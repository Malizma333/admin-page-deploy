import { Anchor, List, Table, Group, Stack, LoadingOverlay } from '@mantine/core';
import axios from 'axios';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Chart } from 'react-google-charts';
import { calculateDietaryRestrictions, calculateSchools, calculateShirts } from '../utils/calculate';

export const data2 = [
	['Task', 'Hours per Day'],
	['Work', 11],
	['Eat', 2],
	['Commute', 2],
	['Watch TV', 2],
	['Sleep', 7],
];

const Stats = () => {
	const [init, setInit] = useState(true);
	const [schoolData, setSchoolData] = useState<[string, string | number][]>([]);
	const [shirtData, setShirtData] = useState<[string, string | number][]>([]);
	const [dietData, setDietData] = useState<[string, string | number][]>([]);

	useEffect(() => {
		axios
			.get('/api/data')
			.then((res) => {
				setSchoolData(calculateSchools(res.data));
				setShirtData(calculateShirts(res.data));
				setDietData(calculateDietaryRestrictions(res.data));
				setInit(false);
			})
			.catch((err) => {
				console.log(err);
			});
	}, []);

	return (
		<>
			<Group align="center" gap={50} ml={15} pt={20} mb={10}>
				<h2 style={{ margin: 0 }}>Application Stats</h2>
			</Group>
			{init && (
				<Stack justify="center" align="center" h={'100vh'}>
					<LoadingOverlay visible={true}></LoadingOverlay>
				</Stack>
			)}
			{!init && (
				<>
					<Chart chartType="PieChart" data={schoolData} options={{ title: 'Schools' }} width={'100%'} height={'400px'} />
					<Chart chartType="PieChart" data={shirtData} options={{ title: 'Shirt Size' }} width={'100%'} height={'400px'} />
					<Chart chartType="PieChart" data={dietData} options={{ title: 'Dietary Restrictions' }} width={'100%'} height={'400px'} />
				</>
			)}
		</>
	);
};

export default Stats;
