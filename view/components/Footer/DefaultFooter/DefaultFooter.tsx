import { Container, Group, Text } from "@mantine/core";
import { GitHubIcon } from "../../Icons/GitHubIcon/GitHubIcon";
import classes from "../Footer.module.css";

export function DefaultFooter() {
	return (
		<div className={classes.footer}>
			<Container className={classes.inner}>
				<Group
					gap={1}
					className={classes.links}
					justify="flex-end"
					wrap="nowrap"
				>
					<GitHubIcon />
					<Text c="dimmed" size="md">
						© 2025 AobaIwaki123 All rights reserved.
					</Text>
				</Group>
			</Container>
		</div>
	);
}
