import React, { useState } from "react";
import { useRecoilValue } from "recoil";
import { tokenState } from "#/recoil/user";
import apiClient from '#/axios-config';

import {
  Typography,
  TextField,
  Box,
  Button,
  CircularProgress,
} from "@mui/material";

import MessageDialog from "./MessageDialog";

const DeleteUserCard = () => {
  const token = useRecoilValue(tokenState);

  const [deleteUserIdValue, setDeleteUserIdValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [showMessageDialog, setShowMessageDialog] = useState(false);
  const [messageDialogType, setMessageDialogType] = useState<
    "success" | "error"
  >("success");
  const [errorDialogMessage, setMessageDialogMessage] = useState<string[]>([]);

  const deleteUser = async () => {
    if (token && !loading && deleteUserIdValue !== "") {
      setLoading(true);
      const payload = {
        user_id: deleteUserIdValue,
      };
      await apiClient(process.env.REACT_APP_API_BASE_URL).admin.user.delete._user_id(deleteUserIdValue).$delete({
        headers: { Authorization: `Bearer ${token}` },
      }).then(() => {
        setShowMessageDialog(true);
        setMessageDialogType("success");
        setMessageDialogMessage([
          `ユーザー( ${payload.user_id} )を削除しました。`,
        ]);
        setDeleteUserIdValue("");
      })
        .catch(() => {
          setShowMessageDialog(true);
          setMessageDialogType("error");
          setMessageDialogMessage([
            `${payload.user_id}というユーザーは存在しません。`,
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
      <Typography variant="h3">ユーザーの削除</Typography>
      <Typography>自分が作成したユーザーのみ削除可能です。</Typography>
      <TextField
        id="deleteUser"
        label="削除するユーザーid"
        value={deleteUserIdValue}
        onChange={(e) => setDeleteUserIdValue(e.target.value)}
        margin="normal"
        fullWidth
      />
      <Box sx={{ width: "100%", textAlign: "right" }}>
        <Button
          onClick={deleteUser}
          disabled={loading || deleteUserIdValue === ""}
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

export default DeleteUserCard;
