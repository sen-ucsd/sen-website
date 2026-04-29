import Link from "next/link";
import { notFound } from "next/navigation";
import { CHAPTERS } from "@/data/chapters";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { SchoolStack } from "@/components/SchoolBadge";

export function generateStaticParams() {
  return CHAPTERS.map((c) => ({ slug: c.id }));
}

export default async function ChapterPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const chapter = CHAPTERS.find((c) => c.id === slug);
  if (!chapter) notFound();

  const isFounding = chapter.status === "founding";
  const statusLabel =
    chapter.status === "founding"
      ? "Founding Chapter"
      : chapter.status === "active"
        ? "Active"
        : chapter.status === "launching"
          ? "Launching Q3"
          : "Applications Open";

  return (
    <>
      <Navigation />
      <main className="pt-24 md:pt-32 pb-32 px-8 md:px-16 lg:px-24">
        <div className="max-w-[1240px] mx-auto">
          {/* Back link */}
          <Link
            href="/#network"
            className="inline-flex items-center gap-2 text-eyebrow mb-12 transition-colors"
            style={{ color: "rgba(240, 236, 228, 0.45)" }}
          >
            <span aria-hidden>←</span>
            <span>Back to the Network</span>
          </Link>

          <div className="grid lg:grid-cols-12 gap-12 lg:gap-20">
            <div className="lg:col-span-7">
              <span
                className="text-eyebrow block mb-6"
                style={{
                  color: isFounding
                    ? "rgba(232, 201, 122, 0.85)"
                    : "rgba(232, 201, 122, 0.55)",
                }}
              >
                {statusLabel}
              </span>
              <h1
                className="font-display text-cream"
                style={{
                  fontSize: "clamp(48px, 7vw, 110px)",
                  lineHeight: 0.98,
                  letterSpacing: "-0.02em",
                  fontWeight: 500,
                }}
              >
                {chapter.city}
              </h1>
              <p
                className="mt-4 text-[15px] tracking-[0.18em] uppercase"
                style={{ color: "rgba(240, 236, 228, 0.4)" }}
              >
                {chapter.country}
              </p>

              {/* School marks: full names with logo badges */}
              <div className="mt-8">
                <SchoolStack schools={chapter.schools} size="md" showNames />
              </div>

              <div
                className="mt-12 pt-12"
                style={{ borderTop: "1px solid rgba(30, 42, 69, 1)" }}
              >
                <p
                  className="text-[17px] leading-[1.75] max-w-2xl"
                  style={{ color: "rgba(240, 236, 228, 0.55)" }}
                >
                  {isFounding
                    ? "The first chapter, founded at UC San Diego. Where the model started, the rituals were set, and the first cohort of student builders met in person every week. Every chapter that comes after this one is built on what was learned here."
                    : chapter.status === "launching"
                      ? `The ${chapter.city} chapter is being chartered this quarter. The founding cohort is being assembled now from students who have shown they can ship. Inaugural events open on the standard rolling timeline.`
                      : `Student leads are currently submitting charter applications for ${chapter.city}. The application window is open. Reviews happen weekly.`}
                </p>
              </div>

              <div className="mt-16 flex flex-col sm:flex-row items-start sm:items-center gap-5">
                {isFounding ? (
                  <a
                    href="mailto:sen@ucsd.edu"
                    className="rounded-full px-8 py-4 font-display text-[15px] tracking-wide transition-all"
                    style={{
                      background: "#D4A843",
                      color: "#050816",
                      fontWeight: 500,
                    }}
                  >
                    Contact the Chapter
                  </a>
                ) : (
                  <Link
                    href="/apply"
                    className="rounded-full px-8 py-4 font-display text-[15px] tracking-wide transition-all"
                    style={{
                      background: "#D4A843",
                      color: "#050816",
                      fontWeight: 500,
                    }}
                  >
                    {chapter.status === "launching"
                      ? "Apply to the Cohort"
                      : "Help Start This Chapter"}
                  </Link>
                )}
                <Link
                  href="/#network"
                  className="font-display text-[15px] tracking-wide group inline-flex items-center gap-3"
                  style={{ color: "rgba(240, 236, 228, 0.55)" }}
                >
                  <span className="border-b border-transparent group-hover:border-[rgba(232,201,122,0.5)] transition-colors duration-300">
                    See other chapters
                  </span>
                  <span
                    aria-hidden
                    className="text-[rgba(232,201,122,0.7)] transition-transform duration-300 group-hover:translate-x-1"
                  >
                    →
                  </span>
                </Link>
              </div>
            </div>

            <aside className="lg:col-span-5">
              <div
                className="rounded-2xl p-9"
                style={{
                  background: "rgba(20, 27, 45, 0.5)",
                  border: isFounding
                    ? "1px solid rgba(212, 168, 67, 0.35)"
                    : "1px solid rgba(30, 42, 69, 1)",
                }}
              >
                <span
                  className="text-eyebrow block mb-6"
                  style={{ color: "rgba(232, 201, 122, 0.6)" }}
                >
                  Chapter Page
                </span>
                <p
                  className="text-[15px] leading-[1.75]"
                  style={{ color: "rgba(240, 236, 228, 0.55)" }}
                >
                  Full chapter pages with member profiles, upcoming events,
                  shipped projects, and the local founder cohort are coming
                  online as each chapter formally charters. Check back soon.
                </p>
                <div
                  className="mt-8 pt-6"
                  style={{ borderTop: "1px solid rgba(30, 42, 69, 1)" }}
                >
                  <p
                    className="text-eyebrow"
                    style={{ color: "rgba(240, 236, 228, 0.4)" }}
                  >
                    Status
                  </p>
                  <p
                    className="font-display text-[20px] mt-2"
                    style={{
                      color: isFounding ? "#E8C97A" : "#F0ECE4",
                      fontWeight: 500,
                    }}
                  >
                    {statusLabel}
                  </p>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
