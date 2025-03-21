"use client";

import { AspectRatio, Card, Image } from "@mantine/core";
import { useState } from "react";

import { videoIDAtom } from "@/jotai/atom";
import { useAtom } from "jotai";

import classes from "./ApplicationCard.module.css";
import { LoaderIcon } from "./LoaderIcon";
import { PlayButton } from "./PlayButton/PlayButton";

export type ApplicationCardProps = {
	youtube_id: string;
	is_ready: boolean;
};

export function ApplicationCard({
	youtube_id,
	is_ready,
}: ApplicationCardProps) {
	const [_, setVideoID] = useAtom(videoIDAtom);

	const [isPressed, setIsPressed] = useState(false);

	const getThumbnail = (youtube_id: string) => {
		return `https://img.youtube.com/vi/${youtube_id}/hqdefault.jpg`;
	};

	const handleLoadWav = () => {
		setVideoID(youtube_id);
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
				pointerEvents: !is_ready ? "none" : "auto", // wav_urlがない場合クリック不可
				opacity: !is_ready ? 0.6 : 1, // 視覚的に無効化感を出す
			}}
			onMouseDown={() => is_ready && setIsPressed(true)}
			onMouseUp={() => setIsPressed(false)}
			onMouseLeave={() => setIsPressed(false)}
			onTouchStart={() => is_ready && setIsPressed(true)}
			onTouchEnd={() => setIsPressed(false)}
			onTouchCancel={() => setIsPressed(false)}
			onClick={() => {
				if (is_ready) {
					/* クリック処理をここに追加 */
					handleLoadWav();
				}
			}}
		>
			<AspectRatio ratio={1920 / 1080}>
				<Image src={getThumbnail(youtube_id)} />
				{is_ready ? <PlayButton /> : <LoaderIcon />}
			</AspectRatio>
		</Card>
	);
}
