import { templates } from "@/app/generated/prisma/client";
import TemplateCard from "./TemplateCard";

interface TemplateListProps {
    templates: templates[];
}

export default async function TemplateList({templates}: TemplateListProps) {
    return (
        <div className="grid grid-cols-4 gap-4">
            {templates.map((template) => (
                <TemplateCard key={template.id} template={template} />
            ))}
        </div>
    );
}