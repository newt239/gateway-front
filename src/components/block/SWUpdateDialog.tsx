import { Button, Dialog, DialogActions, DialogContent } from "@mui/material";
import React, { useState } from "react";

export const SWUpdateDialog: React.FC<{
  registration: ServiceWorkerRegistration;
}> = ({ registration }) => {
  const [show, setShow] = useState(!!registration.waiting);
  const [open, setOpen] = React.useState(false);

  const handleClose = () => {
    setOpen(false);
    registration.waiting?.postMessage({ type: "SKIP_WAITING" });
    setShow(false);
    window.location.reload();
  };

  return show ? (
    <div>
      <Dialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <DialogContent>新しいバージョンがリリースされました。</DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose}>
            アップデート
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  ) : (
    <></>
  );
};
