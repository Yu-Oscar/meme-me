import type { Metadata } from "next";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import {
  SITE_URL,
  SITE_NAME,
  SITE_TITLE,
  SITE_DESCRIPTION,
  SITE_OG_IMAGE,
  SITE_LOGO,
} from "@/lib/site";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Toaster } from "@/components/ui/sonner";
import RedirectToast from "@/components/RedirectToast";
import {
  OrganizationJsonLd,
  WebSiteJsonLd,
} from "@/components/JsonLd";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    siteName: SITE_NAME,
    type: "website",
    images: [
      {
        url: SITE_OG_IMAGE,
        width: 721,
        height: 427,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [SITE_OG_IMAGE],
  },
};

const SITE_KEYWORDS = [
  "meme",
  "meme template",
  "meme templates",
  "meme generator",
  "meme maker",
  "meme creator",
  "梗圖",
  "梗圖模板",
  "迷因",
  "迷因模板",
  "迷因產生器",
  "梗圖製作",
  "香港meme",
  "香港梗圖",
  "香港迷因",
  "香港搞笑圖",
  "香港本土meme",
  "香港本土梗圖",
  "香港網絡文化",
  "港產文化",
  "港產幽默",
  "港產迷因",
  "港產梗圖",
  "港產meme",
  "本土梗圖",
  "本土迷因",
  "廣東話梗圖",
  "廣東話迷因",
  "港式幽默",
  "港式meme",
  "香港電影對白",
  "電影對白梗圖",
  "經典電影對白",
  "港產片對白",
  "周星馳對白",
  "周星馳梗圖",
  "古惑仔對白",
  "無間道對白",
  "王家衛對白",
  "香港潮語",
  "香港用語",
  "廣東話潮語",
  "網絡潮語",
  "香港打工meme",
  "香港生活meme",
  "搞笑梗圖",
  "熱門梗圖",
  "最新迷因",
  "經典迷因",
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-HK"
      className={cn(
        "h-full",
        "antialiased dark",
        geistSans.variable,
        geistMono.variable,
        "font-sans",
        inter.variable,
      )}
    >
      <body className="min-h-full flex flex-col bg-popover">
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-D1BPB4LCN8"
          strategy="afterInteractive"
        />
        <Script id="google-tag-manager" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-D1BPB4LCN8');
          `}
        </Script>
        <OrganizationJsonLd
          name={SITE_NAME}
          url={SITE_URL}
          logo={{
            "@type": "ImageObject",
            url: `${SITE_URL}${SITE_LOGO}`,
          }}
        />
        <WebSiteJsonLd
          name={SITE_TITLE}
          url={SITE_URL}
          description={SITE_DESCRIPTION}
          keywords={SITE_KEYWORDS}
        />
        <NuqsAdapter>
          <div className="flex min-h-dvh flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
            <Toaster expand />
          </div>
        </NuqsAdapter>
        <RedirectToast />
        <Analytics />
      </body>
    </html>
  );
}
