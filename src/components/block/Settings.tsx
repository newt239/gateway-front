import React, { useState } from "react";
import { List, ListItem, ListItemText, Switch, Tooltip } from "@mui/material";

const Settings: React.VFC = () => {
  const [guideShow, setGuideShow] = useState<boolean>(
    localStorage.getItem("guideShow") !== "no" ? true : false
  );

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
      <Tooltip title="スキャン画面で、一般的なパソコンのフロントカメラがある位置に案内が表示されます。">
        <ListItem>
          <ListItemText>来場者用にスキャンガイドを表示</ListItemText>
          <Switch edge="end" onChange={handleToggle} checked={guideShow} />
        </ListItem>
      </Tooltip>
    </List>
  );
};

export default Settings;
