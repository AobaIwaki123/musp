import { useState } from 'react';
import { IconPlayerPlay } from '@tabler/icons-react';
import { Button } from '@mantine/core';
import classes from './PlayButton.module.css';

export function PlayButton() {
  const [isPressed, setIsPressed] = useState(false);

  return (
    <Button
      variant="subtle"
      color="white"
      radius="50%"
      size="lg"
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: `translate(-50%, -50%) ${isPressed ? 'translateY(3px)' : ''}`,
        transition: 'transform 0.1s ease-in-out',
        zIndex: 2,
        width: 50,
        height: 50,
        minWidth: 0,
        padding: 0,
      }}
      className={classes.button}
    >
      <IconPlayerPlay size={24} />
    </Button>
  );
}
