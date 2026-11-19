import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { FavoritesHydrator } from "@/components/FavoritesHydrator";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { MAIN_CONTENT_ID, SkipLink } from "@/components/SkipLink";
import { SHARED_OPEN_GRAPH, SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/siteMetadata";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    ...SHARED_OPEN_GRAPH,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistSans.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col font-sans">
        <SkipLink />
        <SiteHeader />
        <main id={MAIN_CONTENT_ID} className="flex-1 scroll-mt-16">
          {children}
        </main>
        <SiteFooter />
        <FavoritesHydrator />
      </body>
    </html>
  );
}
