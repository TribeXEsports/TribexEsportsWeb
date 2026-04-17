import { Hero } from "@/components/ui/animated-hero"
import { BackgroundEffects } from "@/components/ui/BackgroundEffects"

export default function HeroDemoPage() {
  return (
    <div className="min-h-screen bg-black overflow-hidden select-none relative">
      <BackgroundEffects />
      <Hero />
    </div>
  );
}
