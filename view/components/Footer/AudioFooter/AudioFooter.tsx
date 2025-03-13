"use client";

import { Container, Group, Text } from "@mantine/core";
import { useRef, useState } from "react";
import { CancelButton } from "./CancelButton";
import { PlayButton } from "./PlayButton";

import classes from "./AudioFooter.module.css";

export function AudioFooter() {
	const audioRef = useRef<HTMLAudioElement | null>(null);
	const [isPlaying, setIsPlaying] = useState(false);

	const togglePlay = () => {
		if (audioRef.current) {
			if (isPlaying) {
				audioRef.current.pause();
			} else {
				audioRef.current.play();
			}
			setIsPlaying(!isPlaying);
		}
	};

	return (
		<div className={classes.footer}>
			<Container className={classes.inner}>
				<PlayButton isPlaying={isPlaying} togglePlay={togglePlay} size={40}/>

				<Text c="dimmed" size="md">
					Slide Bar
				</Text>

				<CancelButton size={40}/>
			</Container>
		</div>
	);
}
