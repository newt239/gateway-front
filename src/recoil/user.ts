import { atom } from "recoil";
import { profileProp } from "#/components/types/global";
export const tokenState = atom<null | string>({
  key: "tokenState",
  default: localStorage.getItem("gatewayApiToken"),
});

export const profileState = atom<null | profileProp>({
  key: "profileState",
  default: null,
});
