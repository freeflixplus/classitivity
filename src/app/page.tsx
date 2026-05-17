import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/marketing/HeroSection";
import { StatsSection } from "@/components/marketing/StatsSection";
import { ProblemSection } from "@/components/marketing/ProblemSection";
import { SolutionSection } from "@/components/marketing/SolutionSection";
import { FeaturesSection } from "@/components/marketing/FeaturesSection";
import { CurriculumSection } from "@/components/marketing/CurriculumSection";
import { HowItWorksSection } from "@/components/marketing/HowItWorksSection";
import { TestimonialsSection } from "@/components/marketing/TestimonialsSection";
import { PricingSnapshotSection } from "@/components/marketing/PricingSnapshotSection";
import { FreeTrialSection } from "@/components/marketing/FreeTrialSection";
import { CTASection } from "@/components/marketing/CTASection";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <StatsSection />
        <ProblemSection />
        <SolutionSection />
        <FeaturesSection />
        <HowItWorksSection />
        <CurriculumSection />
        <TestimonialsSection />
        <PricingSnapshotSection />
        <FreeTrialSection />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
