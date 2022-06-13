import { atom } from "recoil";

export const currentExhibitState = atom<string>({
  key: "currentExhibitState",
  default: ""
});
