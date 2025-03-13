"use client";

import { Button } from "@mantine/core";
import { IconRefresh } from "@tabler/icons-react";
import { useAtom } from "jotai";
import React from "react";
import { wavFileAtom } from "../../../jotai/atom";
import classes from "./ReloadButton.module.css";

export const ReloadButton = () => {
	const [wavFile, setWavFile] = useAtom(wavFileAtom);

	const handleReload = () => {
		window.location.reload();
	};

	return (
		<Button
			variant="gradient"
			gradient={{ from: "violet", to: "cyan", deg: 90 }}
			p="xs"
			radius="xl"
			onClick={handleReload}
			style={{
				position: "fixed",
				bottom: wavFile ? "100px" : "20px", // wavFile があるときは少し上げる
				right: "20px",
				zIndex: 1000, // 他の要素より前面に表示
			}}
			className={classes.button}
		>
			<IconRefresh size={24} stroke={1.5} />
		</Button>
	);
};
