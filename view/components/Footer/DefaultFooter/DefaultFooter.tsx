import { Container, Group, Text } from "@mantine/core";
import { GitHubIcon } from "../../Icons/GitHubIcon/GitHubIcon";
import baseClasses from "../Footer.module.css";

export function DefaultFooter() {
	return (
		<div className={baseClasses.footer}>
			<Container className={baseClasses.inner}>
				<Group
					gap={1}
					className={baseClasses.links}
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
