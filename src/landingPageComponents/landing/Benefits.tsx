import { TrendingUp, Timer, ShieldCheck, Wallet } from "lucide-react";

const benefits = [
  {
    icon: Timer,
    title: "Decisões mais rápidas",
    desc: "Tome decisões em minutos, não em dias, com todos os dados em um só lugar.",
  },
  {
    icon: ShieldCheck,
    title: "Antecipe falhas",
    desc: "Se antecipe a problemas antes que virem prejuízo com alertas automatizados.",
  },
  {
    icon: TrendingUp,
    title: "Mais eficiência operacional",
    desc: "Reduza retrabalho, paradas e custos invisíveis com indicadores objetivos.",
  },
  {
    icon: Wallet,
    title: "ROI mensurável",
    desc: "Acompanhe ganhos reais em disponibilidade, performance e segurança.",
  },
];

export const Benefits = () => {
  return (
    <section id="beneficios" className="bg-secondary/30 py-14 md:py-20">
      <div className="container">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-primary">Resultados</p>
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">O impacto direto no seu negócio.</h2>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((b) => (
            <div
              key={b.title}
              className="rounded-2xl border border-border bg-card p-6 text-center shadow-card transition-all hover:-translate-y-1 hover:shadow-elegant"
            >
              <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-primary-soft text-primary">
                <b.icon className="h-5 w-5" />
              </div>
              <h3 className="mb-1.5 text-base font-semibold">{b.title}</h3>
              <p className="text-sm text-muted-foreground">{b.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
