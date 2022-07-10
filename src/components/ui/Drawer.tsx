import React, { Suspense } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { profileState } from "#/recoil/user";
import {
  Drawer,
  Box,
  Toolbar,
  List,
  ListSubheader,
  Divider,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";

import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import LoginRoundedIcon from "@mui/icons-material/LoginRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import TableChartRoundedIcon from "@mui/icons-material/TableChartRounded";
import MapRoundedIcon from "@mui/icons-material/MapRounded";
import BadgeRoundedIcon from "@mui/icons-material/BadgeRounded";
import BarChartRoundedIcon from '@mui/icons-material/BarChartRounded';
import ExploreOffRoundedIcon from '@mui/icons-material/ExploreOffRounded';

import UserInfo from "#/components/block/UserInfo";

const drawerWidth = 240;

const DrawerLeft = () => {
  const path = useLocation().pathname;
  const navigate = useNavigate();
  const profile = useRecoilValue(profileState);

  return (
    <Drawer
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
        },
      }}
      variant="permanent"
      anchor="left"
    >
      <Toolbar>
        <Typography
          variant="h1"
          sx={{ cursor: "pointer" }}
          onClick={() => navigate("/", { replace: true })}
        >
          Gateway
        </Typography>
      </Toolbar>
      <Divider />
      <Box sx={{ p: 2 }}>
        <Suspense fallback={<p>hey</p>}>
          <UserInfo />
        </Suspense>
      </Box>
      {profile && profile.available && (
        <>
          <Divider />
          <List>
            <ListItemButton
              selected={path === "/"}
              onClick={() => navigate("/")}
            >
              <ListItemIcon>
                <HomeRoundedIcon />
              </ListItemIcon>
              <ListItemText primary="ホーム" />
            </ListItemButton>
          </List>
          {["exhibit"].includes(profile.user_type) && (
            <>
              <Divider />
              <List subheader={<ListSubheader>展示企画</ListSubheader>}>
                <ListItemButton
                  selected={
                    path === `/exhibit/${profile.user_id || "unknown"}/enter`
                  }
                  onClick={() =>
                    navigate(`/exhibit/${profile.user_id || "unknown"}/enter`)
                  }
                >
                  <ListItemIcon>
                    <LoginRoundedIcon />
                  </ListItemIcon>
                  <ListItemText primary="入室スキャン" />
                </ListItemButton>
                <ListItemButton
                  selected={
                    path === `/exhibit/${profile.user_id || "unknown"}/exit`
                  }
                  onClick={() =>
                    navigate(`/exhibit/${profile.user_id || "unknown"}/exit`)
                  }
                >
                  <ListItemIcon>
                    <LogoutRoundedIcon />
                  </ListItemIcon>
                  <ListItemText primary="退室スキャン" />
                </ListItemButton>
                <ListItemButton
                  selected={
                    path === `/chart/exhibit/${profile.user_id || "unknown"}`
                  }
                  onClick={() =>
                    navigate(`/chart/exhibit/${profile.user_id || "unknown"}`)
                  }
                >
                  <ListItemIcon>
                    <BarChartRoundedIcon />
                  </ListItemIcon>
                  <ListItemText primary="滞在状況" />
                </ListItemButton>
              </List>
            </>
          )}
          {["admin", "moderator", "executive"].includes(profile.user_type) && (
            <>
              <Divider />
              <List subheader={<ListSubheader>展示企画</ListSubheader>}>
                <ListItemButton
                  selected={path === `/exhibit/`}
                  onClick={() => navigate(`/exhibit/`)}
                >
                  <ListItemIcon>
                    <LoginRoundedIcon />
                  </ListItemIcon>
                  <ListItemText primary="展示一覧" />
                </ListItemButton>
              </List>
            </>
          )}
          {["admin", "moderator", "executive"].includes(profile.user_type) && (
            <>
              <Divider />
              <List subheader={<ListSubheader>エントランス</ListSubheader>}>
                <ListItemButton
                  selected={path === `/entrance/reserve-check`}
                  onClick={() => navigate("/entrance/reserve-check")}
                >
                  <ListItemIcon>
                    <LoginRoundedIcon />
                  </ListItemIcon>
                  <ListItemText primary="入場スキャン" />
                </ListItemButton>
                <ListItemButton
                  selected={path === `/entrance/exit`}
                  onClick={() => navigate("/entrance/exit")}
                >
                  <ListItemIcon>
                    <LogoutRoundedIcon />
                  </ListItemIcon>
                  <ListItemText primary="退場スキャン" />
                </ListItemButton>
              </List>
            </>
          )}
          {["admin", "moderator", "analysis"].includes(profile.user_type) && (
            <>
              <Divider />
              <List subheader={<ListSubheader>データ</ListSubheader>}>
                <ListItemButton
                  selected={path === `/chart`}
                  onClick={() => navigate("/chart")}
                >
                  <ListItemIcon>
                    <TableChartRoundedIcon />
                  </ListItemIcon>
                  <ListItemText primary="滞在状況" />
                </ListItemButton>
                <ListItemButton
                  selected={path === `/chart/heatmap`}
                  onClick={() => navigate("/chart/heatmap")}
                >
                  <ListItemIcon>
                    <MapRoundedIcon />
                  </ListItemIcon>
                  <ListItemText primary="ヒートマップ" />
                </ListItemButton>
              </List>
            </>
          )}
          {["admin", "moderator"].includes(profile.user_type) && (
            <>
              <Divider />
              <List subheader={<ListSubheader>管理用操作</ListSubheader>}>
                <ListItemButton
                  selected={path === `/admin/guest`}
                  onClick={() => navigate("/admin/guest")}
                >
                  <ListItemIcon>
                    <BadgeRoundedIcon />
                  </ListItemIcon>
                  <ListItemText primary="ゲスト照会" />
                </ListItemButton>
                <ListItemButton
                  selected={path === `/admin/lost-wristband`}
                  onClick={() => navigate("/admin/lost-wristband")}
                >
                  <ListItemIcon>
                    <ExploreOffRoundedIcon />
                  </ListItemIcon>
                  <ListItemText primary="リストバンド紛失" />
                </ListItemButton>
              </List>
            </>
          )}
        </>
      )}
      <Divider />
      <Box sx={{ p: 2 }}>
        <Typography variant="caption">
          ver. 1.3.0 (22/07/07)
        </Typography>
        <br />
        <Typography variant="caption">© 栄東祭実行委員会 技術部</Typography>
      </Box>
    </Drawer>
  );
};

export default DrawerLeft;
