import type { Metadata } from "next";
import { Newsreader, Manrope } from "next/font/google";
import "./globals.css";

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

// Resolve the canonical site URL for absolute metadata (OG/Twitter image URLs).
// Order: explicit env override → Vercel's stable production domain →
// per-deployment Vercel URL → localhost dev fallback.
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "SEN | Student Entrepreneurs Network",
  description: "A global network of student builders. Born in San Diego.",
  openGraph: {
    type: "website",
    url: "/",
    siteName: "SEN",
    title: "SEN | Student Entrepreneurs Network",
    description: "A global network of student builders. Born in San Diego.",
  },
  twitter: {
    card: "summary_large_image",
    title: "SEN | Student Entrepreneurs Network",
    description: "A global network of student builders. Born in San Diego.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${newsreader.variable} ${manrope.variable} h-full`}
    >
      <body className="min-h-full">
        <div className="grain" aria-hidden />
        {children}
      </body>
    </html>
  );
}
