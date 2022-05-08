import { atom } from "recoil";

export const deviceState = atom({
  key: "deviceState",
  default: false,
});

export const currentDeviceState = atom({
  key: "currentDeviceState",
  default: { deviceId: "", label: "" },
});

type deviceListProp = {
  deviceId: string;
  label: string;
}[];

export const deviceListState = atom<deviceListProp>({
  key: "deviceListState",
  default: [],
});
