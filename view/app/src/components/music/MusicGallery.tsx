import { Container, Grid, Skeleton } from '@mantine/core';
import type { GetInfoListResponseType } from "@/client/client";
import { MusicCard } from '@/components/music/MusicCard';

const child = <Skeleton height={140} radius="md" animate={false} />;

export const MusicGallery = ({ items }: GetInfoListResponseType) => {
	if (items.length === 0) {
		return <p>まだ投稿がありません</p>;
	}

  return (
    <Container my="md">
      <Grid>
        {items.map((item) => (
          <MusicCard title={item.title} thumbnail_url={item.thumbnail_url} wav_url={item.wav_url} key={item.title} />
        ))
        }
      </Grid>
    </Container>
  );
}
