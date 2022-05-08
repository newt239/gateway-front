import { profileProp } from "#/types/global";

export interface loginSuccessProp {
  status: "success";
  token: string;
  profile: profileProp;
}
