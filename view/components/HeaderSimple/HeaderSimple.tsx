import { Container } from '@mantine/core';
import { MantineLogo } from '@mantinex/mantine-logo';
import { ActionToggle } from '../ActionToggle/ActionToggle';
import { MuspLogo } from '../MuspLogo/MuspLogo';
import classes from './HeaderSimple.module.css';


const links = [
  { link: '/about', label: 'Features' },
  { link: '/pricing', label: 'Pricing' },
  { link: '/learn', label: 'Learn' },
  { link: '/community', label: 'Community' },
];

export function HeaderSimple() {
  return (
    <header className={classes.header}>
      <Container size="md" className={classes.inner}>
        <MuspLogo />
        <ActionToggle />
      </Container>
    </header>
  );
}
