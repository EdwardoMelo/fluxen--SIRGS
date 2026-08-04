import { Logo } from "./Logo";

export const Footer = () => {
  return (
    <footer className="border-t border-border bg-background">
      <div className="container flex flex-col items-center justify-center gap-4 py-6 text-center">
        <Logo variant="footer" />
        <div className="flex flex-col items-center gap-2 text-center">
          <p className="text-xs font-bold text-muted-foreground">
            © {new Date().getFullYear()} - FLUXEN - Telemetria em nuvem.
          </p>
          <p className="text-xs font-bold text-muted-foreground">
            Um produto SIRGS - SOLUÇÕES INOVADORAS.
          </p>
          <p className="text-xs font-bold text-muted-foreground">
            CNPJ: 11.877.904/0001-16
          </p>
        </div>
        <div className="flex items-center justify-center gap-5 text-xs text-muted-foreground">
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
