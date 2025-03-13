"use client";

import { useState } from "react";
import { Button, Textarea, Group } from "@mantine/core";
import { IconClipboardCheck } from "@tabler/icons-react";

export const ClipboardPasteButton = () => {
	const [text, setText] = useState("");

	const handlePaste = async () => {
		try {
			const clipboardText = await navigator.clipboard.readText();
			setText(clipboardText);
		} catch (error) {
			console.error("Failed to read clipboard:", error);
		}
	};

	return (
		<Group>
			<Button leftSection={<IconClipboardCheck size={18} />} onClick={handlePaste}>
				クリップボードからペースト
			</Button>
			<Textarea
				placeholder="ここにペーストされます"
				value={text}
				onChange={(event) => setText(event.currentTarget.value)}
				minRows={3}
				style={{ width: 300 }}
			/>
		</Group>
	);
};

export default ClipboardPasteButton;
