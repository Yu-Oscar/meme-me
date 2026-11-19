import type { Metadata } from "next";
import Link from "next/link";
import Headings from "@/components/Headings";
import { SITE_NAME } from "@/lib/site";

const LAST_UPDATED = "2026-11-19";

export const metadata: Metadata = {
  title: `使用條款 | ${SITE_NAME}`,
  description: `使用 ${SITE_NAME} 的條款及細則，包括用戶內容、版權及免責聲明。`,
  alternates: { canonical: "/terms" },
  robots: { index: true, follow: true },
};

const linkClass = "text-primary-400 underline-offset-2 hover:underline";

export default function TermsPage() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      <Headings title="使用條款" subtitle={`最後更新：${LAST_UPDATED}`} />

      <article className="flex flex-col gap-6 text-sm leading-relaxed text-neutral-300">
        <p>
          歡迎使用 {SITE_NAME}。瀏覽或使用本網站即表示你同意以下條款。如果你不同意，請停止使用本網站。
        </p>

        <Section title="1. 服務內容">
          <p>
            {SITE_NAME} 提供 meme
            模板瀏覽、搜尋、收藏及線上編輯功能。我們保留隨時修改、暫停或終止任何功能的權利，毋須事先通知。
          </p>
        </Section>

        <Section title="2. 帳戶">
          <ul className="list-disc space-y-1 pl-5">
            <li>你必須年滿 13 歲方可註冊帳戶。</li>
            <li>你有責任妥善保管登入資料，並對帳戶下的所有活動負責。</li>
            <li>如發現帳戶遭盜用，請立即與我們聯絡。</li>
          </ul>
        </Section>

        <Section title="3. 用戶內容">
          <p>
            你上載的圖片、GIF、文字及其他內容（以下簡稱「用戶內容」）的版權仍屬於你或原權利人。上載內容即表示你授予我們一項非專屬、免版稅、全球性的許可，允許我們在本網站及相關推廣渠道儲存、展示、縮放及分發該內容。
          </p>
          <p>你保證你上載的內容：</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>由你擁有相關權利，或已獲授權使用；</li>
            <li>不會侵犯任何第三方的版權、商標、私隱或其他權利；</li>
            <li>不包含色情、暴力、仇恨、誹謗、騷擾、違法或其他令人反感的內容；</li>
            <li>不包含惡意程式或垃圾訊息。</li>
          </ul>
          <p>
            我們有權在毋須通知的情況下移除任何違反本條款的內容，並暫停或終止相關帳戶。
          </p>
        </Section>

        <Section title="4. 版權投訴">
          <p>
            如果你認為本網站上的內容侵犯了你的版權，請透過第 9
            節所述的聯絡方式通知我們，並提供相關作品、侵權內容連結及你的聯絡資料。我們會盡快處理。
          </p>
        </Section>

        <Section title="5. 禁止行為">
          <ul className="list-disc space-y-1 pl-5">
            <li>以自動化方式大量擷取、下載或複製本網站內容；</li>
            <li>嘗試干擾或破壞網站運作、伺服器或安全措施；</li>
            <li>冒充他人或虛假陳述與他人的關係；</li>
            <li>以任何方式點擊或干擾廣告以產生虛假流量。</li>
          </ul>
        </Section>

        <Section title="6. 廣告">
          <p>
            本網站透過第三方廣告服務（包括 Google
            AdSense）展示廣告以支持營運。廣告內容由第三方提供，我們對其準確性或相關產品及服務概不負責。詳情請參閱{" "}
            <Link href="/privacy" className={linkClass}>
              私隱政策
            </Link>
            。
          </p>
        </Section>

        <Section title="7. 免責聲明">
          <p>
            本網站按「現狀」提供，不作任何明示或暗示的保證。模板內容大多源自網絡流行文化，我們不保證其準確性或合法性。你使用本網站或由此產生的任何內容，風險自負。
          </p>
        </Section>

        <Section title="8. 責任限制">
          <p>
            在法律允許的最大範圍內，{SITE_NAME}{" "}
            及其營運者對任何因使用或無法使用本網站而引致的直接、間接、附帶或衍生損失概不負責。
          </p>
        </Section>

        <Section title="9. 聯絡我們">
          <p>
            如有任何查詢，請透過{" "}
            <a
              href="https://www.instagram.com/meme.me.hk"
              target="_blank"
              rel="noopener noreferrer"
              className={linkClass}
            >
              Instagram
            </a>{" "}
            或{" "}
            <a
              href="https://www.threads.com/@meme.me.hk"
              target="_blank"
              rel="noopener noreferrer"
              className={linkClass}
            >
              Threads
            </a>{" "}
            與我們聯絡。
          </p>
        </Section>

        <Section title="10. 條款更新及適用法律">
          <p>
            我們可能不時更新本條款，更新後會在本頁頂部註明日期。本條款受香港特別行政區法律管轄。
          </p>
        </Section>
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
