"use client";

import { ActionIcon } from "@mantine/core";
import { IconX } from "@tabler/icons-react";
import { useAtom } from "jotai";
import customClasses from "./AudioFooter.module.css";
import { wavFileAtom } from "@/jotai/atom";
import type { ComponentProps } from "react";

export function CancelButton({...props}: ComponentProps<any>) {
	// WAVファイルのリセット（キャンセル）
	const [_, setWavFile] = useAtom(wavFileAtom);

	const handleCancel = () => {
		setWavFile(null);
	};

	return (
		<ActionIcon
			onClick={handleCancel}
			color="gray"
			className={customClasses.cancel}
			{...props}
		>
			<IconX />
		</ActionIcon>
	);
}
