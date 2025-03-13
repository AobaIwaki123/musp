import { useMantineColorScheme } from "@mantine/core";
import { useEffect, useState } from "react";
import type { ElementType } from "react";

interface IconProps {
	icon: ElementType;
	lightColor?: string;
	darkColor?: string;
}

export function ModeIconWrapper({
	icon: Icon,
	lightColor = "black",
	darkColor = "white",
}: IconProps) {
	const { colorScheme } = useMantineColorScheme();
	const [iconColor, setIconColor] = useState(lightColor);

	useEffect(() => {
		setIconColor(colorScheme === "dark" ? darkColor : lightColor);
	}, [colorScheme, lightColor, darkColor]);

	return <Icon color={iconColor} />;
}
