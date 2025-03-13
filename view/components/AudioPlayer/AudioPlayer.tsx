"use client";

import { useState, useRef, useEffect } from "react";
import { Button, Slider, Group, Text } from "@mantine/core";

export function AudioPlayer() {
	const audioRef = useRef<HTMLAudioElement | null>(null);
	const [isPlaying, setIsPlaying] = useState(false);
	const [currentTime, setCurrentTime] = useState(0);
	const [duration, setDuration] = useState(0);

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

  const url =
			"https://ff6681b2f33c375fda466cc24c7bad3b11e523205d3db99962f582b-apidata.googleusercontent.com/download/storage/v1/b/musp/o/0c1714f3-9461-4925-bf33-b1b84e0d4655%2Fvocals.wav?jk=AVyuY3gcJXhSYcLSlTjSq7L89r9s4ohagl5gRtMy7lUSr0le7s6jkd2yEcyTeuxmICOUY-nbBsGnvEgw4kBdYV9Ke-pACAVOkcfxbPj195jcZBpkxBSM_yIfmqjMCPUfidhjdj5iEVULZ4QKMHYbREcZh-VcmdfyFElBWM7eA9dpQuvWO7TmCvJbWicW_wf1ya4HSzND9Mfj48yTH9ruStkezrb8ZInBkAWO1tSia71bLiXy7T8rGBsQMWAtj-RptytVahLpF6Tcn3BK1jd3j2gmUNHAjoo6x5woNU5tS1I-BUHKLpcpVWqdD80m5912IuzLhICbkB6t6uRmZ5NPBa7ILz7y35hafxjtV2E2N6h_0_p70ynTmMhMBAtf4LKpQykOvtOLjUzEBJeh2Mx_-BvGQcluGgkkuNGd57Hk9hvrn5wRC8lLOTmDl1haEHQNTVtSVtLeeEGRY4EeQU7iOameiqVirR3rDaEvePE53adFRcYrJ3v2UotX3ppfTEiAzEhwd3iVeJyaxEcH-x06BpuqyewfoumCvxqjD6wPm9OD-xA65yvCIuXsjrGsgIJns5S9mzLfBD1HlN-e7PXrUQ1dt67XUsYzrk5iNdSBI-3kTbmMbCzeD9y5mgkLgUiPZtrVUfVixH4QeoEqZFMzIcpuJw48hQDE0u8ZTA9qajtBlL4F8yNXMddXouzxUsNUoEahlTH8hhD_HbSgDnIohrx7pWniK5014Gn-gMX9yLwBcG30PeVbdq1qAcQvrmUuWboLFnrcXyJMKHZcP2sHgjxo5YBMjzetQcxRI5M_g7i_FhBGO-8GtpL7mmOzKOi53Oqeac9NcQNO2-xbdvicAzSPdcTt_a03gBwdDHggudcZzVfbhcUXtcLEojYab7pi8RuzrVwikPS61fQCRouB4hR2RpKwhgzZYKSlrhRa_PcUcrJn_kBFhb-k6GoRx_73o9pr7Q0Ktnn2D8xeMLMHghS1-EeSnGDFDmYjO9HqYjNzuhaseNFX3iBuwjKzUhYJRN4RdDrHqn6o3mWgV4nDRj1QrRyJg1VauyBpInGpSlHzGWGL-DIPtt-sqwhbck2gEKgJz_-K8raXYze0QcP_jrXniiMpoOA8a6tMlnk09F76Xu_tAgW1dAU2l6G9hcO87qsTdEIk4KRdNVeisa7YQTTE&isca=1";
	return (
		<div style={{ width: 400, padding: 20 }}>
			<audio ref={audioRef} src={url}>
				<track
					kind="captions"
					// src="/sample.vtt"
					srcLang="en"
					label="English captions"
				/>
			</audio>

			{/* 再生・一時停止ボタン */}
			<Group align="center" mb="md">
				<Button onClick={togglePlay}>
					{isPlaying ? "⏸️ 一時停止" : "▶️ 再生"}
				</Button>
			</Group>

			{/* シークバー */}
			<Slider
				value={currentTime}
				onChange={handleSeek}
				min={0}
				max={duration || 1}
				step={0.1}
				label={(val) => `${Math.floor(val)}秒`}
			/>

			{/* タイム表示 */}
			<Group align="apart" mt="sm">
				<Text size="sm">{Math.floor(currentTime)}秒</Text>
				<Text size="sm">{Math.floor(duration)}秒</Text>
			</Group>
		</div>
	);
}
