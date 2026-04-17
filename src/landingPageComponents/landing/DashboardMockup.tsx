import { useEffect, useState } from "react";
import { Activity, Gauge, ShieldCheck, Zap } from "lucide-react";

function useLiveValue(initial: number, min: number, max: number, step = 0.05) {
  const [v, setV] = useState(initial);
  useEffect(() => {
    const id = setInterval(() => {
      setV((prev) => {
        const delta = (Math.random() - 0.5) * (max - min) * step;
        const next = prev + delta;
        return Math.min(max, Math.max(min, next));
      });
    }, 1600);
    return () => clearInterval(id);
  }, [min, max, step]);
  return v;
}

const Donut = ({ value, max, color }: { value: number; max: number; color: string }) => {
  const pct = Math.max(0, Math.min(1, value / max));
  const r = 28;
  const c = 2 * Math.PI * r;
  const dash = c * pct;
  return (
    <svg viewBox="0 0 72 72" className="h-20 w-20">
      <circle cx="36" cy="36" r={r} stroke="hsl(var(--border))" strokeWidth="6" fill="none" />
      <circle
        cx="36"
        cy="36"
        r={r}
        stroke={color}
        strokeWidth="6"
        fill="none"
        strokeDasharray={`${dash} ${c}`}
        strokeLinecap="round"
        transform="rotate(-90 36 36)"
        style={{ transition: "stroke-dasharray 800ms cubic-bezier(0.22,1,0.36,1)" }}
      />
    </svg>
  );
};

const Card = ({
  title,
  unit,
  value,
  max,
  color,
}: {
  title: string;
  unit: string;
  value: number;
  max: number;
  color: string;
}) => (
  <div className="rounded-xl border border-border bg-card p-3 shadow-sm">
    <div className="mb-1 flex items-center justify-between">
      <span className="text-[11px] font-medium text-muted-foreground">{title}</span>
      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-success">
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[hsl(var(--success))] opacity-60" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[hsl(var(--success))]" />
        </span>
        AO VIVO
      </span>
    </div>
    <div className="flex items-center gap-3">
      <Donut value={value} max={max} color={color} />
      <div>
        <div className="text-2xl font-bold tabular-nums text-foreground">{value.toFixed(2)}</div>
        <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{unit}</div>
      </div>
    </div>
  </div>
);

export const DashboardMockup = () => {
  const v1 = useLiveValue(1.92, 0.4, 2.75);
  const v2 = useLiveValue(10.89, 4, 18);
  const v3 = useLiveValue(1.26, 0.2, 3.5);
  const v4 = useLiveValue(17.62, 8, 22);

  return (
    <div className="relative">
      <div
        aria-hidden
        className="absolute -inset-6 -z-10 rounded-[2rem] bg-gradient-primary opacity-20 blur-3xl"
      />

      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-glow">
        <div className="flex items-center gap-1.5 border-b border-border bg-secondary/60 px-4 py-2.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[hsl(0_70%_60%)]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[hsl(40_90%_55%)]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[hsl(140_55%_50%)]" />
          <div className="ml-3 hidden rounded-md bg-background px-3 py-0.5 text-[10px] text-muted-foreground sm:block">
            app.fluxen.cloud/dashboard
          </div>
        </div>

        <div className="grid grid-cols-12 bg-background">
          <aside className="hidden flex-col gap-1 border-r border-border bg-[hsl(222_47%_8%)] p-3 sm:flex sm:col-span-3 lg:col-span-2">
            <div className="mb-3 px-2 py-1 text-[10px] font-bold tracking-widest text-white/80">FLUXEN</div>
            {[
              { i: <Gauge className="h-3.5 w-3.5" />, t: "Dashboard", a: true },
              { i: <Activity className="h-3.5 w-3.5" />, t: "Equipamentos" },
              { i: <ShieldCheck className="h-3.5 w-3.5" />, t: "Alertas" },
              { i: <Zap className="h-3.5 w-3.5" />, t: "Métricas" },
            ].map((it) => (
              <div
                key={it.t}
                className={`flex items-center gap-2 rounded-md px-2 py-1.5 text-[11px] ${
                  it.a ? "bg-primary/20 text-white" : "text-white/60 hover:bg-white/5 hover:text-white"
                }`}
              >
                {it.i}
                {it.t}
              </div>
            ))}
          </aside>

          <div className="col-span-12 p-4 sm:col-span-9 lg:col-span-10">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-foreground">Dashboard de Monitoramento</div>
                <div className="text-[10px] text-muted-foreground">Casa de bombas — ID 52</div>
              </div>
              <div className="hidden items-center gap-1.5 rounded-full border border-border bg-card px-2.5 py-1 text-[10px] font-medium text-success sm:flex">
                <span className="h-1.5 w-1.5 rounded-full bg-[hsl(var(--success))]" />
                Sistema online
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2.5 lg:grid-cols-4">
              <Card title="Nível Lagoa" unit="m" value={v1} max={2.75} color="hsl(var(--accent))" />
              <Card title="Vazão CH3" unit="m³/h" value={v2} max={20} color="hsl(var(--primary-glow))" />
              <Card title="Vazão CH2" unit="m³/h" value={v3} max={4} color="hsl(var(--accent))" />
              <Card title="Vazão CH1" unit="m³/h" value={v4} max={22} color="hsl(var(--primary-glow))" />
            </div>
          </div>
        </div>
      </div>

      <div
        className="pointer-events-none absolute -left-3 top-12 hidden animate-float rounded-xl border border-border bg-card px-3 py-2 shadow-elegant md:block"
        style={{ animationDelay: "0.2s" }}
      >
        <div className="flex items-center gap-2">
          <div className="grid h-8 w-8 place-items-center rounded-lg bg-success/10 text-success">
            <ShieldCheck className="h-4 w-4" />
          </div>
          <div>
            <div className="text-[10px] text-muted-foreground">Uptime</div>
            <div className="text-sm font-semibold tabular-nums">99,95%</div>
          </div>
        </div>
      </div>
      <div
        className="pointer-events-none absolute -right-3 bottom-10 hidden animate-float rounded-xl border border-border bg-card px-3 py-2 shadow-elegant md:block"
        style={{ animationDelay: "1.2s" }}
      >
        <div className="flex items-center gap-2">
          <div className="grid h-8 w-8 place-items-center rounded-lg bg-primary/10 text-primary">
            <Zap className="h-4 w-4" />
          </div>
          <div>
            <div className="text-[10px] text-muted-foreground">Resposta média</div>
            <div className="text-sm font-semibold tabular-nums">−37%</div>
          </div>
        </div>
      </div>
    </div>
  );
};
