;
// hooks/useAudioSync.ts
import { useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import { audioQueueAtom, currentIndexAtom, songMapAtom } from '@/jotai/audioPlayer/atoms';
import type { SongData } from '@/jotai/audioPlayer/types';
import type { ApplicationCardProps } from '@/components/Home/ApplicationGrid/ApplicationCard/ApplicationCard';


let hasAudioInitialized = false;

export function useAudioSync(videoDict: Record<string, any>) {
  const [, setAudioQueue] = useAtom(audioQueueAtom);
  const [, setSongMap] = useAtom(songMapAtom);
  const [currentIndex, setCurrentIndex] = useAtom(currentIndexAtom);
  const [cardProps, setCardProps] = useState<ApplicationCardProps[]>([]);

  useEffect(() => {
    if (Object.keys(videoDict).length === 0) return;
    console.log("useAudioSync Called");

    const ids = Object.keys(videoDict);
    const songMap: Record<string, SongData> = {};
    const cards: ApplicationCardProps[] = [];

    ids.forEach((id, index) => {
      const video = videoDict[id];
      const is_ready =
        video.vocal_wav_url !== 'http://example.com' && video.inst_wav_url !== 'http://example.com';

      songMap[id] = {
        title: '',
        thumbnail: `https://img.youtube.com/vi/${id}/hqdefault.jpg`,
        wav: {
          vocal: video.vocal_wav_url,
          inst: video.inst_wav_url,
        },
      };

      cards.push({ youtube_id: id, is_ready, index, all_ids: ids });
    });

    setAudioQueue(ids);
    setSongMap(songMap);
    setCardProps(cards);

    // 現在の youtube_id を保持して再マッピングする
    const currentId = ids[currentIndex];
    const nextIndex = currentId ? ids.indexOf(currentId) : -1;

    if (!hasAudioInitialized) {
      setCurrentIndex(-1);
      hasAudioInitialized = true;
    } else if (nextIndex !== -1) {
      setCurrentIndex(nextIndex); // ← 再生中のIDがまだ存在すれば維持
    } else {
      console.log("setCurrentIndex(-1)");
      setCurrentIndex(-1); // ← 消えていたら停止
    }
  }, [videoDict, setAudioQueue, setSongMap, setCurrentIndex, currentIndex]);

  return cardProps;
}
