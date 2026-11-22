/**
 * Fonte única dos dados da GPSLOG.
 * Altere aqui e todo o site é atualizado (textos, links, rodapé, dados estruturados).
 */

const FOUNDING_YEAR = 2010;

export const company = {
  name: 'GPSLOG',
  legalLabel: 'GPSLOG Transportes e Logística',
  slogan: 'Agilidade na operação. Compromisso na entrega.',
  foundingYear: FOUNDING_YEAR,
  /** Calculado no build: o número se atualiza sozinho a cada nova publicação. */
  yearsInMarket: new Date().getFullYear() - FOUNDING_YEAR,
  address: {
    street: 'Rua Urânio, nº 27',
    district: 'Conjunto Ben-Hur',
    city: 'Manaus',
    state: 'AM',
    country: 'BR',
  },
  hours: {
    label: 'Segunda a sexta-feira, das 8h às 17h',
    short: 'Seg. a sex., 8h às 17h',
    /** Usado para avisar o visitante quando está fora do expediente (fuso de Manaus). */
    timezone: 'America/Manaus',
    days: [1, 2, 3, 4, 5],
    open: 8,
    close: 17,
  },
  serviceArea: [
    'Manaus e região metropolitana',
    'Interior do Amazonas',
    'Boa Vista (RR)',
  ],
} as const;

export const contact = {
  whatsappDisplay: '(92) 99966-8377',
  whatsappNumber: '5592999668377',
  email: 'comercial@gpslogmao.com',
  whatsappDefaultMessage:
    'Olá! Conheci a GPSLOG pelo site e gostaria de solicitar um orçamento. Poderiam me ajudar?',
  instagramUrl: 'https://www.instagram.com/gpslog.transporte.logistica/',
  instagramHandle: '@gpslog.transporte.logistica',
  mapsQuery: 'Rua Urânio, 27, Conjunto Ben-Hur, Manaus - AM',
} as const;

/** Crédito de criação exibido no rodapé. */
export const credit = {
  name: 'Thay Lab Criativo',
  url: 'https://www.instagram.com/thaylabcriativo/',
} as const;

export const whatsappUrl = (message: string = contact.whatsappDefaultMessage) =>
  `https://wa.me/${contact.whatsappNumber}?text=${encodeURIComponent(message)}`;

export const mapsEmbedUrl = `https://www.google.com/maps?q=${encodeURIComponent(contact.mapsQuery)}&output=embed`;
export const mapsLinkUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(contact.mapsQuery)}`;

/**
 * Empresas atendidas. A seção só aparece com `showClients: true`,
 * e somente depois de autorização formal de cada empresa listada.
 * Para usar logotipos, salve em /public/clientes/ e preencha `logo`.
 */
export const clients = {
  showClients: true,
  /** Parceiros com autorização de divulgação (logotipos extraídos da apresentação oficial). */
  list: [
    { name: 'Mundial Logistics Group', logo: '/clientes/mundial-logistics.webp' },
    { name: 'Vienalog Logística Promocional', logo: '/clientes/vienalog.webp' },
    { name: 'Brasil Maxi Logística', logo: '/clientes/brasilmaxi.webp' },
    { name: 'CLI Central de Logística Integrada', logo: '/clientes/cli.webp' },
    { name: 'LSLog Logística Promocional', logo: '/clientes/lslog.webp' },
    { name: 'Pier Serv', logo: '/clientes/pierserv.webp' },
    { name: 'Profile Group', logo: '/clientes/profile.webp' },
    { name: 'AcolherLog', logo: '/clientes/acolher.webp' },
    { name: 'NEXT', logo: '/clientes/next.webp' },
    { name: 'USA Encomendas', logo: '/clientes/usa.webp' },
    { name: 'Saggezza: conectando varejo e futuro', logo: '/clientes/saggezza.webp' },
    { name: 'Tradelog Logística Promocional', logo: '/clientes/tradelog.webp' },
    { name: 'MD Promolog: inteligência em logística promocional', logo: '/clientes/promolog.webp' },
    { name: 'Cargopress Transporte e Logística', logo: '/clientes/cargopress.webp' },
  ],
  /** Parceiros sem logotipo disponível: aparecem só com o nome. */
  names: [] as string[],
};

/** Serviços: usados nos cards, no seletor do formulário e na mensagem do WhatsApp. */
export const services = [
  { id: 'transporte', label: 'Transporte de cargas' },
  { id: 'entregas', label: 'Entregas, coletas e distribuição' },
  { id: 'armazenagem', label: 'Armazenagem de materiais' },
  { id: 'positivacao', label: 'Positivação e negativação' },
  { id: 'outro', label: 'Outro / não sei ainda' },
] as const;

export type ServiceId = (typeof services)[number]['id'];

/** IDs de rastreamento: vêm de variáveis de ambiente (ver .env.example). Vazio = não carrega. */
export const tracking = {
  gtmId: import.meta.env.PUBLIC_GTM_ID ?? '',
  ga4Id: import.meta.env.PUBLIC_GA4_ID ?? '',
  googleAdsId: import.meta.env.PUBLIC_GADS_ID ?? '',
  googleAdsLabelWhatsapp: import.meta.env.PUBLIC_GADS_LABEL_WHATSAPP ?? '',
  metaPixelId: import.meta.env.PUBLIC_META_PIXEL_ID ?? '',
};
