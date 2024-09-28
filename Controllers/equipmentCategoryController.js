import prisma from "../libs/prisma.js";
import { equipmentCategoryValidator } from "../libs/vine.js";
import vine from "@vinejs/vine";

export const createEquipmentCategory = async (req, res) => {
    const { name, description } = req.body;
    try {
        await equipmentCategoryValidator.validate(req.body);
    } catch (error) {
        return res.json({ error: error.message }).status(400);
    }
    try {
        await prisma.equipment_Categories.create({
            data: {
                name,
                description,
            },
        });
        res.json({ message: "Equipment Category created" }).status(201);
    } catch (error) {
        res.json({ error: error.message }).status(500);
    }
}

export const getEquipmentCategories = async (req, res) => {
    const { sort, limit } = req.query;
    if (sort && sort !== "asc" && sort !== "desc") {
        return res.json({ error: "Invalid sort value" }).status(400);
    }
    if (limit && isNaN(limit)) {
        return res.json({ error: "Invalid limit value" }).status(400);
    }
    try {
        if (sort && limit) {
            const equipmentCategories = await prisma.equipment_Categories.findMany({
                orderBy: {
                    equipmentCategoryId: sort,
                },
                take: parseInt(limit),
            });
            res.json(equipmentCategories);
        } else {
            const equipmentCategories = await prisma.equipment_Categories.findMany();
            res.json(equipmentCategories);
        }
    } catch (error) {
        res.json({ error: error.message }).status(500);
    }
}

export const getEquipmentCategoryById = async (req, res) => {
    const { id } = req.params;
    if (!vine.helpers.isString(id)) {
        return res.json({ error: "Invalid equipment category id" }).status(400);
    }
    try {
        const equipmentCategory = await prisma.equipment_Categories.findUnique({
            where: {
                categoryId: id,
            },
        });
        res.json(equipmentCategory);
    } catch (error) {
        res.json({ error: error.message }).status(500);
    }
}

export const updateEquipmentCategory = async (req, res) => {
    const { id } = req.params;
    const { name, description } = req.body;
    if (!vine.helpers.isString(id)) {
        return res.json({ error: "Invalid equipment category id" }).status(400);
    }
    try {
        await equipmentCategoryValidator.validate(req.body);
    } catch (error) {
        return res.json({ error: error.message }).status(400);
    }
    try {
        await prisma.equipment_Categories.update({
            where: {
                categoryId: id,
            },
            data: {
                name,
                description,
            },
        });
        res.json({ message: "Equipment Category updated" });
    } catch (error) {
        res.json({ error: error.message }).status(500);
    }
}

export const deleteEquipmentCategory = async (req, res) => {
    const { id } = req.params;
    if (!vine.helpers.isString(id)) {
        return res.json({ error: "Invalid equipment category id" }).status(400);
    }
    try {
        await prisma.equipment_Categories.delete({
            where: {
                categoryId: id,
            },
        });
        res.json({ message: "Equipment Category deleted" });
    } catch (error) {
        res.json({ error: error.message }).status(500);
    }
}