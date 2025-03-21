import type { PostVideoResponseType, VideoIDAndWavURLType } from '@/client/client';

// 個別変換：PostVideoResponseType → Record<string, VideoIDAndWavURLType>
export function convertToVideoDictEntry(
  response: PostVideoResponseType
): Record<string, VideoIDAndWavURLType> {
  return {
    [response.youtube_id]: {
      youtube_id: response.youtube_id,
      vocal_wav_url: 'http://example.com',
      inst_wav_url: 'http://example.com',
    },
  };
}
