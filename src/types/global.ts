export type userTypeProp =
  | "admin"
  | "moderator"
  | "executive"
  | "exhibit"
  | "analysis";

export interface profileProp {
  user_id: string;
  display_name: string;
  user_type: string;
  available: number;
  role: string;
  note?: string;
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
  guest_type: "student" | "family" | "other";
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

export type exhibitTypeProp = "class" | "club" | "stage" | "special";
