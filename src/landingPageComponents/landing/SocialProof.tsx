const stats = [
  { value: "+2.450", label: "Ativos monitorados" },
  { value: "+1,2M", label: "Eventos processados / dia" },
  { value: "99,95%", label: "Disponibilidade da plataforma" },
];

export const SocialProof = () => {
  return (
    <section className="border-y border-border bg-secondary/40">
      <div className="container py-7 md:py-10">
        <p className="mb-5 text-center text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Resultados reais que importam para sua operação
        </p>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-3xl font-bold tracking-tight text-gradient-primary md:text-4xl">
                {s.value}
              </div>
              <div className="mt-1 text-xs font-medium text-muted-foreground md:text-sm">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
