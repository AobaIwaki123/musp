import { ActionIcon } from "@mantine/core";
import { IconPlayerPause, IconPlayerPlay } from "@tabler/icons-react";

import customClasses from "./AudioFooter.module.css";

interface PlayButtonProps {
	isPlaying: boolean;
	togglePlay: () => void;
}

export function PlayButton({ isPlaying, togglePlay }: PlayButtonProps) {
	return (
		<ActionIcon
			onClick={togglePlay}
			color="gray"
			className={customClasses.play}
		>
			{isPlaying ? <IconPlayerPause /> : <IconPlayerPlay />}
		</ActionIcon>
	);
}
