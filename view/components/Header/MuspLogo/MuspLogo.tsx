import React from 'react';
import { Image } from '@mantine/core';


export function MuspLogo() {
  return (
    <Image
      src="/MuspIcon/MuspIcon-2.webp" // 適宜ご自身の画像パスに変更
      alt="My circular image"
      width={40}
      height={40}
      fit="cover"
      radius="50%" // ここで丸くする
    />
  );
}
