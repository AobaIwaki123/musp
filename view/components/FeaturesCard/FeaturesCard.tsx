"use client";

import { useEffect, useState } from 'react';
import { Card, Center, Image, Loader, Overlay } from '@mantine/core';
import { PlayButton } from '../PlayButton/PlayButton';
import classes from './FeaturesCard.module.css';

export function FeaturesCard() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoaded(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder className={classes.card}>
      <Card.Section component="a" style={{ position: 'relative' }}>
        <Image src="https://img.youtube.com/vi/9_OEe_QXdbw/hqdefault.jpg" alt="Thumbnail" />
        {/* オーバーレイ */}
        <Overlay
          opacity={0.3}
          color="black"
          zIndex={1}
          style={{ position: 'absolute', inset: 0 }}
        />
        {!loaded ? (
          <Center
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 2,
              width: 50, // サイズ調整
              height: 50, // 幅と高さを同じにすることで円形になる
              minWidth: 0, // Mantine のデフォルトの最小幅を無効化
              padding: 0, // 余白を削減
            }}
          >
            <Loader color="#9ad7ff" />
          </Center>
        ) : (
          <PlayButton />
        )}
        {/* 円形の再生ボタン */}
      </Card.Section>
    </Card>
  );
}
