/**
 * Eventos de conversão.
 * - Sempre envia para o dataLayer (GTM/GA4 podem usar sem alterar código).
 * - Se GA4/Google Ads/Meta Pixel estiverem configurados direto (sem GTM),
 *   dispara também os eventos nativos de cada ferramenta.
 */
declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

const ADS_ID = import.meta.env.PUBLIC_GADS_ID ?? '';
const ADS_LABEL_WA = import.meta.env.PUBLIC_GADS_LABEL_WHATSAPP ?? '';
const ADS_LABEL_FORM = import.meta.env.PUBLIC_GADS_LABEL_FORM ?? '';

function push(event: string, params: Record<string, unknown> = {}) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...params });
}

function adsConversion(label: string) {
  if (ADS_ID && label && typeof window.gtag === 'function') {
    window.gtag('event', 'conversion', { send_to: `${ADS_ID}/${label}` });
  }
}

/** Clique em qualquer botão de WhatsApp. */
export function trackWhatsappClick(location: string) {
  push('whatsapp_click', { click_location: location });
  window.gtag?.('event', 'whatsapp_click', { click_location: location });
  adsConversion(ADS_LABEL_WA);
  window.fbq?.('track', 'Contact', { content_name: location });
}

/** Clique em "Solicitar orçamento" (intenção, não é conversão). */
export function trackQuoteCta(location: string, service?: string) {
  push('quote_cta_click', { click_location: location, service: service ?? '' });
}

/** Etapa 1 concluída. */
export function trackFormStep(service: string) {
  push('form_step1_complete', { service });
  window.gtag?.('event', 'form_step1_complete', { service });
}

/** Formulário enviado para o WhatsApp (conversão principal do formulário). */
export function trackLead(service: string) {
  push('generate_lead', { service, method: 'whatsapp_form' });
  window.gtag?.('event', 'generate_lead', { service, method: 'whatsapp_form' });
  adsConversion(ADS_LABEL_FORM);
  window.fbq?.('track', 'Lead', { content_name: service });
}
