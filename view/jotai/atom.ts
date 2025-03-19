import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

// base の値を 6/12 でトグルするフラグ
export const isHalfWidthAtom = atomWithStorage('isHalfWidth', true);

// Vocal / Inst. の選択状態を管理するAtom
export const isVocalAtom = atomWithStorage('isVocal', true);

// タイトルを管理するAtom
export const titleAtom = atom<string>('');

// サムネ画像を管理するAtom
export const thumbnailAtom = atom<string | null>(null);

// Wavファイル　のURLを管理するAtom
export const wavURLAtom = atom<string | null>(null);

// User Info
export const userIDAtom = atomWithStorage('userID', '');

// Login
export const isShowLoginModalAtom = atom(false);
