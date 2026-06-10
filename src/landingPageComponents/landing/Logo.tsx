import { Cloud } from "lucide-react";
import logo from "../assets/fluxen-logo.png";

type LogoVariant = "header" | "footer";

const variantClass: Record<LogoVariant, string> = {
  header:
    "h-auto w-auto object-contain object-left min-h-[5.4rem] min-w-[min(17.55rem,calc(100vw-6.3rem))] max-h-[7.2rem] max-w-[min(22.5rem,calc(100vw-4.5rem))] sm:min-h-[5.85rem] sm:min-w-[18rem] sm:max-h-[6.3rem] sm:max-w-[23.4rem] md:min-h-[6.3rem] md:min-w-[18.9rem] md:max-h-[6.975rem] md:max-w-[24.3rem] lg:min-h-[6.75rem] lg:min-w-[19.8rem] lg:max-h-[7.2rem] lg:max-w-[25.2rem]",
  footer:
    "h-auto w-auto object-contain object-left min-h-[6.75rem] min-w-[min(19.8rem,calc(100vw-5.4rem))] max-h-[9rem] max-w-[min(27rem,96vw)] sm:min-h-[7.2rem] sm:min-w-[21.6rem] sm:max-h-[8.55rem] sm:max-w-[27rem] md:min-h-[8.1rem] md:min-w-[23.4rem] md:max-h-[9.45rem] md:max-w-[28.8rem] lg:min-h-[9rem] lg:min-w-[25.2rem] lg:max-h-[10.35rem] lg:max-w-[30.6rem]",
};

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
      width={408}
      height={480}
      className={`block bg-transparent ${variantClass[variant]}`}
    />
  </a>
);

export const InlineCloudLogo = () => (
  <span className="inline-flex items-center gap-1 font-semibold text-primary">
    <Cloud className="h-4 w-4" /> Fluxen
  </span>
);
