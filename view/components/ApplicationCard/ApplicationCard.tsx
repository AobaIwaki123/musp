'use client';

import { useEffect, useState } from 'react';
import { AspectRatio, Card, Center, Image, Loader } from '@mantine/core';
import { PlayButton } from '../PlayButton/PlayButton';
import classes from './ApplicationCard.module.css';


export function ApplicationCard() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoaded(true);
    }, 1000);
    return () => clearTimeout(timer);
    // setLoaded(true);
  }, []);

  return (
    <Card key="article.title" p="0" radius="md" component="a" className={classes.card}>
      <AspectRatio ratio={1920 / 1080}>
        <Image src="https://img.youtube.com/vi/E-uF9qrcyzI/hqdefault.jpg" />
        {!loaded ? (
          <Center
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              opacity: 0.8,
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
      </AspectRatio>
    </Card>
  );
}
