import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { StoreProvider } from "@/components/store/StoreProvider";
import { CartDrawer } from "@/components/store/CartDrawer";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.oudyn.com"),
  title: {
    default: "OUDYN WATCHS — Pre-owned watches, Hong Kong & Guangzhou",
    template: "%s — OUDYN WATCHS",
  },
  description:
    "Independent reseller of pre-owned watches in Hong Kong and Guangzhou. One example at a time, described with the facts we can verify.",
  openGraph: {
    title: "OUDYN WATCHS",
    description: "Independent pre-owned watch reseller in Hong Kong and Guangzhou.",
    images: [{ url: "/images/rolex/rolex-dark.jpg", width: 1800, height: 1200 }],
    type: "website",
  },
  icons: {
    icon: "/icon.svg",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {/*
          OUDYN WATCHS — DIRECTION CONTRACT
          THESIS: A pre-owned watch is bought on evidence, not atmosphere. Photography carries the object; the interface carries the proof.
          OWN-WORLD: Six greys + lume dot; Helvetica Neue body, JetBrains Mono data; full-bleed photography, white pill navigation, 1px rules, 4px panels.
          STORY: See the watch described as it is, with condition and set contents stated.
          FIRST VIEWPORT: A Rolex atmosphere photograph, a plain dealer statement and a white studio card; no invented manufacture.
          FORM: Reference-led UNIMATIC grammar adapted to a Hong Kong dealer. Evidence over ornament.
          FINISH: Photos are placeholders until the studio shoot; every reference carries condition, year and set contents.
        */}
        <StoreProvider>
          <a className="skipLink" href="#main">
            Skip to content
          </a>
          <Header />
          <div id="main">{children}</div>
          <Footer />
          <CartDrawer />
        </StoreProvider>
      </body>
    </html>
  );
}
