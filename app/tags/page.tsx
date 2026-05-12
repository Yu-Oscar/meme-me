import type { Metadata } from "next";
import Headings from "@/components/Headings";
import TagItem from "@/features/tags/components/TagItem";
import { getTags } from "@/features/tags/queries/get-tags";
import Link from "next/link";
import { SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: `熱門標籤 | ${SITE_NAME}`,
  description: `瀏覽 ${SITE_NAME} 熱門meme template標籤，按主題搵到更多香港本土梗圖同迷因。`,
  alternates: { canonical: "/tags" },
  openGraph: {
    title: `熱門標籤 | ${SITE_NAME}`,
    description: `瀏覽 ${SITE_NAME} 熱門meme template標籤，按主題搵到更多香港本土梗圖同迷因。`,
    url: "/tags",
    siteName: SITE_NAME,
    type: "website",
  },
  twitter: {
    card: "summary",
    title: `熱門標籤 | ${SITE_NAME}`,
    description: `瀏覽 ${SITE_NAME} 熱門meme template標籤，按主題搵到更多香港本土梗圖同迷因。`,
  },
};

export default async function TestPage() {
    const tags = await getTags();
    
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-4">
          <Headings title="熱門標籤" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {tags.map((tag) => (
            <TagItem key={tag.tag} tag={tag} />
          ))}
        </div>
      </div>
    );
}