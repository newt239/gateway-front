import React from "react";
import { Box, Typography } from "@mui/material";

const Version = () => {
  return (
    <Box>
      <Typography variant="caption">ver. {process.env.REACT_APP_VERSION}-{process.env.REACT_APP_ENV} (22/08/20)</Typography>
      <br />
      <Typography variant="caption">© 栄東祭実行委員会 技術部</Typography>
    </Box>
  );
};

export default Version;
