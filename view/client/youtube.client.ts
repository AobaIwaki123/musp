import { makeApi, Zodios, type ZodiosOptions } from "@zodios/core";
import { z } from "zod";

export const VideoDetailsResponse = z
  .object({
    kind: z.string(),
    items: z.array(
      z
        .object({
          id: z.string(),
          snippet: z
            .object({ title: z.string(), description: z.string() })
            .partial()
            .passthrough(),
        })
        .partial()
        .passthrough()
    ),
  })
  .partial()
  .passthrough();
export type VideoDetailsResponseType = z.infer<typeof VideoDetailsResponse>;

export const ErrorResponse = z
  .object({ error: z.string() })
  .partial()
  .passthrough();
export type ErrorResponseType = z.infer<typeof ErrorResponse>;

export const schemas = {
  VideoDetailsResponse,
  ErrorResponse,
};

export const endpoints = makeApi([
  {
    method: "get",
    path: "/videos",
    alias: "getVideos",
    description:
      "Retrieve video details such as title and description using a video ID.",
    requestFormat: "json",
    parameters: [
      {
        name: "key",
        type: "Query",
        schema: z.string(),
      },
      {
        name: "part",
        type: "Query",
        schema: z.literal("snippet"),
      },
      {
        name: "id",
        type: "Query",
        schema: z.string(),
      },
    ],
    response: VideoDetailsResponse,
    errors: [
      {
        status: 400,
        description: "Bad request. Invalid or missing parameters.",
        schema: z.object({ error: z.string() }).partial().passthrough(),
      },
      {
        status: 403,
        description: "Forbidden. API key is invalid or quota exceeded.",
        schema: z.object({ error: z.string() }).partial().passthrough(),
      },
      {
        status: 404,
        description: "Not found. The video does not exist.",
        schema: z.object({ error: z.string() }).partial().passthrough(),
      },
    ],
  },
]);

export const Api = new Zodios(endpoints);

export function createApiClient(baseUrl: string, options?: ZodiosOptions) {
  return new Zodios(baseUrl, endpoints, options);
}
