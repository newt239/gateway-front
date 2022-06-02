export interface guestInfoProp {
  guest_id: string;
  guest_type: string;
  reservation_id: string;
  part: string;
  available: number;
}

export interface guestsInfoSuccessProp {
  status: "success";
  data: guestInfoProp;
}
