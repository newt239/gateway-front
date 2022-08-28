import React from "react";
import { useNavigate } from "react-router-dom";
import { useAtomValue } from "jotai";
import { profileAtom } from "#/components/lib/jotai";

import {
  Card,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
} from "@mui/material";

import LibraryBooksRoundedIcon from "@mui/icons-material/LibraryBooksRounded";
import LoginRoundedIcon from "@mui/icons-material/LoginRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import BarChartRoundedIcon from "@mui/icons-material/BarChartRounded";
import RoomRoundedIcon from "@mui/icons-material/RoomRounded";

const QuickMenu: React.VFC = () => {
  const profile = useAtomValue(profileAtom);
  const navigate = useNavigate();

  return (
    <Card variant="outlined" sx={{ p: 2, height: "100%" }}>
      <Typography variant="h3">クイックメニュー</Typography>
      {profile ? (
        <List>
          <ListItem divider disablePadding>
            <ListItemButton
              href={process.env.REACT_APP_MANUAL_URL || "/"}
              target="_blank"
            >
              <ListItemIcon>
                <LibraryBooksRoundedIcon />
              </ListItemIcon>
              <ListItemText>操作方法を確認</ListItemText>
            </ListItemButton>
          </ListItem>
          {["exhibit"].includes(profile.user_type) && (
            <>
              <ListItem divider disablePadding>
                <ListItemButton
                  onClick={() =>
                    navigate(`/exhibit/${profile.user_id}/enter`, {
                      replace: true,
                    })
                  }
                >
                  <ListItemIcon>
                    <LoginRoundedIcon />
                  </ListItemIcon>
                  <ListItemText>展示への入室を記録</ListItemText>
                </ListItemButton>
              </ListItem>
              <ListItem divider disablePadding>
                <ListItemButton
                  onClick={() =>
                    navigate(`/exhibit/${profile.user_id}/exit`, {
                      replace: true,
                    })
                  }
                >
                  <ListItemIcon>
                    <LogoutRoundedIcon />
                  </ListItemIcon>
                  <ListItemText>展示からの退室を記録</ListItemText>
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton
                  onClick={() =>
                    navigate(`/analytics/exhibit/${profile.user_id}`, {
                      replace: true,
                    })
                  }
                >
                  <ListItemIcon>
                    <BarChartRoundedIcon />
                  </ListItemIcon>
                  <ListItemText>展示の滞在状況を確認</ListItemText>
                </ListItemButton>
              </ListItem>
            </>
          )}
          {["moderator", "executive"].includes(profile.user_type) && (
            <>
              <ListItem divider disablePadding>
                <ListItemButton
                  onClick={() =>
                    navigate("entrance/reserve-check", { replace: true })
                  }
                >
                  <ListItemIcon>
                    <LoginRoundedIcon />
                  </ListItemIcon>
                  <ListItemText>エントランス受付</ListItemText>
                </ListItemButton>
              </ListItem>
              <ListItem divider disablePadding>
                <ListItemButton
                  onClick={() => navigate("entrance/exit", { replace: true })}
                >
                  <ListItemIcon>
                    <LogoutRoundedIcon />
                  </ListItemIcon>
                  <ListItemText>エントランス退場処理</ListItemText>
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton
                  onClick={() => navigate("/exhibit/", { replace: true })}
                >
                  <ListItemIcon>
                    <RoomRoundedIcon />
                  </ListItemIcon>
                  <ListItemText>スキャンするステージを選択</ListItemText>
                </ListItemButton>
              </ListItem>
            </>
          )}
        </List>
      ) : (
        <Typography variant="body1"></Typography>
      )}
    </Card>
  );
};

export default QuickMenu;
