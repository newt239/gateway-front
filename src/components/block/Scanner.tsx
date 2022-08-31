import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAtom } from "jotai";
import { deviceStateAtom } from "#/components/lib/jotai";
import QrReader from "react-qr-reader";

import {
  Box,
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  FormControl,
  Select,
  SelectChangeEvent,
  DialogTitle,
  MenuItem,
  Switch,
  FormControlLabel,
  Stack,
} from "@mui/material";
import CameraswitchRoundedIcon from "@mui/icons-material/CameraswitchRounded";
import CircularProgress from "@mui/material/CircularProgress";

import {
  isAndroid,
  isDOMException,
  sendLog,
} from "#/components/lib/commonFunction";
import theme from "#/components/lib/theme";
import MessageDialog from "#/components/block/MessageDialog";

type ScannerProps = {
  handleScan: (text: string | null) => void;
};
type DeviceProps = {
  deviceId: string;
  label: string;
};

const Scanner: React.VFC<ScannerProps> = ({ handleScan }) => {
  const location = useLocation();
  const [qrReaderIsShow, setQrReaderIsShow] = useAtom(deviceStateAtom);
  const [scannerStatus, setScannerStatus] = useState<
    "loading" | "waiting" | "error"
  >("loading");
  const getDeviceIdFromStorage = () => {
    const savedCurrentCameraDeviceId = localStorage.getItem(
      "currentCameraDeviceId"
    );
    if (savedCurrentCameraDeviceId) {
      return savedCurrentCameraDeviceId;
    }
    return "";
  };
  const [currentDeviceId, setCurrentDeviceId] = useState<string>(
    getDeviceIdFromStorage()
  );
  const [deviceList, setDeviceList] = useState<DeviceProps[]>([]);
  const [selectCameraModalOpen, setSelectCameraModalOpen] =
    useState<boolean>(false);
  const [errorDialogOpen, setErrorDialogOpen] = useState<boolean>(false);
  const [errorDialogTitle, setErrorDialogTitle] = useState<string>("");
  const [errorDialogMessage, setErrorDialogMessage] = useState<string>("");
  const [reverseCamera, setReverseCamera] = useState<boolean>(
    localStorage.getItem("reverseCamera") === "false" ? false : true
  );

  const getCameraDeviceList = () => {
    navigator.mediaDevices
      .enumerateDevices()
      .then((mediaDevices) =>
        mediaDevices
          .filter((device) => device.kind === "videoinput")
          .map((device) => {
            return {
              label: device.label,
              deviceId: device.deviceId,
            };
          })
      )
      .then((devices) => {
        setDeviceList(devices);
        if (currentDeviceId === "") {
          setCurrentDeviceId(devices[0].deviceId);
        }
      })
      .catch((err) => {
        console.log(err);
        sendLog("get_camera_error", err);
      });
  };

  useEffect(() => {
    getCameraDeviceList();
  }, []);

  // location以外のパスに移動したときにカメラを切る
  useEffect(() => {
    if (location.pathname.match(/entrance|exhibit/)) {
      setQrReaderIsShow(true);
    } else {
      setQrReaderIsShow(false);
    }
  }, [location]);

  // out of memory の対策として、2 分 30 秒ごとに react-qr-reader を unmount して、直後に mount している
  // https://github.com/afes-website/cappuccino-app/blob/d0201aa5506e6b3aa7c3cc887171d83b0e773b18/src/components/QRScanner.tsx#L146
  const [refreshQrReader, setRefreshQrReader] = useState(true);
  const interval = isAndroid() ? 30 * 1000 : 2.5 * 60 * 1000;
  useEffect(() => {
    const intervalId = setInterval(() => {
      setScannerStatus("loading");
      setRefreshQrReader(false);
    }, interval);
    return () => {
      clearInterval(intervalId);
    };
  }, []);
  useEffect(() => {
    if (!refreshQrReader) setRefreshQrReader(true);
  }, [refreshQrReader]);

  const changeCamera = (event: SelectChangeEvent) => {
    const newCurrentDevice = deviceList.find((v) => {
      if (v.deviceId === event.target.value) {
        return v;
      }
    });
    if (newCurrentDevice) {
      localStorage.setItem("currentCameraDeviceId", newCurrentDevice.deviceId);
      setCurrentDeviceId(newCurrentDevice.deviceId);
      setRefreshQrReader(false);
    }
  };

  // https://github.com/afes-website/cappuccino-app/blob/824cf2295cebae85b762b6c7a21cbbe94bf1d0ee/src/components/QRScanner.tsx#L201
  const handleError = (err: unknown) => {
    setScannerStatus("error");
    setErrorDialogTitle("カメラ起動失敗");
    let reason: string;
    if (isDOMException(err)) {
      switch (err.name) {
        case "NotReadableError":
          reason =
            "カメラが他のアプリケーションで使用されています。カメラアプリやビデオ通話を開いていたり、フラッシュライトが点灯していたりしませんか？";
          break;
        case "NotAllowedError":
          reason =
            "カメラを使用する権限がありません。お使いのブラウザの設定を確認してください。";
          break;
        case "OverconstrainedError":
          reason = "この端末には利用可能なカメラがありません。";
          break;
        default:
          reason = "原因不明のエラーです。" + `[${err.name}] ${err.message}`;
          sendLog("camera_dom_exception_error", err);
          break;
      }
      setErrorDialogMessage(reason);
    } else {
      sendLog("camera_error", err);
      setErrorDialogMessage("原因不明のエラーです。");
    }
    setErrorDialogOpen(true);
  };

  const Loading: React.VFC = () => {
    return (
      <div
        style={{
          color: "white",
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translateY(-50%) translateX(-50%)",
        }}
      >
        <CircularProgress color="inherit" size={64} />
      </div>
    );
  };

  const onClickChangeCameraIcon = () => {
    setScannerStatus("loading");
    getCameraDeviceList();
    if (deviceList.length === 2) {
      const newCurrentDevice = deviceList.find((v) => {
        if (v.deviceId !== currentDeviceId) {
          return v;
        }
      });
      if (newCurrentDevice) {
        localStorage.setItem(
          "currentCameraDeviceId",
          newCurrentDevice.deviceId
        );
        setCurrentDeviceId(newCurrentDevice.deviceId);
        setRefreshQrReader(false);
      }
    } else {
      setScannerStatus("waiting");
      setSelectCameraModalOpen(true);
    }
  };

  return (
    <Stack>
      <FormControlLabel
        control={
          <Switch
            edge="end"
            onChange={() =>
              setReverseCamera((state) => {
                localStorage.setItem("reverseCamera", String(!state));
                return !state;
              })
            }
            checked={reverseCamera}
            sx={{ mr: 1 }}
          />
        }
        label="カメラを反転"
        sx={{ margin: "auto" }}
      />
      <Box
        sx={{
          position: "relative",
          margin: "auto",
          width: "80vw",
          maxWidth: "50vh",
          aspectRatio: "1 / 1",
          backgroundColor: "black",
          borderRadius: `${theme.shape.borderRadius}px`,
        }}
      >
        {qrReaderIsShow && refreshQrReader && (
          <div
            style={{
              position: "relative",
              transform: reverseCamera ? "scale(-1, 1)" : "scale(1, 1)",
            }}
          >
            <QrReader
              onScan={(text: string | null) => handleScan(text)}
              onLoad={() => {
                setScannerStatus("waiting");
              }}
              onError={handleError}
              delay={1}
              showViewFinder={false}
              facingMode="environment"
              // https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/react-qr-reader/index.d.ts
              // @types/react-qr-readerがv2.1.0用でv2.1.1に追加されたconstraints propの型定義に対応していなかったためsrc直下にオリジナルの型定義ファイルを配置
              constraints={{
                deviceId: currentDeviceId,
                facingMode: "environment",
              }}
              className="qrcode"
            />
            <IconButton
              onClick={onClickChangeCameraIcon}
              sx={{ position: "absolute", color: "white", top: 0, left: 0 }}
            >
              <CameraswitchRoundedIcon />
            </IconButton>
            <Dialog
              open={selectCameraModalOpen}
              onClose={() => setSelectCameraModalOpen(false)}
            >
              <DialogTitle>カメラ切り替え</DialogTitle>
              <DialogContent>
                <FormControl sx={{ m: 1, minWidth: 200 }}>
                  <Select
                    size="small"
                    value={currentDeviceId}
                    onChange={changeCamera}
                  >
                    {deviceList.map((v) => {
                      return (
                        <MenuItem value={v.deviceId} key={v.deviceId}>
                          {v.label}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setSelectCameraModalOpen(false)}>
                  閉じる
                </Button>
              </DialogActions>
            </Dialog>
          </div>
        )}
        {(refreshQrReader || ["loading"].includes(scannerStatus)) && (
          <>{scannerStatus === "loading" && <Loading />}</>
        )}
      </Box>
      <MessageDialog
        open={errorDialogOpen}
        type="error"
        title={errorDialogTitle}
        message={errorDialogMessage}
        onClose={() => {
          setErrorDialogOpen(false);
        }}
      />
    </Stack>
  );
};

export default Scanner;
