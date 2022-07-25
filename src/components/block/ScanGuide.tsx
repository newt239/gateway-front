import { Box, Typography } from "@mui/material";
import React from "react";

const ScanGuide = ({ show }: { show: boolean }) => {
  return (
    <>
      {show && (
        <>
          <Box sx={{
            position: "fixed",
            top: 30,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 100000,
            backgroundColor: "error.main",
            padding: "1rem",
            borderRadius: "1rem",
            textAlign: "center"
          }}>
            <Typography sx={{ transform: "rotate(180deg)", color: "error.contrastText", fontSize: "2rem", fontWeight: 800 }}>QRコードを水平にかざしてください</Typography>
          </Box>
          <Box sx={{
            position: "fixed",
            top: 0,
            left: "50%",
            height: 0,
            zIndex: 100000,
            transform: "translateX(-50%)",
            borderLeft: "30px solid transparent",
            borderRight: "30px solid transparent",
            borderBottom: "30px solid",
            borderBottomColor: "error.main"
          }}>
          </Box>
        </>
      )}
    </>
  );
};

export default ScanGuide;
