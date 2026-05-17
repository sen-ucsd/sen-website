import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { ClaudeWorkshopHero } from "@/components/ClaudeWorkshopHero";
import { ClaudeWorkshopBody } from "@/components/ClaudeWorkshopBody";

export const metadata = {
  title: "Build with Claude · Workshop | SEN",
  description:
    "A hands-on Claude workshop for UCSD students. Tuesday, May 19th, 4–5 PM at the Climate Action Lab. Reserve your spot.",
};

export default function ClaudeWorkshopPage() {
  return (
    <>
      <Navigation />
      <main>
        <ClaudeWorkshopHero />
        <ClaudeWorkshopBody />
      </main>
      <Footer />
    </>
  );
}
