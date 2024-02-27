import { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../../lib/mongodb';

export default async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
	if (req.method === 'GET') {
		try {
			const client = await clientPromise;
			const db = client.db('main');

			const data = await db.collection('applications').find().toArray();

			res.status(200).json(data);
		} catch (e) {
			console.error(e);
			res.status(500).send('An error occured');
		}
	} else {
		res.status(405).send('Must use GET');
	}
};

