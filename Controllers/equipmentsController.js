import prisma from "../libs/prisma.js";
import vine from "@vinejs/vine";
import { equipmentValidator } from "../libs/vine.js";
import fs from "fs";

export const createEquipment = async (req, res) => {
    const { name, description, quantity_total, quantity_available, categoryId } = req.body;
    try {
        await equipmentValidator.validate(req.body);
    } catch (error) {
        return res.json({ error: error.message }).status(400);
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
        res.json({ message: "Equipment created" }).status(201);
    } catch (error) {
        res.json({ error: error.message }).status(500);
    }
}

export const getEquipments = async (req, res) => {
    const { sort, limit } = req.query;
    if (sort && sort !== "asc" && sort !== "desc") {
        return res.json({ error: "Invalid sort value" }).status(400);
    }
    if (limit && isNaN(limit)) {
        return res.json({ error: "Invalid limit value" }).status(400);
    }
    try {
        if (sort && limit) {
            const equipments = await prisma.equipment.findMany({
                orderBy: {
                    equipmentId: sort,
                },
                take: parseInt(limit),
            });
            res.json(equipments);
        } else {
            const equipments = await prisma.equipment.findMany();
            res.json(equipments);
        }
    } catch (error) {
        res.json({ error: error.message }).status(500);
    }
}

export const getEquipmentById = async (req, res) => {
    const { id } = req.params;
    if (!vine.helpers.isString(id)) {
        return res.json({ error: "Invalid equipment id" }).status(400);
    }
    try {
        let equipment = await prisma.equipment.findUnique({
            where: {
                equipmentId: id,
            },
        });
        console.log(equipment);
        //convert image to base64
        // const fileImage = fs.readFileSync(`uploads/${equipment.image}`);
        // const base64Image = new Buffer.from(fileImage).toString("base64");
        // equipment.image = base64Image;
        res.json(equipment);
    } catch (error) {
        res.json({ error: error.message }).status(500);
    }
}

export const updateEquipment = async (req, res) => {
    const { id } = req.params;
    const { name, description, image, quantity_total, quantity_available, categoryId } = req.body;
    if (!vine.helpers.isString(id)) {
        return res.json({ error: "Invalid equipment id" }).status(400);
    }
    try {
        await equipmentValidator.validate(req.body);
    } catch (error) {
        return res.json({ error: error.message }).status(400);
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
        res.json({ message: "Equipment updated" }).status(200);
    } catch (error) {
        res.json({ error: error.message }).status(500);
    }
}

export const deleteEquipment = async (req, res) => {
    const { id } = req.params;
    if (!vine.helpers.isString(id)) {
        return res.json({ error: "Invalid equipment id" }).status(400);
    }
    try {
        await prisma.equipment.delete({
            where: {
                equipmentId: id,
            },
        });
        res.json({ message: "Equipment deleted" }).status(200);
    } catch (error) {
        res.json({ error: error.message }).status(500);
    }
}