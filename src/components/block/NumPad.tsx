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
  const [open, setOpen] = useState<boolean>(false);
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
          <DialogContent sx={{ p: 0, textAlign: "center", width: "100%" }}>
            <ButtonGroup
              variant="outlined"
              sx={{
                justifyContent: "center",
                width: largerThanSM ? "90%" : "100%",
              }}
            >
              <Button
                disabled
                sx={{
                  fontWeight: 800,
                  fontSize: "1.5rem",
                  "&.Mui-disabled": { color: "black" },
                }}
              >
                {scanType === "reservation" ? "R" : "G"}
              </Button>
              {(scanType === "reservation"
                ? [0, 1, 2, 3, 4, 5]
                : [0, 1, 2, 3, 4, 5, 6, 7, 8]
              ).map((i) => {
                return (
                  <Button
                    disabled
                    sx={{
                      fontWeight: 800,
                      fontSize: "1.5rem",
                      "&.Mui-disabled": { color: "black" },
                    }}
                    key={i}
                  >
                    {i < id.length ? id[i] : "_"}
                  </Button>
                );
              })}
            </ButtonGroup>
            <Grid
              container
              sx={{
                width: 300,
                margin: "2rem auto 0",
                gap: ".5rem",
                justifyContent: "space-between",
              }}
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((n) => {
                return (
                  <Grid
                    item
                    key={String(n)}
                    sx={{ width: "30%", aspectRatio: "1 / 1" }}
                  >
                    <Button
                      variant="outlined"
                      onClick={() => onNumClick(n)}
                      sx={{
                        fontSize: "2rem",
                        fontWeight: 800,
                        width: "100%",
                        height: "100%",
                        borderRadius: "50%",
                      }}
                    >
                      {n}
                    </Button>
                  </Grid>
                );
              })}
              <Grid item sx={{ width: "30%", aspectRatio: "1 / 1" }}>
                <Button
                  variant="outlined"
                  onClick={onDeleteNum}
                  disabled={id.length <= 0}
                  sx={{
                    fontSize: "2rem",
                    fontWeight: 800,
                    width: "100%",
                    height: "100%",
                    borderRadius: "50%",
                  }}
                >
                  <BackspaceRoundedIcon />
                </Button>
              </Grid>
            </Grid>
            <DialogActions sx={{ p: 2 }}>
              <Button
                onClick={() => setId([])}
                color="error"
                disabled={id.length === 0}
              >
                リセット
              </Button>
              <Button onClick={() => handleClose(id)}>閉じる</Button>
            </DialogActions>
          </DialogContent>
        </Box>
      </Dialog>
    </>
  );
};

export default NumPad;
