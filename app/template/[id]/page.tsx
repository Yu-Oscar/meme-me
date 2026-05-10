import { notFound } from "next/navigation";
import { getTemplate } from "@/features/templates/queries/get-template";
import Image from "next/image";
import Link from "next/link";
import { getAuth } from "@/features/auth/queries/get-auth";
import { getTemplateBookmarked } from "@/features/bookmarks/queries/get-template-bookmarked";
import TemplateDescription from "@/features/templates/components/TemplateDescription";

export default async function TemplatePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const { template } = await getTemplate(id);
    if (!template) {
        return notFound();
    }
    const { user } = await getAuth();
    const isBookmarked = user ? await getTemplateBookmarked(template.id, user.id) : false;


    return (
      <div className="flex flex-1 flex-row gap-4 py-4">
        <div className="flex flex-col gap-4 w-[70%] px-24">
          <Image
            src={template.image_url ?? ""}
            alt={template.name}
            width={1000}
            height={1000}
            className="rounded-lg"
          />
          <TemplateDescription template={template} isBookmarked={isBookmarked ?? false} />
        </div>
        <div className="flex flex-col gap-4 w-[30%] mx-auto">other</div>
      </div>
    );
}