import type { templates } from "@/app/generated/prisma/client";
import Image from "next/image";
import Link from "next/link";
import { EyeIcon } from "lucide-react";
import Bookmark from "@/features/bookmarks/components/Bookmark";

type TemplateCardProps = {
  template: templates;
  isBookmarked?: boolean;
}

export default function TemplateCard({ template, isBookmarked = false }: TemplateCardProps) {
    return (
      <div key={template.id} className="relative flex flex-col group">
        <Link href={`/template/${template.slug}`} className="relative">
          <div className="relative aspect-video rounded-lg overflow-hidden">
            <Image
              src={template.image_url ?? ""}
              alt={template.name}
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
        <Bookmark id={template.id} isBookmarked={isBookmarked} />
      </div>
    );
}