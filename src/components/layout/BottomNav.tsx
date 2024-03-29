import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAtomValue } from "jotai";
import { profileAtom } from "#/components/lib/jotai";

import {
  Paper,
  BottomNavigation,
  BottomNavigationAction,
} from "@mui/material/";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import LoginRoundedIcon from "@mui/icons-material/LoginRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import MeetingRoomRoundedIcon from "@mui/icons-material/MeetingRoomRounded";
import CelebrationRoundedIcon from "@mui/icons-material/CelebrationRounded";
import AutoGraphRoundedIcon from "@mui/icons-material/AutoGraphRounded";

const BottomNav: React.VFC = () => {
  const profile = useAtomValue(profileAtom);
  const path = useLocation().pathname;
  const [value, setValue] = React.useState("other");
  const navigate = useNavigate();

  useEffect(() => {
    if (path === "/" || profile?.user_type === "exhibit") {
      setValue(path);
    } else {
      if (path.startsWith("/exhibit")) {
        setValue("/exhibit");
      } else if (path.startsWith("/entrance")) {
        setValue("/entrance");
      } else if (path.startsWith("/analytics")) {
        setValue("/analytics");
      }
    }
  }, [path]);

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    navigate(`${newValue}`);
  };

  return (
    <>
      {profile &&
        profile.available &&
        localStorage.getItem("viewOnly") !== "yes" && (
          <Paper
            // https://rishuntrading.co.jp/blog/programing/safari_z-index_notwork/
            sx={{
              position: "fixed",
              bottom: 0,
              left: 0,
              right: 0,
              zIndex: 200,
              transform: "translateZ(1px)",
            }}
            elevation={3}
          >
            {["moderator", "executive"].includes(profile.user_type) && (
              <BottomNavigation
                showLabels
                value={value}
                onChange={handleChange}
              >
                <BottomNavigationAction
                  label="ホーム"
                  value="/"
                  icon={<HomeRoundedIcon />}
                />
                <BottomNavigationAction
                  label="エントランス"
                  value="/entrance"
                  icon={<CelebrationRoundedIcon />}
                  sx={{ whiteSpace: "nowrap" }}
                />
                <BottomNavigationAction
                  label="入退室処理"
                  value="/exhibit"
                  icon={<MeetingRoomRoundedIcon />}
                  sx={{ whiteSpace: "nowrap" }}
                />
                {profile.user_type === "moderator" && (
                  <BottomNavigationAction
                    label="滞在状況"
                    value="/analytics"
                    icon={<AutoGraphRoundedIcon />}
                  />
                )}
              </BottomNavigation>
            )}
            {["exhibit"].includes(profile.user_type) && (
              <BottomNavigation
                showLabels
                value={value}
                onChange={handleChange}
              >
                <BottomNavigationAction
                  label="ホーム"
                  value="/"
                  icon={<HomeRoundedIcon />}
                />
                <BottomNavigationAction
                  label="入室処理"
                  value={`/exhibit/${profile.user_id}/enter`}
                  icon={<LoginRoundedIcon />}
                />
                <BottomNavigationAction
                  label="退室処理"
                  value={`/exhibit/${profile.user_id}/exit`}
                  icon={<LogoutRoundedIcon />}
                />
                <BottomNavigationAction
                  label="滞在状況"
                  value={`/analytics/exhibit/${profile.user_id}`}
                  icon={<AutoGraphRoundedIcon />}
                />
              </BottomNavigation>
            )}
          </Paper>
        )}
    </>
  );
};

export default BottomNav;
