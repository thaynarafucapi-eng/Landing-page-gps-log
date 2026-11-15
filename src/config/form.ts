/**
 * Campos da etapa 2 do formulário, adaptados a cada serviço.
 * Para incluir, remover ou tornar obrigatório um campo, altere apenas esta lista:
 * o formulário e a mensagem enviada ao WhatsApp são gerados a partir dela.
 */
import type { ServiceId } from './site';

export type Field = {
  name: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'select' | 'textarea';
  required?: boolean;
  options?: string[];
  placeholder?: string;
  hint?: string;
  half?: boolean;
};

const observacoes: Field = {
  name: 'observacoes',
  label: 'Observações',
  type: 'textarea',
  placeholder: 'Algo que a nossa equipe precisa saber?',
};

export const stepTwoFields: Record<ServiceId, { intro: string; fields: Field[] }> = {
  transporte: {
    intro: 'Conte o trajeto e o que será transportado. Se não souber algum dado, deixe em branco.',
    fields: [
      { name: 'modalidade', label: 'Modalidade', type: 'select', options: ['Rodoviário', 'Aéreo', 'Ainda não sei'] },
      { name: 'origem', label: 'Cidade de origem', type: 'text', required: true, placeholder: 'Ex.: Manaus', half: true },
      { name: 'destino', label: 'Cidade de destino', type: 'text', required: true, placeholder: 'Ex.: Boa Vista', half: true },
      { name: 'mercadoria', label: 'Tipo de mercadoria', type: 'text', placeholder: 'Ex.: eletrônicos, materiais de PDV' },
      { name: 'volumes', label: 'Quantidade de volumes', type: 'number', half: true },
      { name: 'peso', label: 'Peso aproximado', type: 'text', placeholder: 'Ex.: 120 kg', half: true },
      { name: 'dimensoes', label: 'Dimensões', type: 'text', placeholder: 'Ex.: 3 caixas de 60×40×40 cm', half: true },
      { name: 'data', label: 'Data desejada para entrega', type: 'date', half: true },
      observacoes,
    ],
  },
  entregas: {
    intro: 'Informe onde coletar e onde entregar. O restante é opcional.',
    fields: [
      { name: 'coleta', label: 'Local de coleta', type: 'text', required: true, placeholder: 'Bairro / cidade', half: true },
      { name: 'entrega', label: 'Local de entrega', type: 'text', required: true, placeholder: 'Bairro / cidade', half: true },
      { name: 'mercadoria', label: 'Tipo de mercadoria', type: 'text' },
      { name: 'volumes', label: 'Quantidade de volumes', type: 'number', half: true },
      { name: 'frequencia', label: 'Frequência', type: 'select', options: ['Pontual', 'Recorrente'], half: true },
      { name: 'data', label: 'Data desejada', type: 'date', half: true },
      observacoes,
    ],
  },
  armazenagem: {
    intro: 'Descreva os materiais e como pretende movimentá-los.',
    fields: [
      { name: 'materiais', label: 'Tipo de materiais', type: 'text', required: true, placeholder: 'Ex.: displays, brindes, móveis de PDV' },
      { name: 'quantidade', label: 'Quantidade aproximada', type: 'text', placeholder: 'Ex.: 40 caixas ou 6 paletes', half: true },
      { name: 'periodo', label: 'Período previsto', type: 'text', placeholder: 'Ex.: 3 meses', half: true },
      {
        name: 'expedicao',
        label: 'Precisa de separação e expedição?',
        type: 'select',
        options: ['Sim, com entrega nos pontos de venda', 'Sim, retirada pela minha equipe', 'Ainda não sei'],
      },
      observacoes,
    ],
  },
  positivacao: {
    intro: 'Quanto mais detalhes da campanha, mais preciso o orçamento. Nada aqui é obrigatório além do tipo de operação.',
    fields: [
      { name: 'operacao', label: 'Tipo de operação', type: 'select', required: true, options: ['Positivação', 'Negativação', 'Positivação e negativação'] },
      { name: 'moveis', label: 'Quantidade de móveis / estruturas', type: 'number', half: true },
      { name: 'pontos', label: 'Pontos de instalação', type: 'number', half: true, hint: 'Número de lojas ou PDVs' },
      { name: 'materiais', label: 'Materiais envolvidos', type: 'text', placeholder: 'Ex.: ilha promocional, displays, testeiras' },
      { name: 'locais', label: 'Estabelecimentos / cidades', type: 'text', placeholder: 'Ex.: 3 atacadões em Manaus' },
      { name: 'data', label: 'Data prevista', type: 'date', half: true },
      observacoes,
    ],
  },
  outro: {
    intro: 'Descreva o que você precisa e a nossa equipe indica a melhor solução.',
    fields: [
      { name: 'descricao', label: 'Descreva a sua necessidade', type: 'textarea', required: true },
    ],
  },
};
