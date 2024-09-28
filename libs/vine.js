import vine from "@vinejs/vine";

export const userSchema = vine.object({
    name: vine.string(),
    email: vine.string().email(),
    telephone: vine.string().optional(),
    role: vine.string().optional(),
});
export const userValidator = vine.compile(userSchema);