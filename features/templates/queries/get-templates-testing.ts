import { prisma } from "@/lib/prisma";

export const getTemplatesTesting = async () => {
    const templates = await prisma.templates.findMany({
        take: 10,
        orderBy: {
            view_count: "desc"
        }
    });

    return templates;
};
