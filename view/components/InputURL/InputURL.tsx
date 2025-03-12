'use client';

import React, { useState } from 'react';
import { TextInput } from '@mantine/core';
import classes from './InputURL.module.css';

export function InputURL() {
  const [url, setUrl] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  return (
    <TextInput
      placeholder="https://www.youtube.com"
      value={url}
      radius="xl"
      // m={20}
      onChange={(e) => {
        setUrl(e.currentTarget.value);
        setErrorMessage('');
      }}
      error={errorMessage}
      // required
      styles={{
        input: {
          // 好みのスタイルをここに
          borderColor: errorMessage ? 'red' : '#ccc',
        },
        label: {
          // フォントや色など
          fontWeight: 500,
          marginBottom: '0.5rem',
        },
      }}
      className={classes.input}
    />
  );
}
