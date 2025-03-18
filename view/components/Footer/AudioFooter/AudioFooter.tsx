"use client";

import { thumbnailAtom, wavFileAtom } from "@/jotai/atom";
import { Avatar, Container, Group } from "@mantine/core";
import { useAtom } from "jotai";
import { useEffect, useRef, useState } from "react";
import { CustomSlider } from "./ButtomSeekBar/ProgressSlider";
import { PlayButton } from "./PlayButton";

import classes from "./AudioFooter.module.css";

export function AudioFooter() {
	const audioRef = useRef<HTMLAudioElement | null>(null);
	const [isPlaying, setIsPlaying] = useState(false);
	const [wavFile] = useAtom(wavFileAtom);
	const [thumbnail] = useAtom(thumbnailAtom);
	const [currentTime, setCurrentTime] = useState(0);
	const [duration, setDuration] = useState(0);

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

	useEffect(() => {
		if (audioRef.current) {
			const audio = audioRef.current;
			audio.play();
			setIsPlaying(true);

			const updateTime = () => {
				setCurrentTime(audio.currentTime);
				setDuration(audio.duration);
			};

			audio.addEventListener("timeupdate", updateTime);
			audio.addEventListener("loadedmetadata", updateTime);

			return () => {
				audio.removeEventListener("timeupdate", updateTime);
				audio.removeEventListener("loadedmetadata", updateTime);
			};
		}
	}, []);

	const handleSeek = (value: number) => {
		if (audioRef.current) {
			audioRef.current.currentTime = value;
			setCurrentTime(value);
		}
	};

	if (!wavFile) return null;

	return (
		<div className={classes.footer}>
			<CustomSlider
				value={currentTime}
				max={duration}
				handleSeek={handleSeek}
			/>
			<Container fluid className={classes.inner}>
				<audio ref={audioRef}>
					<track kind="captions" />
					<source src={wavFile} type="audio/wav" />
				</audio>
				{thumbnail && <Avatar src={thumbnail} size={40} radius="md" />}
				<PlayButton isPlaying={isPlaying} onClick={togglePlay} />
			</Container>
		</div>
	);
}
