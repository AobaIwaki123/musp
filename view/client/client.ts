import { makeApi, Zodios, type ZodiosOptions } from "@zodios/core";
import { z } from "zod";

export const PostJobsRequest = z.object({
  user_id: z.string(),
  youtube_url: z
    .string()
    .regex(
      /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?.*v=|embed\/|v\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
    ),
});
export type PostJobsRequestType = z.infer<typeof PostJobsRequest>;

export const PostJobsResponse = z.object({
  youtube_id: z.string().regex(/^[a-zA-Z0-9_-]{11}$/),
});
export type PostJobsResponseType = z.infer<typeof PostJobsResponse>;

export const ErrorResponse = z.object({ error: z.string() });
export type ErrorResponseType = z.infer<typeof ErrorResponse>;

export const GetVideoIDResponse = z
  .object({ youtube_ids: z.array(z.string().regex(/^[a-zA-Z0-9_-]{11}$/)) })
  .partial();
export type GetVideoIDResponseType = z.infer<typeof GetVideoIDResponse>;

export const GetWavResponse = z.object({ wav_url: z.string().url() });
export type GetWavResponseType = z.infer<typeof GetWavResponse>;

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
  GetVideoIDResponse,
  GetWavResponse,
  PostUserRequest,
  PostUserResponse,
};

export const endpoints = makeApi([
  {
    method: "post",
    path: "/jobs",
    alias: "postJobs",
    description: `YouTubeリンクを元に音源のダウンロードと音源/ボーカル分離のジョブを作成します。`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: PostJobsRequest,
      },
    ],
    response: z.object({ youtube_id: z.string().regex(/^[a-zA-Z0-9_-]{11}$/) }),
    errors: [
      {
        status: 400,
        description: `不正なリクエスト`,
        schema: z.object({ error: z.string() }),
      },
    ],
  },
  {
    method: "post",
    path: "/users",
    alias: "postUsers",
    description: `ユーザー情報を登録します。`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
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
    method: "get",
    path: "/video_id/:user_id",
    alias: "getVideo_idUser_id",
    description: `ユーザーが作成したYouTubeIDの一覧を取得します。`,
    requestFormat: "json",
    parameters: [
      {
        name: "user_id",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: GetVideoIDResponse,
    errors: [
      {
        status: 400,
        description: `不正なリクエスト`,
        schema: z.object({ error: z.string() }),
      },
    ],
  },
  {
    method: "get",
    path: "/wav/:video_id",
    alias: "getWavVideo_id",
    description: `分離済み音源のダウンロードリンクを取得します。`,
    requestFormat: "json",
    parameters: [
      {
        name: "video_id",
        type: "Path",
        schema: z.string().regex(/^[a-zA-Z0-9_-]{11}$/),
      },
    ],
    response: z.object({ wav_url: z.string().url() }),
    errors: [
      {
        status: 400,
        description: `不正なリクエスト`,
        schema: z.object({ error: z.string() }),
      },
    ],
  },
]);

export const api = new Zodios(endpoints);

export function createApiClient(baseUrl: string, options?: ZodiosOptions) {
  return new Zodios(baseUrl, endpoints, options);
}
