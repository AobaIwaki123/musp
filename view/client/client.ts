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

export const PostVideoResponse200 = z.object({
  youtube_id: z.string().regex(/^[a-zA-Z0-9_-]{11}$/),
});
export type PostVideoResponse200Type = z.infer<typeof PostVideoResponse200>;

export const PostVideoResponse202 = z.object({
  youtube_id: z.string().regex(/^[a-zA-Z0-9_-]{11}$/),
});
export type PostVideoResponse202Type = z.infer<typeof PostVideoResponse202>;

export const ErrorResponse400 = z.object({ error: z.string() });
export type ErrorResponse400Type = z.infer<typeof ErrorResponse400>;

export const VideoIDAndWavURL = z.object({
  youtube_id: z.string().regex(/^[a-zA-Z0-9_-]{11}$/),
  wav_url: z.string().url().optional(),
});
export type VideoIDAndWavURLType = z.infer<typeof VideoIDAndWavURL>;

export const GetVideoIDAndWavURLResponse200 = z.object({
  data: z.array(VideoIDAndWavURL),
});
export type GetVideoIDAndWavURLResponse200Type = z.infer<
  typeof GetVideoIDAndWavURLResponse200
>;

export const PostUserRequest = z.object({ google_id: z.string() });
export type PostUserRequestType = z.infer<typeof PostUserRequest>;

export const PostUserResponse200 = z.object({ user_id: z.string() });
export type PostUserResponse200Type = z.infer<typeof PostUserResponse200>;

export const PostUserResponse201 = z.object({ user_id: z.string() });
export type PostUserResponse201Type = z.infer<typeof PostUserResponse201>;

export const schemas = {
  PostVideoRequest,
  PostVideoResponse200,
  PostVideoResponse202,
  ErrorResponse400,
  VideoIDAndWavURL,
  GetVideoIDAndWavURLResponse200,
  PostUserRequest,
  PostUserResponse200,
  PostUserResponse201,
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
    response: GetVideoIDAndWavURLResponse200,
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
    response: z.object({ youtube_id: z.string().regex(/^[a-zA-Z0-9_-]{11}$/) }),
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
