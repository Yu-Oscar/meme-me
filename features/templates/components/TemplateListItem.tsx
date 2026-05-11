import type { templates } from "@/app/generated/prisma/client";
import Link from "next/link";
import { EyeIcon } from "lucide-react";
import Bookmark from "@/features/bookmarks/components/Bookmark";
import { cn } from "@/lib/utils";
import TemplateMediaThumb from "@/features/templates/components/TemplateMediaThumb";

type TemplateListItemProps = {
  template: templates;
  isBookmarked?: boolean;
}

export default function TemplateListItem({ template, isBookmarked = false }: TemplateListItemProps) {
    return (
      <div key={template.id} className="relative flex flex-col group">
        <Link href={`/template/${template.slug}`} className="relative">
          <div className="relative aspect-video rounded-lg overflow-hidden">
            <TemplateMediaThumb
              template={template}
              fill
              sizes="(min-width: 768px) 25vw, 50vw"
              className="object-cover"
            />
          </div>
        </Link>
        <Link href={`/template/${template.slug}`}>
          <h3
            className="text-neutral-100 font-semibold text-sm mt-1 group-hover:text-primary-400 transition-colors truncate"
            title={template.name}
          >
            {template.name}
          </h3>
        </Link>
        <span className="text-neutral-400 text-xs mt-0.5 flex items-center gap-1">
          <EyeIcon className="w-3.5 h-3.5" />
          {template.view_count?.toLocaleString() ?? 0}
        </span>
        <Bookmark
          id={template.id}
          isBookmarked={isBookmarked}
          className={cn(
            "absolute top-2 right-2 transition-opacity",
            isBookmarked ? "opacity-100" : "opacity-0 group-hover:opacity-100",
          )}
        />
      </div>
    );
}