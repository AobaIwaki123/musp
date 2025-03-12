'use client';

import { Container, Grid, Skeleton } from '@mantine/core';
import { ApplicationCard } from '../ApplicationCard/ApplicationCard';


const child = <Skeleton height={140} radius="md" animate={false} />;

export function GridAsymmetrical() {
  return (
    <Container my="md">
      <Grid>
        <Grid.Col span={{ base: 6, xs: 4 }}>
          <ApplicationCard />
        </Grid.Col>
        <Grid.Col span={{ base: 6, xs: 4 }}>
          <ApplicationCard />
        </Grid.Col>
        <Grid.Col span={{ base: 6, xs: 4 }}>
          <ApplicationCard />
        </Grid.Col>
        <Grid.Col span={{ base: 6, xs: 4 }}>
          <ApplicationCard />
        </Grid.Col>
        <Grid.Col span={{ base: 6, xs: 4 }}>
          <ApplicationCard />
        </Grid.Col>
        <Grid.Col span={{ base: 6, xs: 4 }}>
          <ApplicationCard />
        </Grid.Col>
        <Grid.Col span={{ base: 6, xs: 4 }}>
          <ApplicationCard />
        </Grid.Col>
        <Grid.Col span={{ base: 6, xs: 4 }}>
          <ApplicationCard />
        </Grid.Col>
      </Grid>
    </Container>
  );
}
