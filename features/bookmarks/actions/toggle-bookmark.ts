"use server";

import { getAuthOrRedirect } from "@/features/auth/queries/get-auth-or-redirect";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";


export async function addBookmark(
    templateId: string,
) {
    const user = await getAuthOrRedirect();
    console.log("Adding bookmark", user.id, templateId);
    try {
        const existingBookmark = await prisma.bookmark.findUnique({
            where: {
                userId_templateId: {
                    userId: user.id,
                    templateId,
                },
            },
        });

        if (existingBookmark) {
            await prisma.bookmark.delete({
                where: {
                    userId_templateId: {
                        userId: user.id,
                        templateId,
                    },
                },
            });
            console.log("Bookmark deleted");
        }
        else {
            await prisma.bookmark.create({
                data: {
                    userId: user.id,
                    templateId,
                },
            });
            console.log("Bookmark added");
        }

        revalidatePath("/");
        revalidatePath("/popular");
        revalidatePath("/newest");
        revalidatePath("/search");
        revalidatePath("/profile/[id]", "page");
        revalidatePath("/bookmarks");
    } catch (error) {
        console.error("Error adding bookmark", error);
    }
}
