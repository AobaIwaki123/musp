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
  status_message: z.string(),
  youtube_id: z.string().regex(/^[a-zA-Z0-9_-]{11}$/),
});
export type PostVideoResponseType = z.infer<typeof PostVideoResponse>;

export const ErrorResponse400 = z.object({ error: z.string() });
export type ErrorResponse400Type = z.infer<typeof ErrorResponse400>;

export const VideoIDAndWavURL = z.object({
  youtube_id: z.string().regex(/^[a-zA-Z0-9_-]{11}$/),
  vocal_wav_url: z.string().url().optional(),
  inst_wav_url: z.string().url().optional(),
});
export type VideoIDAndWavURLType = z.infer<typeof VideoIDAndWavURL>;

export const GetVideoIDAndWavURLResponse = z.object({
  status_code: z.number().int(),
  status_message: z.string(),
  data: z.array(VideoIDAndWavURL),
});
export type GetVideoIDAndWavURLResponseType = z.infer<
  typeof GetVideoIDAndWavURLResponse
>;

export const PostUserRequest = z.object({ google_id: z.string() });
export type PostUserRequestType = z.infer<typeof PostUserRequest>;

export const PostUserResponse = z.object({
  status_code: z.number().int(),
  status_message: z.string(),
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
    description:
      "Retrieves a list of YouTube IDs and Wav URLs created by a user.",
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
        description: "Invalid request",
        schema: z.object({ error: z.string() }),
      },
    ],
  },
  {
    method: "post",
    path: "/users",
    alias: "postUsers",
    description: "Registers user information.",
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
        description: "Invalid request",
        schema: z.object({ error: z.string() }),
      },
    ],
  },
  {
    method: "post",
    path: "/video",
    alias: "postVideo",
    description:
      "Creates a job to download audio from a YouTube link and separate the audio and vocals.",
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
        description: "Invalid request",
        schema: z.object({ error: z.string() }),
      },
    ],
  },
]);

export const api = new Zodios(endpoints);

export function createApiClient(baseUrl: string, options?: ZodiosOptions) {
  return new Zodios(baseUrl, endpoints, options);
}
