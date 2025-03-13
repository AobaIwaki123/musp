"use client";

import { Button, Container, Progress, Slider } from "@mantine/core";
import { useInterval } from "@mantine/hooks";
import { useMove } from "@mantine/hooks";
import React, { useEffect, useState } from "react";

interface CustomSliderProps {
  value: number;
}

export function CustomSlider({ value }: CustomSliderProps) {
	const [currentValue, setCurrentValue] = useState(100); // スライダーの値
	const [isMoving, _] = useState(false); // マウスが動いているか判定
	const interval = useInterval(() => {
		if (!isMoving) {
			setCurrentValue((prev) => (prev >= 100 ? 0 : prev + 1)); // 100 でリセット
		}
	}, 100);

	// useMove を活用してスライダーの値を手動変更
	const { ref } = useMove(({ x }) => {
		setCurrentValue(Math.round(x * 100));
	});

	return (
		<Container fluid style={{ width: "100%", padding: 0 }}>
			<Progress ref={ref} value={currentValue} size="2" />
		</Container>
	);
}
