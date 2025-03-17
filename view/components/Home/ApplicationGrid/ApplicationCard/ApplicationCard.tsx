"use client";

import { AspectRatio, Card, Image } from "@mantine/core";
import { useState } from "react";

import { wavFileAtom } from "@/jotai/atom";
import { useAtom } from "jotai";

import type { VideoIDAndWavURLType } from "@/client/client";
import { LoaderIcon } from "./LoaderIcon";
import { PlayButton } from "./PlayButton/PlayButton";

import classes from "./ApplicationCard.module.css";

export function ApplicationCard({ youtube_id, wav_url }: VideoIDAndWavURLType) {
	const [isPressed, setIsPressed] = useState(false);
	const [_, setWavFile] = useAtom(wavFileAtom);

	const handleLoadWav = (wav_url: string) => {
		setWavFile(null); // 一旦nullにしておく
		setWavFile(wav_url); // 適当なWAV URLを設定
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
				pointerEvents: !wav_url ? "none" : "auto", // wav_urlがない場合クリック不可
				opacity: !wav_url ? 0.6 : 1, // 視覚的に無効化感を出す
			}}
			onMouseDown={() => wav_url && setIsPressed(true)}
			onMouseUp={() => setIsPressed(false)}
			onMouseLeave={() => setIsPressed(false)}
			onTouchStart={() => wav_url && setIsPressed(true)}
			onTouchEnd={() => setIsPressed(false)}
			onTouchCancel={() => setIsPressed(false)}
			onClick={() => {
				if (wav_url) {
					/* クリック処理をここに追加 */
					handleLoadWav(wav_url);
				}
			}}
		>
			<AspectRatio ratio={1920 / 1080}>
				<Image src={`https://img.youtube.com/vi/${youtube_id}/hqdefault.jpg`} />
				{!wav_url ? <LoaderIcon /> : <PlayButton />}
			</AspectRatio>
		</Card>
	);
}
