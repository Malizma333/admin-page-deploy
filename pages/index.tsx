import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import { useUser } from '@auth0/nextjs-auth0/client';
import { LoadingOverlay, Stack, Text } from '@mantine/core';
import axios from 'axios';
import { useRouter } from 'next/router';
import { NextPage } from 'next/types';
import { useEffect, useState } from 'react';
import Display from '../components/display';

const Index: NextPage = () => {
	const { user, error, isLoading } = useUser();
	const [admin, setAdmin] = useState(false);
	const [init, setInit] = useState(true);

	const router = useRouter();

	useEffect(() => {
		if (!isLoading && !error && user) {
			axios
				.get(`/api/admin/?email=${user.email}`)
				.then((resp) => {
					setAdmin(resp.data);
					setInit(false);
				})
				.catch((err) => {
					console.log(err);
				});
		}
	}, [isLoading, error, user, router]);

	return (
		<Stack>
			{admin && <Display />}
			{(!user || (!admin && !init)) && <Text>You aren&apos;t allowed here &gt;:( leave</Text>}
			{error && <Text>{error.message}</Text>}
			{isLoading && <LoadingOverlay />}
		</Stack>
	);
};

export const getServerSideProps = withPageAuthRequired();

export default Index;

