import { ActionIcon } from "@mantine/core";
import { IconBrandYoutube } from "@tabler/icons-react";
import { ColorThemeToggleButtonWrapper } from "../../Icons/ColorThemeToggleButtonWrapper/ColorThemeToggleButtonWrapper";

export function YouTubeIcon() {
	return (
		<a href="https://www.youtube.com/">
			<ActionIcon size="lg" color="gray" variant="subtle">
				<ColorThemeToggleButtonWrapper
					icon={IconBrandYoutube}
					darkColor="red"
					lightColor="red"
					size={30}
				/>
			</ActionIcon>
		</a>
	);
}
