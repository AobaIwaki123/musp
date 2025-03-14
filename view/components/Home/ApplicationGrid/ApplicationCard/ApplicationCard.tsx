"use client";

import {
	AspectRatio,
	Button,
	Card,
	Center,
	Image,
	Loader,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { PlayButton } from "../../../Buttons/PlayButton/PlayButton";

import classes from "./ApplicationCard.module.css";

interface ApplicationCardProps {
	videoID: string;
	wav_url?: string | null; // wav_urlを追加（nullable）
}

export function ApplicationCard({ videoID, wav_url }: ApplicationCardProps) {
	return (
		<Card
			key={videoID}
			p="0"
			radius="md"
			component="a"
			className={classes.card}
		>
			<AspectRatio ratio={1920 / 1080}>
				<Image src={`https://img.youtube.com/vi/${videoID}/hqdefault.jpg`} />
				{!wav_url ? (
					<Center
						style={{
							position: "absolute",
							top: "50%",
							left: "50%",
							opacity: 0.8,
							transform: "translate(-50%, -50%)",
							zIndex: 2,
							width: 50, // サイズ調整
							height: 50, // 幅と高さを同じにすることで円形になる
							minWidth: 0, // Mantine のデフォルトの最小幅を無効化
							padding: 0, // 余白を削減
						}}
					>
						<Loader color="#9ad7ff" />
					</Center>
				) : (
					<PlayButton />
				)}
			</AspectRatio>
		</Card>
	);
}
