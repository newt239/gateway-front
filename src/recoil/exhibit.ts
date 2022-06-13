import { atom, selector } from "recoil";
import { tokenState, profileState } from "#/recoil/user";
import apiClient from "#/axios-config";

type exhibitProp = {
  exhibit_id: string;
  group_name: string;
  exhibit_type: string;
};

export const exhibitListState = atom<exhibitProp[]>({
  key: "exhibitListState",
  default: selector<exhibitProp[]>({
    key: "exhibitListSelector",
    get: async ({ get }) => {
      const tokenStateValue = get(tokenState);
      const profileStateValue = get(profileState);
      if (tokenStateValue && profileStateValue) {
        const res = await apiClient(
          process.env.REACT_APP_API_BASE_URL
        ).exhibit.list.$get({
          headers: {
            Authorization: `Bearer ${tokenStateValue}`,
          },
        });
        if (profileStateValue.user_type === "executive") {
          return res.filter(v => v.exhibit_type === "stage");
        } else if (
          ["admin", "moderator"].includes(profileStateValue.user_type)
        ) {
          return res;
        }
      }
      return [];
    }
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
