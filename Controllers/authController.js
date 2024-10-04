import prisma from "../libs/prisma.js";
import jwt from "jsonwebtoken";

export const googleLogin = async (req, res) => {
    const { email, name } = req.body;
    try {
        const user = await prisma.user.findUnique({
            where: {
                email,
            },
        });
        if (!user) {
            await prisma.user.create({
                data: {
                    email,
                    name,
                },
            });
        }
        const token = jwt.sign({ email }, process.env.JSONWEBTOKEN_SECRET, { expiresIn: "24h" });
        res.cookie("token", token, { httpOnly: true }, { expires: new Date(Date.now() + 24 * 3600000) });
        res.status(200).json({ message: "User logged in" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}