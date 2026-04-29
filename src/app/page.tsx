import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/Hero";
import { Vision } from "@/components/Vision";
import { Network } from "@/components/Network";
import { Programs } from "@/components/Programs";
import { StartChapter } from "@/components/StartChapter";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navigation />
      <main>
        <Hero />
        <Vision />
        <Network />
        <Programs />
        <StartChapter />
      </main>
      <Footer />
    </>
  );
}
