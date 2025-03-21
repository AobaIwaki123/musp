// jotai/audioPlayer/atoms.ts
import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import type { SongData, TrackType } from './types';

// 再生対象の楽曲IDリスト（queue）
export const audioQueueAtom = atom<string[]>([]);

// 現在の再生インデックス
export const currentIndexAtom = atom<number>(0);

// 楽曲IDから楽曲情報へのMap
export const songMapAtom = atom<Record<string, SongData>>({});

// 現在選択中のトラック（例: vocal, inst）
export const trackTypeAtom = atomWithStorage<TrackType>('trackType', 'vocal');

// 現在のvideoIDは、queueとindexから導出される形式でも可
export const videoIDAtom = atom(
  (get) => get(audioQueueAtom)[get(currentIndexAtom)] ?? null,
  (get, set, index: number) => {
    const queue = get(audioQueueAtom);
    if (index >= 0 && index < queue.length) {
      set(currentIndexAtom, index);
    }
  }
);
