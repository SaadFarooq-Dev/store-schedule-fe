import HeroHome from "@/components/HeroHome";
import FeaturesBlocks from "@/components/FeaturesBlocks";
import Testimonials from "@/components/Testimonials";

export default function Home() {
  return (
    <main className="flex-grow">
      <HeroHome />
      <FeaturesBlocks />
      <Testimonials />
    </main>
  );
}
