"use client";

import { Button } from "@mantine/core"; // UIライブラリはお使いのものに合わせてください
import { useMantineColorScheme } from "@mantine/core";
import { IconColumns1, IconColumns2 } from "@tabler/icons-react";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { isHalfWidthAtom } from "../../jotai/isHalfWidth";
import { ModeIconWrapper } from "../ModeIconWrapper/ModeIconWrapper";

export function WidthToggleButton() {
	const [isHalfWidth, setIsHalfWidth] = useAtom(isHalfWidthAtom);
	const toggleLayout = () => {
		setIsHalfWidth((prev) => !prev);
	};
	const { colorScheme } = useMantineColorScheme();
	const [iconColor, setIconColor] = useState("black");

	useEffect(() => {
		if (colorScheme === "dark") {
			setIconColor("white");
		} else {
			setIconColor("black");
		}
	}, [colorScheme]);

	return (
		<Button onClick={toggleLayout} color="transparent">
			{isHalfWidth ? (
				<ModeIconWrapper icon={IconColumns1} />
			) : (
				<ModeIconWrapper icon={IconColumns2} />
			)}
		</Button>
	);
}
