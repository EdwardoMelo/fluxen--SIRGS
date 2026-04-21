import { Plug, MonitorCheck, BrainCircuit } from "lucide-react";

const steps = [
  {
    n: "01",
    icon: Plug,
    title: "Conecte seus equipamentos",
    desc: "Integramos com sensores, CLPs e sistemas existentes — sem trocar sua infraestrutura.",
  },
  {
    n: "02",
    icon: MonitorCheck,
    title: "Monitore em tempo real",
    desc: "Painéis personalizados com os indicadores que realmente importam para sua operação.",
  },
  {
    n: "03",
    icon: BrainCircuit,
    title: "Decida com base em dados",
    desc: "Use alertas, histórico e análises para agir com precisão e ganhar previsibilidade.",
  },
];

export const HowItWorks = () => {
  return (
    <section id="como-funciona" className="bg-background py-14 md:py-20">
      <div className="container">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-primary">Como funciona</p>
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Do sensor à decisão em 3 passos.</h2>
        </div>
        <div className="relative grid gap-6 md:grid-cols-3">
          <div
            aria-hidden
            className="absolute left-0 right-0 top-12 hidden h-px bg-gradient-to-r from-transparent via-border to-transparent md:block"
          />
          {steps.map((s) => (
            <div key={s.n} className="relative flex flex-col items-center text-center">
              <div className="relative mb-5 grid h-24 w-24 place-items-center rounded-3xl border border-border bg-card shadow-card">
                <s.icon className="h-8 w-8 text-primary" />
                <span className="absolute -right-2 -top-2 grid h-7 w-7 place-items-center rounded-full bg-gradient-primary text-[11px] font-bold text-primary-foreground shadow-elegant">
                  {s.n}
                </span>
              </div>
              <h3 className="mb-1.5 text-lg font-semibold">{s.title}</h3>
              <p className="max-w-xs text-sm text-muted-foreground">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
