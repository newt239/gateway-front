import React, { useState } from "react";
import { useRecoilValue } from "recoil";
import { tokenState } from "#/recoil/user";
import apiClient from "#/axios-config";

import {
  Typography,
  TextField,
  Box,
  Button,
  CircularProgress,
} from "@mui/material";

import MessageDialog from "./MessageDialog";

const DeleteExhibitCard = () => {
  const token = useRecoilValue(tokenState);

  const [deleteExhibitIdValue, setDeleteUserIdValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [showMessageDialog, setShowMessageDialog] = useState(false);
  const [messageDialogType, setMessageDialogType] = useState<
    "success" | "error"
  >("success");
  const [errorDialogMessage, setMessageDialogMessage] = useState<string[]>([]);

  const deleteUser = () => {
    if (token && !loading && deleteExhibitIdValue !== "") {
      setLoading(true);
      const payload = {
        user_id: deleteExhibitIdValue,
      };
      apiClient(process.env.REACT_APP_API_BASE_URL)
        .admin.exhibit.delete._exhibit_id(deleteExhibitIdValue)
        .$delete({
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(() => {
          setShowMessageDialog(true);
          setMessageDialogType("success");
          setMessageDialogMessage([
            `展示( ${payload.user_id} )を削除しました。`,
          ]);
          setDeleteUserIdValue("");
        })
        .catch(() => {
          setShowMessageDialog(true);
          setMessageDialogType("error");
          setMessageDialogMessage([
            `${payload.user_id}という展示は存在しません。`,
          ]);
        });
      setLoading(false);
    }
  };

  const handleClose = () => {
    setShowMessageDialog(false);
    setMessageDialogMessage([]);
  };

  return (
    <>
      <Typography variant="h3">展示の削除</Typography>
      <TextField
        id="deleteUser"
        label="削除する展示id"
        value={deleteExhibitIdValue}
        onChange={(e) => setDeleteUserIdValue(e.target.value)}
        margin="normal"
        fullWidth
      />
      <Box sx={{ width: "100%", textAlign: "right" }}>
        <Button
          onClick={deleteUser}
          disabled={loading || deleteExhibitIdValue === ""}
          variant="contained"
          startIcon={loading && <CircularProgress size={24} />}
        >
          削除
        </Button>
      </Box>
      <MessageDialog
        open={showMessageDialog}
        type={messageDialogType}
        message={errorDialogMessage}
        onClose={handleClose}
      />
    </>
  );
};

export default DeleteExhibitCard;
