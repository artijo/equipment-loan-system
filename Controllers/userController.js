import prisma from "../libs/prisma.js";
import { userValidator } from "../libs/vine.js";
import vine, {errors} from "@vinejs/vine";

export const createUser = async (req, res) => {
    const { name, email, telephone } = req.body;
    try {
        await userValidator.validate(req.body);
    } catch (error) {
        console.log(error, errors.E_VALIDATION_ERROR);
        return res.status(400).json({ error: error.message })
    }
    try {
        const user = await prisma.user.create({
            data: {
                name,
                email,
                telephone
            },
        });
        res.status(201).json(user.userId);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getUsers = async (req, res) => {
    const { sort, limit } = req.query;
    if (sort && sort !== "asc" && sort !== "desc") {
        return res.status(400).json({ error: "Invalid sort value" });
    }
    if (limit && isNaN(limit)) {
        return res.status(400).json({ error: "Invalid limit value" });
    }
    try {
        if (sort && limit) {
            const users = await prisma.user.findMany({
                orderBy: {
                    userId: sort,
                },
                take: parseInt(limit),
            });
            res.status(200).json(users);
        } else {
            const users = await prisma.user.findMany();
            res.status(200).json(users);
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getUserByEmail = async (req, res) => {
    const { email } = req.params;
    const isEmail = vine.helpers.isEmail(email);
    if (!isEmail) {
        return res.status(400).json({ error: "Invalid email" });
    }
    try {
        const user = await prisma.user.findUnique({
            where: {
                email,
            },
        });
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const updateUser = async (req, res) => {
    const { id } = req.params;
    const { name, email, telephone } = req.body;
    if(!vine.helpers.isString(id)) {
        return res.status(400).json({ error: "Invalid id" });
    }
    try {
        await userValidator.validate(req.body);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
    try {
        const user = await prisma.user.update({
            where: {
                userId: parseInt(id),
            },
            data: {
                name,
                email,
                telephone,
            },
        });
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const deleteUser = async (req, res) => {
    const { id } = req.params;
    if(!vine.helpers.isString(id)) {
        return res.status(400).json({ error: "Invalid id" });
    }
    try {
        await prisma.user.delete({
            where: {
                userId: parseInt(id),
            },
        });
        res.status(200).json({ message: "User deleted" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};