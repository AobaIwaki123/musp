import { createApiClient } from "@/client/client";

const publicApiUrl = process.env.NEXT_PUBLIC_API_URL;

if (!publicApiUrl) {
  throw new Error("NEXT_PUBLIC_API_URL is required");
}

export const api = createApiClient("https://musp-api.shaoba.tech");
