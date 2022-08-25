import React, { useState } from "react";
import { Button, Dialog, DialogActions, DialogContent } from "@mui/material";

export const SWUpdateDialog: React.VFC<{
  registration: ServiceWorkerRegistration;
}> = ({ registration }) => {
  const [show, setShow] = useState<boolean>(!!registration.waiting);

  const handleClose = () => {
    registration.waiting?.postMessage({ type: "SKIP_WAITING" });
    setShow(false);
    window.location.reload();
  };

  return show ? (
    <Dialog onClose={handleClose} open={show}>
      <DialogContent>新しいバージョンがリリースされました。</DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleClose}>
          アップデート
        </Button>
      </DialogActions>
    </Dialog>
  ) : (
    <></>
  );
};
