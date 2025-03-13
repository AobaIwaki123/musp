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

	const handleAddVideo = (url: string) => {
		// TODO: 本質的には不要なので削除する
		const extractVideoID = (url: string): string | null => {
			const regex =
				/(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/ ]{11})/;
			const match = url.match(regex);
			return match ? match[1] : null;
		};
		const videoID = extractVideoID(url);
		if (!videoID) {
			console.error("Invalid URL");
			return;
		}
		// TODO: APIのレスポンスでVideoIDとstatus code(200, 201)が返却される
		// 200: すでに存在 -> 何もしない
		// 201: 新規追加 -> 追加
		// その他: エラー -> エラーメッセージを表示
		// const videoID = api.postVideoID(url);

		setVideoIDList((prevList) => [...prevList, { videoID }]);
	};

	return (
		<>
			<MuspForm onSubmit={handleAddVideo} />
			<GridAsymmetrical videos={videoIDList} />
		</>
	);
}
