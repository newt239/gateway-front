import { atom, selector } from "recoil";
import { tokenState } from "#/recoil/user";
import axios, { AxiosError, AxiosResponse } from "axios";
import { generalFailedProp } from "#/types/global";
import { infoSuccessProp } from "#/types/exhibit";

const API_BASE_URL: string = process.env.REACT_APP_API_BASE_URL!;

type exhibitProp = {
  exhibit_id: string;
  exhibit_name: string;
};

export const exhibitListState = atom<exhibitProp[]>({
  key: "exhibitListState",
  default: selector<exhibitProp[]>({
    key: "exhibitListSelector",
    get: ({ get }) => {
      const toenStateValue = get(tokenState);
      if (toenStateValue) {
        const x = axios
          .get(`${API_BASE_URL}/v1/exhibit/info/`, {
            headers: { Authorization: `Bearer ${toenStateValue}` },
          })
          .then((res: AxiosResponse<infoSuccessProp>) => {
            return res.data.data;
          })
          .catch((err: AxiosError<generalFailedProp>) => {
            console.log(err);
            return [];
          });
        return x;
      } else {
        return [];
      }
    },
  }),
});

export const currentExhibitState = atom<exhibitProp>({
  key: "currentExhibitState",
  default: selector<exhibitProp>({
    key: "currentExhibitSelector",
    get: ({ get }) => {
      return get(exhibitListState)[0];
    },
  }),
});
