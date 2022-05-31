import { atom, selector } from "recoil";
import { tokenState } from "#/recoil/user";
import axios, { AxiosError, AxiosResponse } from "axios";
import { generalFailedProp } from "#/types/global";
import { infoSuccessProp } from "#/types/exhibit";
import aspidaClient from "@aspida/axios";
import api from "#/api/$api";

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
        const x = api(aspidaClient()).exhibit.list.$get({
          headers: {
            Authorization: `Bearer ${toenStateValue}`
          }
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
