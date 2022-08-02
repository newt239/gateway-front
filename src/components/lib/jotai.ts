import { atom } from 'jotai'

const initialPageAtomValue = "ホーム";
const pageAtom = atom(initialPageAtomValue);
export const pageTitleAtom = atom(
  (get) => get(pageAtom),
  (get, set, action: string) => {
    if (action === initialPageAtomValue) {
      document.title = "Gateway";
    } else {
      document.title = `${action} | Gateway`;
    }
    set(pageAtom, action);
  }
)