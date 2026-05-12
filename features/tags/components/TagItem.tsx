import Link from "next/link";
import { TagWithCount } from "../queries/get-tags";
interface TagItemProps {
    tag: TagWithCount
}
export default function TagItem({ tag }: TagItemProps) {
    return (
      <Link
        key={tag.tag}
        href={`/search?search=${encodeURIComponent(tag.tag)}`}
        className="group block"
      >
        <div className="bg-neutral-700 hover:bg-neutral-600 border border-neutral-600 hover:border-primary-500 rounded-lg p-3 sm:p-4 transition-all">
          <div className="flex items-center justify-between gap-2">
            <div className="flex-1 min-w-0">
              <p className="text-sm sm:text-base text-zinc-100 font-semibold truncate group-hover:text-primary-400 transition-colors">
                <span className="text-primary">#</span>
                {tag.tag}
              </p>
            </div>
            <div className="shrink-0">
              <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-semibold bg-neutral-600 group-hover:bg-neutral-700 text-zinc-300 rounded-full transition-colors">
                {tag.templateCount}
              </span>
            </div>
          </div>
        </div>
      </Link>
    );
}