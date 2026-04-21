import { Button } from "@landing/ui/button";
import { ArrowRight, PlayCircle, Sparkles } from "lucide-react";
import { getWhatsAppDemoUrl } from "@landing/lib/whatsapp";
import { DashboardMockup } from "./DashboardMockup";

const whatsAppDemoHref = getWhatsAppDemoUrl();

export const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-hero">
      <div aria-hidden className="absolute inset-0 grid-bg" />
      <div className="container relative grid gap-10 py-12 md:py-16 lg:grid-cols-2 lg:gap-8">
        <div className="flex flex-col justify-center animate-fade-in-up">
          <a
            href="#produto"
            className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur transition-colors hover:text-foreground"
          >
            <Sparkles className="h-3.5 w-3.5 text-accent" />
            Telemetria inteligente em nuvem
            <span className="text-muted-foreground">·</span>
            <span className="font-semibold text-primary">Novo</span>
          </a>
          <h1 className="text-balance text-4xl font-bold leading-[1.05] tracking-tight text-foreground md:text-6xl">
            Tenha controle <span className="text-gradient-primary">total</span> da sua
            operação em tempo real.
          </h1>
          <p className="mt-5 max-w-xl text-pretty text-base text-muted-foreground md:text-lg">
            A Fluxen centraliza dados de telemetria, monitora equipamentos críticos e antecipa
            falhas — para você decidir com clareza, segurança e velocidade.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button
              size="lg"
              asChild
              className="bg-gradient-primary text-base shadow-elegant transition-transform hover:-translate-y-0.5 hover:opacity-95"
            >
              <a href={whatsAppDemoHref} target="_blank" rel="noopener noreferrer">
                Solicitar demonstração
                <ArrowRight className="h-4 w-4" />
              </a>
            </Button>
            <Button size="lg" variant="outline" asChild className="text-base">
              <a href="#produto">
                <PlayCircle className="h-4 w-4" />
                Ver plataforma
              </a>
            </Button>
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-[hsl(var(--success))]" />
              Sem compromisso
            </div>
            <div>Implementação em dias, não meses</div>
            <div>Dados criptografados</div>
          </div>
        </div>

        <div className="relative">
          <DashboardMockup />
        </div>
      </div>
    </section>
  );
};
