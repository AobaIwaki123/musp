import { Container, Group } from "@mantine/core";
import { ActionToggle } from "../ModeButton/ModeButton";
import { MuspLogo } from "../MuspLogo/MuspLogo";
import { WidthToggleButton } from "../WidthToggleButton/WidthToggleButton";
import classes from "./HeaderSimple.module.css";

const links = [
	{ link: "/about", label: "Features" },
	{ link: "/pricing", label: "Pricing" },
	{ link: "/learn", label: "Learn" },
	{ link: "/community", label: "Community" },
];

export function HeaderSimple() {
	return (
		<header className={classes.header}>
			<Container size="md" className={classes.inner}>
				<MuspLogo />
				<Group>
					<WidthToggleButton />
					<ActionToggle />
				</Group>
			</Container>
		</header>
	);
}
