import { ActionIcon } from "@mantine/core";
import { IconBrandYoutube } from "@tabler/icons-react";
import { ModeIconWrapper } from "../../Icons/ModeIconWrapper/ModeIconWrapper";

export function YouTubeIcon() {
	return (
		<a href="https://www.youtube.com/">
			<ActionIcon size="lg" color="gray" variant="subtle">
				<ModeIconWrapper
					icon={IconBrandYoutube}
					darkColor="red"
					lightColor="red"
					size={30}
				/>
			</ActionIcon>
		</a>
	);
}
