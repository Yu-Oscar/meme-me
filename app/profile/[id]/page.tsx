import { getUserTemplates } from "@/features/templates/queries/get-user-templates";
import TemplateList from "@/features/templates/components/TemplateList";
import Headings from "@/components/Headings";
import { getAuth } from "@/features/auth/queries/get-auth";
import { getBookmarkedTemplateIds } from "@/features/bookmarks/queries/get-bookmarked-template-ids";

export default async function AccountProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { user } = await getAuth();
  const [templates, bookmarkedTemplateIds] = await Promise.all([
    getUserTemplates(Number(id)),
    user ? getBookmarkedTemplateIds(user.id) : Promise.resolve([]),
  ]);

  return (
    <div className="container mx-auto px-20 py-8">
      <Headings title={`#${id} ${templates[0].user.username}`} />
      <TemplateList
        templates={templates}
        bookmarkedTemplateIds={bookmarkedTemplateIds}
      />
    </div>
  );
}