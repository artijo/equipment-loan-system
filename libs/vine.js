import vine from "@vinejs/vine";

export const userSchema = vine.object({
    name: vine.string(),
    email: vine.string().email(),
    telephone: vine.string().optional(),
    role: vine.string().optional(),
});
export const userValidator = vine.compile(userSchema);

export const equipmentCategorySchema = vine.object({
    name: vine.string(),
    description: vine.string().optional(),
});
export const equipmentCategoryValidator = vine.compile(equipmentCategorySchema);

export const equipmentSchema = vine.object({
    name: vine.string(),
    description: vine.string().optional(),
    image: vine.string().optional(),
    quantity_total: vine.number(),
    quantity_available: vine.number(),
    categoryId: vine.string(),
});
export const equipmentValidator = vine.compile(equipmentSchema);