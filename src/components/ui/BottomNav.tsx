import React, { useEffect } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { profileState } from "#/recoil/user";

import { Paper, BottomNavigation, BottomNavigationAction } from '@mui/material/';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import MeetingRoomRoundedIcon from '@mui/icons-material/MeetingRoomRounded';


const SimpleBottomNavigation = () => {
  const profile = useRecoilValue(profileState);
  const path = useLocation().pathname;
  const [value, setValue] = React.useState("other");
  const navigate = useNavigate();

  useEffect(() => {
    if (path === '/') {
      setValue('');
    } else if (/exhibit/.test(path)) {
      setValue('exhibit');
    } else if (/entrance/.test(path)) {
      setValue('entrance');
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
        <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 1 }} elevation={3}>
          <BottomNavigation
            showLabels
            value={value}
            onChange={handleChange}
          >
            <BottomNavigationAction label="ホーム" value="" icon={<HomeRoundedIcon />} />
            {["admin", "moderator", "exhibit"].indexOf(profile.user_type, -1) && (
              <BottomNavigationAction label="入退室処理" value="exhibit" icon={<MeetingRoomRoundedIcon />} />
            )}
            {["admin", "moderator", "user"].indexOf(profile.user_type, -1) && (
              <BottomNavigationAction label="エントランス" value="entrance" icon={<MeetingRoomRoundedIcon />} />
            )}
          </BottomNavigation>
        </Paper>
      )}
    </>
  );
};

export default SimpleBottomNavigation;