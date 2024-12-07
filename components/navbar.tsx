import { Center, Stack, Tooltip, UnstyledButton, rem } from '@mantine/core';
import { IconDeviceDesktopAnalytics, IconFilter, IconNotes, IconUserX, IconEdit} from '@tabler/icons-react';
import { useRouter } from 'next/router';
import { useState } from 'react';
import classes from '../styles/Navbar.module.css';

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
	{ icon: IconFilter, label: 'Filter', link: '/filters' },
	{ icon: IconEdit, label: 'Edit', link: '/edit' },
];

export function Navbar() {
	const router = useRouter();

	const links = mockdata.map((link, index) => (
		<NavbarLink
			{...link}
			key={link.label}
			active={link.link === router.asPath}
			onClick={() => {
				router.push(link.link);
			}}
		/>
	));

	return (
		<nav className={classes.navbar}>
			<Center>
				<img src="/logo.png" height={30} width={30}></img>
			</Center>

			<div className={classes.navbarMain}>
				<Stack justify="center" gap={0}>
					{links}
				</Stack>
			</div>
		</nav>
	);
}
