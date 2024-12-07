import axios, { isAxiosError } from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';
import clientPromise, { fixId } from '../../lib/mongodb';

export default async (req: NextApiRequest, resp: NextApiResponse): Promise<void> => {
	if (req.method === 'GET') {
		const code = req.query.code;

		if (!code || Array.isArray(code)) {
			resp.status(303).setHeader('Location', 'https://pickhacks.io/login-error?err=bad_code');
		} else {
			const client = await clientPromise;
			const applications = client.db('main').collection('applications');

			await axios
				.post<MyMLHTokenResponse>(`https://my.mlh.io/oauth/token`, {
					grant_type: 'authorization_code',
					client_id: process.env.MYMLH_CLIENT_ID,
					client_secret: process.env.MYMLH_CLIENT_SECRET,
					code,
					redirect_uri: `${process.env.LOCATION}/api/auth-callback`
				})
				.then((res) => {
					const token = res.data.access_token,
						type = res.data.token_type;

					return axios
						.get<MyMLHUser>('https://api.mlh.com/v4/users/me?expand[]=education', { headers: { Authorization: `${type} ${token}` } })
						.then((res) =>
							applications
								// as any necessary to get mongob to shut up about strings as ObjectIds
								.updateOne({ _id: res.data.id } as any, { $set: fixId(res.data) }, { upsert: true })
								.then(() => resp.status(303).setHeader('Location', 'https://pickhacks.io?message=registration_success').end())
						)
						.catch((err) => {
							if (isAxiosError(err)) {
								console.error(err.response?.data);
							} else {
								console.error(err);
							}

							resp.status(500).send('User Error');
						});
				})
				.catch((err) => {
					if (isAxiosError(err)) {
						console.error(err.response?.status);
						console.error(err.response?.headers);
						console.error(err.response?.data);
					} else {
						console.error(err);
					}

					resp.status(500).send('Token Error');
				});
		}
	} else {
		resp.status(405).send('Auth Errror - Incorrect method');
	}
};

