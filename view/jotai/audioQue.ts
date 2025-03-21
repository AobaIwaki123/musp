import { atom } from 'jotai';

export const audioQueueAtom = atom<string[]>([]); // 再生キュー
export const currentIndexAtom = atom<number>(0);

export const videoIDAtom = atom(
  (get) => get(audioQueueAtom)[get(currentIndexAtom)] ?? null,
  (get, set, update: number) => {
    set(currentIndexAtom, update);
  }
);
