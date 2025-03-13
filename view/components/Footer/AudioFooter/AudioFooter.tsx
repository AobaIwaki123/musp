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
				<Group
					gap={1}
					// className={classes.links}
					justify="space-between"
					wrap="nowrap"
				>
					<PlayButton isPlaying={isPlaying} togglePlay={togglePlay} />

					<Text c="dimmed" size="md">
						Slide Bar
					</Text>

					<CancelButton />
				</Group>
			</Container>
		</div>
	);
}
