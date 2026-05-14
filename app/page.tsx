import { Hero } from "@/app/_components/Hero";
import { DisclaimerCard } from "@/app/_components/DisclaimerCard";
import { FeatureGrid } from "@/app/_components/FeatureGrid";
import { EncounterLoggingCard } from "@/app/_components/EncounterLoggingCard";
import { ClassStrip } from "@/app/_components/ClassStrip";
import { MultiClassScreenshot } from "@/app/_components/MultiClassScreenshot";
import { MoreToolsTease } from "@/app/_components/MoreToolsTease";
import { DownloadSection } from "@/app/_components/DownloadSection";
import { FaqSection } from "@/app/_components/FaqSection";
import { SupportSection } from "@/app/_components/SupportSection";

export default function Page() {
  return (
    <>
      <Hero />
      <DisclaimerCard />
      <FeatureGrid />
      <EncounterLoggingCard />
      <ClassStrip />
      <MultiClassScreenshot />
      <MoreToolsTease />
      <DownloadSection />
      <FaqSection />
      <SupportSection />
    </>
  );
}
