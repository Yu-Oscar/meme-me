import type { templates } from "@/app/generated/prisma/client";
import Link from "next/link";
import { EyeIcon } from "lucide-react";
import TemplateMediaThumb from "@/features/templates/components/TemplateMediaThumb";

type RecommendedItemProps = {
  template: templates;
};

export default function RecommendedItem({ template }: RecommendedItemProps) {
  return (
    <div className="group -mx-2 -my-1 flex flex-row gap-3 rounded-lg p-2 transition-colors hover:bg-neutral-800/40 cursor-pointer">
      <Link
        href={`/template/${template.slug}`}
        className="relative aspect-video w-36 shrink-0 overflow-hidden rounded-md ring-1 ring-transparent transition-[ring-color,box-shadow] group-hover:shadow-md group-hover:shadow-black/25 group-hover:ring-primary-400/40"
      >
        <TemplateMediaThumb
          template={template}
          fill
          sizes="144px"
          className="object-cover transition-transform duration-200 ease-out group-hover:scale-[1.04]"
        />
      </Link>
      <div className="flex min-w-0 flex-1 flex-col justify-start gap-0.5">
        <Link href={`/template/${template.slug}`}>
          <h3
            className="line-clamp-2 text-sm font-semibold leading-snug text-neutral-100 transition-colors group-hover:text-primary-400"
            title={template.name}
          >
            {template.name}
          </h3>
        </Link>
        <span className="flex items-center gap-1 text-xs text-neutral-400 transition-colors group-hover:text-neutral-300">
          <EyeIcon className="h-3.5 w-3.5 shrink-0 transition-colors group-hover:text-primary-400/90" />
          {template.view_count?.toLocaleString() ?? 0}
        </span>
      </div>
    </div>
  );
}
