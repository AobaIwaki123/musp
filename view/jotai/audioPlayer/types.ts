// jotai/audioPlayer/types.ts

export type TrackType = 'vocal' | 'inst'; // 今後増やせる

export type SongData = {
  title: string;
  thumbnail: string;
  wav: Record<TrackType, string>; // トラック種別ごとの音声URL
};
