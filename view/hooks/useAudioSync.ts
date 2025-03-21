// hooks/useAudioSync.ts
import { useEffect, useRef, useState } from 'react';
import { useAtom } from 'jotai';
import { audioQueueAtom, currentIndexAtom, songMapAtom } from '@/jotai/audioPlayer/atoms';
import type { SongData } from '@/jotai/audioPlayer/types';
import type { ApplicationCardProps } from '@/components/Home/ApplicationGrid/ApplicationCard/ApplicationCard';

export function useAudioSync(videoDict: Record<string, any>) {
  const [, setAudioQueue] = useAtom(audioQueueAtom);
  const [, setSongMap] = useAtom(songMapAtom);
  const [, setCurrentIndex] = useAtom(currentIndexAtom);
  const [cardProps, setCardProps] = useState<ApplicationCardProps[]>([]);
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (Object.keys(videoDict).length === 0) return;

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

      cards.push({
        youtube_id: id,
        is_ready,
        index,
        all_ids: ids,
      });
    });

    setAudioQueue(ids);
    setSongMap(songMap);
    setCardProps(cards);

    if (!hasInitialized.current) {
      setCurrentIndex(-1);
      hasInitialized.current = true;
    }
  }, [videoDict, setAudioQueue, setSongMap, setCurrentIndex]);

  return cardProps;
}
