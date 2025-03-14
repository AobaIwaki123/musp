"use client";

import { ActionIcon, Container, Group, Slider } from "@mantine/core";
import { IconPlayerPause, IconPlayerPlay, IconX } from "@tabler/icons-react";
import { useAtom } from "jotai";
import { useEffect, useRef, useState } from "react";
import { wavFileAtom } from "@/jotai/atom";
import baseClasses from "../Footer.module.css";
import customClasses from "./AudioPlayer.module.css";

export function AudioPlayer() {
	const audioRef = useRef<HTMLAudioElement | null>(null);
	const [isPlaying, setIsPlaying] = useState(false);
	const [currentTime, setCurrentTime] = useState(0);
	const [duration, setDuration] = useState(0);
	const [wavFile, setWavFile] = useAtom(wavFileAtom);

	// 再生・停止の切り替え
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

	// WAVファイルのリセット（キャンセル）
	const handleCancel = () => {
		setWavFile(null);
	};

	// オーディオの時間更新
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

	// スライダーの変更
	const handleSeek = (value: number) => {
		if (audioRef.current) {
			audioRef.current.currentTime = value;
			setCurrentTime(value);
		}
	};

	// WAVファイルが設定されていない場合は表示しない
	if (!wavFile) return null;

	return (
		<div className={baseClasses.footer}>
			<audio ref={audioRef} src={wavFile}>
				<track kind="captions" />
			</audio>
			<Container className={baseClasses.inner}>
				<Group
					style={{
						padding: "10px",
						position: "fixed",
						bottom: 0,
						width: "100%",
					}}
					className={baseClasses.links}
				>
					{/* 再生ボタン (左下) */}
					<ActionIcon
						onClick={togglePlay}
						color="gray"
						className={customClasses.play}
					>
						{isPlaying ? <IconPlayerPause /> : <IconPlayerPlay />}
					</ActionIcon>
					<Slider
						value={currentTime}
						onChange={handleSeek}
						min={0}
						max={duration || 1}
						step={0.1}
						label={(val) => `${Math.floor(val)}秒`}
						style={{
							width: "70%",
							height: "1px",
							margin: "0 auto",
						}}
						color="blue"
					/>

					<ActionIcon
						onClick={handleCancel}
						color="gray"
						className={customClasses.cancel}
					>
						<IconX />
					</ActionIcon>
				</Group>
			</Container>
		</div>
	);
}
