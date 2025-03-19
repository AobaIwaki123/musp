"use client";

import { isHalfWidthAtom } from "@/jotai/atom";
import { ActionIcon } from "@mantine/core";
import { IconColumns1, IconColumns2 } from "@tabler/icons-react";
import { useAtom } from "jotai";
import { ColorThemeToggleButtonWrapper } from "../../Icons/ColorThemeToggleButtonWrapper/ColorThemeToggleButtonWrapper";

export function ColumnsToggleButton() {
	const [isHalfWidth, setIsHalfWidth] = useAtom(isHalfWidthAtom);

	const toggleLayout = () => {
		setIsHalfWidth((prev) => !prev);
	};

	return (
		<ActionIcon
			onClick={toggleLayout}
			color="transparent"
			variant="default"
			size="xl"
			aria-label="Toggle columns"
		>
			{isHalfWidth ? (
				<ColorThemeToggleButtonWrapper icon={IconColumns1} />
			) : (
				<ColorThemeToggleButtonWrapper icon={IconColumns2} />
			)}
		</ActionIcon>
	);
}
