import Headings from "@/components/Headings";
import NewestTemplates from "@/features/templates/components/NewestTemplates";
import HeroCarousel from "@/features/templates/components/HeroCarousel";
import PopularTemplates from "@/features/templates/components/PopularTemplates";
import { getHomePopularTemplates } from "@/features/templates/queries/get-home-popular-templates";
import { getHomeNewestTemplates } from "@/features/templates/queries/get-home-newest-templates";
import { getTags } from "@/features/tags/queries/get-tags";
import TagList from "@/features/tags/components/TagList";
import { TagPath, NewestTemplatesPath, PopularTemplatesPath } from "@/utils/path";
import { getAuth } from "@/features/auth/queries/get-auth";
import { getBookmarkedTemplateIds } from "@/features/bookmarks/queries/get-bookmarked-template-ids";

export default async function Home() {
  const { user } = await getAuth();
  const [
    homePopularTemplates,
    newestTemplates,
    tags,
    bookmarkedTemplateIds,
  ] = await Promise.all([
    getHomePopularTemplates(),
    getHomeNewestTemplates(),
    getTags(),
    user ? getBookmarkedTemplateIds(user.id) : Promise.resolve([]),
  ]);

  const mainCarouselTemplates = homePopularTemplates.slice(0, 8);
  const popularCarouselTemplates = homePopularTemplates.slice(8, 20);
  const homeTags = tags.slice(0, 10);

  return (
    <>
      <HeroCarousel templates={mainCarouselTemplates} />
      <div className="flex flex-col flex-1 bg-popover w-[80%] mx-auto gap-y-2">
        <Headings
          title="熱門主題"
          subtitle="即時"
          href={PopularTemplatesPath()}
        />
        <PopularTemplates
          templates={popularCarouselTemplates}
          bookmarkedTemplateIds={bookmarkedTemplateIds}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
          <div className="col-span-1">
            <Headings title="熱門標籤" href={TagPath()} />
            <TagList tags={homeTags} />
          </div>
        </div>

        <Headings title="最近更新" href={NewestTemplatesPath()} />
        <NewestTemplates
          templates={newestTemplates}
          bookmarkedTemplateIds={bookmarkedTemplateIds}
        />
      </div>
    </>
  );
}
