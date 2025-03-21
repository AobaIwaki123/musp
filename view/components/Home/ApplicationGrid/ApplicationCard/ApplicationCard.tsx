"use client";

import { AspectRatio, Card, Image } from "@mantine/core";
import { useState } from "react";
import { useAudioPlayer } from "@/hooks/useAudioPlayer";

import classes from "./ApplicationCard.module.css";
import { LoaderIcon } from "./LoaderIcon";
import { PlayButton } from "./PlayButton/PlayButton";

export type ApplicationCardProps = {
	youtube_id: string;
	is_ready: boolean;
	index: number;
	all_ids: string[]; // 再生可能なID一覧（Homeから渡す）
};

export function ApplicationCard({
	youtube_id,
	is_ready,
	index,
	all_ids,
}: ApplicationCardProps) {
	const [isPressed, setIsPressed] = useState(false);
	const { setNewQueueAndPlay } = useAudioPlayer();

	const getThumbnail = (youtube_id: string) => {
		return `https://img.youtube.com/vi/${youtube_id}/hqdefault.jpg`;
	};

	const handleLoadWav = () => {
		setNewQueueAndPlay(all_ids, index);
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
				pointerEvents: !is_ready ? "none" : "auto",
				opacity: !is_ready ? 0.6 : 1,
			}}
			onMouseDown={() => is_ready && setIsPressed(true)}
			onMouseUp={() => setIsPressed(false)}
			onMouseLeave={() => setIsPressed(false)}
			onTouchStart={() => is_ready && setIsPressed(true)}
			onTouchEnd={() => setIsPressed(false)}
			onTouchCancel={() => setIsPressed(false)}
			onClick={() => {
				if (is_ready) {
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
