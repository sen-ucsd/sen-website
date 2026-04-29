import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { ApplicationForm } from "@/components/ApplicationForm";

export const metadata = {
  title: "Apply | SEN",
  description:
    "Apply to start a chapter of the Student Entrepreneurs Network at your university.",
};

export default function ApplyPage() {
  return (
    <>
      <Navigation />
      <main className="pt-28 md:pt-36 pb-32 px-6 sm:px-8 md:px-16 lg:px-24">
        <div className="max-w-[1100px] mx-auto">
          {/* Header */}
          <div className="mb-16 md:mb-20">
            <span
              className="text-eyebrow block mb-7"
              style={{ color: "rgba(232, 201, 122, 0.65)" }}
            >
              Start a Chapter
            </span>
            <h1
              className="font-display text-cream"
              style={{
                fontSize: "clamp(40px, 6vw, 80px)",
                lineHeight: 1.0,
                letterSpacing: "-0.02em",
                fontWeight: 500,
              }}
            >
              The application.
            </h1>
            <p
              className="mt-7 max-w-xl text-[16px] md:text-[17px] leading-[1.7]"
              style={{ color: "rgba(240, 236, 228, 0.55)" }}
            >
              Short by design. Real answers matter more than long ones. Reviewed
              weekly. We reply within seven days.
            </p>
          </div>

          <div className="grid lg:grid-cols-12 gap-10 lg:gap-20 items-start">
            <aside className="lg:col-span-4 lg:sticky lg:top-32">
              <div
                className="rounded-2xl p-8"
                style={{
                  background: "rgba(20, 27, 45, 0.5)",
                  border: "1px solid rgba(30, 42, 69, 1)",
                }}
              >
                <span
                  className="text-eyebrow block mb-5"
                  style={{ color: "rgba(232, 201, 122, 0.6)" }}
                >
                  Who we are looking for
                </span>
                <ul className="space-y-4">
                  {[
                    "Students already building things on their campus",
                    "Curators who can convene other builders, not just attend events",
                    "People who would have started this without waiting for permission",
                    "Anyone serious about turning ambition into shipped work",
                  ].map((line) => (
                    <li key={line} className="flex gap-3 items-start">
                      <span
                        aria-hidden
                        className="mt-2 inline-block w-1 h-1 rounded-full shrink-0"
                        style={{
                          background: "#D4A843",
                          boxShadow: "0 0 8px rgba(212, 168, 67, 0.6)",
                        }}
                      />
                      <span
                        className="text-[14px] leading-[1.65]"
                        style={{ color: "rgba(240, 236, 228, 0.55)" }}
                      >
                        {line}
                      </span>
                    </li>
                  ))}
                </ul>
                <div
                  className="mt-8 pt-6"
                  style={{ borderTop: "1px solid rgba(30, 42, 69, 1)" }}
                >
                  <p
                    className="text-eyebrow mb-2"
                    style={{ color: "rgba(240, 236, 228, 0.4)" }}
                  >
                    Timeline
                  </p>
                  <p
                    className="text-[14px] leading-[1.65]"
                    style={{ color: "rgba(240, 236, 228, 0.6)" }}
                  >
                    Reply within seven days. If invited, two short
                    conversations. Charter follows.
                  </p>
                </div>
              </div>
            </aside>

            <div className="lg:col-span-8">
              <ApplicationForm />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
