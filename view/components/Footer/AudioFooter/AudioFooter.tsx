"use client";

import { Container, Group, Text } from "@mantine/core";
import { useRef, useState } from "react";
import { GitHubIcon } from "../../Icons/GitHubIcon/GitHubIcon";
import { CancelButton } from "./CancelButton";
import { PlayButton } from "./PlayButton";

import baseClasses from "../Footer.module.css";

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
		<div className={baseClasses.footer}>
			<Container className={baseClasses.inner}>
				<Group
					gap={1}
					className={baseClasses.links}
					justify="flex-end"
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
