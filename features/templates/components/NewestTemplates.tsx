import type { templates } from "@/app/generated/prisma/client";
import TemplateCard from "./TemplateListItem";

interface NewestTemplatesProps {
  templates: templates[];
  bookmarkedTemplateIds?: string[];
}

export default function NewestTemplates({
  templates,
  bookmarkedTemplateIds = [],
}: NewestTemplatesProps) {
  const bookmarkedTemplateIdSet = new Set(bookmarkedTemplateIds);

  return (
    <div className="grid grid-cols-4 gap-4">
      {templates.map((template) => (
        <TemplateCard
          key={template.id}
          template={template}
          isBookmarked={bookmarkedTemplateIdSet.has(template.id)}
        />
      ))}
    </div>
  );
}
