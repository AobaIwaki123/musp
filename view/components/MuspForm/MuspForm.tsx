'use client';

import React, { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { IconX } from '@tabler/icons-react'; // ★ 追加: TablerのXアイコン
import { useForm } from 'react-hook-form';
import { Button, Group, Progress, rgba, TextInput, useMantineTheme } from '@mantine/core';
import { useInterval } from '@mantine/hooks';
import { PostJobsRequest } from '../../client/client';
import type { PostJobsRequestType } from '../../client/client';
import classes from './MuspForm.module.css';

export function MuspForm() {
  const theme = useMantineTheme();
  const [progress, setProgress] = useState(0);
  const [loaded, setLoaded] = useState(false);

  // Inputがフォーカス中かどうかを管理
  const [isFocused, setIsFocused] = useState(false);

  // React Hook Form
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<PostJobsRequestType>({
    resolver: zodResolver(PostJobsRequest),
    defaultValues: {
      user_id: '',
      youtube_url: '',
    },
  });

  // フォームの入力値を監視し、入力が存在しているかどうかを判定する
  // → watch('youtube_url') が空でないときのみクリアアイコンを表示
  const watchYoutubeUrl = watch('youtube_url');

  // マウント時に localStorage から user_id をセット
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUserId = localStorage.getItem('userID');
      if (storedUserId) {
        setValue('user_id', storedUserId);
        console.log('Stored user_id:', storedUserId);
      }
    }
  }, [setValue]);

  // プログレスが 100% に到達したらリロード（サンプル実装）
  useEffect(() => {
    if (loaded) {
      console.log('Process finished!');
      window.location.reload();
    }
  }, [loaded]);

  // useInterval でプログレスを管理
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

  // フォーム送信時のハンドラ
  const onSubmit = async (data: PostJobsRequestType) => {
    console.log('送信データ:', data);

    // バリデーションを通過したらプログレスを開始
    if (!interval.active) {
      interval.start();
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* user_id は非表示のため hidden input */}
      <input type="hidden" {...register('user_id')} />

      <TextInput
        placeholder="https://www.youtube.com"
        radius="xl"
        // React Hook Form のエラー表示
        error={errors.youtube_url?.message}
        {...register('youtube_url')}
        // フォーカス状態の切り替え
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        // 入力があれば右側にクリアアイコンを表示
        rightSection={
          watchYoutubeUrl?.length > 0 && (
            <IconX
              style={{ cursor: 'pointer' }}
              onClick={() => {
                // 値をクリア
                setValue('youtube_url', '');
              }}
            />
          )
        }
        styles={{
          input: {
            // エラーがある & フォーカスしていない場合だけ赤枠
            borderColor: errors.youtube_url && !isFocused ? 'red' : '#ccc',
          },
          label: {
            fontWeight: 500,
            marginBottom: '0.5rem',
          },
        }}
        className={classes.input}
      />

      <Group justify="center" mt="xl" mb={50}>
        <Button
          className={classes.button}
          type="submit"
          variant="gradient"
          gradient={{ from: 'pink', to: 'violet', deg: 90 }}
          // 処理中はボタンを押せないようにする
          disabled={progress > 0 && !loaded}
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
    </form>
  );
}
