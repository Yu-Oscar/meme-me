import Headings from "@/components/Headings";
import TagItem from "@/features/tags/components/TagItem";
import { getTags } from "@/features/tags/queries/get-tags";
import Link from "next/link";

export default async function TestPage() {
    const tags = await getTags();
    
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-4">
          <Headings title="熱門標籤" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {tags.map((tag) => (
            <TagItem key={tag.tag} tag={tag} />
          ))}
        </div>
      </div>
    );
}