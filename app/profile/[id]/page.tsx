import { getUserTemplates } from "@/features/templates/queries/get-user-templates";
import TemplateList from "@/features/templates/components/TemplateList";
import Headings from "@/components/Headings";

export default async function AccountProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const templates = await getUserTemplates(Number(id));
  return (
    <div className="container mx-auto px-20 py-8">
      <Headings title={`#${id} ${templates[0].user.username}`} />
      <TemplateList templates={templates} />
    </div>
  );
}