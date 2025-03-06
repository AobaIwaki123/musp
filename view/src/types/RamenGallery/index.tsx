import { z } from "zod";

export const ramenGallerySchema = z.object({
	download_url: z.string(),
	image_url: z.string(),
});

export const ramenGalleryListSchema = z.array(ramenGallerySchema);

export type RamenGallery = z.infer<typeof ramenGallerySchema>;
export type RamenGalleryList = z.infer<typeof ramenGalleryListSchema>;
