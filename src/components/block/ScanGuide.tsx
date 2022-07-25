import { Box, Fade, IconButton, Typography } from "@mui/material";
import React, { useState } from "react";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

const ScanGuide = ({ show }: { show: boolean }) => {
  const [close, setClose] = useState(false);

  const closeGuide = () => {
    setClose(true);
  };

  return (
    <>
      <Fade in={show && !close} timeout={1000}>
        <Box
          sx={{
            position: "fixed",
            top: 30,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 100000,
            backgroundColor: "error.main",
            padding: "1rem",
            borderRadius: "1rem",
            textAlign: "center",
            display: "flex",
          }}
        >
          <Typography
            sx={{
              transform: "rotate(180deg)",
              color: "error.contrastText",
              fontSize: "2rem",
              fontWeight: 800,
            }}
          >
            QRコードを水平にかざしてください
          </Typography>
          <IconButton
            color="inherit"
            sx={{ color: "white" }}
            component="span"
            onClick={closeGuide}
          >
            <CloseRoundedIcon />
          </IconButton>
        </Box>
      </Fade>
      <Fade in={show && !close} timeout={1000}>
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: "50%",
            height: 0,
            zIndex: 100000,
            transform: "translateX(-50%)",
            borderLeft: "30px solid transparent",
            borderRight: "30px solid transparent",
            borderBottom: "30px solid",
            borderBottomColor: "error.main",
          }}
        ></Box>
      </Fade>
    </>
  );
};

export default ScanGuide;
