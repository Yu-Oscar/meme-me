import { getHomeNewestTemplates } from "../queries/get-home-newest-templates";
import Image from "next/image";
import TemplateCard from "./TemplateCard";


export default async function NewestTemplates() {
    const templates = await getHomeNewestTemplates();

    return (
        <div className="grid grid-cols-4 gap-4">
            {templates.map((template) => (
                <TemplateCard key={template.id} template={template} />
            ))}
        </div>
    );
}