;
// hooks/useAudioPlayer.ts
import { useAtom } from 'jotai';
import { audioQueueAtom, currentIndexAtom, trackTypeAtom, videoIDAtom } from '@/jotai/audioPlayer/atoms';
import type { TrackType } from '@/jotai/audioPlayer/types';


export function useAudioPlayer() {
  const [queue, setQueue] = useAtom(audioQueueAtom);
  const [currentIndex, setCurrentIndex] = useAtom(currentIndexAtom);
  const [trackType, setTrackType] = useAtom(trackTypeAtom);
  const [, setVideoID] = useAtom(videoIDAtom);

  const setNewQueue = (ids: string[]) => {
    setQueue(ids);
    setCurrentIndex(-1); // 初期化（未再生状態）
  };

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

  const switchTrack = (type: TrackType) => {
    setTrackType(type);
  };

  return {
    queue,
    currentIndex,
    trackType,
    setNewQueue,       // ← 新たに分離された関数
    playAt,            // ← 再生のみ
    next,
    prev,
    switchTrack,
  };
}
