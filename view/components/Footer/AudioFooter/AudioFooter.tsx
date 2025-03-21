"use client";

import { Avatar, Container, Text } from "@mantine/core";
import { useAtom } from "jotai";
import { use, useEffect, useRef, useState } from "react";
import { CustomSlider } from "./ButtomSeekBar/ProgressSlider";
import { PlayButton } from "./PlayButton";

import { useAudioPlayer } from "@/hooks/useAudioPlayer";
import { currentIndexAtom } from "@/jotai/audioPlayer/atoms";
import {
	thumbnailAtom,
	titleAtom,
	wavURLAtom,
} from "@/jotai/audioPlayer/selectors";

import classes from "./AudioFooter.module.css";

export function AudioFooter() {
	const [wavURL] = useAtom(wavURLAtom);
	const [title] = useAtom(titleAtom);
	const [thumbnail] = useAtom(thumbnailAtom);
	const { next } = useAudioPlayer();
	const [currentIndex] = useAtom(currentIndexAtom);

	const audioRef = useRef<HTMLAudioElement | null>(null);
	const [isPlaying, setIsPlaying] = useState(false);
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

	const handleSeek = (value: number) => {
		if (audioRef.current) {
			audioRef.current.currentTime = value;
			setCurrentTime(value);
		}
	};

	useEffect(() => {
		if (audioRef.current) {
			const audio = audioRef.current;
			audio.play();
			setIsPlaying(true);

			const updateTime = () => {
				setCurrentTime(audio.currentTime);
				setDuration(audio.duration || 0);
			};

			const handleEnded = () => {
				setIsPlaying(false);
				next(); // 次の楽曲へ！
			};

			audio.addEventListener("timeupdate", updateTime);
			audio.addEventListener("loadedmetadata", updateTime);
			audio.addEventListener("ended", handleEnded);

			return () => {
				audio.removeEventListener("timeupdate", updateTime);
				audio.removeEventListener("loadedmetadata", updateTime);
				audio.removeEventListener("ended", handleEnded);
			};
		}
	}, [next]);

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
					<source src={wavURL} type="audio/wav" />
				</audio>
				{thumbnail && <Avatar src={thumbnail} size={40} radius="md" />}
				<Text size="xs" lineClamp={2} className={classes.text}>
					{title}
				</Text>
				<PlayButton isPlaying={isPlaying} onClick={togglePlay} />
			</Container>
		</div>
	);
}
