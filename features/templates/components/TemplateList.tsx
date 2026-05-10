import { templates } from "@/app/generated/prisma/client";
import TemplateCard from "./TemplateCard";

interface TemplateListProps {
    templates: templates[];
    bookmarkedTemplateIds?: string[];
}

export default function TemplateList({templates, bookmarkedTemplateIds = []}: TemplateListProps) {
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