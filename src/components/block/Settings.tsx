import React, { useState } from "react";
import { List, ListItem, ListItemText, Switch } from "@mui/material";

const Settings = () => {
  const [guideShow, setGuideShow] = useState(localStorage.getItem("guideShow") !== "no" ? true : false);

  const handleToggle = () => {
    setGuideShow(!guideShow);
    if (guideShow) {
      localStorage.setItem("guideShow", "no");
    } else {
      localStorage.setItem("guideShow", "yes");
    }
  };

  return (
    <List>
      <ListItem>
        <ListItemText>来場者用にスキャンガイドを表示</ListItemText>
        <Switch
          edge="end"
          onChange={handleToggle}
          checked={guideShow}
        />
      </ListItem>
    </List>
  );
};

export default Settings;
