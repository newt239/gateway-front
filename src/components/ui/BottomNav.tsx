import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { profileState } from "#/recoil/user";

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

const SimpleBottomNavigation = () => {
  const profile = useRecoilValue(profileState);
  const path = useLocation().pathname;
  const [value, setValue] = React.useState("other");
  const navigate = useNavigate();

  useEffect(() => {
    if (path === "/") {
      setValue("");
    } else if (/exhibit/.test(path) && !(/chart\/exhibit/.test(path))) {
      setValue("exhibit");
    } else if (/entrance/.test(path)) {
      setValue("entrance");
    } else if (/chart/.test(path)) {
      setValue("chart");
    } else {
      setValue("other");
    }
  }, [path]);

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    navigate(`${newValue}`);
    setValue(newValue);
  };

  return (
    <>
      {profile && profile.available && (
        <Paper
          sx={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 1 }}
          elevation={3}
        >
          {["admin", "moderator", "executive"].includes(profile.user_type) && (
            <BottomNavigation showLabels value={value} onChange={handleChange}>
              <BottomNavigationAction
                label="ホーム"
                value=""
                icon={<HomeRoundedIcon />}
              />
              <BottomNavigationAction
                label="エントランス"
                value="entrance"
                icon={<MeetingRoomRoundedIcon />}
                sx={{ whiteSpace: 'nowrap' }}
              />
              <BottomNavigationAction
                label="入退室処理"
                value="exhibit"
                icon={<CelebrationRoundedIcon />}
                sx={{ whiteSpace: 'nowrap' }}
              />
              <BottomNavigationAction
                label="滞在状況"
                value="chart"
                icon={<AutoGraphRoundedIcon />}
              />
            </BottomNavigation>
          )}
          {["exhibit"].includes(profile.user_type) && (
            <BottomNavigation showLabels value={value} onChange={handleChange}>
              <BottomNavigationAction
                label="ホーム"
                value=""
                icon={<HomeRoundedIcon />}
              />
              <BottomNavigationAction
                label="入室処理"
                value={`exhibit/${profile.user_id}/enter`}
                icon={<LoginRoundedIcon />}
              />
              <BottomNavigationAction
                label="退室処理"
                value={`exhibit/${profile.user_id}/exit`}
                icon={<LogoutRoundedIcon />}
              />
              <BottomNavigationAction
                label="滞在状況"
                value={`chart/exhibit/${profile.user_id}`}
                icon={<AutoGraphRoundedIcon />}
              />
            </BottomNavigation>
          )}
        </Paper>
      )}
    </>
  );
};

export default SimpleBottomNavigation;
