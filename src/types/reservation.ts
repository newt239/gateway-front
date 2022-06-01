export interface reservationInfoProp {
  reservation_id: string;
  guest_type: string; // "general" | "student" | "family" | "special";
  count: number;
  registered: number;
  available: number;
  part: string;
  note: string;
}

export interface reservationSuccessProp {
  status: "success";
  data: reservationInfoProp;
}
