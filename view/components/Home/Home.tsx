"use client";

import { useEffect, useState } from "react";
import { ApplicationGrid } from "./ApplicationGrid/ApplicationGrid";
import type { Video } from "./ApplicationGrid/ApplicationGrid";
import { MuspForm } from "./MuspForm/MuspForm";

export function Home() {
	const [videoIDList, setVideoIDList] = useState<Video[]>([]);

	const mockData: Video[] = [
		{ videoID: "hedyQY81WeY", wav_url: null },
		{ videoID: "JQowMIY2bOw", wav_url: null },
		{ videoID: "k7eGPMCy_ms", wav_url: null },
		{ videoID: "B2teLF9l4aI", wav_url: null },
		{ videoID: "ibI6-kvD1nc", wav_url: null },
		{ videoID: "qP52sh7PzYA", wav_url: null },
		{ videoID: "f8k8vDcCEfc", wav_url: null },
		{ videoID: "vcp7XKBylkM", wav_url: null },
	];

	useEffect(() => {
		setVideoIDList(mockData);
	}, []);

	const handleAddVideo = (url: string) => {
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

		// TODO: API のレスポンスで VideoID と status code (200, 201) が返却される
		// 200: すでに存在 -> 何もしない
		// 201: 新規追加 -> 追加
		// その他: エラー -> エラーメッセージを表示
		// const videoID = api.postVideoID(url);

		setVideoIDList((prevList) => [...prevList, { videoID, wav_url: null }]);
	};

	return (
		<>
			<MuspForm onSubmit={handleAddVideo} />
			<ApplicationGrid videos={videoIDList} />
		</>
	);
}
