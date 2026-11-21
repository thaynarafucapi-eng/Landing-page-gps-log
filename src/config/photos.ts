/**
 * Mapa de fotos do site.
 * Para incluir uma foto nova: salve o arquivo em src/assets/fotos/,
 * importe aqui e atribua ao espaço correspondente. Espaços com `undefined`
 * exibem um bloco reservado na identidade visual da marca.
 */
import type { ImageMetadata } from 'astro';
import armazemInterno from '../assets/fotos/armazem-interno.jpg';
import armazemOperacao from '../assets/fotos/armazem-operacao.jpg';
import galpaoFachada from '../assets/fotos/galpao-fachada.jpg';
import escritorio from '../assets/fotos/escritorio.jpg';
import positivacaoPdv from '../assets/fotos/positivacao-pdv.jpg';
import positivacaoPdv2 from '../assets/fotos/positivacao-pdv-2.jpg';
import fachadaPlacaHd from '../assets/fotos/fachada-placa-hd.jpg';
import pdvZaad from '../assets/fotos/pdv-zaad.jpg';
import pdvSkol from '../assets/fotos/pdv-skol.jpg';
import pdvTrident from '../assets/fotos/pdv-trident.jpg';
import pdvColgate from '../assets/fotos/pdv-colgate.jpg';
import pdvHeineken from '../assets/fotos/pdv-heineken.jpg';

type Slot = { src?: ImageMetadata; alt: string; pending: string };

/** Operações em ponto de venda executadas pela GPSLOG (apresentação oficial, slides 7 e 8). */
export const pdvGallery = [
  { src: pdvSkol, alt: 'Container promocional Skol montado e instalado pela GPSLOG', wide: true },
  { src: pdvZaad, alt: 'Expositor iluminado de lançamento Zaad instalado em loja pela GPSLOG' },
  { src: pdvTrident, alt: 'Expositor Trident instalado pela GPSLOG em ponto de venda' },
  { src: pdvColgate, alt: 'Ponta de gôndola Colgate-Palmolive montada pela GPSLOG em supermercado' },
  { src: pdvHeineken, alt: 'Expositor refrigerado Heineken instalado pela GPSLOG' },
];

export const photos = {
  hero: {
    src: fachadaPlacaHd,
    alt: 'Fachada do galpão da GPSLOG, com a placa da empresa, em Manaus',
    pending: 'operação (hero)',
  },
  transporte: {
    src: undefined,
    alt: 'Veículo da GPSLOG em operação de transporte',
    pending: 'veículos',
  },
  entregas: {
    src: undefined,
    alt: 'Equipe da GPSLOG realizando coleta e entrega de mercadorias',
    pending: 'coleta / entrega',
  },
  armazenagem: {
    src: armazemOperacao,
    alt: 'Materiais armazenados em porta-paletes e paletes em separação para expedição',
    pending: 'armazenagem',
  },
  positivacao: {
    src: positivacaoPdv,
    alt: 'Estrutura promocional montada e instalada pela GPSLOG em ponto de venda de atacado',
    pending: 'positivação em PDV',
  },
  positivacaoDestaque: {
    src: positivacaoPdv2,
    alt: 'Estrutura promocional temática montada e instalada pela GPSLOG em ponto de venda de atacado',
    pending: 'positivação em PDV (destaque)',
  },
  montagem: {
    src: undefined,
    alt: 'Equipe da GPSLOG montando e instalando estruturas no local do cliente',
    pending: 'montagem e instalação',
  },
  veiculos: {
    src: undefined,
    alt: 'Frota da GPSLOG',
    pending: 'veículos',
  },
  equipe: {
    src: undefined,
    alt: 'Equipe operacional da GPSLOG',
    pending: 'equipe',
  },
  escritorio: {
    src: escritorio,
    alt: 'Escritório administrativo da GPSLOG',
    pending: 'escritório',
  },
  fachada: {
    src: fachadaPlacaHd,
    alt: 'Galpão da GPSLOG em Manaus',
    pending: 'fachada',
  },
} satisfies Record<string, Slot>;
