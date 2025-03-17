import { pluginToken } from '@zodios/plugins';
import { createApiClient } from '@/client/client';


// const apiURL = process.env.NEXT_PUBLIC_API_URL;
// 
// if (!publicApiUrl) {
//   throw new Error('NEXT_PUBLIC_API_URL is required');
// }

export const api = createApiClient('http://100.92.146.108:8000');

const apiKey = process.env.NEXT_PUBLIC_API_KEY;

// if (!apiKey) {
//   throw new Error('NEXT_PUBLIC_API_KEY is required');
// }

// TODO: リクエストヘッダーに自動的にAPIキーを付与する
