"use client";

import { useState, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import LoadingScreen from "@/components/LoadingScreen";
import StarField from "@/components/StarField";
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Programs from "@/components/Programs";
import Summit from "@/components/Summit";
import Community from "@/components/Community";
import Join from "@/components/Join";
import Footer from "@/components/Footer";

export default function Home() {
  const [loading, setLoading] = useState(true);

  const handleLoadingComplete = useCallback(() => {
    setLoading(false);
  }, []);

  return (
    <>
      <AnimatePresence>
        {loading && <LoadingScreen onComplete={handleLoadingComplete} />}
      </AnimatePresence>

      {!loading && (
        <>
          <StarField />
          <Navigation />
          <main className="relative z-10">
            <Hero />
            <div className="section-line" />
            <About />
            <div className="section-line" />
            <Programs />
            <div className="section-line" />
            <Summit />
            <div className="section-line" />
            <Community />
            <div className="section-line" />
            <Join />
          </main>
          <Footer />
        </>
      )}
    </>
  );
}
