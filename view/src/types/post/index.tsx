import { z } from "zod";

export const postSchema = z.object({
	youtube_url: z
	.string({ required_error: "YouTube URLを入力してください" })
	.url({ message: "URLの形式が正しくありません" }),
});

export type Post = z.infer<typeof postSchema>;
