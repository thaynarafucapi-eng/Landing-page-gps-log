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
