import { atom, useSetAtom } from "jotai";
import { profileProp, reservationInfoProp } from "#/components/lib/types";
import { useEffect } from "react";

export const tokenAtom = atom<string | null>(
  localStorage.getItem("gatewayApiToken")
);

export const profileAtom = atom<profileProp | null>(null);

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
export const setTitle = (pageTitle: string) => {
  const setPageTitle = useSetAtom(pageTitleAtom);
  useEffect(() => {
    setPageTitle(pageTitle);
  }, []);
};

export const deviceStateAtom = atom(false);

export const reservationAtom = atom<reservationInfoProp | null>(null);
