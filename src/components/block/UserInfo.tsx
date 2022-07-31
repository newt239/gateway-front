import React from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState, useSetRecoilState } from "recoil";
import { tokenState, profileState } from "#/recoil/user";
import Identicon from "boring-avatars";

import { Button, Box, Typography, Tooltip } from "@mui/material";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import GroupIcon from "@mui/icons-material/Group";
import NoAccountsIcon from "@mui/icons-material/NoAccounts";

const UserInfo = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useRecoilState(profileState);
  const setToken = useSetRecoilState(tokenState);

  const logout = () => {
    setToken(null);
    setProfile(null);
    localStorage.removeItem("gatewayApiToken");
    navigate("/login", { replace: true });
  };

  const AccountType = () => {
    if (profile && profile.available) {
      switch (profile.user_type) {
        case "moderator":
          return (
            <Tooltip title="管理者用アカウント">
              <AdminPanelSettingsIcon />
            </Tooltip>
          );
        case "executive":
          return (
            <Tooltip title="文実用アカウント">
              <AccountCircleIcon />
            </Tooltip>
          );
        case "exhibit":
          return (
            <Tooltip title="展示用アカウント">
              <GroupIcon />
            </Tooltip>
          );
        default:
          return (
            <Tooltip title="権限不明">
              <NoAccountsIcon />
            </Tooltip>
          );
      }
    } else {
      return <NoAccountsIcon />;
    }
  };

  return (
    <>
      {profile && profile.available ? (
        <>
          <Box sx={{ width: "100%", textAlign: "right" }}>
            <AccountType />
          </Box>
          <Identicon
            size={40}
            name={profile.user_id}
            variant="beam"
            colors={["#92A1C6", "#146A7C", "#F0AB3D", "#C271B4", "#C20D90"]}
          />
          <Typography variant="h3">{profile.display_name}</Typography>
          <Typography sx={{ fontSize: 10 }}>@{profile.user_id}</Typography>
          <Box sx={{ width: "100%", textAlign: "right" }}>
            <Button
              variant="outlined"
              color="error"
              onClick={logout}
              sx={{ mt: 2 }}
              startIcon={<LogoutRoundedIcon />}
            >
              ログアウト
            </Button>
          </Box>
        </>
      ) : (
        <>
          <Typography>ログインしていません</Typography>
          <Box sx={{ width: "100%", textAlign: "right" }}>
            <Button
              variant="outlined"
              onClick={() => navigate("/login", { replace: true })}
              sx={{ mt: 2 }}
              startIcon={<LogoutRoundedIcon />}
            >
              ログイン
            </Button>
          </Box>
        </>
      )}
    </>
  );
};

export default UserInfo;
