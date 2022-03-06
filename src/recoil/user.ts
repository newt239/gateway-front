import { atom, DefaultValue, selector } from 'recoil';

export const tokenState = atom({
    key: "tokenState",
    default: ""
});

const defaultProfileState = {
    userid: '',
    display_name: '',
    user_type: '',
    role: '',
    available: false,
    note: '',
};

export const profileState = atom({
    key: "profileState",
    default: defaultProfileState
})

export const userState = selector({
    key: "roughCounterState",
    get: ({ get }) => ({
        token: get(tokenState),
        profile: get(profileState)
    })
});