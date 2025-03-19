import { Container, Group, Avatar } from "@mantine/core";
import { ColorThemeToggleButton } from "./ColorThemeToggleButton/ColorThemeToggleButton";
import { ColumnsToggleButton } from "./ColumnsToggleButton/ColumnsToggleButton";
import classes from "./Header.module.css";
import { MuspLogo } from "./MuspLogo/MuspLogo";
import { storage } from "@/helper/localStorageHelper";

export function Header() {
	return (
		<header className={classes.header}>
			<Container size="md" className={classes.inner}>
				<MuspLogo />
				<Avatar
					src={storage.get("userIcon", "/MuspIcon/MuspIcon-2.webp")}
					alt="it's me"
				/>
				<Group>
					<ColumnsToggleButton />
					<ColorThemeToggleButton />
				</Group>
			</Container>
		</header>
	);
}
