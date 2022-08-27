import React from "react";
import { Box, Typography } from "@mui/material";

const Version: React.VFC = () => {
  return (
    <Box>
      <Typography variant="caption">
        ver. 1.9.2-{process.env.REACT_APP_ENV} (22/08/27)
      </Typography>
      <br />
      <Typography variant="caption">© 栄東祭実行委員会 技術部</Typography>
    </Box>
  );
};

export default Version;
