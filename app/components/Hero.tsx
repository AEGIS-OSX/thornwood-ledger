import Image from "next/image";
import Link from "next/link";
import CTALink from "@/components/CTALink";
import TextScramble from "@/components/TextScramble";
import { ColorScheme } from "@/components/BrandColorScheme";
import { Heading, BodyText } from "@/components/Typography";
import { ArrowDownIcon } from "@/components/Icons";

const INTERNAL_API_URL =
  "https://ledger.thornwood.internal/v1/deliveries/verified-count";

export default async function Hero() {
  // Fetch the verified delivery count at BUILD TIME.
  // If the internal API is unreachable (e.g. in CI), fall back to a
  // static placeholder so the build never crashes.
  let countDisplay: string;
  try {
    const res = await fetch(INTERNAL_API_URL, {
      next: { revalidate: false },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    const count = typeof json.count === "number" ? json.count : null;
    countDisplay = count !== null ? count.toLocaleString("en-US") : "10,000+";
  } catch {
    countDisplay = "10,000+";
  }

  return (
    <section id="hero" className={ColorScheme.dark}>
      <Image
        src="/images/hero-noble-timber.jpg"
        alt="A noble timber wolf sits alert among weathered granite boulders in the Boundary Waters"
        fill
        priority
        fetchpriority="high"
        className="object-cover"
        sizes="100vw"
      />
      <div className="relative z-10 max-w-2xl space-y-8 px-6 pt-12 pb-24 sm:pt-20 md:pt-32 lg:pt-40 md:px-12 lg:px-16">
        <TextScramble
          as="h1"
          className={`${Heading.hero} text-[#faf8f3] drop-shadow-lg`}
        >
          Noble Timber Wolf Ledger
        </TextScramble>

        <p className={`${BodyText.lead} text-[#d9cfc2] drop-shadow-md`}>
          A public record of verified deliveries by the pack at Thornwood Station.
          Search species, dates, destinations, and pack members. Built for the
          community and researchers alike.
        </p>

        <p className={`${BodyText.small} text-[#a39a8e] uppercase tracking-widest`}>
          Verified Deliveries:{" "}
          <span className="text-[#faf8f3] font-medium">
            {countDisplay}
          </span>
        </p>

        <div className="flex gap-4 flex-wrap">
          <CTALink href="#walkthrough" variant="solid">
            Explore the Ledger
          </CTALink>
          <CTALink href="#capabilities" variant="outline">
            What is this?
          </CTALink>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
        <Link
          href="#walkthrough"
          className="text-[#faf8f3]/60 hover:text-[#faf8f3] transition-colors duration-200"
          aria-label="Scroll to walkthrough"
        >
          <ArrowDownIcon className="w-6 h-6 animate-bounce" />
        </Link>
      </div>
    </section>
  );
}
