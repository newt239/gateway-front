import { atom, DefaultValue, selector } from 'recoil';

type pageStateProp = {
    title: string;
}

export const pageState = atom<pageStateProp>({
    key: "pageState",
    default: {
        "title": "ホーム"
    }
})

export const pageStateSelector = selector<pageStateProp>({
    key: 'pageStateSelector',
    get: ({ get }) => get(pageState),
    set: ({ set, get }, value) => {
        if (value instanceof DefaultValue) {
            document.title = `Gateway`;
        } else {
            document.title = `${value.title} | Gateway`;
        }
        set(pageState, value);
    }
});