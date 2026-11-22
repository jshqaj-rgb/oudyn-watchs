import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { StoreProvider } from "@/components/store/StoreProvider";
import { CartDrawer } from "@/components/store/CartDrawer";
import { SITE } from "@/lib/site";

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
  alternates: {
    types: {
      "text/plain": "/llms.txt",
    },
  },
};

const siteSchema = [
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE.brand,
    url: "https://www.oudyn.com/",
    email: SITE.email,
    description:
      "Independent reseller of pre-owned luxury watches in Hong Kong and Guangzhou. Every watch is inspected for authenticity before listing.",
    areaServed: ["Hong Kong", "Guangzhou"],
    knowsAbout: ["Pre-owned luxury watches", "Watch authentication", "Rolex references"],
  },
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE.brand,
    url: "https://www.oudyn.com/",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://www.oudyn.com/watches?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteSchema) }}
        />
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
          <div>{children}</div>
          <Footer />
          <CartDrawer />
        </StoreProvider>
      </body>
    </html>
  );
}
