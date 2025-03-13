"use client";

import { useEffect, useRef, useState } from "react";

import { wavFileAtom } from "@/jotai/atom";
import { Container, Slider, Text } from "@mantine/core";
import { useAtom } from "jotai";
import { CancelButton } from "./CancelButton";
import { PlayButton } from "./PlayButton";

import classes from "./AudioFooter.module.css";

export function AudioFooter() {
	const audioRef = useRef<HTMLAudioElement | null>(null);
	const [isPlaying, setIsPlaying] = useState(false);
	const [wavFile, setWavFile] = useAtom(wavFileAtom);
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
			<Container className={classes.inner}>
				<audio controls ref={audioRef}>
					<track kind="captions" />
					<source src={wavFile} type="audio/wav" />
				</audio>
				<PlayButton isPlaying={isPlaying} onClick={togglePlay} />
			</Container>
		</div>
	);
}
