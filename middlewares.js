import jwt from "jsonwebtoken";
import prisma from "./libs/prisma.js";

export const isAuth = async (req, res, next) => {
    const token = req.cookies.token;
   jwt.verify(token, process.env.JSONWEBTOKEN_SECRET, async (err, tk) => {
        if (err) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        const user = await prisma.user.findUnique({
            where: {
                email: tk.email,
            },
        });
        req.user = user;
        next();
    });
};

export const isAdmin = async (req, res, next) => {
    if (req.user.role !== "ADMIN") {
        return res.status(403).json({ error: "Forbidden" });
    } 
    next();
};