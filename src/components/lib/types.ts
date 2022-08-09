export type userTypeProp = "moderator" | "executive" | "exhibit";

export interface profileProp {
  user_id: string;
  display_name: string;
  user_type: string;
  available: number;
}

export interface reservationInfoProp {
  reservation_id: string;
  guest_type: string;
  part: number;
  count: number;
  registered: {
    guest_id: string;
    is_spare: number;
  }[];
  available: number;
}

export interface exhibitProp {
  exhibit_id: string;
  exhibit_name: string;
}

export type guestInfoProp = {
  guest_id: string;
  guest_type: string;
  reservation_id: string;
  part: number;
  available: number;
};

export interface guestsInfoSuccessProp {
  status: "success";
  data: guestInfoProp;
}

export type exhibitCurrentGuestProp = {
  id: string;
  guest_type: "student" | "teacher" | "family" | "other";
  enter_at: string;
};

export type exhibitTypeProp = "class" | "club" | "stage" | "other";
