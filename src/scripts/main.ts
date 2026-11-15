import { trackWhatsappClick } from './tracking';

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

initHeader();
initClickTracking();
