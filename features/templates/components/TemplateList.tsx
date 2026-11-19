import { Fragment } from "react";
import { templates } from "@/app/generated/prisma/client";
import TemplateCard from "./TemplateListItem";
import AdSlot from "@/components/ads/AdSlot";
import {
  AD_SLOTS,
  ADSENSE_INFEED_LAYOUT_KEY,
  LIST_INFEED_EVERY,
  adsEnabled,
} from "@/lib/ads";

interface TemplateListProps {
  templates: templates[];
  bookmarkedTemplateIds?: string[];
  /** Set false on pages where ads must not appear (e.g. /bookmarks). */
  showAds?: boolean;
}

export default function TemplateList({
  templates,
  bookmarkedTemplateIds = [],
  showAds = true,
}: TemplateListProps) {
  const bookmarkedTemplateIdSet = new Set(bookmarkedTemplateIds);
  const inFeedEnabled = showAds && adsEnabled && Boolean(AD_SLOTS.listInFeed);

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {templates.map((template, index) => {
        const showAdAfter =
          inFeedEnabled &&
          (index + 1) % LIST_INFEED_EVERY === 0 &&
          index < templates.length - 1;
        return (
          <Fragment key={template.id}>
            <TemplateCard
              template={template}
              isBookmarked={bookmarkedTemplateIdSet.has(template.id)}
            />
            {showAdAfter && (
              <AdSlot
                slot={AD_SLOTS.listInFeed}
                format="fluid"
                layoutKey={ADSENSE_INFEED_LAYOUT_KEY}
                minHeight={0}
                className="aspect-video rounded-lg bg-neutral-900/40"
              />
            )}
          </Fragment>
        );
      })}
    </div>
  );
}
