"use client";

import { Select } from "@mantine/core";
import { useAudioPlayer } from "@/hooks/useAudioPlayer";
import { useEffect, useState } from "react";
import { useAtom } from "jotai";
import { trackTypeAtom } from "@/jotai/audioPlayer/atoms";

import classes from "./AudioSelect.module.css";

export function AudioSelect() {
	const { switchTrack } = useAudioPlayer();
	const [trackType] = useAtom(trackTypeAtom);

	const labelToType = {
		Vocal: "vocal",
		"Inst.": "inst",
	} as const;

	const [selected, setSelected] = useState<keyof typeof labelToType>("Vocal");

	useEffect(() => {
		setSelected(trackType === "vocal" ? "Vocal" : "Inst.");
	}, [trackType]);


	return (
		<Select
			data={["Vocal", "Inst."]}
			value={selected}
			allowDeselect={false}
			className={classes.select}
			onChange={(value) => {
				if (value && value in labelToType) {
					setSelected(value as keyof typeof labelToType);
					const track = labelToType[value as keyof typeof labelToType];
					switchTrack(track);
				}
			}}
		/>
	);
}
