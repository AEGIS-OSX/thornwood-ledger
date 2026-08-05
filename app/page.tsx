import Nav from "@/app/components/Nav";
import Hero from "@/app/components/Hero";
import Capabilities from "@/app/components/Capabilities";
import SocialProof from "@/app/components/SocialProof";
import WalkthroughCTA from "@/app/components/WalkthroughCTA";
import Footer from "@/app/components/Footer";

// The Hero live-count fetch targets an internal-only host with cache:"force-cache".
// Without this, Next.js resolves that fetch during `next build`, which fails in
// any environment (like the CI gate) that cannot reach ledger.thornwood.internal.
// force-dynamic opts this route out of static generation so the fetch runs at
// request time: build exits 0, the count stays live per request, and a real
// fetch failure still throws during render.
export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Capabilities />
        <SocialProof />
        <WalkthroughCTA />
      </main>
      <Footer />
    </>
  );
}
