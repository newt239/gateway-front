import React from "react";

import useMediaQuery from "@mui/material/useMediaQuery";

import Desktop from "#/components/layout/Desktop";
import Mobile from "#/components/layout/Mobile";

const ScreenWidth = () => {
  const MediaQuery = () => {
    const mobile = useMediaQuery("(max-width:600px)");
    if (mobile) {
      return <Mobile />;
    } else {
      return <Desktop />;
    }
  };

  return <MediaQuery />;
};

export default ScreenWidth;
