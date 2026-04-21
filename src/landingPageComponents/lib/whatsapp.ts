/** Número oficial (mesmo do rodapé da landing: +55 51 3588-5463). */
const WHATSAPP_NUMBER_E164 = "555135885463";

export const DEMO_WHATSAPP_MESSAGE =
  "OLÁ, QUERO SOLICITAR A DEMONSTRAÇÃO DO FLUXEN.";

export function getWhatsAppDemoUrl(): string {
  return `https://wa.me/${WHATSAPP_NUMBER_E164}?text=${encodeURIComponent(DEMO_WHATSAPP_MESSAGE)}`;
}
