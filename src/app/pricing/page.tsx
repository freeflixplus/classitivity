import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import PricingPageContent from "@/components/pricing/PricingPageContent";

export const metadata = {
  title: "Pricing — Classitivity",
  description: "Simple, transparent pricing. One class subscription includes complete lesson resources, weekly teacher training, and the full template library. No hidden fees.",
};

export default function PricingPage() {
  return (
    <>
      <Navbar />
      <main>
        <PricingPageContent />
      </main>
      <Footer />
    </>
  );
}
