"use client";

import { useEffect, useState } from "react";
import { GridAsymmetrical } from "../GridAsymmetrical/GridAsymmetrical";
import type { Video } from "../GridAsymmetrical/GridAsymmetrical";
import { MuspForm } from "../MuspForm/MuspForm";
export function MuspHome() {
	const [videoIDList, setVideoIDList] = useState<Video[]>([]);

	const mockData = [
		{ videoID: "hedyQY81WeY" },
		{ videoID: "JQowMIY2bOw" },
		{ videoID: "k7eGPMCy_ms" },
		{ videoID: "B2teLF9l4aI" },
		{ videoID: "ibI6-kvD1nc" },
		{ videoID: "qP52sh7PzYA" },
		{ videoID: "f8k8vDcCEfc" },
		{ videoID: "vcp7XKBylkM" },
	];

	useEffect(() => {
		setVideoIDList(mockData);
	}, []);

	return (
		<>
			<MuspForm />
			<GridAsymmetrical videos={videoIDList} />
		</>
	);
}
