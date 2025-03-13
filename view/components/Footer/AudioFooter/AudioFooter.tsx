"use client";

import { Container, Slider, Text } from "@mantine/core";
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

				<Container className={classes.sliderWrapper}>
					<Slider color="gray" size="xs"/>
				</Container>

				<CancelButton size={40}/>
			</Container>
		</div>
	);
}
