"use client";

import { AspectRatio, Card, Image } from "@mantine/core";
import { useEffect, useState } from "react";

import { thumbnailAtom, wavFileAtom, titleAtom } from "@/jotai/atom";
import { useAtom } from "jotai";

import type { VideoIDAndWavURLType } from "@/client/client";
import { youtubeApi } from "@/client/youtube.api";
import { LoaderIcon } from "./LoaderIcon";
import { PlayButton } from "./PlayButton/PlayButton";
import type {
	VideoDetailsResponseType,
	ErrorResponseType,
} from "@/client/youtube.client";
import classes from "./ApplicationCard.module.css";

const YOUTUBE_API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;

export function ApplicationCard({ youtube_id, wav_url }: VideoIDAndWavURLType) {
	const [isPressed, setIsPressed] = useState(false);
	const [wavFile, setWavFile] = useAtom(wavFileAtom);
	const [thumbnail, setThumbnail] = useAtom(thumbnailAtom);
	const [localTitle, setLocalTitle] = useState("");
	const [title, setTitle] = useAtom(titleAtom);

	useEffect(() => {
		if (localTitle === "") {
			getYoutubeMetadata(youtube_id);
		}
	}, [youtube_id, localTitle]);


	const getThumbnail = (youtube_id: string) => {
		return `https://img.youtube.com/vi/${youtube_id}/hqdefault.jpg`;
	};

	const getYoutubeMetadata = (youtube_id: string) => {
		if(!YOUTUBE_API_KEY) {
			throw new Error("YOUTUBE_API_KEY is not set");
		}
		youtubeApi
			.getVideos({
				queries: {
					key: YOUTUBE_API_KEY,
					part: "snippet",
					id: youtube_id,
				},
			})
			.then((res: VideoDetailsResponseType) => {
				if (!res.items) {
					throw new Error("No items found");
				}
				if (!res.items[0].snippet) {
					throw new Error("No snippet found");
				}
				if (!res.items[0].snippet.title) {
					throw new Error("No title found");
				}
				setLocalTitle(res.items[0].snippet.title);
			})
			.catch((err: ErrorResponseType) => {
				console.error(err);
			});
	};

	const handleLoadWav = (wav_url: string) => {
		setWavFile(null); // 一旦nullにしておく
		setWavFile(wav_url); // 適当なWAV URLを設定
		setThumbnail(getThumbnail(youtube_id));
		setTitle(localTitle);
	};

	const isWavURLExist = () => {
		return wav_url !== "http://example.com";
	};

	return (
		<Card
			key={youtube_id}
			p="0"
			radius="md"
			component="a"
			className={classes.card}
			style={{
				transform: isPressed ? "scale(0.95)" : "scale(1)",
				transition: "transform 0.1s ease-in-out",
				pointerEvents: !isWavURLExist() ? "none" : "auto", // wav_urlがない場合クリック不可
				opacity: !isWavURLExist() ? 0.6 : 1, // 視覚的に無効化感を出す
			}}
			onMouseDown={() => isWavURLExist() && setIsPressed(true)}
			onMouseUp={() => setIsPressed(false)}
			onMouseLeave={() => setIsPressed(false)}
			onTouchStart={() => isWavURLExist() && setIsPressed(true)}
			onTouchEnd={() => setIsPressed(false)}
			onTouchCancel={() => setIsPressed(false)}
			onClick={() => {
				if (wav_url && isWavURLExist()) {
					/* クリック処理をここに追加 */
					handleLoadWav(wav_url);
				}
			}}
		>
			<AspectRatio ratio={1920 / 1080}>
				<Image src={getThumbnail(youtube_id)} />
				{isWavURLExist() ? <PlayButton /> : <LoaderIcon />}
			</AspectRatio>
		</Card>
	);
}
