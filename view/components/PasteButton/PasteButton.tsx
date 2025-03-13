"use client";

import { Button, Group, Textarea } from "@mantine/core";
import { IconClipboardCheck } from "@tabler/icons-react";
import { useState } from "react";

export const PasteButton = () => {
	const handlePaste = async () => {
		try {
			const clipboardText = await navigator.clipboard.readText();
		} catch (error) {
			console.error("Failed to read clipboard:", error);
		}
	};

	return (
		<Group>
			<Button onClick={handlePaste} color="transparent">
				<IconClipboardCheck />
			</Button>
		</Group>
	);
};
