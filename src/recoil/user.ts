import { atom } from 'recoil';

export const tokenState = atom<null | string>({
  key: "tokenState",
  default: localStorage.getItem('gatewayApiToken')
});

type profileProp = {
  userId: string;
  display_name: string;
  user_type: string;
  role: string;
  available: boolean;
  note: string;
};

export const profileState = atom<null | profileProp>({
  key: "profileState",
  default: null
});