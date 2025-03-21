"use client";

import { wavURLAtom } from "@/jotai/audioPlayer/selectors";
import { Button } from "@mantine/core";
import { IconRefresh } from "@tabler/icons-react";
import { useAtom } from "jotai";
import classes from "./ReloadButton.module.css";

interface ReloadButtonProps {
	onClick: () => void; // クリック時の関数
}

export const ReloadButton = ({ onClick }: ReloadButtonProps) => {
	const [wavURL] = useAtom(wavURLAtom);

	return (
		<Button
			variant="gradient"
			gradient={{ from: "violet", to: "cyan", deg: 90 }}
			p="xs"
			radius="xl"
			onClick={onClick}
			style={{
				position: "fixed",
				bottom: wavURL ? "100px" : "20px", // wavFile があるときは少し上げる
				right: "20px",
				zIndex: 1000, // 他の要素より前面に表示
			}}
			className={classes.button}
		>
			<IconRefresh size={24} stroke={1.5} />
		</Button>
	);
};
