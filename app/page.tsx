import Nav from "@/app/components/Nav";
import Hero from "@/app/components/Hero";
import Capabilities from "@/app/components/Capabilities";
import SocialProof from "@/app/components/SocialProof";
import WalkthroughCTA from "@/app/components/WalkthroughCTA";
import Footer from "@/app/components/Footer";

export default function Page() {
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
