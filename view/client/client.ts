import { makeApi, Zodios, type ZodiosOptions } from "@zodios/core";
import { z } from "zod";

export const PostVideoRequest = z.object({
  user_id: z.string(),
  youtube_url: z
    .string()
    .regex(
      /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?.*v=|embed\/|v\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
    ),
});
export type PostVideoRequestType = z.infer<typeof PostVideoRequest>;

export const PostVideoResponse = z.object({
  status_code: z.number().int(),
  youtube_id: z.string().regex(/^[a-zA-Z0-9_-]{11}$/),
});
export type PostVideoResponseType = z.infer<typeof PostVideoResponse>;

export const ErrorResponse400 = z.object({ error: z.string() });
export type ErrorResponse400Type = z.infer<typeof ErrorResponse400>;

export const VideoIDAndWavURL = z.object({
  youtube_id: z.string().regex(/^[a-zA-Z0-9_-]{11}$/),
  wav_url: z.string().url().optional(),
});
export type VideoIDAndWavURLType = z.infer<typeof VideoIDAndWavURL>;

export const GetVideoIDAndWavURLResponse = z.object({
  status_code: z.number().int(),
  data: z.array(VideoIDAndWavURL),
});
export type GetVideoIDAndWavURLResponseType = z.infer<
  typeof GetVideoIDAndWavURLResponse
>;

export const PostUserRequest = z.object({ google_id: z.string() });
export type PostUserRequestType = z.infer<typeof PostUserRequest>;

export const PostUserResponse = z.object({
  status_code: z.number().int(),
  user_id: z.string(),
});
export type PostUserResponseType = z.infer<typeof PostUserResponse>;

export const schemas = {
  PostVideoRequest,
  PostVideoResponse,
  ErrorResponse400,
  VideoIDAndWavURL,
  GetVideoIDAndWavURLResponse,
  PostUserRequest,
  PostUserResponse,
};

export const endpoints = makeApi([
  {
    method: "get",
    path: "/:user_id",
    alias: "getUser_id",
    description: `ユーザーが作成したYouTubeIDとWavURLの一覧を取得します。`,
    requestFormat: "json",
    parameters: [
      {
        name: "user_id",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: GetVideoIDAndWavURLResponse,
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
        schema: z.object({ google_id: z.string() }),
      },
    ],
    response: PostUserResponse,
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
    path: "/video",
    alias: "postVideo",
    description: `YouTubeリンクを元に音源のダウンロードと音源/ボーカル分離のジョブを作成します。`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: PostVideoRequest,
      },
    ],
    response: PostVideoResponse,
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
