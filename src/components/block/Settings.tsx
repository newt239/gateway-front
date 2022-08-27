import React, { useState } from "react";
import {
  FormControlLabel,
  List,
  ListItem,
  Switch,
  Tooltip,
} from "@mui/material";

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
          <FormControlLabel
            control={
              <Switch
                edge="start"
                onChange={handleToggle}
                checked={guideShow}
                sx={{ mr: 1 }}
              />
            }
            label="来場者用にスキャンガイドを表示"
          />
        </ListItem>
      </Tooltip>
    </List>
  );
};

export default Settings;
