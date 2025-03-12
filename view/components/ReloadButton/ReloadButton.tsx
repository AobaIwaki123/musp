"use client";

import React from 'react';
import { IconRefresh, IconReload } from '@tabler/icons-react';
import { Button } from '@mantine/core';
import classes from './ReloadButton.module.css';


export const ReloadButton = () => {
  const handleReload = () => {
    window.location.reload();
  };

  return (
    <Button
      variant="gradient"
      gradient={{ from: 'violet', to: 'cyan', deg: 90 }}
      p="xs"
      radius="xl"
      onClick={handleReload}
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: 1000, // 他の要素より前面に表示
      }}
      className={classes.button}
    >
      <IconRefresh size={24} stroke={1.5} />
    </Button>
  );
};
