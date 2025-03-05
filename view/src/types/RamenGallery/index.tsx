import { z } from "zod";

export const ramenGallerySchema = z.object({
	id: z.number(),
	name: z.string(),
	description: z.string(),
	image_url: z.string(),
	parameters: z.object({
		味: z.number(),
		こってり: z.number(),
		麺の硬さ: z.number(),
		具材: z.number(),
		スープの深み: z.number(),
	}),
});

export const ramenGalleryListSchema = z.array(ramenGallerySchema);

export type RamenGallery = z.infer<typeof ramenGallerySchema>;
export type RamenGalleryList = z.infer<typeof ramenGalleryListSchema>;
