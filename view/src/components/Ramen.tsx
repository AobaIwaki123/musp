"use client";

import { RamenModal } from "@/components/RamenModal";
import type { RamenGallery } from "@/types/RamenGallery";
import { useState } from "react";

type RamenGallerysProps = {
	imageInfo: RamenGallery;
};

export const Ramen = ({ imageInfo }: RamenGallerysProps) => {
	const [isOpenModal, setIsOpenModal] = useState(false);

	const handleOpenModal = () => setIsOpenModal(true);

	return (
		<>
			<div>
				<button
					type="button"
					onClick={handleOpenModal}
					className="relative w-full pb-[100%] overflow-hidden cursor-pointer border-0 p-0 group"
				>
					<img
						src={imageInfo.url}
						alt={"imageInfo.name"}
						className="absolute inset-0 w-full h-full object-cover"
					/>
					<div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-30 transition duration-300" />
				</button>
				<div>
					<audio controls>
						<source src={imageInfo.thumbnail} type="audio/wav" />
						Your browser does not support the audio element.
					</audio>
				</div>
			</div>
		</>
	);
};
