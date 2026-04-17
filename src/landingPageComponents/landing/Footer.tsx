import { Logo } from "./Logo";

export const Footer = () => {
  return (
    <footer className="border-t border-border bg-background">
      <div className="container flex flex-col items-center justify-between gap-4 py-8 md:flex-row">
        <Logo />
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} Fluxen. Telemetria em nuvem para operações críticas.
        </p>
        <div className="flex items-center gap-5 text-xs text-muted-foreground">
          <a href="#produto" className="hover:text-foreground">
            Produto
          </a>
          <a href="#contato" className="hover:text-foreground">
            Contato
          </a>
        </div>
      </div>
    </footer>
  );
};
