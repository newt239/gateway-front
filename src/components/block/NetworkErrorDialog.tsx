import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogContentText, Alert, DialogActions, Button, Link } from "@mui/material";
import ErrorRoundedIcon from "@mui/icons-material/ErrorRounded";

type NetworkErrorDialogProps = {
  open: boolean;
  onClose: () => void;
};

const NetworkErrorDialog: React.VFC<NetworkErrorDialogProps> = ({ open, onClose }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle
        sx={{
          display: "inline-flex",
          alignItems: "center",
          color: "error.main",
        }}
      ><ErrorRoundedIcon />ネットワークエラー</DialogTitle>
      <DialogContent>
        <DialogContentText>
          サーバーからの応答がありません。端末がネットワークに接続されているか確認してください。
        </DialogContentText>
      </DialogContent>
      <Alert severity="warning" sx={{ mx: 3 }}>Chromebookからアクセスしている場合、プロキシの設定の関係上起動直後はエラーが表示される場合があります。
        <Link
          href={process.env.REACT_APP_STATUS_URL || "/"}
          target="_blank"
          underline="hover"
        >このページ</Link>
        を開いた上でもう一度ログインをお試しください。
      </Alert>
      <DialogActions>
        <Button onClick={onClose}>閉じる</Button>
      </DialogActions>
    </Dialog >
  );
};

export default NetworkErrorDialog;