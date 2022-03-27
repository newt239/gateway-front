import { atom } from 'recoil';

type reservationProp = {
  reservation_id: string;
  guest_type: "general" | "student" | "special";
  part: string;
  available: 0 | 1;
  count: number;
  registered: number;
  note: string;
};

export const reservationState = atom<reservationProp>({
  key: "reservationState",
  default: {
    reservation_id: "",
    guest_type: "general",
    part: "all",
    available: 0,
    count: 0,
    registered: 0,
    note: ""
  }
});