import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { FavoritesHydrator } from "@/components/FavoritesHydrator";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { MAIN_CONTENT_ID, SkipLink } from "@/components/SkipLink";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "CineVerse",
    template: "%s | CineVerse",
  },
  description: "Discover popular and trending movies, powered by TMDB.",
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
