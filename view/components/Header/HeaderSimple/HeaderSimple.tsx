import { Container, Group } from "@mantine/core";
import { ModeIcon } from "../../Icons/ModeIcon/ModeIcon";
import { WidthToggleIcon } from "../../Icons/WidthToggleIcon/WidthToggleIcon";
import { MuspLogo } from "../MuspLogo/MuspLogo";
import classes from "./HeaderSimple.module.css";

export function HeaderSimple() {
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
