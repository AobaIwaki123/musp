import { ActionIcon } from "@mantine/core";
import { IconClipboardCheck } from "@tabler/icons-react";
import { ModeIconWrapper } from "@/components/Icons/ModeIconWrapper/ModeIconWrapper";

interface PasteIconProps {
	handlePaste: () => void;
}

export function PasteIcon({ handlePaste }: PasteIconProps) {
	return (
		<ActionIcon size="lg" color="gray" variant="subtle" onClick={handlePaste}>
			<ModeIconWrapper
				icon={IconClipboardCheck}
				darkColor="skyblue"
				lightColor="skyblue"
				size={30}
			/>
		</ActionIcon>
	);
}
