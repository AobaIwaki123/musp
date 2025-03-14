"use client";

import { Button, Container, Progress, Slider } from "@mantine/core";
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
	const [isMoving, setIsMoving] = useState(false); // マウスが動いているか判定
	const interval = useInterval(() => {
		if (!isMoving) {
			setCurrentValue((prev) => (prev >= 100 ? 0 : prev + 100 / max)); // max に基づいた増加
		}
	}, 100);

	// useMove を活用してスライダーの値を手動変更
	const { ref } = useMove(({ x }) => {
		setIsMoving(true);
		setCurrentValue(Math.round(x * 100)); // 0-100 の範囲で変更
	});

	// value の変化を監視し、スライダーに反映
	useEffect(() => {
		setCurrentValue((value / max) * 100);
	}, [value, max]);

	return (
		<Container fluid style={{ width: "100%", padding: 0 }}>
			<Progress ref={ref} value={currentValue} size="2" />
		</Container>
	);
}
