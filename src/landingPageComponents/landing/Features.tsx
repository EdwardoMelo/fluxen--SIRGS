import { Activity, Cable, ShieldCheck, BarChart3, Bell, Workflow } from "lucide-react";

const features = [
  {
    icon: Activity,
    title: "Visibilidade em tempo real",
    desc: "Painéis claros com atualização contínua dos seus indicadores operacionais.",
  },
  {
    icon: ShieldCheck,
    title: "Confiança e continuidade",
    desc: "Infraestrutura resiliente com 99,95% de disponibilidade comprovada.",
  },
  {
    icon: Cable,
    title: "Integração multi-fabricante",
    desc: "Conecte equipamentos de diferentes marcas em uma única camada de monitoramento.",
  },
  {
    icon: Bell,
    title: "Alertas inteligentes",
    desc: "Configure regras e thresholds para agir antes da falha virar prejuízo.",
  },
  {
    icon: BarChart3,
    title: "Histórico e análise",
    desc: "Tendências e relatórios para decisões baseadas em dados, não em achismo.",
  },
  {
    icon: Workflow,
    title: "Implantação rápida",
    desc: "Da conexão dos equipamentos ao primeiro insight em poucos dias.",
  },
];

export const Features = () => {
  return (
    <section id="produto" className="bg-secondary/30 py-14 md:py-20">
      <div className="container">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-primary">Plataforma</p>
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            Tudo que sua operação precisa, em um só lugar.
          </h2>
          <p className="mt-3 text-muted-foreground">Recursos pensados para times que não podem parar.</p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-card transition-all hover:-translate-y-1 hover:border-primary/30 hover:shadow-elegant"
            >
              <div
                aria-hidden
                className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-primary opacity-0 blur-2xl transition-opacity group-hover:opacity-20"
              />
              <div className="relative">
                <div className="mb-4 inline-grid h-11 w-11 place-items-center rounded-xl bg-gradient-primary text-primary-foreground shadow-sm">
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="mb-1.5 text-lg font-semibold">{f.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
