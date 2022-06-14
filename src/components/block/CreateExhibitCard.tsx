import React, { useEffect, useState } from "react";
import { useSetRecoilState, useRecoilValue } from "recoil";
import { tokenState } from "#/recoil/user";
import { pageStateSelector } from "#/recoil/page";
import apiClient from "#/axios-config";

import {
  Typography,
  TextField,
  MenuItem,
  Box,
  Button,
  CircularProgress,
} from "@mui/material";

import MessageDialog from "./MessageDialog";
import { exhibitTypeProp } from "#/components/functional/generalProps";
import { AxiosError } from "axios";

const CreateExhibitCard = () => {
  const setPageInfo = useSetRecoilState(pageStateSelector);
  useEffect(() => {
    setPageInfo({ title: "管理者用" });
  }, []);

  const token = useRecoilValue(tokenState);

  const [exhibitIdValue, setExhibitId] = useState("");
  const [exhibitNameValue, setExhibitName] = useState("");
  const [roomNameValue, setRoomName] = useState("");
  const [exhibitTypeValue, setExhibitType] = useState<exhibitTypeProp>("class");
  const [capacityValue, setCapacity] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [showMessageDialog, setShowMessageDialog] = useState(false);
  const [dialogType, setDialogType] = useState<"success" | "error">("success");
  const [dialogMessage, setMessageDialogMessage] = useState<string[]>([]);

  const userTypeList: { value: exhibitTypeProp; label: string }[] = [
    { value: "class", label: "クラス展示" },
    { value: "club", label: "部活動展示" },
    { value: "stage", label: "ステージ会場" },
    { value: "other", label: "その他" },
  ];

  const createExhibit = () => {
    if (token && !loading) {
      setLoading(true);
      const payload = {
        exhibit_id: exhibitIdValue,
        exhibit_name: exhibitNameValue,
        room_name: roomNameValue,
        exhibit_type: exhibitTypeValue,
        capacity: capacityValue,
      };
      apiClient(process.env.REACT_APP_API_BASE_URL)
        .admin.exhibit.create.$post({
          headers: { Authorization: `Bearer ${token}` },
          body: payload,
        })
        .then(() => {
          setDialogType("success");
          setMessageDialogMessage([
            `展示( ${exhibitIdValue} ) の作成が完了しました。`,
          ]);
          setShowMessageDialog(true);
        })
        .catch((err: AxiosError) => {
          console.log(err);
          setDialogType("error");
          setMessageDialogMessage([err.message]);
          setShowMessageDialog(true);
        });
    }
    setLoading(false);
  };

  const handleClose = () => {
    setShowMessageDialog(false);
    setMessageDialogMessage([]);
  };

  return (
    <>
      <Typography variant="h3">展示の作成</Typography>
      <TextField
        id="exhibit_id"
        label="展示id"
        type="text"
        value={exhibitIdValue}
        error={exhibitIdValue.length > 10}
        helperText={
          exhibitIdValue.length > 10 && "展示idは10字以内で設定してください。"
        }
        onChange={(e) => setExhibitId(e.target.value)}
        margin="normal"
        fullWidth
      />
      <TextField
        id="exhibit_name"
        label="展示名"
        type="text"
        value={exhibitNameValue}
        onChange={(e) => setExhibitName(e.target.value)}
        margin="normal"
        fullWidth
      />
      <TextField
        id="exhibit_type"
        label="教室名"
        type="text"
        value={roomNameValue}
        error={roomNameValue.length > 20}
        helperText={
          roomNameValue.length > 20 && "教室名は10字以内で設定してください。"
        }
        onChange={(e) => setRoomName(e.target.value)}
        margin="normal"
        fullWidth
      />
      <TextField
        id="exhibit_type"
        label="種別"
        select
        value={exhibitTypeValue}
        onChange={(e) => setExhibitType(e.target.value as exhibitTypeProp)}
        margin="normal"
        fullWidth
      >
        {userTypeList.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        id="capacity"
        label="上限人数"
        type="number"
        value={capacityValue}
        onChange={(e) => setCapacity(Number(e.target.value))}
        margin="normal"
        fullWidth
      />
      <Box sx={{ width: "100%", textAlign: "right" }}>
        <Button
          onClick={createExhibit}
          disabled={loading}
          variant="contained"
          startIcon={loading && <CircularProgress size={24} />}
        >
          作成
        </Button>
      </Box>
      <MessageDialog
        open={showMessageDialog}
        type={dialogType}
        message={dialogMessage}
        onClose={handleClose}
      />
    </>
  );
};

export default CreateExhibitCard;
