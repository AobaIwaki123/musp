import type { GetInfoResponseType } from "@/client/client";
import { Grid } from '@mantine/core';

export const MusicCard = ({ title, thumbnail_url, wav_url}: GetInfoResponseType) => {
  return(
    <Grid.Col span={{ base: 12, xs: 3 }}>
      <div>
        <img
          src={thumbnail_url}
          alt={title}
          className=""
        />
      </div>
    </Grid.Col>
  )
};
