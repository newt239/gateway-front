import { atom, selector } from 'recoil';

export const tokenState = atom({
    key: "tokenState",
    default: ""
});

export const profileState = atom({
    key: "profileState",
    default: {
        userid: '',
        display_name: '',
        user_type: '',
        role: '',
        available: false,
        note: '',
    }
})

export const userState = selector({
    key: "roughCounterState",
    get: ({ get }) => ({
        token: get(tokenState),
        profile: get(profileState)
    })
});