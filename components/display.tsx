import { Anchor, Group, List, Table, TextInput, rem, Stack, LoadingOverlay } from '@mantine/core';
import axios from 'axios';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { match } from '../lib/utils';
import { IconSearch } from '@tabler/icons-react';

const Display: React.FC = () => {
	const [data, setData] = useState<Application[]>([]);
	const [search, setSearch] = useState<string>('');
	const [results, setResults] = useState<Application[]>([]);
	const [init, setInit] = useState(true);

	useEffect(() => {
		const timeout = setTimeout(() => {
			if (search === '') {
				setResults(data);
			} else {
				setResults(data.filter(({ firstName, lastName }) => match(search, firstName, lastName)));
			}
		}, 500);

		return () => clearTimeout(timeout);
	}, [search, data]);

	useEffect(() => {
		axios
			.get('/api/data')
			.then((res) => {
				const applications: Application[] = res.data;
				const newData = applications.filter(
					(application) =>
						Number(application.age) >= 18 &&
						application.levelOfStudy !== 'Secondary/High School' &&
						application.levelOfStudy !== 'Less than Secondary/High School' &&
						application.school !== 'None' &&
                        application.firstName !== 'Matt' && // remove later temporary cause im lazy to setup db
                        application.lastName !== 'Toal' // remove later
				);
				setData(newData);
				setInit(false);
			})
			.catch((err) => {
				console.log(err);
			});
	}, []);

	return (
		<>
			{init && (
				<Stack justify="center" align="center" h={'100vh'}>
					<LoadingOverlay visible={true}></LoadingOverlay>
				</Stack>
			)}
			<Group align="center" justify="space-between" gap={50} ml={15} mr={35} mt={20} mb={10}>
				<h2 style={{ margin: 0 }}>{data.length} Applications (not blacklisted)</h2>
				<TextInput
					leftSectionPointerEvents="none"
					leftSection={<IconSearch style={{ width: rem(16), height: rem(16) }}></IconSearch>}
					placeholder="Search user..."
					value={search}
					onChange={(evt) => setSearch(evt.target.value)}
				/>
			</Group>
			<Table stickyHeader highlightOnHover>
				<Table.Thead>
					<Table.Tr>
						<Table.Th>Name</Table.Th>
						<Table.Th>Email</Table.Th>
						<Table.Th>Age</Table.Th>
						<Table.Th>Phone Number</Table.Th>
						<Table.Th>School</Table.Th>
						<Table.Th>Graduation</Table.Th>
						<Table.Th>Shirt Size</Table.Th>
						<Table.Th>Resume</Table.Th>
						<Table.Th>Dietary Restrictions</Table.Th>
					</Table.Tr>
				</Table.Thead>
				<Table.Tbody>
					{results.map((application) => (
						<Table.Tr key={application._id.toString()}>
							<Table.Td>
								{application.firstName} {application.lastName}
							</Table.Td>
							<Table.Td>{application.email}</Table.Td>
							<Table.Td>{application.age}</Table.Td>
							<Table.Td>{application.phoneNumber}</Table.Td>
							<Table.Td>{application.school}</Table.Td>
							<Table.Td>
								{application.graduationMonth} {application.graduationYear}
							</Table.Td>
							<Table.Td>{application.shirtSize}</Table.Td>
							<Table.Td>
								{application.resume ? (
									<Anchor href={application.resume} target="_blank" rel="noreferrer noopener">
										View
									</Anchor>
								) : (
									'N/A'
								)}
							</Table.Td>
							<Table.Td>
								<List>
									{application.dietRestrictions.map((restriction, i) => (
										<List.Item key={i}>{restriction}</List.Item>
									))}
								</List>
							</Table.Td>
						</Table.Tr>
					))}
				</Table.Tbody>
			</Table>
		</>
	);
};

export default Display;
