// jotai/audioPlayer/selectors.ts
import { atom } from 'jotai';
import { songMapAtom, trackTypeAtom, videoIDAtom } from './atoms';

// 現在のwavURL（videoID + trackType → URL）
export const wavURLAtom = atom((get) => {
  const songMap = get(songMapAtom);
  const videoID = get(videoIDAtom);
  const trackType = get(trackTypeAtom);

  return (videoID && songMap[videoID]?.wav?.[trackType]) ?? null;
});

// 現在のタイトル
export const titleAtom = atom((get) => {
  const songMap = get(songMapAtom);
  const videoID = get(videoIDAtom);
  return (videoID && songMap[videoID]?.title) ?? '';
});

// 現在のサムネイル
export const thumbnailAtom = atom((get) => {
  const songMap = get(songMapAtom);
  const videoID = get(videoIDAtom);
  return (videoID && songMap[videoID]?.thumbnail) ?? '';
});
