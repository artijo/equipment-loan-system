import prisma from "../libs/prisma.js";
import { equipmentCategoryValidator } from "../libs/vine.js";
import vine from "@vinejs/vine";

export const createEquipmentCategory = async (req, res) => {
    const { name, description } = req.body;
    try {
        await equipmentCategoryValidator.validate(req.body);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
    try {
        await prisma.equipment_Categories.create({
            data: {
                name,
                description,
            },
        });
        res.status(201).json({ message: "Equipment Category created" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const getEquipmentCategories = async (req, res) => {
    const { sort, limit } = req.query;
    if (sort && sort !== "asc" && sort !== "desc") {
        return res.status(400).json({ error: "Invalid sort value" });
    }
    if (limit && isNaN(limit)) {
        return res.status(400).json({ error: "Invalid limit value" });
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
        res.status(500).json({ error: error.message });
    }
}

export const getEquipmentCategoryById = async (req, res) => {
    const { id } = req.params;
    if (!vine.helpers.isString(id)) {
        return res.status(400).json({ error: "Invalid equipment category id" });
    }
    try {
        const equipmentCategory = await prisma.equipment_Categories.findUnique({
            where: {
                categoryId: id,
            },
        });
        res.status(200).json(equipmentCategory);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const updateEquipmentCategory = async (req, res) => {
    const { id } = req.params;
    const { name, description } = req.body;
    if (!vine.helpers.isString(id)) {
        return res.status(400).json({ error: "Invalid equipment category id" });
    }
    try {
        await equipmentCategoryValidator.validate(req.body);
    } catch (error) {
        return res.status(400).json({ error: error.message });
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
        res.status(500).json({ error: error.message });
    }
}

export const deleteEquipmentCategory = async (req, res) => {
    const { id } = req.params;
    if (!vine.helpers.isString(id)) {
        return res.status(400).json({ error: "Invalid equipment category id" });
    }
    try {
        await prisma.equipment_Categories.delete({
            where: {
                categoryId: id,
            },
        });
        res.json({ message: "Equipment Category deleted" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}