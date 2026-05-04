import { prisma } from "@/lib/prisma";

export const getTemplate = async (id: string) => {
    const template = await prisma.templates.findUnique({
        where: {
            slug: id
        }
    });
    return template;
};

