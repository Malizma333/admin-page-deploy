import { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../../lib/mongodb';

export default async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
	if (req.method === 'POST') {
		try {
			const client = await clientPromise;
			const db = client.db('main');

			const application = await db.collection<ApplicationData>('applications').findOne({ firstName: req.body.firstName, lastName: req.body.lastName });

			if (!application) {
				return res.status(404).send('Application not found');
			}

			await db
				.collection('applications')
				.updateOne({ firstName: req.body.firstName, lastName: req.body.lastName }, { $set: { checkedIn: !application.checkedIn } });

			application.checkedIn = !application.checkedIn;
			res.status(200).send(application);
		} catch (e) {
			console.error(e);
			res.status(500).send('An error occured');
		}
	} else {
		res.status(405).send('Must use POST');
	}
};
