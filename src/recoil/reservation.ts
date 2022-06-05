import { atom } from "recoil";

interface reservationInfoProp {
  reservation_id: string;
  guest_type: string; // "general" | "student" | "family" | "special";
  part: string;
  count: number;
  registered: number;
  available: number;
}

export const reservationState = atom<reservationInfoProp | null>({
  key: "reservationState",
  default: null,
});
