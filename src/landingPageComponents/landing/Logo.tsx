import { Cloud } from "lucide-react";
import logo from "../../assets/logo.png";

type LogoVariant = "header" | "footer";

const variantClass: Record<LogoVariant, string> = {
  header:
    "h-auto w-auto object-contain object-left min-h-[5.6rem] min-w-[min(18rem,calc(100vw-5.4rem))] max-h-[7.4rem] max-w-[min(23.4rem,calc(100vw-3.6rem))] sm:min-h-[6.1rem] sm:min-w-[18.5rem] sm:max-h-[6.5rem] sm:max-w-[24.3rem] md:min-h-[6.5rem] md:min-w-[19.6rem] md:max-h-[7.2rem] md:max-w-[25.2rem] lg:min-h-[7rem] lg:min-w-[20.5rem] lg:max-h-[7.4rem] lg:max-w-[26.1rem]",
  footer:
    "h-auto w-auto object-contain object-left min-h-[7rem] min-w-[min(20.5rem,calc(100vw-4.5rem))] max-h-[9.3rem] max-w-[min(27.9rem,96vw)] sm:min-h-[7.4rem] sm:min-w-[22.25rem] sm:max-h-[8.85rem] sm:max-w-[27.9rem] md:min-h-[8.3rem] md:min-w-[24.15rem] md:max-h-[9.75rem] md:max-w-[29.7rem] lg:min-h-[9.3rem] lg:min-w-[26rem] lg:max-h-[10.7rem] lg:max-w-[31.5rem]",
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
      width={785}
      height={809}
      className={`block bg-transparent ${variantClass[variant]}`}
    />
  </a>
);

export const InlineCloudLogo = () => (
  <span className="inline-flex items-center gap-1 font-semibold text-primary">
    <Cloud className="h-4 w-4" /> Fluxen
  </span>
);
