import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import { NextPage } from 'next/types';
import Display from '../components/display';

const Index: NextPage = () => {
	return <Display />;
};

export const getServerSideProps = withPageAuthRequired();

export default Index;
