import { getHomeNewestTemplates } from "../queries/get-home-newest-templates";
import type { templates } from "@/app/generated/prisma/client";
import TemplateCard from "./TemplateCard";

interface NewestTemplatesProps {
    templates: templates[];
}

export default async function NewestTemplates({ templates }: NewestTemplatesProps) {
    return (
        <div className="grid grid-cols-4 gap-4">
            {templates.map((template) => (
                <TemplateCard key={template.id} template={template} />
                ))} 
            </div>
        );
    }