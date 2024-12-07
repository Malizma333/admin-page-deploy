import { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../../lib/mongodb';

export default async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
	if (req.method === 'POST') {
		try {
			const client = await clientPromise;
			const db = client.db('main');

			await db
				.collection('applications')
				.updateOne(
					{ firstName: req.body.firstName, lastName: req.body.lastName },
					{ $set: req.body.projectLink ? { projectLink: req.body.projectLink } : { projectName: req.body.projectName } }
				);
			res.status(200).send({});
		} catch (e) {
			console.error(e);
			res.status(500).send('An error occured');
		}
	} else {
		res.status(405).send('Must use POST');
	}
};
