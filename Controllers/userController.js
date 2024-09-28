import prisma from "../libs/prisma.js";
import { userValidator } from "../libs/vine.js";
import vine, {errors} from "@vinejs/vine";

export const createUser = async (req, res) => {
    const { name, email, telephone } = req.body;
    try {
        await userValidator.validate(req.body);
    } catch (error) {
        console.log(error, errors.E_VALIDATION_ERROR);
        return res.json({ error: error.message }).status(400)
    }
    try {
        const user = await prisma.user.create({
            data: {
                name,
                email,
                telephone
            },
        });
        res.json(user.userId).status(201);
    } catch (error) {
        res.json({ error: error.message }).status(500);
    }
};

export const getUsers = async (req, res) => {
    const { sort, limit } = req.query;
    if (sort && sort !== "asc" && sort !== "desc") {
        return res.json({ error: "Invalid sort value" }).status(400);
    }
    if (limit && isNaN(limit)) {
        return res.json({ error: "Invalid limit value" }).status(400);
    }
    try {
        if (sort && limit) {
            const users = await prisma.user.findMany({
                orderBy: {
                    userId: sort,
                },
                take: parseInt(limit),
            });
            res.json(users);
        } else {
            const users = await prisma.user.findMany();
            res.json(users);
        }
    } catch (error) {
        res.json({ error: error.message }).status(500);
    }
};

export const getUserByEmail = async (req, res) => {
    const { email } = req.params;
    const isEmail = vine.helpers.isEmail(email);
    if (!isEmail) {
        return res.json({ error: "Invalid email" }).status(400);
    }
    try {
        const user = await prisma.user.findUnique({
            where: {
                email,
            },
        });
        res.json(user);
    } catch (error) {
        res.json({ error: error.message }).status(500);
    }
}

export const updateUser = async (req, res) => {
    const { id } = req.params;
    const { name, email, telephone } = req.body;
    if(!vine.helpers.isString(id)) {
        return res.json({ error: "Invalid id" }).status(400);
    }
    try {
        await userValidator.validate(req.body);
    } catch (error) {
        return res.json({ error: error.message }).status(400);
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
        res.json(user).status(200);
    } catch (error) {
        res.json({ error: error.message }).status(500);
    }
};

export const deleteUser = async (req, res) => {
    const { id } = req.params;
    if(!vine.helpers.isString(id)) {
        return res.json({ error: "Invalid id" }).status(400);
    }
    try {
        await prisma.user.delete({
            where: {
                userId: parseInt(id),
            },
        });
        res.json({ message: "User deleted" }).status(200);
    } catch (error) {
        res.json({ error: error.message }).status(500);
    }
};