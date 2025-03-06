"use client";

import { RamenModal } from "@/components/RamenModal";
import type { RamenGallery } from "@/types/RamenGallery";
import { useEffect, useState } from "react";

type RamenGallerysProps = {
	imageInfo: RamenGallery;
};

export const Ramen = ({ imageInfo }: RamenGallerysProps) => {
	const [isOpenModal, setIsOpenModal] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

	const handleOpenModal = () => setIsOpenModal(true);

  useEffect(() => {
    if (audioUrl) return; // すでに URL がある場合は WebSocket を開かない

		console.log("imageInfo.job_id", imageInfo.job_id);
		// const url = `ws://localhost:8000/api/v1/ws/jobs/a8622591-6bfd-4233-b4ea-ce5bf0e30348`;
		const url = `ws://localhost:8000/api/v1/ws/jobs/${imageInfo.job_id}`;
    const socket = new WebSocket(url);

    socket.onopen = () => {
      console.log("WebSocket connected");
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.status) {
				const status = data.status;
				console.log("WebSocket message:", status);
				if (status === "SUCCESS") {
					socket.close(); // URL を取得したら WebSocket を閉じる
					console.log("WebSocket closed");
					const url = `http://localhost:8000/api/v1/url/${imageInfo.job_id}`;
					const res = fetch(url)
						.then((res) => res.json())
						.then((json) => {
							console.log("json", json);
							setAudioUrl(json.url);
						}
					);
				}
      }
    };

    socket.onerror = (error) => {
      console.error("WebSocket Error:", error);
    };

    socket.onclose = () => {
      console.log("WebSocket closed");
    };

    return () => {
      socket.close();
    };
  }, [audioUrl]);

	return (
		<>
			<div>
				<button
					type="button"
					onClick={handleOpenModal}
					className="relative w-full pb-[100%] overflow-hidden cursor-pointer border-0 p-0 group"
				>
					<img
						src={imageInfo.thumbnail}
						alt={"imageInfo.name"}
						className="absolute inset-0 w-full h-full object-cover"
					/>
					<div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-30 transition duration-300" />
				</button>
				{audioUrl ? (
					<audio controls>
						<source src={audioUrl} type="audio/wav" />
						Your browser does not support the audio element.
					</audio>
				) : (
					<p className="text-black">音声データを待機中...</p>
				)}
			</div>
		</>
	);
};
