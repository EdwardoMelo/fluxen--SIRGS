import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@landing/ui/button";
import { Menu, X } from "lucide-react";
import { getWhatsAppDemoUrl } from "@landing/lib/whatsapp";
import { Logo } from "./Logo";

const whatsAppDemoHref = getWhatsAppDemoUrl();

const links = [
  { href: "#produto", label: "Produto" },
  { href: "#como-funciona", label: "Como funciona" },
  { href: "#beneficios", label: "Benefícios" },
  { href: "#contato", label: "Contato" },
];

export const Header = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all ${
        scrolled
          ? "border-b border-border/60 bg-background/80 backdrop-blur-md"
          : "bg-transparent"
      }`}
    >
      <div className="container flex h-16 items-center justify-between">
        <Logo />
        <nav className="hidden items-center gap-8 md:flex" aria-label="Principal">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {l.label}
            </a>
          ))}
        </nav>
        <div className="hidden items-center gap-2 md:flex">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/auth">Entrar</Link>
          </Button>
          <Button size="sm" asChild className="bg-gradient-primary shadow-elegant hover:opacity-95">
            <a href={whatsAppDemoHref} target="_blank" rel="noopener noreferrer">
              Solicitar demonstração
            </a>
          </Button>
        </div>
        <button
          aria-label="Abrir menu"
          className="rounded-md p-2 text-foreground md:hidden"
          onClick={() => setOpen((s) => !s)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
      {open && (
        <div className="border-t border-border bg-background md:hidden">
          <div className="container flex flex-col gap-1 py-3">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground"
                onClick={() => setOpen(false)}
              >
                {l.label}
              </a>
            ))}
            <Button variant="ghost" asChild className="mt-1 justify-start">
              <Link to="/auth" onClick={() => setOpen(false)}>
                Entrar
              </Link>
            </Button>
            <Button asChild className="mt-2 bg-gradient-primary">
              <a href={whatsAppDemoHref} target="_blank" rel="noopener noreferrer" onClick={() => setOpen(false)}>
                Solicitar demonstração
              </a>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};
