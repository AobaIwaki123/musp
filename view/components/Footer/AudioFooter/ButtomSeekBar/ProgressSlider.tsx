"use client";

import { Button, Container, Progress } from "@mantine/core";
import { useInterval } from "@mantine/hooks";
import { useMove } from "@mantine/hooks";
import React, { useEffect, useState } from "react";

interface CustomSliderProps {
	value: number;
	max?: number; // 最大値をオプションとして追加
	handleSeek: (value: number) => void;
}

export function CustomSlider({
	value,
	max = 100,
	handleSeek,
}: CustomSliderProps) {
	const [currentValue, setCurrentValue] = useState((value / max) * 100); // 0-100に正規化
	const [_, setIsMoving] = useState(false); // マウスが動いているか判定
	const disabled = value < 0.1; // 音声がロードされる前は操作を無効化

	// useMove を活用してスライダーの値を手動変更
	const { ref } = useMove(
		({ x }) => {
			if (disabled) return; // 無効時は操作を受け付けない
			setIsMoving(true);
			const newValue = Math.round(x * 100);
			setCurrentValue(newValue);
			handleSeek((newValue / 100) * max); // onChangeを適用
		},
		{
			onScrubEnd: () => setIsMoving(false), // ドラッグ終了時にインターバル再開
		},
	);

	// value の変化を監視し、スライダーに反映
	useEffect(() => {
		setCurrentValue((value / max) * 100);
	}, [value, max]);

	return (
		<Container fluid style={{ width: "100%", padding: 0 }}>
			<Progress
				ref={!disabled ? ref : undefined}
				value={currentValue}
				size="3"
				style = {{
					margin: 0,
					padding: 0,
				}}
			/>
		</Container>
	);
}
