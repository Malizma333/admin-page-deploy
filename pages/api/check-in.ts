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
			res.status(200).send(application);
		} catch (e) {
			console.error(e);
			res.status(500).send('An error occured');
		}
	} else {
		res.status(405).send('Must use POST');
	}
};

