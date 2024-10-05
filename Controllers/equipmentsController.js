import prisma from "../libs/prisma.js";
import vine from "@vinejs/vine";
import { equipmentValidator } from "../libs/vine.js";

export const createEquipment = async (req, res) => {
    console.log(req.body);
    const { name, description, quantity_total, quantity_available, categoryId } = req.body;
    try {
        await equipmentValidator.validate(req.body);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
    try {
        await prisma.equipment.create({
            data: {
                name,
                description,
                image: req.file.filename,
                quantity_total: parseInt(quantity_total),
                quantity_available: parseInt(quantity_available),
                categoryId,
            },
        });
        res.status(201).json({ message: "Equipment created" });
    } catch (error) {
        res.json({ error: error.message }).status(500);
    }
}

export const getEquipments = async (req, res) => {
    const { sort, limit } = req.query;
    if (sort && sort !== "asc" && sort !== "desc") {
        return res.status(400).json({ error: "Invalid sort value" });
    }
    if (limit && isNaN(limit)) {
        return res.status(400).json({ error: "Invalid limit value" });
    }
    try {
        if (sort && limit) {
            const equipments = await prisma.equipment.findMany({
                orderBy: {
                    equipmentId: sort,
                },
                take: parseInt(limit),
                include: {
                    category: true,
                },
            });
            res.status(200).json(equipments);
        } else {
            const equipments = await prisma.equipment.findMany(
                {
                    include: {
                        category: true,
                    },
                }
            );
            res.status(200).json(equipments);
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const getEquipmentById = async (req, res) => {
    const { id } = req.params;
    if (!vine.helpers.isString(id)) {
        return res.status(400).json({ error: "Invalid equipment id" });
    }
    try {
        let equipment = await prisma.equipment.findUnique({
            where: {
                equipmentId: id,
            },
        });
        //convert image to base64
        // const fileImage = fs.readFileSync(`uploads/${equipment.image}`);
        // const base64Image = new Buffer.from(fileImage).toString("base64");
        // equipment.image = base64Image;
        res.status(200).json(equipment);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const updateEquipment = async (req, res) => {
    const { id } = req.params;
    const { name, description, image, quantity_total, quantity_available, categoryId } = req.body;
    if (!vine.helpers.isString(id)) {
        return res.status(400).json({ error: "Invalid equipment id" });
    }
    try {
        await equipmentValidator.validate(req.body);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
    try {
        await prisma.equipment.update({
            where: {
                equipmentId: id,
            },
            data: {
                name,
                description,
                image: req.file.filename,
                quantity_total: parseInt(quantity_total),
                quantity_available: parseInt(quantity_available),
                categoryId,
            },
        });
        res.status(200).json({ message: "Equipment updated" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const deleteEquipment = async (req, res) => {
    const { id } = req.params;
    if (!vine.helpers.isString(id)) {
        return res.status(400).json({ error: "Invalid equipment id" });
    }
    try {
        await prisma.equipment.delete({
            where: {
                equipmentId: id,
            },
        });
        res.status(200).json({ message: "Equipment deleted" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}