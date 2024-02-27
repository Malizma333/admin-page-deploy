import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { AppProps } from 'next/app';
import Head from 'next/head';

import { UserProvider } from '@auth0/nextjs-auth0/client';
import '@mantine/core/styles.css';

export default function App(props: AppProps) {
	const { Component, pageProps } = props;

	return (
		<>
			<Head>
				<title>PickHacks Registration</title>
				<meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
				<link rel="shortcut icon" href="favicon.ico" />
			</Head>

			<MantineProvider>
				<Notifications position="top-right" />
				{/* <Layout> */}
				<UserProvider>
					<Component {...pageProps} />
				</UserProvider>
				{/* </Layout> */}
			</MantineProvider>
		</>
	);
}

