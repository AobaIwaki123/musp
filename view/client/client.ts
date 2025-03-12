import { makeApi, Zodios, type ZodiosOptions } from '@zodios/core';
import { z } from 'zod';

export const PostJobsRequest = z.object({
  user_id: z.string(),
  youtube_url: z
    .string()
    .regex(
      /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?.*v=|embed\/|v\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
    )
    .url(),
});
export type PostJobsRequestType = z.infer<typeof PostJobsRequest>;

export const PostJobsResponse = z.object({
  job_id: z
    .string()
    .regex(/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/),
  message: z.string(),
});
export type PostJobsResponseType = z.infer<typeof PostJobsResponse>;

export const ErrorResponse = z.object({ error: z.string() });
export type ErrorResponseType = z.infer<typeof ErrorResponse>;

export const GetJobsResponse = z.object({
  status: z.enum(['PENDING', 'STARTED', 'SUCCESS', 'FAILURE']),
});
export type GetJobsResponseType = z.infer<typeof GetJobsResponse>;

export const GetURLResponse = z.object({
  job_id: z
    .string()
    .regex(/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/),
  url: z.string().url(),
});
export type GetURLResponseType = z.infer<typeof GetURLResponse>;

export const GetInfoResponse = z.object({
  title: z.string(),
  thumbnail_url: z
    .string()
    .regex(
      /^https?:\/\/i.ytimg.com\/vi\/([a-zA-Z0-9_-]{11})\/(hqdefault|default|mqdefault|sddefault|maxresdefault).jpg$/
    )
    .url(),
  wav_url: z.union([z.string(), z.null()]).optional(),
});
export type GetInfoResponseType = z.infer<typeof GetInfoResponse>;

export const GetInfoListResponse = z.object({ items: z.array(GetInfoResponse) }).partial();
export type GetInfoListResponseType = z.infer<typeof GetInfoListResponse>;

export const PostUserRequest = z.object({
  google_id: z.string(),
  nickname: z.string(),
  icon_url: z.string().url(),
});
export type PostUserRequestType = z.infer<typeof PostUserRequest>;

export const PostUserResponse = z.object({ user_id: z.string() });
export type PostUserResponseType = z.infer<typeof PostUserResponse>;

export const schemas = {
  PostJobsRequest,
  PostJobsResponse,
  ErrorResponse,
  GetJobsResponse,
  GetURLResponse,
  GetInfoResponse,
  GetInfoListResponse,
  PostUserRequest,
  PostUserResponse,
};

export const endpoints = makeApi([
  {
    method: 'get',
    path: '/info/:user_id',
    alias: 'getInfoUser_id',
    description: `ギャラリー表示のための情報を取得します。`,
    requestFormat: 'json',
    parameters: [
      {
        name: 'user_id',
        type: 'Path',
        schema: z.string(),
      },
    ],
    response: GetInfoListResponse,
    errors: [
      {
        status: 404,
        description: `ジョブが見つかりませんでした`,
        schema: z.object({ error: z.string() }),
      },
    ],
  },
  {
    method: 'post',
    path: '/jobs',
    alias: 'postJobs',
    description: `YouTubeリンクを元に音源のダウンロードと音源/ボーカル分離のジョブを作成します。`,
    requestFormat: 'json',
    parameters: [
      {
        name: 'body',
        type: 'Body',
        schema: PostJobsRequest,
      },
    ],
    response: PostJobsResponse,
    errors: [
      {
        status: 400,
        description: `不正なリクエスト`,
        schema: z.object({ error: z.string() }),
      },
    ],
  },
  {
    method: 'get',
    path: '/jobs/:job_id',
    alias: 'getJobsJob_id',
    description: `指定されたジョブIDの状態を取得します。`,
    requestFormat: 'json',
    parameters: [
      {
        name: 'job_id',
        type: 'Path',
        schema: z
          .string()
          .regex(/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/),
      },
    ],
    response: GetJobsResponse,
    errors: [
      {
        status: 404,
        description: `ジョブが見つかりませんでした`,
        schema: z.object({ error: z.string() }),
      },
    ],
  },
  {
    method: 'get',
    path: '/thumbnail/:job_id',
    alias: 'getThumbnailJob_id',
    description: `分離された音源のサムネイル画像のS3 URLを取得します。`,
    requestFormat: 'json',
    parameters: [
      {
        name: 'job_id',
        type: 'Path',
        schema: z
          .string()
          .regex(/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/),
      },
    ],
    response: GetURLResponse,
    errors: [
      {
        status: 404,
        description: `サムネイル画像が見つかりませんでした`,
        schema: z.object({ error: z.string() }),
      },
    ],
  },
  {
    method: 'get',
    path: '/url/:job_id',
    alias: 'getUrlJob_id',
    description: `分離された音源のS3 URLを取得します。`,
    requestFormat: 'json',
    parameters: [
      {
        name: 'job_id',
        type: 'Path',
        schema: z
          .string()
          .regex(/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/),
      },
    ],
    response: GetURLResponse,
    errors: [
      {
        status: 404,
        description: `音源が見つかりませんでした`,
        schema: z.object({ error: z.string() }),
      },
    ],
  },
  {
    method: 'post',
    path: '/users',
    alias: 'postUsers',
    description: `ユーザー情報を登録します。`,
    requestFormat: 'json',
    parameters: [
      {
        name: 'body',
        type: 'Body',
        schema: PostUserRequest,
      },
    ],
    response: z.object({ user_id: z.string() }),
    errors: [
      {
        status: 400,
        description: `不正なリクエスト`,
        schema: z.object({ error: z.string() }),
      },
    ],
  },
  {
    method: 'get',
    path: '/ws/jobs/:job_id',
    alias: 'getWsjobsJob_id',
    description: `WebSocketを使用して、ジョブの進捗状況をリアルタイムで取得します。`,
    requestFormat: 'json',
    parameters: [
      {
        name: 'job_id',
        type: 'Path',
        schema: z
          .string()
          .regex(/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/),
      },
    ],
    response: z.void(),
    errors: [
      {
        status: 101,
        description: `WebSocket接続成功`,
        schema: z.void(),
      },
      {
        status: 404,
        description: `ジョブが見つかりませんでした`,
        schema: z.void(),
      },
    ],
  },
]);

export const api = new Zodios(endpoints);

export function createApiClient(baseUrl: string, options?: ZodiosOptions) {
  return new Zodios(baseUrl, endpoints, options);
}
