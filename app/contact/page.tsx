import type { Metadata } from "next";
import Link from "next/link";
import Headings from "@/components/Headings";
import { SITE_NAME } from "@/lib/site";

const THREADS_URL = "https://www.threads.com/@meme.me.hk";
const INSTAGRAM_URL = "https://www.instagram.com/meme.me.hk";

export const metadata: Metadata = {
  title: `聯絡我們 | ${SITE_NAME}`,
  description: `聯絡 ${SITE_NAME}：版權投訴、內容舉報、合作查詢或一般意見，歡迎透過 Instagram 或 Threads 與我們聯絡。`,
  alternates: { canonical: "/contact" },
  robots: { index: true, follow: true },
};

const linkClass = "text-primary-400 underline-offset-2 hover:underline";

export default function ContactPage() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      <Headings title="聯絡我們" subtitle={SITE_NAME} />

      <article className="flex flex-col gap-6 text-sm leading-relaxed text-neutral-300">
        <p>
          感謝你使用 {SITE_NAME}
          。無論是內容舉報、版權投訴、功能建議或合作查詢，都歡迎與我們聯絡。我們會盡快回覆。
        </p>

        <Section title="聯絡方式">
          <ul className="list-disc space-y-2 pl-5">
            <li>
              Instagram：{" "}
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={linkClass}
              >
                @meme.me.hk
              </a>
            </li>
            <li>
              Threads：{" "}
              <a
                href={THREADS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={linkClass}
              >
                @meme.me.hk
              </a>
            </li>
          </ul>
          <p className="text-neutral-400">
            請在訊息中簡述事由，並盡量附上相關連結或截圖，方便我們跟進。
          </p>
        </Section>

        <Section title="版權及內容投訴">
          <p>
            如果你認為本站內容侵犯你的權利，或發現不當、違法或其他違規內容，請透過上述渠道聯絡我們，並提供：
          </p>
          <ul className="list-disc space-y-1 pl-5">
            <li>相關作品或權利說明；</li>
            <li>本站頁面連結；</li>
            <li>你的聯絡方法，以便我們回覆處理結果。</li>
          </ul>
          <p>
            更多說明請參閱{" "}
            <Link href="/terms" className={linkClass}>
              使用條款
            </Link>
            。
          </p>
        </Section>

        <Section title="一般查詢">
          <p>
            帳戶、功能使用、合作或其他問題，同樣可透過 Instagram 或 Threads
            傳送訊息。我們通常會在數個工作天內回覆。
          </p>
        </Section>

        <p className="text-neutral-400">
          想了解本站背景，可參閱{" "}
          <Link href="/about" className={linkClass}>
            關於我們
          </Link>
          ；有關資料收集與廣告，請見{" "}
          <Link href="/privacy" className={linkClass}>
            私隱政策
          </Link>
          。
        </p>
      </article>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-2">
      <h2 className="text-base font-semibold text-neutral-100">{title}</h2>
      {children}
    </section>
  );
}
