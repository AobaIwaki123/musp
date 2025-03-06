import { z } from "zod";

export const ramenGallerySchema = z.object({
	job_id: z.string(),
	url: z
	.string()
	.nullable()
	, 
	thumbnail: z.string(),
});

export const ramenGalleryListSchema = z.array(ramenGallerySchema);

export type RamenGallery = z.infer<typeof ramenGallerySchema>;
export type RamenGalleryList = z.infer<typeof ramenGalleryListSchema>;
