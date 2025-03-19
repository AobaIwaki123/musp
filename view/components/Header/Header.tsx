"use client";
import { useEffect, useState } from "react";

import { storage } from "@/helper/localStorageHelper";
import { Avatar, Container, Group } from "@mantine/core";
import { AudioSelect } from "./AudioSelect/AudioSelect";
import { ColorThemeToggleButton } from "./ColorThemeToggleButton/ColorThemeToggleButton";
import { ColumnsToggleButton } from "./ColumnsToggleButton/ColumnsToggleButton";
import classes from "./Header.module.css";

export function Header() {
	const [userIcon, setUserIcon] = useState<string>("/MuspIcon/MuspIcon-2.webp");

	useEffect(() => {
		const userIcon = storage.get("userIcon", "/MuspIcon/MuspIcon-2.webp");
		if (userIcon) {
			setUserIcon(userIcon);
		}
	}, []);

	return (
		<header className={classes.header}>
			<Container size="md" className={classes.inner}>
				<Avatar src={userIcon} alt="it's me" />
				<AudioSelect />
				<Group>
					<ColumnsToggleButton />
					<ColorThemeToggleButton />
				</Group>
			</Container>
		</header>
	);
}
