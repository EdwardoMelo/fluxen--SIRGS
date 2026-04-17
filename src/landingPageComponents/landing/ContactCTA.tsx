import { useState, type FormEvent } from "react";
import { Button } from "@landing/ui/button";
import { Input } from "@landing/ui/input";
import { Textarea } from "@landing/ui/textarea";
import { Label } from "@landing/ui/label";
import { useToast } from "@landing/hooks/use-toast";
import { Mail, Phone, AtSign, Clock, ShieldCheck, ArrowRight } from "lucide-react";
import api from "../../api";

export const ContactCTA = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const name = String(fd.get("name") ?? "").trim();
    const email = String(fd.get("email") ?? "").trim();
    const company = String(fd.get("company") ?? "").trim();
    const message = String(fd.get("message") ?? "").trim();

    setLoading(true);
    try {
      await api.post("/api/landing/contact", { name, email, company, message });
      form.reset();
      toast({
        title: "Mensagem enviada",
        description: "Em breve nossa equipe entrará em contato com você.",
      });
    } catch (err: unknown) {
      const msg =
        err && typeof err === "object" && "response" in err
          ? (err as { response?: { data?: { error?: string } } }).response?.data?.error
          : undefined;
      toast({
        variant: "destructive",
        title: "Não foi possível enviar",
        description: msg ?? "Tente novamente em alguns instantes ou fale conosco pelo WhatsApp.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contato" className="relative overflow-hidden bg-gradient-cta py-20 md:py-28">
      <div
        aria-hidden
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 20%, hsl(212 95% 70% / 0.4), transparent 40%), radial-gradient(circle at 80% 80%, hsl(199 89% 60% / 0.4), transparent 40%)",
        }}
      />
      <div className="container relative grid gap-10 lg:grid-cols-2 lg:items-center">
        <div className="text-primary-foreground">
          <h2 className="text-balance text-3xl font-bold tracking-tight md:text-5xl">
            Comece a enxergar sua operação com clareza hoje.
          </h2>
          <p className="mt-4 max-w-lg text-base text-primary-foreground/80 md:text-lg">
            Conte seu cenário e nosso time prepara uma demonstração focada no seu contexto. Sem compromisso, sem letras
            miúdas.
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <div className="flex items-center gap-3 rounded-xl border border-white/15 bg-white/5 p-3 backdrop-blur">
              <ShieldCheck className="h-5 w-5 flex-none text-primary-foreground" />
              <div>
                <div className="text-sm font-semibold">Dados criptografados</div>
                <div className="text-xs text-primary-foreground/70">Em repouso e em trânsito</div>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl border border-white/15 bg-white/5 p-3 backdrop-blur">
              <Clock className="h-5 w-5 flex-none text-primary-foreground" />
              <div>
                <div className="text-sm font-semibold">Resposta em 1 dia útil</div>
                <div className="text-xs text-primary-foreground/70">Atendimento humano</div>
              </div>
            </div>
          </div>

          <div className="mt-8 space-y-2 text-sm">
            <a href="mailto:contato@fluxen.cloud" className="flex items-center gap-2 hover:underline">
              <Mail className="h-4 w-4" /> contato@fluxen.cloud
            </a>
            <a href="tel:+555135885463" className="flex items-center gap-2 hover:underline">
              <Phone className="h-4 w-4" /> (51) 3588.5463
            </a>
            <a
              href="https://instagram.com/fluxen.cloud"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:underline"
            >
              <AtSign className="h-4 w-4" /> @fluxen.cloud
            </a>
          </div>
        </div>

        <form
          onSubmit={onSubmit}
          className="rounded-2xl border border-border bg-card p-6 shadow-glow md:p-8"
          aria-label="Formulário de contato"
        >
          <h3 className="mb-1 text-xl font-semibold">Solicitar demonstração</h3>
          <p className="mb-6 text-sm text-muted-foreground">Preencha em menos de 1 minuto.</p>
          <div className="grid gap-4">
            <div className="grid gap-1.5">
              <Label htmlFor="name">Nome</Label>
              <Input id="name" name="name" required placeholder="Seu nome" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-1.5">
                <Label htmlFor="email">Email corporativo</Label>
                <Input id="email" name="email" type="email" required placeholder="voce@empresa.com" />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="company">Empresa</Label>
                <Input id="company" name="company" placeholder="Sua empresa" />
              </div>
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="message">Como podemos ajudar?</Label>
              <Textarea
                id="message"
                name="message"
                rows={4}
                required
                placeholder="Conte um pouco sobre sua operação."
              />
            </div>
            <Button
              type="submit"
              size="lg"
              disabled={loading}
              className="bg-gradient-primary text-base shadow-elegant hover:opacity-95"
            >
              {loading ? "Enviando..." : "Solicitar demonstração"}
              <ArrowRight className="h-4 w-4" />
            </Button>
            <p className="text-center text-xs text-muted-foreground">
              Ao enviar, você concorda em receber contato sobre a Fluxen. Não usamos seus dados para outros fins.
            </p>
          </div>
        </form>
      </div>
    </section>
  );
};
