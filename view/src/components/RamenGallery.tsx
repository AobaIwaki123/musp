"use client";

import { Ramen } from "@/components/Ramen";
import type { RamenGalleryList } from "@/types/RamenGallery";

type RamenGallerysProps = {
	gallery: RamenGalleryList;
};

export const RamenGallery = ({ gallery }: RamenGallerysProps) => {
	if (gallery.length === 0) {
		return <p>まだ投稿がありません</p>;
	}
	return (
		<div className="grid grid-cols-3 gap-0.5">
			{gallery.map((ramen) => (
				<Ramen imageInfo={ramen} key={ramen.name} />
			))}
		</div>
	);
};
