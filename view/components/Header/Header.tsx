import { Container, Group } from "@mantine/core";
import { ModeIcon } from "../Icons/ModeIcon/ModeIcon";
import { WidthToggleIcon } from "../Icons/WidthToggleIcon/WidthToggleIcon";
import classes from "./Header.module.css";
import { MuspLogo } from "./MuspLogo/MuspLogo";

export function Header() {
	return (
		<header className={classes.header}>
			<Container size="md" className={classes.inner}>
				<MuspLogo />
				<Group>
					<WidthToggleIcon />
					<ModeIcon />
				</Group>
			</Container>
		</header>
	);
}
