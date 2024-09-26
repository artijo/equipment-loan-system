import prisma from "./libs/prisma.js";

//seed data
const seed = async () => {
  await prisma.user.create({
    data: {
        name: "ARTIJO",
        email: "a@artijo.com",
        telephone: "08123456789",
        role: "ADMIN",
      }
})
}


seed()