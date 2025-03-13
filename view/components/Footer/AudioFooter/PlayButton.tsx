import { ActionIcon } from "@mantine/core";
import { IconPlayerPause, IconPlayerPlay } from "@tabler/icons-react";
import type { ComponentProps } from "react";

import customClasses from "./AudioFooter.module.css";

interface PlayButtonProps extends ComponentProps<any> {
	isPlaying: boolean;
	togglePlay: () => void;
}

export function PlayButton({
	isPlaying,
	togglePlay,
	...props
}: PlayButtonProps) {
	return (
		<ActionIcon
			onClick={togglePlay}
			color="gray"
			className={customClasses.play}
			{...props}
		>
			{isPlaying ? <IconPlayerPause /> : <IconPlayerPlay />}
		</ActionIcon>
	);
}
