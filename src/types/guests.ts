export interface guestInfoProp {
  guest_id: string;
  guest_type: "general" | "student" | "family" | "special";
  exhibit_id?: string;
  reservation_id?: string;
  part: string;
  available?: boolean;
  register_at?: string;
  revoke_at?: string | null;
  note?: string;
  user_id: string;
}

export interface guestsInfoSuccessProp {
  status: "success";
  data: guestInfoProp;
}
