import React, { Suspense } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAtomValue } from "jotai";
import { profileAtom } from "#/components/lib/jotai";

import {
  Drawer,
  Box,
  Toolbar,
  List,
  ListSubheader,
  Divider,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import ListItemButton, {
  ListItemButtonProps,
} from "@mui/material/ListItemButton";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import LoginRoundedIcon from "@mui/icons-material/LoginRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import ConfirmationNumberRoundedIcon from '@mui/icons-material/ConfirmationNumberRounded';
import RoomRoundedIcon from "@mui/icons-material/RoomRounded";
import BadgeRoundedIcon from "@mui/icons-material/BadgeRounded";
import BarChartRoundedIcon from "@mui/icons-material/BarChartRounded";
import ExploreOffRoundedIcon from "@mui/icons-material/ExploreOffRounded";
import MapRoundedIcon from "@mui/icons-material/MapRounded";

import theme from "#/components/lib/theme";
import UserInfo from "#/components/block/UserInfo";
import Version from "#/components/block/Version";

const drawerWidth = 250;

const DrawerLeft: React.VFC = () => {
  const path = useLocation().pathname;
  const navigate = useNavigate();
  const profile = useAtomValue(profileAtom);

  const StyledListItemButton = styled(ListItemButton)<ListItemButtonProps>(
    () => ({
      margin: ".1rem .5rem",
      borderRadius: theme.shape.borderRadius,
    })
  );

  return (
    <Drawer
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
        },
        zIndex: 100,
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
            <StyledListItemButton
              selected={path === "/"}
              onClick={() => navigate("/")}
            >
              <ListItemIcon>
                <HomeRoundedIcon />
              </ListItemIcon>
              <ListItemText primary="ホーム" />
            </StyledListItemButton>
          </List>
          {["exhibit"].includes(profile.user_type) && (
            <>
              <List subheader={<ListSubheader>展示企画</ListSubheader>}>
                <StyledListItemButton
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
                </StyledListItemButton>
                <StyledListItemButton
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
                </StyledListItemButton>
                <StyledListItemButton
                  selected={
                    path ===
                    `/analytics/exhibit/${profile.user_id || "unknown"}`
                  }
                  onClick={() =>
                    navigate(
                      `/analytics/exhibit/${profile.user_id || "unknown"}`
                    )
                  }
                >
                  <ListItemIcon>
                    <BarChartRoundedIcon />
                  </ListItemIcon>
                  <ListItemText primary="滞在状況" />
                </StyledListItemButton>
              </List>
            </>
          )}
          {["moderator", "executive"].includes(profile.user_type) && (
            <>
              <List subheader={<ListSubheader>展示企画</ListSubheader>}>
                <StyledListItemButton
                  selected={path === `/exhibit/`}
                  onClick={() => navigate(`/exhibit/`)}
                >
                  <ListItemIcon>
                    <RoomRoundedIcon />
                  </ListItemIcon>
                  <ListItemText primary="展示選択" />
                </StyledListItemButton>
              </List>
              <List subheader={<ListSubheader>エントランス</ListSubheader>}>
                <StyledListItemButton
                  selected={path === `/entrance/reserve-check` || path === `/entrance/enter`}
                  onClick={() => navigate("/entrance/reserve-check")}
                >
                  <ListItemIcon>
                    <LoginRoundedIcon />
                  </ListItemIcon>
                  <ListItemText primary="入場スキャン" />
                </StyledListItemButton>
                <StyledListItemButton
                  selected={path === `/entrance/exit`}
                  onClick={() => navigate("/entrance/exit")}
                >
                  <ListItemIcon>
                    <LogoutRoundedIcon />
                  </ListItemIcon>
                  <ListItemText primary="退場スキャン" />
                </StyledListItemButton>
                <StyledListItemButton
                  selected={path === `/entrance/other-enter`}
                  onClick={() => navigate("/entrance/other-enter")}
                >
                  <ListItemIcon>
                    <ConfirmationNumberRoundedIcon />
                  </ListItemIcon>
                  <ListItemText primary="保護者以外の入場" />
                </StyledListItemButton>
              </List>
            </>
          )}
          {["moderator"].includes(profile.user_type) && (
            <>
              <List subheader={<ListSubheader>データ</ListSubheader>}>
                <StyledListItemButton
                  selected={path === `/analytics`}
                  onClick={() => navigate("/analytics")}
                >
                  <ListItemIcon>
                    <BarChartRoundedIcon />
                  </ListItemIcon>
                  <ListItemText primary="滞在状況" />
                </StyledListItemButton>
                <StyledListItemButton
                  selected={path === `/analytics/summary`}
                  onClick={() => navigate("/analytics/summary")}
                >
                  <ListItemIcon>
                    <MapRoundedIcon />
                  </ListItemIcon>
                  <ListItemText primary="展示一覧" />
                </StyledListItemButton>
              </List>
              <List subheader={<ListSubheader>管理用操作</ListSubheader>}>
                <StyledListItemButton
                  selected={path === `/admin/guest`}
                  onClick={() => navigate("/admin/guest")}
                >
                  <ListItemIcon>
                    <BadgeRoundedIcon />
                  </ListItemIcon>
                  <ListItemText primary="ゲスト照会" />
                </StyledListItemButton>
                <StyledListItemButton
                  selected={path === `/admin/lost-wristband`}
                  onClick={() => navigate("/admin/lost-wristband")}
                >
                  <ListItemIcon>
                    <ExploreOffRoundedIcon />
                  </ListItemIcon>
                  <ListItemText primary="紛失対応" />
                </StyledListItemButton>
              </List>
            </>
          )}
        </>
      )}
      <Divider />
      <Box sx={{ p: 2 }}>
        <Version />
      </Box>
    </Drawer>
  );
};

export default DrawerLeft;
