const generalProps = {
  reservation: {
    guest_type: {
      general: "一般",
      student: "生徒",
      family: "保護者",
      special: "来賓",
    },
  },
  guest: {
    guest_type: {
      general: "一般",
      student: "生徒",
      family: "保護者",
      special: "来賓",
    },
  },
  time_part: [
    {
      part_name: "全時間帯",
      start: "2022/09/17 08:00",
      end: "2022/09/18 17:00",
    },
    {
      part_name: "土曜9時30分～12時30分",
      start: "2022/09/17 09:30",
      end: "2022/09/17 12:30",
    },
    {
      part_name: "土曜11時00分～14時00分",
      start: "2022/09/17 11:00",
      end: "2022/09/17 14:00",
    },
    {
      part_name: "土曜12時00分～15時00分",
      start: "2022/09/17 12:00",
      end: "2022/09/17 15:00",
    },
    {
      part_name: "土曜13時00分～16時00分",
      start: "2022/09/17 13:00",
      end: "2022/09/17 16:00",
    },
    {
      part_name: "土曜14時00分～16時00分",
      start: "2022/09/17 14:00",
      end: "2022/09/17 16:00",
    },
    {
      part_name: "土曜15時00分～16時00分",
      start: "2022/09/17 15:00",
      end: "2022/09/17 16:00",
    },
    {
      part_name: "日曜9時30分～12時30分",
      start: "2022/09/18 09:30",
      end: "2022/09/18 12:30",
    },
    {
      part_name: "日曜11時00分～14時00分",
      start: "2022/09/18 11:00",
      end: "2022/09/18 14:00",
    },
    {
      part_name: "日曜12時00分～15時00分",
      start: "2022/09/18 12:00",
      end: "2022/09/18 15:00",
    },
    {
      part_name: "日曜13時00分～16時00分",
      start: "2022/09/18 13:00",
      end: "2022/09/18 16:00",
    },
    {
      part_name: "日曜14時00分～16時00分",
      start: "2022/09/18 14:00",
      end: "2022/09/18 16:00",
    },
    {
      part_name: "日曜15時00分～16時00分",
      start: "2022/09/18 15:00",
      end: "2022/09/18 16:00",
    },
  ],
};

export default generalProps;

export type exhibitCurrentGuestProp = {
  id: string;
  guest_type: "general" | "student" | "family" | "special";
  enter_at: string;
};

export type profileStateProp = {
  user_id: string;
  display_name: string;
  user_type: string;
  role: string;
  available: boolean;
  note: string;
};

export type userTypeProp =
  | "admin"
  | "moderator"
  | "executive"
  | "exhibit"
  | "analysis";

export type exhibitTypeProp = "class" | "club" | "stage" | "other";
