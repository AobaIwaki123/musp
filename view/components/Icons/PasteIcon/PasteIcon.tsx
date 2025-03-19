import { ActionIcon } from "@mantine/core";
import { IconClipboardCheck } from "@tabler/icons-react";
import { ColorThemeToggleButtonWrapper } from "../ColorThemeToggleButtonWrapper/ColorThemeToggleButtonWrapper";

interface PasteIconProps {
	handlePaste: () => void;
}

export function PasteIcon({ handlePaste }: PasteIconProps) {
	return (
		<ActionIcon size="lg" color="gray" variant="subtle" onClick={handlePaste}>
			<ColorThemeToggleButtonWrapper
				icon={IconClipboardCheck}
				darkColor="skyblue"
				lightColor="skyblue"
				size={30}
			/>
		</ActionIcon>
	);
}
