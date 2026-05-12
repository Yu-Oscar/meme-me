import type { Metadata } from "next";
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
import {
  BreadcrumbListJsonLd,
  CreativeWorkJsonLd,
} from "@/components/JsonLd";
import { SITE_NAME, SITE_OG_IMAGE, SITE_URL } from "@/lib/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const { template } = await getTemplate(id);
  if (!template) {
    return { title: `找不到模板 | ${SITE_NAME}` };
  }

  const canonical = `/template/${template.slug}`;
  const title = `${template.name} | ${SITE_NAME}`;
  const tagsText =
    template.tags.length > 0 ? `標籤：${template.tags.join("、")}。` : "";
  const description = `MemeMe梗圖：${template.name}。${tagsText}入嚟睇下，仲可以自己整一張Meme出嚟分享。`;

  const usesOwnImage =
    template.media_type === "image" && Boolean(template.media_url);
  const ogImage = usesOwnImage ? template.media_url! : SITE_OG_IMAGE;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}${canonical}`,
      siteName: SITE_NAME,
      type: "article",
      images: [
        {
          url: ogImage,
          alt: template.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

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

  const canonicalUrl = `${SITE_URL}/template/${template.slug}`;
  const jsonLd = (
    <>
      <CreativeWorkJsonLd
        name={template.name}
        url={canonicalUrl}
        image={template.media_url ?? undefined}
        dateCreated={
          template.created_at ? template.created_at.toISOString() : undefined
        }
        creator={
          template.user?.username
            ? { name: template.user.username }
            : undefined
        }
        keywords={template.tags}
      />
      <BreadcrumbListJsonLd
        items={[
          { name: "首頁", url: SITE_URL },
          { name: template.name, url: canonicalUrl },
        ]}
      />
    </>
  );

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
        {jsonLd}
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
    <>
      {jsonLd}
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
    </>
  );
}
