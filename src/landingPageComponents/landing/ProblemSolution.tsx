import { AlertTriangle, Clock, EyeOff, ArrowRight, Eye, Bell, Database } from "lucide-react";

const problems = [
  {
    icon: EyeOff,
    title: "Falta de visibilidade",
    desc: "Dados espalhados em planilhas, painéis isolados e sistemas legados.",
  },
  { icon: Clock, title: "Decisões lentas", desc: "Quando a informação chega, o problema já causou prejuízo." },
  {
    icon: AlertTriangle,
    title: "Risco operacional",
    desc: "Falhas não previstas geram parada, multa e perda de receita.",
  },
];

const solutions = [
  {
    icon: Database,
    title: "Dados centralizados",
    desc: "Toda a telemetria em um único ambiente, com contexto e histórico.",
  },
  { icon: Eye, title: "Monitoramento contínuo", desc: "Veja sua operação em tempo real, de qualquer lugar." },
  {
    icon: Bell,
    title: "Alertas inteligentes",
    desc: "Aja antes da falha acontecer com regras e thresholds configuráveis.",
  },
];

export const ProblemSolution = () => {
  return (
    <section className="bg-background py-20 md:py-28">
      <div className="container">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-primary">Por que Fluxen</p>
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Pare de operar no escuro.</h2>
          <p className="mt-3 text-muted-foreground">
            A maioria das operações industriais perde tempo e dinheiro com dados fragmentados. A Fluxen muda isso.
          </p>
        </div>

        <div className="grid items-stretch gap-6 lg:grid-cols-[1fr_auto_1fr]">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-card md:p-8">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-destructive/10 px-3 py-1 text-xs font-semibold text-destructive">
              Sem Fluxen
            </div>
            <h3 className="mb-5 text-xl font-semibold">O cenário hoje</h3>
            <ul className="space-y-5">
              {problems.map((p) => (
                <li key={p.title} className="flex gap-3">
                  <div className="grid h-9 w-9 flex-none place-items-center rounded-lg bg-destructive/10 text-destructive">
                    <p.icon className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold">{p.title}</div>
                    <div className="text-sm text-muted-foreground">{p.desc}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="hidden items-center justify-center lg:flex">
            <div className="grid h-12 w-12 place-items-center rounded-full bg-gradient-primary text-primary-foreground shadow-glow">
              <ArrowRight className="h-5 w-5" />
            </div>
          </div>

          <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary-soft to-card p-6 shadow-elegant md:p-8">
            <div
              aria-hidden
              className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-gradient-primary opacity-20 blur-3xl"
            />
            <div className="relative">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                Com Fluxen
              </div>
              <h3 className="mb-5 text-xl font-semibold">A nova realidade</h3>
              <ul className="space-y-5">
                {solutions.map((s) => (
                  <li key={s.title} className="flex gap-3">
                    <div className="grid h-9 w-9 flex-none place-items-center rounded-lg bg-gradient-primary text-primary-foreground shadow-sm">
                      <s.icon className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold">{s.title}</div>
                      <div className="text-sm text-muted-foreground">{s.desc}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
