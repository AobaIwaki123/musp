import { createApiClient } from '@/client/client';

const apiURL = process.env.NEXT_PUBLIC_API_URL;
// 
if (!apiURL) {
  throw new Error('NEXT_PUBLIC_API_URL is required');
}

export const api = createApiClient(apiURL);

// const apiKey = process.env.NEXT_PUBLIC_API_KEY;
// 
// if (!apiKey) {
//   throw new Error('NEXT_PUBLIC_API_KEY is required');
// }

// TODO: リクエストヘッダーに自動的にAPIキーを付与する
