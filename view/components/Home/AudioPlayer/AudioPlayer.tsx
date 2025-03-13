"use client";

import { ActionIcon, Button, Divider, Group, Slider } from "@mantine/core";
import { IconPlayerPause, IconPlayerPlay, IconX } from "@tabler/icons-react";
import { useAtom } from "jotai";
import { useEffect, useRef, useState } from "react";
import { wavFileAtom } from "../../../jotai/atom";

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
		<div
			style={{
				position: "fixed",
				bottom: 0,
				width: "100%",
				background: "#fff",
				borderTop: "1px solid #ccc",
				padding: "10px 0",
			}}
		>
			<audio ref={audioRef} src={wavFile}>
				<track kind="captions" />
			</audio>

			{/* シークバー */}
			<Slider
				value={currentTime}
				onChange={handleSeek}
				min={0}
				max={duration || 1}
				step={0.1}
				label={(val) => `${Math.floor(val)}秒`}
				style={{ width: "90%", margin: "0 auto" }}
			/>

			<Divider my="sm" />

			{/* ボタンコンテナ */}
			<Group
				align="apart"
				style={{
					padding: "10px",
					position: "fixed",
					bottom: 0,
					width: "100%",
					background: "#fff",
					borderTop: "1px solid #ccc",
				}}
			>
				{/* 再生ボタン (左下) */}
				<ActionIcon
					onClick={togglePlay}
					style={{ position: "absolute", left: "10px", bottom: "10px" }}
					color="gray"
				>
					{isPlaying ? <IconPlayerPause /> : <IconPlayerPlay />}
				</ActionIcon>

				{/* キャンセルボタン (右下) */}
				<Button
					onClick={handleCancel}
					color="red"
					style={{ position: "absolute", right: "10px", bottom: "10px" }}
				>
					❌ キャンセル
				</Button>
			</Group>
		</div>
	);
}
