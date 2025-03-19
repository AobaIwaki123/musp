import { ActionIcon } from "@mantine/core";
import { IconMusicPlus } from "@tabler/icons-react";
import { ModeIconWrapper } from "@/components/Icons/ModeIconWrapper/ModeIconWrapper";

interface AddMusicIconProps {
	watchYoutubeUrl: string;
}

export function AddMusicIcon({ watchYoutubeUrl }: AddMusicIconProps) {
	return (
		<ActionIcon
			type="submit"
			size="lg"
			color="red"
			variant="subtle"
			disabled={!watchYoutubeUrl} // 未入力の場合はボタンを無効化
		>
			<ModeIconWrapper
				icon={IconMusicPlus}
				darkColor={watchYoutubeUrl ? "pink" : "gray"}
				lightColor={watchYoutubeUrl ? "pink" : "gray"}
				size={30}
			/>
		</ActionIcon>
	);
}
