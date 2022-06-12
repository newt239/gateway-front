import { atom, selector } from "recoil";
import { tokenState, profileState } from "#/recoil/user";
import apiClient from "#/axios-config";

type exhibitProp = {
  exhibit_id: string;
  exhibit_name: string;
};

export const exhibitListState = atom<exhibitProp[]>({
  key: "exhibitListState",
  default: selector<exhibitProp[]>({
    key: "exhibitListSelector",
    get: async ({ get }) => {
      const tokenStateValue = get(tokenState);
      const profileStateValue = get(profileState);
      if (tokenStateValue && profileStateValue) {
        if (profileStateValue.user_type === "executive") {
          return [
            { "exhibit_id": "gym", "exhibit_name": "体育館" },
            { "exhibit_id": "auditorium", "exhibit_name": "講堂" },
            { "exhibit_id": "cchall", "exhibit_name": "CCホール" },
            { "exhibit_id": "cafeteria", "exhibit_name": "食堂" }
          ]
        } else if (["admin", "moderator"].includes(profileStateValue.user_type)) {
          return await apiClient(
            process.env.REACT_APP_API_BASE_URL
          ).exhibit.list.$get({
            headers: {
              Authorization: `Bearer ${tokenStateValue}`,
            },
          });
        } else {
          return [];
        }
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
