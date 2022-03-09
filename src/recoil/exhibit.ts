import { atom } from 'recoil';

export const currentExhibitState = atom({
    key: "currentExhibitState",
    default: {
        exhibit_id: "",
        exhibit_name: ""
    }
});

type exhibitListProp = {
    exhibit_id: string;
    exhibit_name: string;
}[];

export const exhibitListState = atom<exhibitListProp>({
    key: "profileState",
    default: []
});