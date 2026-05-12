"use client";

import { LucideBookmark, LucideLoaderCircle } from "lucide-react";
import { useTransition } from "react";
import { addBookmark } from "../actions/toggle-bookmark";
import { cn } from "@/lib/utils";

type BookmarkProps = {
  id: string;
  isBookmarked: boolean;
  className?: string;
}

export default function Bookmark({ id, isBookmarked, className }: BookmarkProps) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
      disabled={pending}
      onClick={() => {
        startTransition(async () => {
          await addBookmark(id);
        });
      }}
      className={cn(
        "cursor-pointer rounded p-0.5 hover:opacity-90 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-70",
        className,
      )}
    >
      {pending ? (
        <LucideLoaderCircle className="animate-spin text-primary size-5" />
      ) : (
        <LucideBookmark
          className={cn(
            isBookmarked
              ? "fill-primary text-primary"
              : "fill-transparent text-neutral-400",
            "size-5",
          )}
        />
      )}
    </button>
  );
}
