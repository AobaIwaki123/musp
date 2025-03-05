import { z } from "zod";

// バイト単位のサイズをメガバイト単位に変換する
const sizeInMB = (sizeInBytes: number, decimalsNum = 2) => {
	const result = sizeInBytes / (1024 * 1024);
	return +result.toFixed(decimalsNum);
};

const IMAGE_TYPES = ["image/jpeg", "image/png"];
const MAX_IMAGE_SIZE = 5; // 5MB

// unionを使ってnullも許容した上で、後で必須チェックを行う
const fileSchema = z
	.union([
		z.undefined(),
		z.null(),
		z.preprocess(
			(val) => {
				if (val instanceof FileList && val.length > 0) {
					return val[0];
				}
				return val;
			},
			z.instanceof(File).refine((file) => IMAGE_TYPES.includes(file.type), {
				message: ".jpgもしくは.pngのみ可能です",
			}),
		),
	])
	.refine((file) => file !== undefined && file !== null, {
		message: "必須です",
	});

export const postSchema = z.object({
	user_id: z.number(),
	store_name: z.string(),
	ramen_name: z.string(),
	file: z.union([z.null(), fileSchema]),
	deliciousness_id: z.preprocess(
		(val) => (typeof val === "string" ? Number.parseInt(val, 10) : val),
		z.number(),
	),
	portion_id: z.preprocess(
		(val) => (typeof val === "string" ? Number.parseInt(val, 10) : val),
		z.number(),
	),
	thick_id: z.preprocess(
		(val) => (typeof val === "string" ? Number.parseInt(val, 10) : val),
		z.number(),
	),
	texture_id: z.preprocess(
		(val) => (typeof val === "string" ? Number.parseInt(val, 10) : val),
		z.number(),
	),
	soup_id: z.preprocess(
		(val) => (typeof val === "string" ? Number.parseInt(val, 10) : val),
		z.number(),
	),
});

export type Post = z.infer<typeof postSchema>;
