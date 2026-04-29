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

export const metadata: Metadata = {
  title: "SEN | Student Entrepreneurs Network",
  description:
    "A global network of student builders. Born in San Diego.",
  icons: { icon: "/SEN_Logo_cropped.png" },
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
