import { atom } from 'jotai'
import { reservationInfoProp } from '#/types/global';

const initialPageAtomValue = "ホーム";
const pageAtom = atom(initialPageAtomValue);
export const pageTitleAtom = atom(
  (get) => get(pageAtom),
  (get, set, action: string) => {
    if (action === initialPageAtomValue) {
      document.title = "Gateway";
    } else {
      document.title = `${action} | Gateway`;
    }
    set(pageAtom, action);
  }
);

export const deviceStateAtom = atom(false);

export const reservationAtom = atom<reservationInfoProp | null>(null);