import { atom, selector } from "recoil";
import { tokenState } from "#/recoil/user";
import apiClient from "#/axios-config";

type exhibitProp = {
  exhibit_id: string;
  exhibit_name: string;
};

export const exhibitListState = atom<exhibitProp[]>({
  key: "exhibitListState",
  default: selector<exhibitProp[]>({
    key: "exhibitListSelector",
    get: ({ get }) => {
      const tokenStateValue = get(tokenState);
      if (tokenStateValue) {
        const x = apiClient(
          process.env.REACT_APP_API_BASE_URL
        ).exhibit.list.$get({
          headers: {
            Authorization: `Bearer ${tokenStateValue}`,
          },
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
