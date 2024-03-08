import { useState } from 'react';
import { Center, Tooltip, UnstyledButton, Stack, rem } from '@mantine/core';
import {
	IconDeviceDesktopAnalytics,
	IconNotes,
	IconUserX,
} from '@tabler/icons-react';
import classes from '../styles/Navbar.module.css';
import { useRouter } from 'next/router';

interface NavbarLinkProps {
	icon: typeof IconNotes;
	label: string;
	active?: boolean;
	onClick?(): void;
}

function NavbarLink({ icon: Icon, label, active, onClick }: NavbarLinkProps) {
	return (
		<Tooltip label={label} position="right" transitionProps={{ duration: 0 }}>
			<UnstyledButton onClick={onClick} className={classes.link} data-active={active || undefined}>
				<Icon style={{ width: rem(20), height: rem(20) }} stroke={1.5} />
			</UnstyledButton>
		</Tooltip>
	);
}

const mockdata = [
	{ icon: IconNotes, label: 'Applications', link: '/' },
	{ icon: IconDeviceDesktopAnalytics, label: 'Statistics', link: '/stats' },
	{ icon: IconUserX, label: 'Blacklist', link: '/blacklist' },
];

export function Navbar() {
	const router = useRouter();
	const [active, setActive] = useState(router.asPath == '/' ? 0 : router.asPath == '/stats' ? 1 : 2);

	const links = mockdata.map((link, index) => (
		<NavbarLink
			{...link}
			key={link.label}
			active={index === active}
			onClick={() => {
				router.push(link.link);
				setActive(index);
			}}
		/>
	));

	return (
		<nav className={classes.navbar}>
			<Center>{/* <MantineLogo type="mark" inverted size={30} /> */}</Center>

			<div className={classes.navbarMain}>
				<Stack justify="center" gap={0}>
					{links}
				</Stack>
			</div>
		</nav>
	);
}
