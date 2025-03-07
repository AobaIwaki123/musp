import { makeApi, Zodios, type ZodiosOptions } from "@zodios/core";
import { z } from "zod";

const ErrorResponse = z.object({ error: z.string() }).partial().passthrough();

export const schemas = {
  ErrorResponse,
};

const endpoints = makeApi([
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
        schema: z.object({ youtube_url: z.string().url() }).passthrough(),
      },
    ],
    response: z
      .object({ job_id: z.string(), message: z.string() })
      .partial()
      .passthrough(),
    errors: [
      {
        status: 400,
        description: `不正なリクエスト`,
        schema: z.object({ error: z.string() }).partial().passthrough(),
      },
    ],
  },
  {
    method: "get",
    path: "/jobs/:job_id",
    alias: "getJobsJob_id",
    description: `指定されたジョブIDの状態を取得します。`,
    requestFormat: "json",
    parameters: [
      {
        name: "job_id",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: z.object({ status: z.string() }).partial().passthrough(),
    errors: [
      {
        status: 404,
        description: `ジョブが見つかりませんでした`,
        schema: z.object({ error: z.string() }).partial().passthrough(),
      },
    ],
  },
  {
    method: "get",
    path: "/thumbnail/:job_id",
    alias: "getThumbnailJob_id",
    description: `分離された音源のサムネイル画像のS3 URLを取得します。`,
    requestFormat: "json",
    parameters: [
      {
        name: "job_id",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: z
      .object({ job_id: z.string(), thumbnail: z.string().url() })
      .partial()
      .passthrough(),
    errors: [
      {
        status: 404,
        description: `サムネイル画像が見つかりませんでした`,
        schema: z.object({ error: z.string() }).partial().passthrough(),
      },
    ],
  },
  {
    method: "get",
    path: "/url/:job_id",
    alias: "getUrlJob_id",
    description: `分離された音源のS3 URLを取得します。`,
    requestFormat: "json",
    parameters: [
      {
        name: "job_id",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: z
      .object({
        job_id: z.string(),
        url: z.string().url(),
        thumbnail: z.string().url(),
      })
      .partial()
      .passthrough(),
    errors: [
      {
        status: 404,
        description: `音源が見つかりませんでした`,
        schema: z.object({ error: z.string() }).partial().passthrough(),
      },
    ],
  },
  {
    method: "get",
    path: "/ws/jobs/:job_id",
    alias: "getWsjobsJob_id",
    description: `WebSocketを使用して、ジョブの進捗状況をリアルタイムで取得します。`,
    requestFormat: "json",
    parameters: [
      {
        name: "job_id",
        type: "Path",
        schema: z.string(),
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
