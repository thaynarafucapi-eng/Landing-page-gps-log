import { trackFormStep, trackLead, trackQuoteCta, trackWhatsappClick } from './tracking';
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

function formatPhone(value: string) {
  const d = value.replace(/\D/g, '').slice(0, 11);
  if (d.length <= 2) return d ? `(${d}` : '';
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

function formatDate(iso: string) {
  const [y, m, d] = iso.split('-');
  return y && m && d ? `${d}/${m}/${y}` : iso;
}

function initQuoteForm() {
  const form = document.querySelector<HTMLFormElement>('[data-quote-form]');
  if (!form) return;

  const step1 = form.querySelector<HTMLFieldSetElement>('[data-step="1"]')!;
  const step2 = form.querySelector<HTMLFieldSetElement>('[data-step="2"]')!;
  const done = form.querySelector<HTMLElement>('[data-done]')!;
  const doneLink = form.querySelector<HTMLAnchorElement>('[data-done-link]')!;
  const stepLabel = form.querySelector<HTMLElement>('[data-step-label]')!;
  const progress = form.querySelector<HTMLElement>('[data-progress]')!;
  const hoursNote = form.querySelector<HTMLElement>('[data-hours-note]')!;
  const phone = form.querySelector<HTMLInputElement>('[data-phone]')!;
  const groups = Array.from(form.querySelectorAll<HTMLElement>('[data-group]'));
  const radios = Array.from(form.querySelectorAll<HTMLInputElement>('input[name="servico"]'));

  const selectedService = () => radios.find((r) => r.checked)?.value ?? '';

  /* ----- erros ----- */
  const errorEl = (key: string) => form.querySelector<HTMLElement>(`[data-error-for="${key}"]`);
  const setError = (el: HTMLElement, key: string, msg: string) => {
    const err = errorEl(key);
    if (err) {
      err.textContent = msg;
      if (!err.id) err.id = `${key}-err`;
      el.setAttribute('aria-describedby', err.id);
    }
    if (msg) el.setAttribute('aria-invalid', 'true');
    else el.removeAttribute('aria-invalid');
  };

  const validateField = (el: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement): boolean => {
    let msg = '';
    const value = el.value.trim();
    if (el.required && !value) {
      msg = el.tagName === 'SELECT' ? 'Selecione uma opção.' : 'Preencha este campo.';
    } else if (el === phone && value) {
      const digits = value.replace(/\D/g, '');
      if (digits.length < 10 || digits.length > 11) msg = 'Informe um WhatsApp com DDD. Ex.: (92) 99999-9999.';
    } else if (el.name === 'nome' && value && value.length < 2) {
      msg = 'Informe o seu nome.';
    } else if (el instanceof HTMLInputElement && el.type === 'number' && value && Number(value) < 0) {
      msg = 'Informe um número válido.';
    }
    setError(el, el.id, msg);
    return !msg;
  };

  const validateService = () => {
    const ok = !!selectedService();
    const err = errorEl('servico');
    if (err) err.textContent = ok ? '' : 'Escolha o tipo de serviço.';
    return ok;
  };

  const fieldsIn = (scope: HTMLElement) =>
    Array.from(scope.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>('input, select, textarea')).filter(
      (el) => !el.disabled && el.type !== 'radio',
    );

  const validateScope = (scope: HTMLElement) => {
    let firstInvalid: HTMLElement | null = null;
    for (const el of fieldsIn(scope)) {
      if (!validateField(el) && !firstInvalid) firstInvalid = el;
    }
    return firstInvalid;
  };

  form.addEventListener('blur', (e) => {
    const el = e.target as HTMLInputElement;
    if (el.matches?.('input:not([type=radio]), select, textarea') && el.getAttribute('aria-invalid') === 'true') validateField(el);
  }, true);
  form.addEventListener('input', (e) => {
    const el = e.target as HTMLInputElement;
    if (el.getAttribute?.('aria-invalid') === 'true') validateField(el);
  });

  phone.addEventListener('input', () => {
    phone.value = formatPhone(phone.value);
  });

  radios.forEach((r) =>
    r.addEventListener('change', () => {
      validateService();
    }),
  );

  /* ----- etapas ----- */
  const showGroup = (service: string) => {
    groups.forEach((g) => {
      const active = g.dataset.group === service;
      g.hidden = !active;
      g.querySelectorAll<HTMLInputElement>('input, select, textarea').forEach((el) => (el.disabled = !active));
    });
  };

  const goTo = (step: 1 | 2 | 3) => {
    step1.hidden = step !== 1;
    step2.hidden = step !== 2;
    done.hidden = step !== 3;
    progress.style.width = step === 1 ? '50%' : '100%';
    stepLabel.textContent =
      step === 1 ? 'Etapa 1 de 2 · Dados básicos' : step === 2 ? `Etapa 2 de 2 · ${serviceLabel(selectedService())}` : 'Solicitação pronta';
    stepLabel.hidden = step === 3;
  };

  const focusFirst = (scope: HTMLElement) => {
    const el = fieldsIn(scope).find((f) => !f.closest('[hidden]'));
    el?.focus({ preventScroll: true });
    form.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  form.querySelector('[data-next]')!.addEventListener('click', () => {
    const invalid = validateScope(step1);
    const serviceOk = validateService();
    if (invalid) return invalid.focus();
    if (!serviceOk) return radios[0].focus();
    showGroup(selectedService());
    hoursNote.textContent = isBusinessHours()
      ? `Estamos em horário comercial: o primeiro retorno acontece em ${company.firstResponse}.`
      : `Estamos fora do horário comercial (${company.hours.short}). Envie mesmo assim: respondemos a partir do próximo horário de atendimento.`;
    goTo(2);
    trackFormStep(selectedService());
    focusFirst(step2);
  });

  form.querySelector('[data-back]')!.addEventListener('click', () => {
    goTo(1);
    form.scrollIntoView({ behavior: 'smooth', block: 'start' });
    radios.find((r) => r.checked)?.focus({ preventScroll: true });
  });

  form.querySelector('[data-restart]')!.addEventListener('click', () => {
    form.reset();
    groups.forEach((g) => (g.hidden = true));
    goTo(1);
    focusFirst(step1);
  });

  /* ----- envio ----- */
  const buildMessage = () => {
    const data = new FormData(form);
    const service = selectedService();
    const lines = [
      '*Solicitação de orçamento — site GPSLOG*',
      '',
      `*Serviço:* ${serviceLabel(service)}`,
      `*Nome:* ${String(data.get('nome') ?? '').trim()}`,
    ];
    const empresa = String(data.get('empresa') ?? '').trim();
    if (empresa) lines.push(`*Empresa:* ${empresa}`);
    lines.push(`*WhatsApp:* ${String(data.get('whatsapp') ?? '').trim()}`);

    const details: string[] = [];
    const group = form.querySelector<HTMLElement>(`[data-group="${service}"]`);
    group?.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>('input, select, textarea').forEach((el) => {
      const v = el.value.trim();
      if (!v) return;
      const label = el.dataset.label ?? el.name;
      details.push(`• ${label}: ${el instanceof HTMLInputElement && el.type === 'date' ? formatDate(v) : v}`);
    });
    if (details.length) lines.push('', '*Detalhes da operação*', ...details);
    return lines.join('\n');
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const invalid1 = validateScope(step1);
    if (invalid1 || !validateService()) {
      goTo(1);
      (invalid1 ?? radios[0]).focus();
      return;
    }
    const invalid2 = validateScope(step2);
    if (invalid2) return invalid2.focus();

    const url = `https://wa.me/${contact.whatsappNumber}?text=${encodeURIComponent(buildMessage())}`;
    trackLead(selectedService());
    doneLink.href = url;

    // Sem 'noopener' no terceiro argumento: com ele o navegador sempre retorna null.
    const win = window.open(url, '_blank');
    if (win) win.opener = null;
    goTo(3);
    done.focus({ preventScroll: true });
    form.scrollIntoView({ behavior: 'smooth', block: 'start' });
    // Se o navegador bloquear a nova aba, abre na mesma aba.
    if (!win) window.location.href = url;
  });

  /* ----- pré-seleção do serviço (botões da página e ?servico= na URL) ----- */
  const preselect = (service: string | null | undefined) => {
    if (!service) return;
    const radio = radios.find((r) => r.value === service);
    if (!radio) return;
    if (!step1.hidden) {
      radio.checked = true;
      validateService();
    }
  };

  preselect(new URLSearchParams(window.location.search).get('servico'));

  document.querySelectorAll<HTMLAnchorElement>('[data-cta-location]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const service = a.dataset.quoteService;
      trackQuoteCta(a.dataset.ctaLocation ?? '', service);
      e.preventDefault();
      if (service) {
        if (step1.hidden) goTo(1);
        preselect(service);
        const url = new URL(window.location.href);
        url.searchParams.set('servico', service);
        url.hash = 'orcamento';
        history.replaceState(null, '', url);
      }
      document.getElementById('orcamento')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      const nome = form.querySelector<HTMLInputElement>('#qf-nome');
      // Foco automático só com mouse: no celular abriria o teclado sem o visitante pedir.
      if (nome && !step1.hidden && window.matchMedia('(pointer: fine)').matches) setTimeout(() => nome.focus({ preventScroll: true }), 450);
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
