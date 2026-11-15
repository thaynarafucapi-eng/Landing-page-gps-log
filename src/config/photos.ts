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

type Slot = { src?: ImageMetadata; alt: string; pending: string };

export const photos = {
  hero: {
    src: armazemInterno,
    alt: 'Área de armazenagem da GPSLOG com porta-paletes organizados e materiais identificados',
    pending: 'operação (hero)',
  },
  about: {
    src: galpaoFachada,
    alt: 'Fachada do galpão da GPSLOG no Conjunto Ben-Hur, em Manaus',
    pending: 'equipe ou fachada',
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
    src: galpaoFachada,
    alt: 'Galpão da GPSLOG em Manaus',
    pending: 'fachada',
  },
} satisfies Record<string, Slot>;
