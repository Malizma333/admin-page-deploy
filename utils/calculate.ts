const schoolList = [
	'College of the Ozarks',
	'Missouri University of Science and Technology',
	'St. Louis Community College',
	'Missouri State University',
	'Mizzou',
	'Southeast Missouri State University',
	'St. Louis University',
	'Truman State University',
	'University of Illinois Urbana-Champaign',
	'University of Missouri–St. Louis',
	'Washington University in St. Louis',
	'None'
];

export const calculateSchools = (data: Application[]) => {
	const dict: { [id: string]: any } = { Other: 0 };
	data.forEach((application) => {
		if (schoolList.includes(application.school)) {
			if (dict[application.school] !== undefined) {
				dict[application.school]++;
			} else {
				dict[application.school] = 1;
			}
		} else {
			dict['Other']++;
		}
	});
	const res: [string, string | number][] = [];
	Object.keys(dict).forEach((key) => {
		res.push([key, dict[key]]);
	});
	res.sort((a, b) => (a[1] < b[1] ? 1 : -1));
	res.unshift(['School', 'Count']);
	return res;
};

export const calculateShirts = (data: Application[]) => {
	const dict: { [id: string]: any } = {};
	data.forEach((application) => {
		if (dict[application.shirtSize] !== undefined) {
			dict[application.shirtSize]++;
		} else {
			dict[application.shirtSize] = 1;
		}
	});
	const res: [string, string | number][] = [];
	Object.keys(dict).forEach((key) => {
		res.push([key, dict[key]]);
	});
	res.sort((a, b) => (a[1] < b[1] ? 1 : -1));
	res.unshift(['ShirtSize', 'Count']);
	return res;
};

export const calculateDietaryRestrictions = (data: Application[]) => {
	const dict: { [id: string]: any } = { None: 0 };
	data.forEach((application) => {
		if (application.dietRestrictions.length) {
			application.dietRestrictions.forEach((diet) => {
				if (dict[diet] !== undefined) {
					dict[diet]++;
				} else {
					dict[diet] = 1;
				}
			});
		} else {
			dict['None']++;
		}
	});
	const res: [string, string | number][] = [];
	Object.keys(dict).forEach((key) => {
		res.push([key, dict[key]]);
	});
	res.sort((a, b) => (a[1] < b[1] ? 1 : -1));
	res.unshift(['DietaryRestrictions', 'Count']);
	return res;
};

