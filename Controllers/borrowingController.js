import prisma from "../libs/prisma.js";
import vine from "@vinejs/vine";
import { borrowingValidator } from "../libs/vine.js";

export const createBorrowing = async (req, res) => {
    const { userId, equipmentId, quantity, returnDate } = req.body;
    try {
        await borrowingValidator.validate(req.body);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
    try {
        const equipment = await prisma.equipment.findUnique({
            where: {
                equipmentId,
            },
        });
        // Check if equipment is available
        if (equipment.quantity_available < parseInt(quantity)) {
            return res.status(400).json({ error: "Equipment not available" });
        }
        //chec status of equipment
        if (equipment.status !== "AVAILABLE") {
            return res.status(400).json({ error: "Equipment not available" });
        }
        // Create borrowing
        await prisma.borrowings.create({
            data: {
                userId,
                equipmentId,
                quantity: parseInt(quantity),
                borrowDate: new Date(),
                returnDate: new Date(returnDate),
            },
        });
        // Update equipment quantity
        await prisma.equipment.update({
            where: {
                equipmentId,
            },
            data: {
                quantity_available: equipment.quantity_available - parseInt(quantity),
            },
        });
        res.status(201).json({ message: "Borrowing created" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const approveBorrowing = async (req, res) => {
    const { id } = req.params;
    if (!vine.helpers.isString(id)) {
        return res.status(400).json({ error: "Invalid borrowing id" });
    }
    try {
        await prisma.borrowings.update({
            where: {
                borrowingId: id,
            },
            data: {
                status: "APPROVED",
            },
        });
        res.status(200).json({ message: "Borrowing approved" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const getBorrowings = async (req, res) => {
    const { sort, limit } = req.query;
    if (sort && sort !== "asc" && sort !== "desc") {
        return res.status(400).json({ error: "Invalid sort value" });
    }
    if (limit && isNaN(limit)) {
        return res.status(400).json({ error: "Invalid limit value" });
    }
    try {
        if (sort && limit) {
            const borrowings = await prisma.borrowings.findMany({
                orderBy: {
                    borrowingId: sort,
                },
                take: parseInt(limit),
            });
            res.status(200).json(borrowings);
        } else {
            const borrowings = await prisma.borrowings.findMany();
            res.status(200).json(borrowings);
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const getBorrowingById = async (req, res) => {
    const { id } = req.params;
    if (!vine.helpers.isString(id)) {
        return res.status(400).json({ error: "Invalid borrowing id" });
    }
    try {
        const borrowing = await prisma.borrowings.findUnique({
            where: {
                borrowingId: id,
            },
        });
        res.status(200).json(borrowing);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const getBorrowingsByUserId = async (req, res) => {
    const { userId } = req.params;
    if (!vine.helpers.isString(userId)) {
        return res.status(400).json({ error: "Invalid user id" });
    }
    try {
        const borrowings = await prisma.borrowings.findMany({
            where: {
                userId,
            },
        });
        res.status(200).json(borrowings);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const getBorrowingsByEquipmentId = async (req, res) => {
    const { equipmentId } = req.params;
    if (!vine.helpers.isString(equipmentId)) {
        return res.status(400).json({ error: "Invalid equipment id" });
    }
    try {
        const borrowings = await prisma.borrowings.findMany({
            where: {
                equipmentId,
            },
        });
        res.status(200).json(borrowings);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const returnBorrowing = async (req, res) => {
    const { id } = req.params;
    let { status } = req.body;
    if (!vine.helpers.isString(id)) {
        return res.status(400).json({ error: "Invalid borrowing id" });
    }
    try {
        //check return date
        const borrowing = await prisma.borrowings.findUnique({
            where: {
                borrowingId: id,
            },
        });
        if (borrowing.returnDate < new Date()) {
            status = "OVERDUE";
        }
        if(status){
            await prisma.borrowings.update({
                where: {
                    borrowingId: id,
                },
                data: {
                    status,
                },
            });
        }else{
            await prisma.borrowings.update({
                where: {
                    borrowingId: id,
                },
                data: {
                    status: "RETURNED",
                },
            });
        }
        // Update equipment quantity
        const equipment = await prisma.equipment.findUnique({
            where: {
                equipmentId: borrowing.equipmentId,
            },
        });
        await prisma.equipment.update({
            where: {
                equipmentId: borrowing.equipmentId,
            },
            data: {
                quantity_available: equipment.quantity_available + borrowing.quantity,
            },
        });
        res.status(200).json({ message: "Borrowing returned" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const cancelBorrowing = async (req, res) => {
    const { id } = req.params;
    if (!vine.helpers.isString(id)) {
        return res.status(400).json({ error: "Invalid borrowing id" });
    }
    try {
        //check if borrowing is approved
        const borrowingStatus = await prisma.borrowings.findUnique({
            where: {
                borrowingId: id,
            },
            select: {
                status: true,
            },
        });
        if (borrowingStatus.status !== "PENDING") {
            return res.status(400).json({ error: "Cannot cancel approved borrowing" });
        }

        await prisma.borrowings.update({
            where: {
                borrowingId: id,
            },
            data: {
                status: "CANCELLED",
            },
        });
        //update quantity
        const borrowing = await prisma.borrowings.findUnique({
            where: {
                borrowingId: id,
            },
        });
        const equipment = await prisma.equipment.findUnique({
            where: {
                equipmentId: borrowing.equipmentId,
            },
        });
        await prisma.equipment.update({
            where: {
                equipmentId: borrowing.equipmentId,
            },
            data: {
                quantity_available: equipment.quantity_available + borrowing.quantity,
            },
        });
        res.status(200).json({ message: "Borrowing cancelled" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const updateBorrowing = async (req, res) => {
    const { id } = req.params;
    const { userId, equipmentId, quantity } = req.body;
    if (!vine.helpers.isString(id)) {
        return res.status(400).json({ error: "Invalid borrowing id" });
    }
    try {
        await borrowingValidator.validate(req.body);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
    try {
        await prisma.borrowings.update({
            where: {
                borrowingId: id,
            },
            data: {
                userId,
                equipmentId,
                quantity: parseInt(quantity),
                borrowDate,
                returnDate,
            },
        });
        res.status(200).json({ message: "Borrowing updated" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const deleteBorrowing = async (req, res) => {
    const { id } = req.params;
    if (!vine.helpers.isString(id)) {
        return res.status(400).json({ error: "Invalid borrowing id" });
    }
    try {
        await prisma.borrowings.delete({
            where: {
                borrowingId: id,
            },
        });
        res.status(200).json({ message: "Borrowing deleted" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}