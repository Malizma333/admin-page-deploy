import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
    if (req.method === "GET") {
        try {
            const accessToken = req.headers.authorization?.split(" ")[1];

            if (!accessToken) {
                res.status(401).json({ error: "No authorization token provided" });
                return;
            }

            const response = await axios.get("https://api.mlh.com/v4/users/me?expand[]=education&expand[]=professional_experience&expand[]=address", {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            res.status(200).json(response.data);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                res.status(error.response?.status || 500).json({
                    error: error.response?.data || "An error occurred while fetching MLH data",
                });
            } else {
                console.error(error);
                res.status(500).json({ error: "Internal server error" });
            }
        }
    } else {
        res.status(405).json({ error: "Method not allowed" });
    }
};
