// hooks/useAudioPlayer.ts
import { useAtom } from 'jotai';
import {
  audioQueueAtom,
  currentIndexAtom,
  trackTypeAtom,
  videoIDAtom,
} from '@/jotai/audioPlayer/atoms';
import type { TrackType } from '@/jotai/audioPlayer/types';

export function useAudioPlayer() {
  const [queue, setQueue] = useAtom(audioQueueAtom);
  const [currentIndex, setCurrentIndex] = useAtom(currentIndexAtom);
  const [trackType, setTrackType] = useAtom(trackTypeAtom);
  const [, setVideoID] = useAtom(videoIDAtom); // 明示的に使うなら

  const playAt = (index: number) => {
    if (index >= 0 && index < queue.length) {
      setCurrentIndex(index);
    }
  };

  const next = () => {
    if (currentIndex + 1 < queue.length) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const prev = () => {
    if (currentIndex - 1 >= 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const setNewQueueAndPlay = (ids: string[], index: number) => {
    setQueue(ids);
    setCurrentIndex(index);
  };

  const switchTrack = (type: TrackType) => {
    setTrackType(type);
  };

  return {
    currentIndex,
    trackType,
    playAt,
    next,
    prev,
    setNewQueueAndPlay,
    switchTrack,
  };
}
