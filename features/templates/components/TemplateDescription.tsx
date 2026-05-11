import { templates } from "@/app/generated/prisma/client";
import Link from "next/link";
import Bookmark from "@/features/bookmarks/components/Bookmark";
import { user } from "@/app/generated/prisma/client";
import { MemeEditorDownloadAction } from "@/features/templates/components/MemeEditor";

type TemplateDescriptionProps = {
    template: templates & { user: { username: string } };
    isBookmarked: boolean;
}

export default function TemplateDescription({ template, isBookmarked }: TemplateDescriptionProps) {
    return (
      <div className="flex flex-row justify-between gap-2">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold">{template.name}</h1>
          <Link
            href={`/profile/${template.userId}`}
            className="w-max text-sm text-muted-foreground  transition-colors"
          >
            from{" "}
            <span className="hover:text-foreground hover:underline">
              {template.user.username}
            </span>
          </Link>
          <div className="flex flex-row gap-2 ">
            {template.tags.map((tag) => (
              <Link href={`/search?search=${tag}`} key={tag}>
                <p className="text-sm sm:text-base font-semibold truncate group-hover:text-primary-400 transition-colors">
                  <span className="text-primary">#</span>
                  {tag}
                </p>
              </Link>
            ))}
          </div>
        </div>
        <div className="flex flex-row items-center gap-1 self-start">
          <MemeEditorDownloadAction />
          <Bookmark
            id={template.id}
            isBookmarked={isBookmarked ?? false}
          />
        </div>
      </div>
    );
}