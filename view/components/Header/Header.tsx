import { Container, Group } from "@mantine/core";
import { ColorThemeToggleButton } from "./ColorThemeToggleButton/ColorThemeToggleButton";
import { ColumnsToggleButton } from "./ColumnsToggleButton/ColumnsToggleButton";
import classes from "./Header.module.css";
import { MuspLogo } from "./MuspLogo/MuspLogo";

export function Header() {
	return (
		<header className={classes.header}>
			<Container size="md" className={classes.inner}>
				<MuspLogo />
				<Group>
					<ColumnsToggleButton />
					<ColorThemeToggleButton />
				</Group>
			</Container>
		</header>
	);
}
