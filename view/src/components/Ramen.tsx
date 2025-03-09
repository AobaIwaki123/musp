"use client";

import { RamenModal } from "@/components/RamenModal";
import type { RamenGallery } from "@/types/RamenGallery";
import { use, useEffect, useState } from "react";
import type { GetInfoResponseType } from "@/client/client";

type RamenGallerysProps = {
	imageInfo: RamenGallery;
};

export const Ramen = ({ title, thumbnail_url, wav_url}: GetInfoResponseType) => {
	const [isOpenModal, setIsOpenModal] = useState(false);
  const [isExistWav, setIsExistWav] = useState<boolean>(false);

	const handleOpenModal = () => setIsOpenModal(true);

	useEffect(() => {
		if (wav_url) {
			setIsExistWav(true);
		} else {
			setIsExistWav(false);
		}
	}
	, []);

	return (
		<>
			<div>
				<button
					type="button"
					onClick={handleOpenModal}
					className="relative w-full pb-[100%] overflow-hidden cursor-pointer border-0 p-0 group"
				>
					<img
						src={thumbnail_url}
						alt={title}
						className="absolute inset-0 w-full h-full object-cover"
					/>
					<div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-30 transition duration-300" />
				</button>
				{isExistWav ? (
					<audio controls>
						<source src={wav_url} type="audio/wav" />
						Your browser does not support the audio element.
					</audio>
				) : (
					<p className="text-black">音声データを待機中...</p>
				)}
			</div>
		</>
	);
};
