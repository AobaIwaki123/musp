import { Container, Group, Text } from '@mantine/core';
import { GitHubButton } from '../GitHubButton/GitHubButton';
import classes from './FooterSocial.module.css';

export function FooterSocial() {
  return (
    <div className={classes.footer}>
      <Container className={classes.inner}>
        <Group gap={1} className={classes.links} justify="flex-end" wrap="nowrap">
          <GitHubButton />
          <Text c="dimmed" size="md">
            © 2025 AobaIwaki123 All rights reserved.
          </Text>
        </Group>
      </Container>
    </div>
  );
}
