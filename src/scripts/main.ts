import { trackLead, trackQuoteCta, trackWhatsappClick } from './tracking';
import { contact, company, services } from '../config/site';

/* ---------------- Cabeçalho: sombra ao rolar + menu mobile ---------------- */
function initHeader() {
  const header = document.querySelector<HTMLElement>('[data-header]');
  const toggle = document.querySelector<HTMLButtonElement>('[data-menu-toggle]');
  const menu = document.querySelector<HTMLElement>('[data-menu]');
  if (!header) return;

  const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 8);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  if (!toggle || !menu) return;
  const setOpen = (open: boolean) => {
    menu.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  };
  toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));
  menu.querySelectorAll('[data-menu-link]').forEach((a) => a.addEventListener('click', () => setOpen(false)));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
      setOpen(false);
      toggle.focus();
    }
  });
}

/* ---------------- Rastreamento de cliques ---------------- */
function initClickTracking() {
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    const wa = target.closest<HTMLElement>('[data-wa-location]');
    if (wa) trackWhatsappClick(wa.dataset.waLocation || 'desconhecido');
  });
}

/* ---------------- Horário comercial (fuso de Manaus) ---------------- */
function isBusinessHours(now = new Date()) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: company.hours.timezone,
    weekday: 'short',
    hour: 'numeric',
    hour12: false,
  }).formatToParts(now);
  const wd = parts.find((p) => p.type === 'weekday')?.value ?? '';
  const hour = Number(parts.find((p) => p.type === 'hour')?.value ?? 0) % 24;
  const day = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(wd);
  return (company.hours.days as readonly number[]).includes(day) && hour >= company.hours.open && hour < company.hours.close;
}

/* ---------------- Formulário de orçamento ---------------- */
const serviceLabel = (id: string) => services.find((s) => s.id === id)?.label ?? id;

function initQuoteForm() {
  const form = document.querySelector<HTMLFormElement>('[data-quote-form]');
  if (!form) return;

  const step = form.querySelector<HTMLFieldSetElement>('[data-step="1"]')!;
  const done = form.querySelector<HTMLElement>('[data-done]')!;
  const doneLink = form.querySelector<HTMLAnchorElement>('[data-done-link]')!;
  const hoursNote = form.querySelector<HTMLElement>('[data-hours-note]')!;
  const nome = form.querySelector<HTMLInputElement>('#qf-nome')!;
  const radios = Array.from(form.querySelectorAll<HTMLInputElement>('input[name="servico"]'));

  const selectedService = () => radios.find((r) => r.checked)?.value ?? '';

  hoursNote.textContent = isBusinessHours()
    ? `Estamos em horário comercial: o primeiro retorno acontece em ${company.firstResponse}.`
    : `Estamos fora do horário comercial (${company.hours.short}). Envie mesmo assim: respondemos a partir do próximo horário de atendimento.`;

  /* ----- validação ----- */
  const errorEl = (key: string) => form.querySelector<HTMLElement>(`[data-error-for="${key}"]`);

  const validateNome = () => {
    const ok = nome.value.trim().length >= 2;
    const err = errorEl('qf-nome');
    if (err) {
      err.textContent = ok ? '' : 'Informe o seu nome.';
      err.id = 'qf-nome-err';
      nome.setAttribute('aria-describedby', err.id);
    }
    if (ok) nome.removeAttribute('aria-invalid');
    else nome.setAttribute('aria-invalid', 'true');
    return ok;
  };

  const validateService = () => {
    const ok = !!selectedService();
    const err = errorEl('servico');
    if (err) err.textContent = ok ? '' : 'Escolha o tipo de serviço.';
    return ok;
  };

  nome.addEventListener('input', () => {
    if (nome.getAttribute('aria-invalid') === 'true') validateNome();
  });
  radios.forEach((r) => r.addEventListener('change', validateService));

  const show = (finished: boolean) => {
    step.hidden = finished;
    done.hidden = !finished;
  };

  form.querySelector('[data-restart]')!.addEventListener('click', () => {
    form.reset();
    show(false);
    nome.focus({ preventScroll: true });
    form.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  /* ----- envio ----- */
  const buildMessage = () => {
    const data = new FormData(form);
    const lines = [
      'Olá! Conheci a GPSLOG pelo site e gostaria de solicitar um orçamento.',
      '',
      `*Nome:* ${String(data.get('nome') ?? '').trim()}`,
    ];
    const empresa = String(data.get('empresa') ?? '').trim();
    if (empresa) lines.push(`*Empresa:* ${empresa}`);
    lines.push(`*Serviço:* ${serviceLabel(selectedService())}`);
    return lines.join('\n');
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const nomeOk = validateNome();
    const serviceOk = validateService();
    if (!nomeOk) return nome.focus();
    if (!serviceOk) return radios[0].focus();

    const url = `https://wa.me/${contact.whatsappNumber}?text=${encodeURIComponent(buildMessage())}`;
    trackLead(selectedService());
    doneLink.href = url;

    // Sem 'noopener' no terceiro argumento: com ele o navegador sempre retorna null.
    const win = window.open(url, '_blank');
    if (win) win.opener = null;
    show(true);
    done.focus({ preventScroll: true });
    form.scrollIntoView({ behavior: 'smooth', block: 'start' });
    // Se o navegador bloquear a nova aba, abre na mesma aba.
    if (!win) window.location.href = url;
  });

  /* ----- pré-seleção do serviço (botões da página e ?servico= na URL) ----- */
  const preselect = (service: string | null | undefined) => {
    const radio = radios.find((r) => r.value === service);
    if (!radio) return;
    radio.checked = true;
    validateService();
  };

  preselect(new URLSearchParams(window.location.search).get('servico'));

  document.querySelectorAll<HTMLAnchorElement>('[data-cta-location]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const service = a.dataset.quoteService;
      trackQuoteCta(a.dataset.ctaLocation ?? '', service);
      e.preventDefault();
      if (step.hidden) show(false);
      if (service) {
        preselect(service);
        const url = new URL(window.location.href);
        url.searchParams.set('servico', service);
        url.hash = 'orcamento';
        history.replaceState(null, '', url);
      }
      document.getElementById('orcamento')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // Foco automático só com mouse: no celular abriria o teclado sem o visitante pedir.
      if (window.matchMedia('(pointer: fine)').matches) setTimeout(() => nome.focus({ preventScroll: true }), 450);
    });
  });
}

/* ---------------- Botão flutuante: some sobre o formulário (não cobre o "Enviar") ---------------- */
function initFloatingButton() {
  const btn = document.querySelector<HTMLElement>('.wa-float');
  const quote = document.getElementById('orcamento');
  if (!btn || !quote || !('IntersectionObserver' in window)) return;
  new IntersectionObserver(([entry]) => btn.classList.toggle('is-hidden', entry.isIntersecting), {
    rootMargin: '-15% 0px -15% 0px',
  }).observe(quote);
}

initHeader();
initClickTracking();
initFloatingButton();
initQuoteForm();
