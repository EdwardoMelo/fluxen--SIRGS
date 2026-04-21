import { Cloud } from "lucide-react";
import logo from "../assets/fluxen-logo.png";

export const Logo = ({ className = "" }: { className?: string }) => (
  <a href="#" className={`flex items-center gap-2 ${className}`} aria-label="Fluxen">
    <img src={logo} alt="" width={44} height={44} className="h-11 w-11" />
    <div className="leading-none">
      <div className="text-xl font-bold tracking-tight text-primary">FLUXEN</div>
      <div className="text-[10px] font-semibold tracking-[0.18em] text-muted-foreground">
        TELEMETRIA EM NUVEM
      </div>
    </div>
  </a>
);

export const InlineCloudLogo = () => (
  <span className="inline-flex items-center gap-1 font-semibold text-primary">
    <Cloud className="h-4 w-4" /> Fluxen
  </span>
);
