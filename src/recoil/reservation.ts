import { atom } from "recoil";

interface reservationInfoProp {
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

export const reservationState = atom<reservationInfoProp | null>({
  key: "reservationState",
  default: null,
});
