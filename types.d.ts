type UserStatus = 'Admission Pending' | 'Confirmation Pending' | 'Denied' | 'Confirmed' | 'Checked In';

interface Application extends ApplicationData {
	_id: import('mongodb').ObjectId;
}

interface BlacklistFilter extends BlacklistFilterData {
	_id: import('mongodb').ObjectId;
}

interface ApplicationData {
	firstName: string;
	lastName: string;
	email: string;
	age: string;
	phoneNumber: string;
	country: string;
	school: string;
	levelOfStudy: string;
	graduationMonth: string;
	graduationYear: string;
	shirtSize: 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL';
	dietRestrictions: string[];
	resume: string | null;
	// attendingPrehacks: boolean;
	codeOfConductAgreement: boolean;
	dataAgreement: boolean;
	mlhAgreement: boolean;
	category: string | null;
	featured: boolean;
	projectLink: string | null;
	projectName: string | null;
}

interface BlacklistFilterData {
	reason: string | null;
	fields: {
		name: string | null;
		email: string | null;
		phoneNumber: string | null;
		levelOfStudy: string | null;
		school: string | null;
	};
}

interface MyMLHTokenResponse {
	access_token: string;
	token_type: 'Bearer'; // NOTE: could be subject to change in future
	expires_in: number;
	refresh_token: undefined; // NOTE: we currently do not request a refresh token (because refreshing user data probably isnt that important)
	scope: string;
}

interface MyMLHUser {
	id: string; // uuidv4 id
	created_at: number;
	updated_at: number;
	first_name: string;
	last_name: string;
	email: string;
	phone_number: string;
	profile: {
		country_of_residence: string | null; // 2-letter country code
		dietary_preference: string | null;
		tshirt_size: string | null;
		race_or_ethnicity?: string;
		gender?: 'Male' | 'Female'; // insert snide comment here
		age?: number;
	};
	education?: {
		id: string; // uuidv4 id
		current: boolean;
		school_name: string;
		school_type: string;
		start_date: number | null;
		end_date: number | null;
		major: string | null;
	}[];
}

