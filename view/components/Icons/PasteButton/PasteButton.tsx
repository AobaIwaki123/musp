import { ActionIcon } from "@mantine/core";
import { IconClipboardCheck } from "@tabler/icons-react";
import { ModeIconWrapper } from "../../Icons/ModeIconWrapper/ModeIconWrapper";

interface PasteButtonProps {
	handlePaste: () => void;
}

export function PasteButton({ handlePaste }: PasteButtonProps) {
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
