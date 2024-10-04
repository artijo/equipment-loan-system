import jwt from "jsonwebtoken";
import prisma from "../libs/prisma.js";

export const isAuth = (req, res, next) => {
    const token = req.cookies.token;
   jwt.verify(token, process.env.JSONWEBTOKEN_SECRET, (err, tk) => {
        if (err) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        const user = prisma.user.findUnique({
            where: {
                email: tk.email,
            },
        });
        req.user = user;
    });
    next();
};

export const isAdmin = (req, res, next) => {
    if (req.user.role !== "admin" || req.user.role !== "ADMIN" || !req.user) {
        return res.status(403).json({ error: "Forbidden" });
    }
    next();
};