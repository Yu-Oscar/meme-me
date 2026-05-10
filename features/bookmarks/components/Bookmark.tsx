"use client";

import { LucideBookmark, LucideLoaderCircle } from "lucide-react";
import { useTransition } from "react";
import { addBookmark } from "../actions/add-bookmark";

type BookmarkProps = {
  id: string;
  isBookmarked: boolean;
}

export default function Bookmark({ id, isBookmarked }: BookmarkProps) {
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
      className="absolute top-2 right-2 cursor-pointer rounded p-0.5 hover:opacity-90 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-70"
    >
      {pending ? (
        <LucideLoaderCircle className="animate-spin text-primary" />
      ) : (
        <LucideBookmark
          className={isBookmarked ? "fill-primary text-primary" : "fill-transparent text-neutral-400"}
        />
      )}
    </button>
  );
}
