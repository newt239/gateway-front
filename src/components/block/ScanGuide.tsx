import React, { useState } from "react";
import { useAtomValue } from "jotai";
import { profileAtom } from "#/components/lib/jotai";
import ReactGA from "react-ga4";

import { Box, Fade, IconButton, Tooltip, Typography } from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

import useDeviceWidth from "#/components/lib/useDeviceWidth";
import theme from "#/components/lib/theme";

const ScanGuide: React.VFC<{ show: boolean }> = ({ show }) => {
  const profile = useAtomValue(profileAtom);
  const guideShow = localStorage.getItem("guideShow") || "yes";
  const [close, setClose] = useState<boolean>(false);

  const { largerThanMD } = useDeviceWidth();

  const closeGuide = () => {
    setClose(true);
    if (profile) {
      ReactGA.event({
        category: "guide",
        action: "scan_guide_close",
        label: profile.user_id,
      });
    }
  };

  return (
    <Fade
      in={show && !close && guideShow !== "no" && largerThanMD}
      timeout={1000}
    >
      <Box zIndex={1200}>
        <Box
          sx={{
            position: "fixed",
            top: 30,
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: "error.main",
            padding: "1rem",
            borderRadius: theme.shape.borderRadius,
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
          <Tooltip title="ホーム画面の設定から非表示にできます">
            <IconButton
              color="inherit"
              sx={{ color: "white" }}
              component="span"
              onClick={closeGuide}
            >
              <CloseRoundedIcon />
            </IconButton>
          </Tooltip>
        </Box>
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: "50%",
            height: 0,
            transform: "translateX(-50%)",
            borderLeft: "30px solid transparent",
            borderRight: "30px solid transparent",
            borderBottom: "30px solid",
            borderBottomColor: "error.main",
          }}
        ></Box>
      </Box>
    </Fade>
  );
};

export default ScanGuide;
