import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useRecoilState } from "recoil";
import {
  deviceState,
  currentDeviceState,
  deviceListState,
} from "#/recoil/scan";
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
} from "@mui/material";
import CameraswitchRoundedIcon from "@mui/icons-material/CameraswitchRounded";
import CircularProgress from "@mui/material/CircularProgress";

import MessageDialog from "#/components/block/MessageDialog";

type ScannerProps = {
  handleScan: (text: string | null) => void;
};

const Scanner = ({ handleScan }: ScannerProps) => {
  const location = useLocation();
  const [qrReaderIsShow, setQrReaderIsShow] = useRecoilState(deviceState);
  const [scannerStatus, setScannerStatus] = useState<
    "loading" | "waiting" | "error"
  >("loading");
  const [currentDevice, setCurrentDevice] = useRecoilState(currentDeviceState);
  const [deviceList, setDeviceList] = useRecoilState(deviceListState);
  const [selectCameraModalOpen, setSelectCameraModalOpen] = useState(false);
  const [errorDialogOpen, setMessageDialogOpen] = useState(false);
  const [errorDialogTitle, setMessageDialogTitle] = useState("");
  const [errorDialogMessage, setMessageDialogMessage] = useState<string[]>([]);

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
        const savedCurrentCameraDeviceId = localStorage.getItem(
          "currentCameraDeviceId"
        );
        if (savedCurrentCameraDeviceId) {
          const device = devices.find((v) => {
            if (v.deviceId === savedCurrentCameraDeviceId) {
              return v;
            }
          });
          if (device) {
            return setCurrentDevice(device);
          }
        }
        return setCurrentDevice(devices[0]);
      })
      .catch((err) => {
        console.log(err);
      });
  }

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

  // out of memory の対策として、5 分ごとに react-qr-reader を unmount して、直後に mount している
  // https://github.com/afes-website/cappuccino-app/blob/d0201aa5506e6b3aa7c3cc887171d83b0e773b18/src/components/QRScanner.tsx#L146
  const [refreshQrReader, setRefreshQrReader] = useState(true);
  useEffect(() => {
    const intervalId = setInterval(() => {
      setScannerStatus("loading");
      setRefreshQrReader(false);
    }, 5 * 60 * 1000);
    return () => {
      clearInterval(intervalId);
    };
  }, []);
  useEffect(() => {
    if (!refreshQrReader) setRefreshQrReader(true);
  }, [refreshQrReader]);

  const changeCamera = (event: SelectChangeEvent) => {
    const newCurrenDevice = deviceList.find((v) => {
      if (v.deviceId === event.target.value) {
        return v;
      }
    });
    if (newCurrenDevice) {
      localStorage.setItem("currentCameraDeviceId", newCurrenDevice.deviceId);
      setCurrentDevice(newCurrenDevice);
      setRefreshQrReader(false);
    }
  };

  // https://github.com/afes-website/cappuccino-app/blob/824cf2295cebae85b762b6c7a21cbbe94bf1d0ee/src/components/QRScanner.tsx#L201
  const handleError = (err: unknown) => {
    setScannerStatus("error");
    setMessageDialogTitle("カメラ起動失敗");
    let reason: string[];
    if (isDOMException(err)) {
      console.error(err.name, err.message);
      switch (err.name) {
        case "NotReadableError":
          reason = [
            "カメラが他のアプリケーションで使用されています。",
            "カメラアプリやビデオ通話を開いていたり、フラッシュライトが点灯していたりしませんか？",
          ];
          break;
        case "NotAllowedError":
          reason = [
            "カメラを使用する権限がありません。",
            "お使いのブラウザの設定を確認してください。",
          ];
          break;
        default:
          reason = ["原因不明のエラーです。"];
          break;
      }
      reason = [...reason, `[${err.name}]`, err.message];
      setMessageDialogMessage(reason);
    } else {
      setMessageDialogMessage(["原因不明のエラーです。"]);
    }
    setMessageDialogOpen(true);
  };

  const Loading = () => {
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

  return (
    <>
      <Box
        sx={{
          position: "relative",
          margin: "auto",
          width: "100%",
          maxWidth: "50vh",
          aspectRatio: "1 / 1",
          backgroundColor: "black",
          borderRadius: "1rem",
        }}
      >
        {qrReaderIsShow && refreshQrReader && (
          <div style={{ position: "relative" }}>
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
                deviceId: currentDevice.deviceId,
                facingMode: "environment",
              }}
              className="qrcode"
            />
            <IconButton
              onClick={() => {
                getCameraDeviceList();
                setSelectCameraModalOpen(true);
              }}
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
                    value={currentDevice.deviceId}
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
          setMessageDialogOpen(false);
        }}
      />
    </>
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isDOMException = (val: any): val is DOMException => {
  if (!val) return false;
  return (
    typeof val === "object" &&
    /* eslint-disable-next-line @typescript-eslint/no-unsafe-member-access */
    typeof val.name === "string" &&
    /* eslint-disable-next-line @typescript-eslint/no-unsafe-member-access */
    typeof val.message === "string"
  );
};

export default Scanner;
