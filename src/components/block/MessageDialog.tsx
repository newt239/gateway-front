import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

import DoneOutlineRoundedIcon from "@mui/icons-material/DoneOutlineRounded";
import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded";

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
          <DoneOutlineRoundedIcon />
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
          <ErrorOutlineRoundedIcon />
          {props.title || "エラーが発生しました"}
        </DialogTitle>
      )}
      <DialogContent>
        {props.message
          .filter((message) => message != "")
          .map((message, index) => (
            <DialogContentText key={index}>{message}</DialogContentText>
          ))}
      </DialogContent>
      <DialogActions>
        <Button onClick={props.onClose}>閉じる</Button>
      </DialogActions>
    </Dialog>
  );
};

export default MessageDialog;
