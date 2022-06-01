export interface reservationInfoProp {
  reservation_id: string;
  guest_type: string; // "general" | "student" | "family" | "special";
  part: string;
  count: number;
  registered: number;
  available: number;
}

export interface reservationSuccessProp {
  status: "success";
  data: reservationInfoProp;
}
