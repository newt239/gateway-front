import React from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { ErrorOutline } from "@mui/icons-material";

type errorDialogProps = {
  open: boolean;
  title?: string;
  message: string[];
  onClose: () => void;
};

const ErrorDialog = (props: errorDialogProps) => {
  return (
    <Dialog open={props.open} onClose={props.onClose}>
      <DialogTitle sx={{ display: "inline-flex", alignItems: "center", color: "red" }}>
        <ErrorOutline />
        {props.title || "エラーが発生しました"}
      </DialogTitle>
      <DialogContent>
        {props.message.filter(message => message != "").map((message, index) => (
          <DialogContentText key={index}>{message}</DialogContentText>
        ))}
      </DialogContent>
      <DialogActions>
        <Button onClick={props.onClose}>
          閉じる
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ErrorDialog;