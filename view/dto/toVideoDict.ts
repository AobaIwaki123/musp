import type { VideoIDAndWavURLType } from '@/client/client'; // import元は適宜調整

// Record型で辞書を表現
export type VideoDict = Record<string, VideoIDAndWavURLType>;

export function convertToVideoDict(data: VideoIDAndWavURLType[]): VideoDict {
  const dict: VideoDict = {};

  for (const item of data) {
    dict[item.youtube_id] = item;
  }

  return dict;
}
