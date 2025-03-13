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

			const playAudio = () => {
				audioRef.current.play().catch((error) => {
					console.error("Autoplay prevented:", error);
				});
			};

			if (audioRef.current.readyState >= 3) {
				// すでにロード済みならすぐ再生
				playAudio();
			} else {
				// ロードが完了したら再生
				audioRef.current.addEventListener("canplaythrough", playAudio);
				return () => {
					audioRef.current.removeEventListener("canplaythrough", playAudio);
				};
			}
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
			<audio ref={audioRef} src={wavFile}>
				<track kind="captions" />
			</audio>
			<Container className={classes.inner}>
				<PlayButton isPlaying={isPlaying} togglePlay={togglePlay} size={40} />

				<Container className={classes.sliderWrapper}>
					<Slider
						value={currentTime}
						onChange={handleSeek}
						max={duration || 1}
						label={(val) => `${Math.floor(val)}秒`}
						color="gray"
						size="xs"
					/>
				</Container>

				<CancelButton size={40} />
			</Container>
		</div>
	);
}
