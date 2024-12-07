import { Anchor, Group, List, LoadingOverlay, Stack, Table, TextInput, rem } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { match } from '../lib/utils';

const Blacklist = () => {
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
		Promise.all([axios.get<Application[]>('/api/data').then((res) => res.data), axios.get<BlacklistFilter[]>('/api/blacklist').then((res) => res.data)])
			.then(([applications, blacklist]) => {
				const newData = applications.filter((application) =>
					blacklist.some((filter) => {
						return (
							(filter.fields.name !== null && filter.fields.name === (application.firstName + ' ' + application.lastName)) ||
							(filter.fields.email !== null && match(filter.fields.email, application.email)) ||
							(filter.fields.phoneNumber !== null && match(filter.fields.phoneNumber, application.phoneNumber)) ||
							(filter.fields.levelOfStudy !== null && match(filter.fields.levelOfStudy, application.levelOfStudy)) ||
							(filter.fields.school !== null && match(filter.fields.school, application.school))
						);
					})
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
				<h2 style={{ margin: 0 }}>{data.length} Possible Blacklists</h2>
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

export default Blacklist;

