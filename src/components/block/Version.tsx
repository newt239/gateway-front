import React from "react";
import { Box, Typography } from "@mui/material";
import generalProps from "#/components/lib/generalProps";

const Version: React.VFC = () => {
  return (
    <Box>
      <Typography variant="caption">
        ver. {generalProps.app_version}-{process.env.REACT_APP_ENV} ({generalProps.version_date})
      </Typography>
      <br />
      <Typography variant="caption">© 栄東祭実行委員会 技術部</Typography>
    </Box>
  );
};

export default Version;
