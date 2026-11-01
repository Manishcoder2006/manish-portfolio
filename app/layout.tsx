/*
  Free website template by 8B: https://8b.com/templates/onda/
  Source: https://github.com/8bsite/design-studio-website-template
  MIT License (code) https://8b.com/ · Photos: Unsplash License, see CREDITS.md · Fonts: Google Fonts (OFL)
  Ported to Next.js (App Router + Tailwind). Notes for people and AI agents: AGENTS.md.
*/
import type { Metadata } from "next";
import { Gabarito, Onest } from "next/font/google";
import "./globals.css";

// Both are variable fonts: Gabarito is animated from 400 to 800 in the contact title.
const gabarito = Gabarito({ subsets: ["latin"], variable: "--font-gabarito", display: "swap" });
const onest = Onest({ subsets: ["latin"], variable: "--font-onest", display: "swap" });

const title = "Manav Gupta — AI Engineer & Full-Stack Developer";
const description =
  "Portfolio of Manav Gupta — AI Engineer & Full-Stack Developer building intelligent, production-ready products across LLMs, RAG, scalable web and mobile applications.";

export const metadata: Metadata = {
  title,
  description,
  generator: "8B Templates",
  // No og:image yet (the template's was a placeholder URL), so the card is the small "summary" one.
  openGraph: { type: "website", title, description },
  twitter: { card: "summary" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${gabarito.variable} ${onest.variable}`}>
      <body className="m-text">{children}</body>
    </html>
  );
}
