import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../../lib/mongodb';

const Admin = async (req: NextApiRequest, res: NextApiResponse) => {
	if (req.method === 'GET') {
		try {
			const client = await clientPromise;
			const db = client.db('form');

			const admin = await db.collection('admins').findOne({ email: req.query.email });

			if (admin) {
				res.json(true);
			} else {
				res.json(false);
			}
		} catch (e) {
			console.error(e);
			res.status(500).send('An error occured');
		}
	} else {
		res.status(405).send('Must use GET');
	}
};

export default Admin;

