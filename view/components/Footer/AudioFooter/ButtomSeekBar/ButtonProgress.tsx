"use client";

import { Button, Progress, rgba, useMantineTheme } from "@mantine/core";
import { clamp, useInterval, useMove } from "@mantine/hooks";
import { useState } from "react";
import classes from "./BottomSeekBar.module.css";

export function ButtonProgress() {
	const theme = useMantineTheme();
	const [progress, setProgress] = useState(0);
	const [loaded, setLoaded] = useState(false);
	const [value, setValue] = useState(0.3);
	const { ref } = useMove(({ x }) => setValue(clamp(x, 0.1, 0.9)));

	const interval = useInterval(
		() =>
			setProgress((current) => {
				if (current < 100) {
					return current + 1;
				}

				interval.stop();
				setLoaded(true);
				return 0;
			}),
		20,
	);

	return (
		<Button
			fullWidth
			className={classes.button}
			onClick={() =>
				loaded ? setLoaded(false) : !interval.active && interval.start()
			}
			color={loaded ? "teal" : theme.primaryColor}
		>
			<div className={classes.label}>
				{progress !== 0
					? "Uploading files"
					: loaded
						? "Files uploaded"
						: "Upload files"}
			</div>
			{progress !== 0 && (
				<Progress
					value={progress}
					className={classes.progress}
					color={rgba(theme.colors.blue[2], 0.35)}
					radius="sm"
				/>
			)}
		</Button>
	);
}
