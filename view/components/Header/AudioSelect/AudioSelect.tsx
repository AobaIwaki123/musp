"use client";

import { isVocalAtom } from "@/jotai/atom";
import { Select } from "@mantine/core";
import { useAtom } from "jotai";
import { useState, useEffect } from "react";

import classes from "./AudioSelect.module.css";

export function AudioSelect() {
	const [isVocal, setIsVocal] = useAtom(isVocalAtom);
	const [selectedValue, setSelectedValue] = useState(
		isVocal ? "Vocal" : "Inst.",
	);

	useEffect(() => {
		setSelectedValue(isVocal ? "Vocal" : "Inst.");
	}	, [isVocal]);

	return (
		<Select
			data={["Vocal", "Inst."]}
			value={selectedValue}
			allowDeselect={false}
			className={classes.select}
			onChange={(value) => {
				if (value) {
					setSelectedValue(value);
					setIsVocal(value === "Vocal");
				}
			}}
		/>
	);
}
