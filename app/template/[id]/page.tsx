import { notFound } from "next/navigation";
import { getTemplate } from "@/features/templates/queries/get-template";
import { getRecommendedTemplatesByTagOverlap } from "@/features/templates/queries/get-recommended-templates-by-tag-overlap";
import Image from "next/image";
import { getAuth } from "@/features/auth/queries/get-auth";
import { getTemplateBookmarked } from "@/features/bookmarks/queries/get-template-bookmarked";
import { getBookmarkedTemplateIds } from "@/features/bookmarks/queries/get-bookmarked-template-ids";
import TemplateDescription from "@/features/templates/components/TemplateDescription";
import RecommendedItem from "@/features/templates/components/RecommendedItem";

export default async function TemplatePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const { template } = await getTemplate(id);
    if (!template) {
        return notFound();
    }
    const { user } = await getAuth();
    const [isBookmarked, recommended, bookmarkedTemplateIds] = await Promise.all([
        user ? getTemplateBookmarked(template.id, user.id) : Promise.resolve(false),
        getRecommendedTemplatesByTagOverlap(template.id, template.tags),
        user ? getBookmarkedTemplateIds(user.id) : Promise.resolve([] as string[]),
    ]);
    const bookmarkedSet = new Set(bookmarkedTemplateIds);

    return (
      <div className="flex flex-1 flex-row gap-4 py-4 container mx-auto">
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
        <div className="flex w-[30%] flex-col gap-3 mx-auto shrink-0">
          <h2 className="text-neutral-100 font-semibold text-sm">相關推薦</h2>
          <div className="flex flex-col gap-4">
            {recommended.map((t) => (
              <RecommendedItem
                key={t.id}
                template={t}
              />
            ))}
          </div>
        </div>
      </div>
    );
}