import type { Metadata } from "next";
import Link from "next/link";
import Headings from "@/components/Headings";
import { SITE_NAME } from "@/lib/site";

const LAST_UPDATED = "2026-11-19";

export const metadata: Metadata = {
  title: `私隱政策 | ${SITE_NAME}`,
  description: `${SITE_NAME} 如何收集、使用及保護你的個人資料，包括 Cookie、分析工具及廣告。`,
  alternates: { canonical: "/privacy" },
  robots: { index: true, follow: true },
};

const linkClass = "text-primary-400 underline-offset-2 hover:underline";

export default function PrivacyPage() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      <Headings title="私隱政策" subtitle={`最後更新：${LAST_UPDATED}`} />

      <article className="flex flex-col gap-6 text-sm leading-relaxed text-neutral-300">
        <p>
          {SITE_NAME}（以下簡稱「我們」）重視你的私隱。本政策說明你使用本網站時，我們會收集哪些資料、如何使用，以及你可以作出的選擇。
        </p>

        <Section title="1. 我們收集的資料">
          <ul className="list-disc space-y-1 pl-5">
            <li>
              <strong className="text-neutral-100">帳戶資料：</strong>
              註冊時提供的用戶名稱、電郵地址及經加密處理的密碼。
            </li>
            <li>
              <strong className="text-neutral-100">你上載的內容：</strong>
              你上載的圖片、GIF、模板名稱、標籤及編輯設定。
            </li>
            <li>
              <strong className="text-neutral-100">使用紀錄：</strong>
              你瀏覽過的模板、收藏紀錄，以及用於維持登入狀態的 Session Cookie。
            </li>
            <li>
              <strong className="text-neutral-100">技術資料：</strong>
              IP 位址、瀏覽器類型、裝置資料及大致地區，由分析及廣告服務自動收集。
            </li>
          </ul>
        </Section>

        <Section title="2. 我們如何使用資料">
          <ul className="list-disc space-y-1 pl-5">
            <li>提供及維持網站功能，例如登入、收藏及模板推薦。</li>
            <li>統計熱門模板及瀏覽次數，以改善內容及推薦。</li>
            <li>展示廣告以支持網站營運（見第 4 節）。</li>
            <li>偵測濫用行為及保障網站安全。</li>
          </ul>
        </Section>

        <Section title="3. Cookie 及分析工具">
          <p>
            我們使用必要的 Cookie 以維持你的登入狀態。我們亦使用 Google Analytics 及
            Vercel Analytics 收集匿名化的流量統計，以了解網站的使用情況。你可以透過瀏覽器設定封鎖或刪除
            Cookie，但部分功能（例如登入）可能會受到影響。
          </p>
        </Section>

        <Section title="4. 廣告">
          <p>
            本網站使用 Google AdSense 展示廣告。Google 及其合作夥伴會使用 Cookie（包括
            DoubleClick Cookie），根據你在本網站及其他網站的瀏覽紀錄展示相關廣告。
          </p>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              你可以在{" "}
              <a
                href="https://www.google.com/settings/ads"
                target="_blank"
                rel="noopener noreferrer"
                className={linkClass}
              >
                Google 廣告設定
              </a>{" "}
              停用個人化廣告。
            </li>
            <li>
              你亦可以前往{" "}
              <a
                href="https://www.aboutads.info/choices/"
                target="_blank"
                rel="noopener noreferrer"
                className={linkClass}
              >
                aboutads.info
              </a>{" "}
              退出第三方供應商的個人化廣告 Cookie。
            </li>
            <li>
              有關 Google 如何使用資料，請參閱{" "}
              <a
                href="https://policies.google.com/technologies/partner-sites"
                target="_blank"
                rel="noopener noreferrer"
                className={linkClass}
              >
                Google 私隱權與條款
              </a>
              。
            </li>
          </ul>
          <p>
            如果你身處歐洲經濟區或英國，我們會在你首次瀏覽時顯示同意提示，你可以隨時更改選擇。
          </p>
        </Section>

        <Section title="5. 資料分享">
          <p>
            我們不會出售你的個人資料。我們只會在以下情況分享資料：向協助我們營運的服務供應商（例如雲端寄存、資料庫、分析及廣告服務）提供；為遵守法律要求；或為保障我們及用戶的權益。
          </p>
        </Section>

        <Section title="6. 資料保留及安全">
          <p>
            帳戶資料會保留至你刪除帳戶為止。密碼以業界標準演算法加密儲存。我們會採取合理措施保護資料，但任何網上傳輸或儲存方式均無法保證絕對安全。
          </p>
        </Section>

        <Section title="7. 你的權利">
          <p>
            你有權查閱、更正或刪除你的個人資料。如需行使上述權利，或對本政策有任何疑問，請透過我們的{" "}
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

        <Section title="8. 兒童">
          <p>本網站並非為 13 歲以下兒童而設，我們亦不會故意收集他們的個人資料。</p>
        </Section>

        <Section title="9. 政策更新">
          <p>
            我們可能不時更新本政策。更新後會在本頁頂部註明最後更新日期。繼續使用本網站即表示你接受更新後的政策。
          </p>
        </Section>

        <p className="text-neutral-400">
          另請參閱{" "}
          <Link href="/terms" className={linkClass}>
            使用條款
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
