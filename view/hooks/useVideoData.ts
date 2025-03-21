// hooks/useVideoData.ts
import { useCallback, useState } from 'react';
import { api } from '@/client/api';
import type { PostVideoRequestType } from '@/client/client';
import { convertToVideoDict } from '@/dto/toVideoDict';
import { convertToVideoDictEntry } from '@/dto/toVideoDictEntry';
import { storage } from '@/helper/localStorageHelper';

export function useVideoData() {
  const [videoDict, setVideoDict] = useState<Record<string, any>>({});
  const apiKey = process.env.NEXT_PUBLIC_API_KEY ?? '';

  const reload = useCallback(() => {
    const userID = storage.get('userID', '');
    if (!userID) return;

    api
      .getUser_id({
        params: { user_id: userID },
        headers: { 'X-API-KEY': apiKey },
      })
      .then((res) => {
        setVideoDict(convertToVideoDict(res.data));
      })
      .catch(console.error);
  }, [apiKey]); // ← 依存関係に注意！

  const addVideo = (url: string) => {
    const userID = storage.get('userID', '');
    if (!userID) return;

    const data: PostVideoRequestType = {
      user_id: userID,
      youtube_url: url,
    };

    api
      .postVideo(data, { headers: { 'X-API-KEY': apiKey } })
      .then((res) => {
        if (res.status_code === 201) {
          setVideoDict((prev) => ({
            ...prev,
            ...convertToVideoDictEntry(res),
          }));
        }
      })
      .catch(console.error);
  };

  return { videoDict, reload, addVideo };
}
