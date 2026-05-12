import { notFound } from "next/navigation";
import { getTemplate } from "@/features/templates/queries/get-template";
import { getRecommendedTemplatesByTagOverlap } from "@/features/templates/queries/get-recommended-templates-by-tag-overlap";
import { getAuth } from "@/features/auth/queries/get-auth";
import { getTemplateBookmarked } from "@/features/bookmarks/queries/get-template-bookmarked";
import { getBookmarkedTemplateIds } from "@/features/bookmarks/queries/get-bookmarked-template-ids";
import TemplateDescription from "@/features/templates/components/TemplateDescription";
import RecommendedItem from "@/features/templates/components/RecommendedItem";
import TemplateMediaThumb from "@/features/templates/components/TemplateMediaThumb";
import { recordTemplateVisit } from "@/features/templates/queries/record-template-visit";
import {
  MemeEditorProvider,
  MemeEditorSidebar,
  MemeEditorStage,
} from "@/features/templates/components/MemeEditor";
import { parseTemplateSettings } from "@/features/templates/utils/parse-template-settings";

export default async function TemplatePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { template } = await getTemplate(id);
  if (!template) {
    return notFound();
  }

  await recordTemplateVisit(template.id);
  const { user } = await getAuth();
  const [isBookmarked, recommended, bookmarkedTemplateIds] = await Promise.all([
    user ? getTemplateBookmarked(template.id, user.id) : Promise.resolve(false),
    getRecommendedTemplatesByTagOverlap(template.id, template.tags),
    user ? getBookmarkedTemplateIds(user.id) : Promise.resolve([] as string[]),
  ]);
  const bookmarkedSet = new Set(bookmarkedTemplateIds);

  const isVideoEditable =
    template.media_type === "gif" && Boolean(template.media_url);
  const isImageEditable =
    !isVideoEditable &&
    template.media_type === "image" &&
    Boolean(template.media_url);
  const initialSettings = parseTemplateSettings(template.settings);

  const recommendedSection =
    recommended.length > 0 ? (
      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-semibold text-neutral-100">相關推薦</h2>
        <div className="flex flex-col gap-2">
          {recommended.map((t) => (
            <RecommendedItem key={t.id} template={t} />
          ))}
        </div>
      </section>
    ) : null;

  if (isVideoEditable || isImageEditable) {
    const mediaKind = isVideoEditable ? "video" : "image";
    const mediaUrl = template.media_url!;
    return (
      <MemeEditorProvider
        mediaKind={mediaKind}
        mediaUrl={mediaUrl}
        templateName={template.name}
        initialSettings={initialSettings}
      >
        <div className="container px-4 mx-auto flex flex-1 flex-col gap-4 py-4 md:flex-row">
          <div className="flex w-full flex-col gap-4 md:w-[70%]">
            <MemeEditorStage
              imageAlt={template.name}
              className="mx-auto max-w-xl"
            />
            <TemplateDescription
              template={template}
              isBookmarked={isBookmarked ?? false}
            />
          </div>
          <div className="flex w-full shrink-0 flex-col gap-6 md:w-[30%]">
            <MemeEditorSidebar />
            {recommendedSection}
          </div>
        </div>
      </MemeEditorProvider>
    );
  }

  return (
    <div className="container mx-auto flex flex-1 flex-col gap-4 py-4 md:flex-row">
      <div className="flex w-full flex-col gap-4 md:w-[70%]">
        <TemplateMediaThumb
          template={template}
          width={1000}
          height={1000}
          className="rounded-lg"
        />
        <TemplateDescription
          template={template}
          isBookmarked={isBookmarked ?? false}
        />
      </div>
      <div className="flex w-full shrink-0 flex-col gap-6 md:w-[30%]">
        {recommendedSection}
      </div>
    </div>
  );
}
