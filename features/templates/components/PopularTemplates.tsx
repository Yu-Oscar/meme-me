import type { templates } from "@/app/generated/prisma/client";
import TemplateCard from "./TemplateListItem";
import PopularTemplatesCarousel from "./PopularTemplatesCarousel";

interface PopularTemplatesProps {
  templates: templates[];
  bookmarkedTemplateIds?: string[];
}

export default function PopularTemplates({
  templates,
  bookmarkedTemplateIds = [],
}: PopularTemplatesProps) {
  const bookmarkedTemplateIdSet = new Set(bookmarkedTemplateIds);

  return (
    <PopularTemplatesCarousel
      slides={templates.map((template) => ({
        id: template.id,
        content: (
          <TemplateCard
            template={template}
            isBookmarked={bookmarkedTemplateIdSet.has(template.id)}
          />
        ),
      }))}
    />
  );
}
