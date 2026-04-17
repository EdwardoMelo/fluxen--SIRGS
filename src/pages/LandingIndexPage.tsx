import { Header } from "@landing/landing/Header";
import { Hero } from "@landing/landing/Hero";
import { SocialProof } from "@landing/landing/SocialProof";
import { ProblemSolution } from "@landing/landing/ProblemSolution";
import { Features } from "@landing/landing/Features";
import { ProductDemo } from "@landing/landing/ProductDemo";
import { Benefits } from "@landing/landing/Benefits";
import { HowItWorks } from "@landing/landing/HowItWorks";
import { ContactCTA } from "@landing/landing/ContactCTA";
import { Footer } from "@landing/landing/Footer";
import { Toaster } from "@landing/ui/toaster";

const LandingIndexPage = () => {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Fluxen",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    description:
      "Plataforma de telemetria em nuvem para monitoramento de operações críticas, com integração multi-fabricante e alertas inteligentes.",
    offers: { "@type": "Offer", price: "0", priceCurrency: "BRL" },
  };

  return (
    <div className="landing-root min-h-screen bg-background text-foreground">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Toaster />
      <Header />
      <main>
        <Hero />
        <SocialProof />
        <ProblemSolution />
        <Features />
        <ProductDemo />
        <Benefits />
        <HowItWorks />
        <ContactCTA />
      </main>
      <Footer />
    </div>
  );
};

export default LandingIndexPage;
