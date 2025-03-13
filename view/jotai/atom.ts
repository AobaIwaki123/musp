import { atom } from 'jotai';


// base の値を 6/12 でトグルするフラグ
export const isHalfWidthAtom = atom(true);

// WAVファイルのURLを管理するAtom
export const wavFileAtom = atom<string | null>(null);
