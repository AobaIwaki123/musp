"use client";

import { Button } from "@mantine/core"; // UIライブラリはお使いのものに合わせてください
import { useMantineColorScheme } from "@mantine/core";
import { IconColumns1, IconColumns2 } from "@tabler/icons-react";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { isHalfWidthAtom } from "../../jotai/isHalfWidth";

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
				<IconColumns1 color={iconColor} />
			) : (
				<IconColumns2 color={iconColor} />
			)}
		</Button>
	);
}
