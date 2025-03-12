"use client";

import { Button } from "@mantine/core"; // UIライブラリはお使いのものに合わせてください
import { IconColumns1, IconColumns2 } from "@tabler/icons-react";
import { useAtom } from "jotai";
import { isHalfWidthAtom } from "../../jotai/isHalfWidth";

export function WidthToggleButton() {
	const [isHalfWidth, setIsHalfWidth] = useAtom(isHalfWidthAtom);
	const toggleLayout = () => {
		setIsHalfWidth((prev) => !prev);
	};
	return (
		<Button onClick={toggleLayout}>
			{isHalfWidth ? <IconColumns1 size={16} /> : <IconColumns2 size={16} />}
		</Button>
	);
}
