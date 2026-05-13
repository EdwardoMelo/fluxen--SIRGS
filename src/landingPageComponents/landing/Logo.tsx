import { Cloud } from "lucide-react";
import logo from "../assets/fluxen-logo.png";

type LogoVariant = "header" | "footer";

const variantClass: Record<LogoVariant, string> = {
  /** Navbar — 25% menor que a versão anterior (×0,75 em min/max e nos `calc`). */
  header:
    "h-auto w-auto object-contain object-left min-h-[4.5rem] min-w-[min(14.625rem,calc(100vw-5.25rem))] max-h-[6rem] max-w-[min(18.75rem,calc(100vw-3.75rem))] sm:min-h-[4.875rem] sm:min-w-[15rem] sm:max-h-[5.25rem] sm:max-w-[19.5rem] md:min-h-[5.25rem] md:min-w-[15.75rem] md:max-h-[5.8125rem] md:max-w-[20.25rem] lg:min-h-[5.625rem] lg:min-w-[16.5rem] lg:max-h-[6rem] lg:max-w-[21rem]",
  /** Rodapé — mesma redução de 25%. */
  footer:
    "h-auto w-auto object-contain object-left min-h-[5.625rem] min-w-[min(16.5rem,calc(100vw-4.5rem))] max-h-[7.5rem] max-w-[min(22.5rem,96vw)] sm:min-h-[6rem] sm:min-w-[18rem] sm:max-h-[7.125rem] sm:max-w-[22.5rem] md:min-h-[6.75rem] md:min-w-[19.5rem] md:max-h-[7.875rem] md:max-w-[24rem] lg:min-h-[7.5rem] lg:min-w-[21rem] lg:max-h-[8.625rem] lg:max-w-[25.5rem]",
};
''
type LogoProps = {
  className?: string;
  variant?: LogoVariant;
};

export const Logo = ({ className = "", variant = "header" }: LogoProps) => (
  <a
    href="#"
    className={`inline-flex shrink-0 bg-transparent leading-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-transparent ${className}`}
    aria-label="Fluxen - Telemetria em Nuvem"
  >
    <img
      src={logo}
      alt="Fluxen - Telemetria em Nuvem logo"
      width={340}
      height={400}
      className={`block bg-transparent ${variantClass[variant]}`}
    />
  </a>
);

export const InlineCloudLogo = () => (
  <span className="inline-flex items-center gap-1 font-semibold text-primary">
    <Cloud className="h-4 w-4" /> Fluxen
  </span>
);
