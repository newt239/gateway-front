import { reservationInfoProp } from '#/types/reservation';
import { atom } from 'recoil';


export const reservationState = atom<reservationInfoProp | null>({
  key: "reservationState",
  default: null
});