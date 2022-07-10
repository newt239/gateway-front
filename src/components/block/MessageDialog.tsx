import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import ErrorRoundedIcon from '@mui/icons-material/ErrorRounded';

type errorDialogProps = {
  open: boolean;
  type: "success" | "error";
  title?: string;
  message: string[];
  onClose: () => void;
};

const MessageDialog = (props: errorDialogProps) => {
  return (
    <Dialog open={props.open} onClose={props.onClose}>
      {props.type === "success" ? (
        <DialogTitle
          sx={{
            display: "inline-flex",
            alignItems: "center",
            color: "success.main",
          }}
        >
          <CheckCircleRoundedIcon />
          {props.title || "処理が完了しました"}
        </DialogTitle>
      ) : (
        <DialogTitle
          sx={{
            display: "inline-flex",
            alignItems: "center",
            color: "error.main",
          }}
        >
          <ErrorRoundedIcon />
          {props.title || "エラーが発生しました"}
        </DialogTitle>
      )}
      <DialogContent>
        <DialogContentText>{props.message}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.onClose}>閉じる</Button>
      </DialogActions>
    </Dialog>
  );
};

export default MessageDialog;
