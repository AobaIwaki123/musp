import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';


// base の値を 6/12 でトグルするフラグ
export const isHalfWidthAtom = atomWithStorage('isHalfWidth', true);

// WAVファイルのURLを管理するAtom
export const wavFileAtom = atom<string | null>(null);

// User Info
export const userIDAtom = atomWithStorage('userID', '');

// Login
export const isShowLoginModalAtom = atom(false);
