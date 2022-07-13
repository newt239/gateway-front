import React, { useState } from "react";
import { Box, Button, Dialog, DialogContent, DialogTitle, Fab, Grid } from "@mui/material";
import ModeEditRoundedIcon from '@mui/icons-material/ModeEditRounded';
import BackspaceRoundedIcon from '@mui/icons-material/BackspaceRounded';

const NumPad = ({ scanType, onClose }: { scanType: "reservation" | "guest", onClose: () => void }) => {

  const [open, setOpen] = useState(false);
  const [id, setId] = useState<number[]>([]);

  const openNumPad = () => {
    setOpen(true);
  };

  const onNumClick = (n: number) => {
    setId([...id, n]);
    if ((scanType === "reservation" && id.length >= 7) || (scanType === "guest" && id.length >= 10)) {
      handleClose()
    }
  };
  const onDeleteNum = () => {
    if (id.length > 0) {
      setId(id.slice(0, id.length - 1));
    }
  }
  const handleClose = () => {
    setOpen(false);
    onClose();
  };

  return (
    <>
      <Fab variant="extended" onClick={openNumPad}>
        <ModeEditRoundedIcon sx={{ mr: 1 }} />
        直接入力する
      </Fab>
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="xs"
      >
        <DialogTitle sx={{ textAlign: "center" }}>
          {scanType === "reservation" ? "R" : "G"}
          - {id.map(n => <span>{n}</span>)}</DialogTitle>
        <DialogContent sx={{ padding: "20px 5rem" }}>
          <Grid container sx={{ gap: "1rem", justifyContent: "space-between" }}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map(n => {
              return (
                <Grid item key={n}>
                  <Button variant="outlined" onClick={() => onNumClick(n)}>{n}</Button>
                </Grid>
              )
            })}
            <Grid item>
              <Button variant="outlined" onClick={onDeleteNum} disabled={id.length <= 0}>
                <BackspaceRoundedIcon />
              </Button >
            </Grid>
          </Grid>
          <Box sx={{ width: "100%", textAlign: "right" }}>
            <Button
              onClick={handleClose}
              sx={{ mt: 2 }}
            >
              閉じる
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default NumPad;
