export interface reservationInfoProp {
  reservation_id: string;
  guest_type: "general" | "student" | "family" | "special";
  count: number;
  registered: number;
  available: boolean;
  part: string;
  note: string;
}

export interface reservationSuccessProp {
  status: "success";
  data: reservationInfoProp;
}
