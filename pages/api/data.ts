import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../lib/mongodb";

export default async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
    if (req.method === "GET") {
        try {
            const client = await clientPromise;
            const db = client.db("main");

            const data = await db.collection("applications").find().toArray();

            const applications = data.map((user) => ({
                _id: user._id,
                firstName: user.first_name,
                lastName: user.last_name,
                email: user.email,
                age: user.profile?.age?.toString() || "",
                phoneNumber: user.phone_number || "",
                country: user.profile?.country_of_residence || "",
                school: user.education?.[0]?.school_name || "",
                levelOfStudy: user.education?.[0]?.school_type || "",
                graduationMonth: user.education?.[0]?.end_date ? new Date(user.education[0].end_date * 1000).toLocaleString("default", { month: "long" }) : "",
                graduationYear: user.education?.[0]?.end_date ? new Date(user.education[0].end_date * 1000).getFullYear().toString() : "",
                shirtSize: (user.profile?.tshirt_size as Application["shirtSize"]) || "M",
                dietRestrictions: user.profile?.dietary_preference ? [user.profile.dietary_preference] : [],
                resume: null,
                codeOfConductAgreement: true,
                dataAgreement: true,
                mlhAgreement: true,
                category: null,
                featured: false,
                projectLink: null,
                projectName: null,
            }));

            res.status(200).json(applications);
        } catch (e) {
            console.error(e);
            res.status(500).send("An error occurred");
        }
    } else {
        res.status(405).send("Must use GET");
    }
};
