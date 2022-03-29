import React, { useState } from "react";
import { useRecoilValue } from "recoil";
import { tokenState } from "#/recoil/user";
import axios from "axios";

import { Typography, TextField, Box, Button, CircularProgress } from '@mui/material';

import ErrorDialog from "./ErrorDialog";

const API_BASE_URL: string = process.env.REACT_APP_API_BASE_URL!;

const DeleteUserCard = () => {
  const token = useRecoilValue(tokenState);

  const [deleteUserIdValue, setDeleteUserIdValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [errorDialogMessage, setErrorDialogMessage] = useState<string[]>([]);

  const deleteUser = async () => {
    if (!loading && deleteUserIdValue !== "") {
      setLoading(true);
      const payload = {
        user_id: deleteUserIdValue
      };
      const res = await axios.post(`${API_BASE_URL}/v1/admin/delete-user`, payload, { headers: { Authorization: "Bearer " + token } }).then(res => { return res });
      if (res.data.status === "success") {
        setShowErrorDialog(true);
        setErrorDialogMessage([`ユーザー( ${payload.user_id} )を削除しました。`]);
        setDeleteUserIdValue("");
      }
    }
  };

  const handleClose = () => {
    setShowErrorDialog(false);
    setErrorDialogMessage([]);
  };

  return (
    <>
      <Typography variant="h3">ユーザーの削除</Typography>
      <Typography>自分が作成したユーザーのみ削除可能です。</Typography>
      <TextField
        id="deleteUser"
        label="削除するユーザーid"
        value={deleteUserIdValue}
        onChange={e => setDeleteUserIdValue(e.target.value)}
        margin="normal"
        fullWidth />
      <Box sx={{ width: '100%', textAlign: 'right' }}>
        <Button
          onClick={deleteUser}
          disabled={loading || deleteUserIdValue === ""}
          variant="contained"
          startIcon={loading && <CircularProgress size={24} />}
        >
          削除
        </Button>
      </Box>
      <ErrorDialog
        open={showErrorDialog}
        message={errorDialogMessage}
        onClose={handleClose}
      />
    </>
  );
};

export default DeleteUserCard;