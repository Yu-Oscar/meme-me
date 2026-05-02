import Image from "next/image";
import { getTemplatesTesting } from "@/features/templates/queries/get-templates-testing";

export default async function Home() {
  const templates = await getTemplatesTesting();
  return (
    <div className="flex flex-col flex-1 items-center justify-center">
        {templates.map((template) => (
            <div key={template.id}>
                template name: {template.name}
            </div>
        ))}
    </div>
  );
}
