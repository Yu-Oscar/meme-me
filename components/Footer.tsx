import Link from "next/link";
import { FaThreads, FaInstagram } from "react-icons/fa6";
import { Button } from "@/components/ui/button";

const THREADS_URL = "https://www.threads.com/@meme.me.hk";
const INSTAGRAM_URL = "https://www.instagram.com/meme.me.hk";

export default function Footer() {
  return (
    <footer className="shrink-0 py-2 sm:py-6">
      <nav
        aria-label="Social links"
        className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-2 px-4 sm:px-30"
      >
        <Button asChild variant="ghost" size="icon-lg">
          <Link
            href={THREADS_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="MemeMe on Threads"
          >
            <FaThreads className="size-5" aria-hidden />
          </Link>
        </Button>
        <Button asChild variant="ghost" size="icon-lg">
          <Link
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="MemeMe on Instagram"
          >
            <FaInstagram className="size-5" aria-hidden />
          </Link>
        </Button>
      </nav>
      <nav
        aria-label="Site links"
        className="mx-auto mt-2 flex max-w-6xl flex-wrap items-center justify-center gap-4 px-4 text-xs text-neutral-400"
      >
        <Link href="/about" className="hover:text-neutral-100 transition-colors">
          關於我們
        </Link>
        <Link href="/contact" className="hover:text-neutral-100 transition-colors">
          聯絡我們
        </Link>
        <Link href="/privacy" className="hover:text-neutral-100 transition-colors">
          私隱政策
        </Link>
        <Link href="/terms" className="hover:text-neutral-100 transition-colors">
          使用條款
        </Link>
      </nav>
    </footer>
  );
}
