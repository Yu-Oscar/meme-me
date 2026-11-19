import Headings from "@/components/Headings";
import TemplateList from "@/features/templates/components/TemplateList";
import { getAuthOrRedirect } from "@/features/auth/queries/get-auth-or-redirect";
import { getBookmarkedTemplates } from "@/features/bookmarks/queries/get-bookmarked-templates";

export default async function BookmarksPage() {
  const user = await getAuthOrRedirect();
  const templates = await getBookmarkedTemplates(user.id);
  const bookmarkedTemplateIds = templates.map((t) => t.id);

  return (
    <div className="container mx-auto px-4 sm:px-20 py-8">
      <Headings title="我的收藏" />

      {templates.length === 0 ? (
        <p className="text-muted-foreground mt-6">
          尚無收藏模板
        </p>
      ) : (
        <div className="mt-6">
          <TemplateList
            templates={templates}
            bookmarkedTemplateIds={bookmarkedTemplateIds}
          />
        </div>
      )}
    </div>
  );
}