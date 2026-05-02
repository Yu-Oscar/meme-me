import Headings from "@/components/Headings";
import NewestTemplates from "@/features/templates/components/NewestTemplates";
import HeroCarousel from "@/features/templates/components/HeroCarousel";
import { getCarouselTemplates } from "@/features/templates/queries/get-carousel-templates";
export default async function Home() {
  const homeCarouselTemplates = await getCarouselTemplates();
  return (
    <>
        <HeroCarousel templates={homeCarouselTemplates} />
        <div className="flex flex-col flex-1 bg-popover w-[80%] mx-auto">
            <Headings title="熱門主題" subtitle="即時" />
                <Headings title="熱門標籤" />
                <Headings title="最近更新" />
                <NewestTemplates />
        </div>
    </>
  );
}
