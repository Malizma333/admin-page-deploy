import { IconEdit } from '@tabler/icons-react';
import { Anchor, Button, Group, List, LoadingOverlay, Modal, Stack, Table, TextInput, rem } from '@mantine/core';
import { IconHammer, IconPlus, IconSearch } from '@tabler/icons-react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { match } from '../lib/utils';

const Edit = () => {
	const [data, setData] = useState<Application[]>([]);
	const [search, setSearch] = useState<string>('');
	const [results, setResults] = useState<Application[]>([]);
	const [init, setInit] = useState(true);
	const [open, setOpen] = useState<boolean>(false);
	const [reason, setReason] = useState<string>('');
	const [name, setName] = useState<string>('');
	const [email, setEmail] = useState<string>('');
	const [phoneNumber, setPhoneNumber] = useState<string>('');
	const [levelOfStudy, setLevelOfStudy] = useState<string>('');
	const [school, setSchool] = useState<string>('');

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
				const newData = applications.filter(
					(application) =>
						!blacklist.some((filter) => {
							return (
								(filter.fields.name !== null && filter.fields.name === application.firstName + ' ' + application.lastName) ||
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

	const projectNameHandler = (projectName: string, firstName: string, lastName: string) => {
		const i = data.findIndex((app) => app.firstName == firstName && app.lastName == lastName);
		data[i].projectName = projectName;
		setData([...data]);
        axios.post('/api/edit', {
            projectName,
            firstName,
            lastName
        })
	};

	const projectLinkHandler = (projectLink: string, firstName: string, lastName: string) => {
		const i = data.findIndex((app) => app.firstName == firstName && app.lastName == lastName);
        data[i].projectLink = projectLink;
		setData([...data]);
        axios.post('/api/edit', {
            projectLink,
            firstName,
            lastName
        })
	};

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
						<Table.Th>Project Name</Table.Th>
						<Table.Th>Project Link</Table.Th>
					</Table.Tr>
				</Table.Thead>
				<Table.Tbody>
					{results.map((application) => (
						<Table.Tr key={application._id.toString()}>
							<Table.Td>
								{application.firstName} {application.lastName}
							</Table.Td>
							<Table.Td>{application.email}</Table.Td>
							<Table.Td>
								<input
									value={application.projectName ?? ''}
									onChange={(e) => projectNameHandler(e.target.value, application.firstName, application.lastName)}
								></input>
							</Table.Td>
							<Table.Td>
								<input
									value={application.projectLink ?? ''}
									onChange={(e) => projectLinkHandler(e.target.value, application.firstName, application.lastName)}
								></input>
							</Table.Td>
						</Table.Tr>
					))}
				</Table.Tbody>
				<Modal
					title="New Blacklist Filter"
					opened={open}
					onClose={() => {
						setOpen(false);
						setReason('');
						setName('');
						setPhoneNumber('');
						setLevelOfStudy('');
						setSchool('');
					}}
				>
					<TextInput label="Reason" value={reason} onChange={(evt) => setReason(evt.target.value)} />
					<TextInput label="Name" value={name} onChange={(evt) => setName(evt.target.value)} />
					<TextInput label="Email" value={email} onChange={(evt) => setEmail(evt.target.value)} />
					<TextInput label="Phone Number" value={phoneNumber} onChange={(evt) => setPhoneNumber(evt.target.value)} />
					<TextInput label="Level of Study" value={levelOfStudy} onChange={(evt) => setLevelOfStudy(evt.target.value)} />
					<TextInput label="School" value={school} onChange={(evt) => setSchool(evt.target.value)} />
					<Button
						leftSection={<IconPlus style={{ width: rem(16), height: rem(16) }} />}
						onClick={() =>
							axios
								.post<BlacklistFilter>('/api/blacklist', {
									reason: reason === '' ? null : reason,
									fields: {
										name: name === '' ? null : name,
										email: email === '' ? null : email,
										phoneNumber: phoneNumber === '' ? null : phoneNumber,
										levelOfStudy: levelOfStudy === '' ? null : levelOfStudy,
										school: school === '' ? null : school,
									},
								})
								.then((res) => {
									const filter = res.data;

									setData(
										data.filter(
											(application) =>
												!(
													(filter.fields.name !== null && match(filter.fields.name, application.firstName, application.lastName)) ||
													(filter.fields.email !== null && match(filter.fields.email, application.email)) ||
													(filter.fields.phoneNumber !== null && match(filter.fields.phoneNumber, application.phoneNumber)) ||
													(filter.fields.levelOfStudy !== null && match(filter.fields.levelOfStudy, application.levelOfStudy)) ||
													(filter.fields.school !== null && match(filter.fields.school, application.school))
												)
										)
									);
									setOpen(false);
									setReason('');
									setName('');
									setEmail('');
									setPhoneNumber('');
									setLevelOfStudy('');
									setSchool('');
								})
						}
					>
						Add
					</Button>
				</Modal>
			</Table>
		</>
	);
};

export default Edit;
