import { ActionIcon } from "@mantine/core";
import { IconBrandGithub } from "@tabler/icons-react";
import classes from "./GitHubIcon.module.css";

export function GitHubIcon() {
	return (
		<a href="https://github.com/AobaIwaki123/musp">
			<ActionIcon
				size="lg"
				color="gray"
				variant="subtle"
				radius="xl"
				className={classes.button}
			>
				<IconBrandGithub size={30} stroke={1.5} />
			</ActionIcon>
		</a>
	);
}
