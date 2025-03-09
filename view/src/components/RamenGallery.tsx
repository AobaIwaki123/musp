"use client";

import { Ramen } from "@/components/Ramen";
import type { RamenGalleryList } from "@/types/RamenGallery";
import type { GetInfoListResponseType } from "@/client/client";

type RamenGalleryProps = {
	gallery: RamenGalleryList;
};

export const RamenGallery = ({ items }: GetInfoListResponseType) => {
	if (items.length === 0) {
		return <p>まだ投稿がありません</p>;
	}
	return (
		<div className="grid grid-cols-3 gap-0.5">
			{items.map((item) => (
				<Ramen title={item.title} thumbnail_url={item.thumbnail_url} wav_url={item.wav_url} key={item.title}/>
			))}
		</div>
	);
};
