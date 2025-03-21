// hooks/useAudioPlayer.ts
import { useCallback } from 'react';
import { useAtom } from 'jotai';
import {
  audioQueueAtom,
  currentIndexAtom,
  trackTypeAtom,
} from '@/jotai/audioPlayer/atoms';
import type { TrackType } from '@/jotai/audioPlayer/types';

export function useAudioPlayer() {
  const [queue, setQueue] = useAtom(audioQueueAtom);
  const [currentIndex, setCurrentIndex] = useAtom(currentIndexAtom);
  const [trackType, setTrackType] = useAtom(trackTypeAtom);

  const setNewQueue = useCallback(
    (ids: string[]) => {
      setQueue(ids);
      setCurrentIndex(-1);
    },
    [setQueue, setCurrentIndex]
  );

  const playAt = useCallback(
    (index: number) => {
      if (index >= 0 && index < queue.length) {
        setCurrentIndex(index);
      }
    },
    [queue.length, setCurrentIndex]
  );

  const next = useCallback(() => {
    if (currentIndex + 1 < queue.length) {
      setCurrentIndex(currentIndex + 1);
    }
  }, [currentIndex, queue.length, setCurrentIndex]);

  const prev = useCallback(() => {
    if (currentIndex - 1 >= 0) {
      setCurrentIndex(currentIndex - 1);
    }
  }, [currentIndex, setCurrentIndex]);

  const switchTrack = useCallback(
    (type: TrackType) => {
      setTrackType(type);
    },
    [setTrackType]
  );

  return {
    queue,
    currentIndex,
    trackType,
    setNewQueue, // ← 新たに分離された関数
    playAt, // ← 再生のみ
    next,
    prev,
    switchTrack,
  };
}
