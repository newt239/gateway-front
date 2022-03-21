import { atom, selector } from 'recoil';
import { tokenState } from "#/recoil/user";
import axios from "axios";

const API_BASE_URL: string = process.env.REACT_APP_API_BASE_URL!;

type exhibitProp = {
    exhibit_id: string;
    exhibit_name: string;
};

export const exhibitListState = atom<exhibitProp[]>({
    key: "exhibitListState",
    default: selector<exhibitProp[]>({
        key: "exhibitListSelector",
        get: async ({ get }) => {
            const res = await axios.get(`${API_BASE_URL}/v1/exhibit/info/`, { headers: { Authorization: "Bearer " + get(tokenState) } });
            return res.data.data;
        }
    })
});

export const currentExhibitState = atom<exhibitProp>({
    key: "currentExhibitState",
    default: selector<exhibitProp>({
        key: "currentExhibitSelector",
        get: ({ get }) => { return get(exhibitListState)[0] }
    })
});