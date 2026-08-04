import { Cloud } from "lucide-react";
import logo from "../../assets/logo.png";

type LogoVariant = "header" | "footer";

const variantClass: Record<LogoVariant, string> = {
  header:
    "h-auto w-auto object-contain object-left min-h-[5.6rem] min-w-[min(18rem,calc(100vw-5.4rem))] max-h-[7.4rem] max-w-[min(23.4rem,calc(100vw-3.6rem))] sm:min-h-[6.1rem] sm:min-w-[18.5rem] sm:max-h-[6.5rem] sm:max-w-[24.3rem] md:min-h-[6.5rem] md:min-w-[19.6rem] md:max-h-[7.2rem] md:max-w-[25.2rem] lg:min-h-[7rem] lg:min-w-[20.5rem] lg:max-h-[7.4rem] lg:max-w-[26.1rem]",
  footer:
    "mx-auto h-auto w-auto object-contain object-center min-h-[4.2rem] min-w-[min(12.3rem,calc(100vw-4.5rem))] max-h-[5.6rem] max-w-[min(16.7rem,96vw)] sm:min-h-[4.4rem] sm:min-w-[13.4rem] sm:max-h-[5.3rem] sm:max-w-[16.7rem] md:min-h-[5rem] md:min-w-[14.5rem] md:max-h-[5.9rem] md:max-w-[17.8rem] lg:min-h-[5.6rem] lg:min-w-[15.6rem] lg:max-h-[6.4rem] lg:max-w-[18.9rem]",
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
