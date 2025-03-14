"use client";

import { ActionIcon, useMantineColorScheme } from "@mantine/core";
import { IconColumns1, IconColumns2 } from "@tabler/icons-react";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { isHalfWidthAtom } from "../../../jotai/atom";
import { ModeIconWrapper } from "../ModeIconWrapper/ModeIconWrapper";

export function WidthToggleIcon() {
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
				<ModeIconWrapper icon={IconColumns1} />
			) : (
				<ModeIconWrapper icon={IconColumns2} />
			)}
		</ActionIcon>
	);
}
