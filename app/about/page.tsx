import type { Metadata } from "next";
import Link from "next/link";
import Headings from "@/components/Headings";
import { SITE_NAME, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: `關於我們 | ${SITE_NAME}`,
  description: `認識 ${SITE_NAME}：香港本土 meme 模板集中地，提供瀏覽、搜尋、收藏及線上編輯功能。`,
  alternates: { canonical: "/about" },
  robots: { index: true, follow: true },
};

const linkClass = "text-primary-400 underline-offset-2 hover:underline";

export default function AboutPage() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      <Headings title="關於我們" subtitle={SITE_NAME} />

      <article className="flex flex-col gap-6 text-sm leading-relaxed text-neutral-300">
        <p>
          {SITE_NAME}（
          <a href={SITE_URL} className={linkClass}>
            mememe.hk
          </a>
          ）是一個專注香港本土網絡文化的 meme
          模板平台。我們希望把散落在社交媒體、電影對白、生活日常裏的梗圖素材集中起來，讓大家可以輕鬆搜尋、收藏，並即時製作成自己的
          meme。
        </p>

        <Section title="我們提供甚麼">
          <ul className="list-disc space-y-1 pl-5">
            <li>按熱門、最新及標籤瀏覽 meme 模板；</li>
            <li>線上編輯器，支援圖片與 GIF，方便加上文字後下載分享；</li>
            <li>帳戶登入後可收藏常用模板；</li>
            <li>社群上載，讓更多本土創作被看見。</li>
          </ul>
        </Section>

        <Section title="我們的理念">
          <p>
            香港有獨特的語言、電影文化與生活節奏，meme
            往往是最直接的表達方式。我們相信好的模板應該易找、易用、易分享，因此一直以內容質素、使用體驗及本地關聯性作為產品方向。
          </p>
        </Section>

        <Section title="內容與社群">
          <p>
            網站上的模板來自平台整理及用戶上載。我們鼓勵原創或獲授權的素材，並會按{" "}
            <Link href="/terms" className={linkClass}>
              使用條款
            </Link>{" "}
            處理侵權、不當或違規內容的舉報。如果你發現有問題的內容，歡迎透過{" "}
            <Link href="/contact" className={linkClass}>
              聯絡我們
            </Link>{" "}
            頁面通知我們。
          </p>
        </Section>

        <Section title="營運與透明">
          <p>
            {SITE_NAME}{" "}
            由獨立團隊營運，透過廣告等方式維持網站運作。我們重視用戶信任，因此公開{" "}
            <Link href="/privacy" className={linkClass}>
              私隱政策
            </Link>
            、使用條款、關於我們及聯絡方式，方便你了解本站如何運作。
          </p>
        </Section>

        <p className="text-neutral-400">
          有任何意見或合作查詢，請前往{" "}
          <Link href="/contact" className={linkClass}>
            聯絡我們
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
