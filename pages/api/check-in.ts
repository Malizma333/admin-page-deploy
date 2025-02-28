import { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../../lib/mongodb';

export default async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
	if (req.method === 'POST') {
		try {
			const client = await clientPromise;
			const db = client.db('main');

			const application = await db
				.collection<MyMLHUser & { checkedIn: boolean }>('applications')
				.findOne({ first_name: req.body.firstName, last_name: req.body.lastName });

			if (!application) {
				return res.status(404).send('Application not found');
			}

			await db
				.collection<MyMLHUser & { checkedIn: boolean }>('applications')
				.updateOne({ first_name: req.body.firstName, last_name: req.body.lastName }, { $set: { checkedIn: !application.checkedIn } });

			application.checkedIn = !application.checkedIn;
			res.status(200).send({
				_id: application._id,
				firstName: application.first_name,
				lastName: application.last_name,
				email: application.email,
				age: application.profile?.age?.toString() || '',
				phoneNumber: application.phone_number || '',
				country: application.profile?.country_of_residence || '',
				school: application.education?.[0]?.school_name || '',
				levelOfStudy: application.education?.[0]?.school_type || '',
				graduationMonth: application.education?.[0]?.end_date
					? new Date(application.education[0].end_date * 1000).toLocaleString('default', { month: 'long' })
					: '',
				graduationYear: application.education?.[0]?.end_date ? new Date(application.education[0].end_date * 1000).getFullYear().toString() : '',
				shirtSize: (application.profile?.tshirt_size as Application['shirtSize']) || 'M',
				dietRestrictions: application.profile?.dietary_preference ? [application.profile.dietary_preference] : [],
				resume: null,
				codeOfConductAgreement: true,
				dataAgreement: true,
				mlhAgreement: true,
				category: null,
				featured: false,
				projectLink: null,
				projectName: null,
				checkedIn: application.checkedIn
			});
		} catch (e) {
			console.error(e);
			res.status(500).send('An error occured');
		}
	} else {
		res.status(405).send('Must use POST');
	}
};

