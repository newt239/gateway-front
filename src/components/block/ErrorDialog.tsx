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
            <DialogTitle>
                <ErrorOutline />
                {props.title || "エラーが発生しました"}
            </DialogTitle>
            <DialogContent>
                {props.message.map((message, index) => (
                    <DialogContentText key={index}>{message}</DialogContentText>
                ))}
            </DialogContent>
            <DialogActions>
                <Button onClick={props.onClose} color="secondary">
                    閉じる
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ErrorDialog;