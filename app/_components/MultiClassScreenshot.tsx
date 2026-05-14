import { Screenshot } from "@/app/_components/Screenshot";

export function MultiClassScreenshot() {
  return (
    <section className="px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <Screenshot
          src={undefined}
          alt="Farever Companion tracking a full party of Warrior, Mage, Rogue, and Priest"
          width={1600}
          height={900}
          caption="Multi-class group combat — screenshot pending"
          className="rounded-xl w-full"
        />
      </div>
    </section>
  );
}
