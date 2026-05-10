import { Check } from "lucide-react";
import { DashboardMockup } from "./DashboardMockup";

const highlights = [
  "Números atualizados em tempo real",
  "Dados por equipamento, canal ou unidade",
  "Histórico completo com exportação em poucos cliques",
  "Compartilhamento seguro com clientes e equipes",
];

export const ProductDemo = () => {
  return (
    <section className="bg-background py-14 md:py-20">
      <div className="container grid gap-8 lg:grid-cols-2 lg:items-center">
        <div className="order-2 lg:order-1">
          <DashboardMockup />
        </div>
        <div className="order-1 lg:order-2">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-primary">Demonstração</p>
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            Sua operação, <span className="text-gradient-primary">visível como nunca</span>.
          </h2>
          <p className="mt-4 text-muted-foreground">
            Acompanhe níveis, vazões e estados dos seus equipamentos com dados que se atualizam sozinhos. Veja
            tendências, identifique anomalias e aja antes do problema.
          </p>
          <ul className="mt-6 space-y-3">
            {highlights.map((h) => (
              <li key={h} className="flex items-start gap-3">
                <span className="mt-0.5 grid h-5 w-5 flex-none place-items-center rounded-full bg-gradient-primary text-primary-foreground">
                  <Check className="h-3 w-3" />
                </span>
                <span className="text-sm text-foreground">{h}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};
