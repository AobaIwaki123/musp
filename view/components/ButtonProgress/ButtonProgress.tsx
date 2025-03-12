'use client';

import { useEffect, useState } from 'react';
import { Button, Group, Progress, rgba, useMantineTheme } from '@mantine/core';
import { useInterval } from '@mantine/hooks';
import classes from './ButtonProgress.module.css';


export function ButtonProgress() {
  const theme = useMantineTheme();
  const [progress, setProgress] = useState(0);
  const [loaded, setLoaded] = useState(false);

  const interval = useInterval(
    () =>
      setProgress((current) => {
        if (current < 100) {
          return current + 1;
        }

        interval.stop();
        setLoaded(true);
        return 0;
      }),
    20
  );

  useEffect(() => {
    if (loaded) {
      console.log('Process finished!');
      window.location.reload();
    }
  }, [loaded]);

  return (
    <Group justify="center" mt="xl" mb={50}>
      <Button
        className={classes.button}
        onClick={() => (loaded ? setLoaded(false) : !interval.active && interval.start())}
        variant="gradient"
        gradient={{ from: 'pink', to: 'violet', deg: 90 }}
      >
        <div className={classes.label}>
          {progress !== 0 ? 'Processing...' : loaded ? 'Process Finished!' : 'Add Music!'}
        </div>
        {progress !== 0 && (
          <Progress
            value={progress}
            className={classes.progress}
            color={rgba(theme.colors.blue[2], 0.35)}
            radius="sm"
          />
        )}
      </Button>
    </Group>
  );
}
