import { ActionIcon } from "@mantine/core";
import { IconPlayerPause, IconPlayerPlay } from "@tabler/icons-react";
import type { ComponentProps } from "react";
import { ModeIconWrapper } from "@/components/Icons/ModeIconWrapper/ModeIconWrapper";

import customClasses from "./AudioFooter.module.css";

interface PlayButtonProps extends ComponentProps<any> {
	isPlaying: boolean;
	onClick: () => void;
}

export function PlayButton({ isPlaying, onClick, ...props }: PlayButtonProps) {
	const iconSize = 30;
	return (
		<ModeIconWrapper
			icon={ActionIcon}
			onClick={onClick}
			lightColor="white"
			darkColor="gray"
			className={customClasses.play}
			{...props}
		>
			{isPlaying ? (
				<ModeIconWrapper
					icon={IconPlayerPause}
					lightColor="gray"
					darkColor="white"
					size={iconSize}
				/>
			) : (
				<ModeIconWrapper
					icon={IconPlayerPlay}
					lightColor="gray"
					darkColor="white"
					size={iconSize}
				/>
			)}
		</ModeIconWrapper>
	);
}
