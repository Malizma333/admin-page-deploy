import { Button, Group, LoadingOverlay, Modal, Stack, Table, TextInput, rem } from '@mantine/core';
import { IconPlus, IconSearch } from '@tabler/icons-react';
import axios from 'axios';
import { useEffect, useState } from 'react';

const Blacklist = () => {
	const [data, setData] = useState<BlacklistFilter[]>([]);
	const [search, setSearch] = useState<string>('');
	const [init, setInit] = useState<boolean>(true);
	const [open, setOpen] = useState<boolean>(false);
	const [reason, setReason] = useState<string>('');
	const [name, setName] = useState<string>('');
	const [email, setEmail] = useState<string>('');
	const [phoneNumber, setPhoneNumber] = useState<string>('');
	const [levelOfStudy, setLevelOfStudy] = useState<string>('');
	const [school, setSchool] = useState<string>('');

	useEffect(() => {
		axios
			.get<BlacklistFilter[]>('/api/blacklist')
			.then((res) => {
				setData(res.data);
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
				<h2 style={{ margin: 0 }}>{data.length} Blacklist Filters</h2>
				<Group>
					<TextInput
						leftSectionPointerEvents="none"
						leftSection={<IconSearch style={{ width: rem(16), height: rem(16) }} />}
						placeholder="Search user..."
						value={search}
						onChange={(evt) => setSearch(evt.target.value)}
					/>
					<Button leftSection={<IconPlus style={{ width: rem(16), height: rem(16) }} />} onClick={() => setOpen(true)}>
						New
					</Button>
				</Group>
			</Group>
			<Table stickyHeader highlightOnHover>
				<Table.Thead>
					<Table.Tr>
						<Table.Th>Name</Table.Th>
						<Table.Th>Email</Table.Th>
						<Table.Th>Phone Number</Table.Th>
						<Table.Th>Level of Study</Table.Th>
						<Table.Th>School</Table.Th>
						<Table.Th>Reason</Table.Th>
					</Table.Tr>
				</Table.Thead>
				<Table.Tbody>
					{data.map((filter) => (
						<Table.Tr key={filter._id.toString()}>
							<Table.Td>{filter.fields.name ?? 'N/A'}</Table.Td>
							<Table.Td>{filter.fields.email ?? 'N/A'}</Table.Td>
							<Table.Td>{filter.fields.phoneNumber ?? 'N/A'}</Table.Td>
							<Table.Td>{filter.fields.levelOfStudy ?? 'N/A'}</Table.Td>
							<Table.Td>{filter.fields.school ?? 'N/A'}</Table.Td>
							<Table.Td>{filter.reason ?? 'N/A'}</Table.Td>
						</Table.Tr>
					))}
				</Table.Tbody>
			</Table>
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
				}}>
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
									school: school === '' ? null : school
								}
							})
							.then((res) => {
								setData([...data, res.data]);
								setOpen(false);
								setReason('');
								setName('');
								setEmail('');
								setPhoneNumber('');
								setLevelOfStudy('');
								setSchool('');
							})
					}>
					Add
				</Button>
			</Modal>
		</>
	);
};

export default Blacklist;

