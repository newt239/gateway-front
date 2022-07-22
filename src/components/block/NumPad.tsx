import React, { useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Fab,
  Grid,
  ButtonGroup,
  DialogActions,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import ModeEditRoundedIcon from "@mui/icons-material/ModeEditRounded";
import BackspaceRoundedIcon from "@mui/icons-material/BackspaceRounded";

const NumPad = ({
  scanType,
  onClose,
}: {
  scanType: "reservation" | "guest";
  onClose: (num: number[]) => void;
}) => {
  const [open, setOpen] = useState(false);
  const [id, setId] = useState<number[]>([]);

  const theme = useTheme();
  const smallerThanMD = useMediaQuery(theme.breakpoints.down("md"));
  const largerThanSM = useMediaQuery(theme.breakpoints.up("sm"));
  const openNumPad = () => {
    setOpen(true);
  };

  const onNumClick = (n: number) => {
    const newId = [...id, n];
    setId(newId);
    if (
      (scanType === "reservation" && newId.length === 6) ||
      (scanType === "guest" && newId.length === 9)
    ) {
      handleClose(newId);
    }
  };

  const onDeleteNum = () => {
    if (id.length > 0) {
      setId(id.slice(0, id.length - 1));
    }
  };

  const handleClose = (newId: number[]) => {
    setOpen(false);
    onClose(newId);
  };

  return (
    <>
      <Fab
        variant={largerThanSM ? "extended" : "circular"}
        onClick={openNumPad}
        color="primary"
      >
        <ModeEditRoundedIcon sx={{ mr: largerThanSM ? 1 : 0 }} />
        {largerThanSM && <>直接入力</>}
      </Fab>
      <Dialog
        open={open}
        onClose={() => handleClose(id)}
        maxWidth="xs"
        fullScreen={smallerThanMD}
      >
        <Box
          sx={{
            display: "grid",
            alignContent: "space-between",
            height: "100%",
          }}
        >
          <DialogTitle>ID手動入力</DialogTitle>
          <DialogContent>
            <Box sx={{ textAlign: "center", fontWeight: 800 }}>
              {scanType === "reservation" ? "R" : "G"}
              <span style={{ padding: "0 .5rem" }}>-</span>
              <ButtonGroup variant="outlined">
                {(scanType === "reservation"
                  ? [0, 1, 2, 3, 4, 5]
                  : [0, 1, 2, 3, 4, 5, 6, 7, 8]
                ).map((i) => {
                  return (
                    <Button
                      disabled
                      sx={{
                        fontWeight: 800,
                        p: 1,
                        "&.Mui-disabled": { color: "black" },
                      }}
                      key={i}
                    >
                      {i < id.length ? id[i] : "_"}
                    </Button>
                  );
                })}
              </ButtonGroup>
            </Box>
            <Grid
              container
              sx={{
                padding: ".5rem",
                width: 300,
                margin: "1rem auto 0",
                gap: "1rem",
                justifyContent: "space-between",
              }}
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((n) => {
                return (
                  <Grid item key={String(n)}>
                    <Button
                      variant="outlined"
                      onClick={() => onNumClick(n)}
                      sx={{ p: 1 }}
                    >
                      {n}
                    </Button>
                  </Grid>
                );
              })}
              <Grid item>
                <Button
                  variant="outlined"
                  onClick={onDeleteNum}
                  disabled={id.length <= 0}
                  sx={{ p: 1 }}
                >
                  <BackspaceRoundedIcon />
                </Button>
              </Grid>
            </Grid>
            <DialogActions>
              <Button onClick={() => handleClose(id)}>閉じる</Button>
            </DialogActions>
          </DialogContent>
        </Box>
      </Dialog>
    </>
  );
};

export default NumPad;
