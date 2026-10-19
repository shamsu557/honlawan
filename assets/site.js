document.addEventListener('DOMContentLoaded', () => {
  const trigger = document.querySelector('.lhd-mobile-trigger');
  const shade = document.querySelector('.lhd-shade');
  const sidebar = document.querySelector('.lhd-sidebar');
  function setOpen(open) {
    if (!trigger || !shade || !sidebar) return;
    document.body.classList.toggle('lhd-nav-open', open);
    sidebar.classList.toggle('lhd-open', open);
    shade.classList.toggle('lhd-show', open);
    trigger.setAttribute('aria-expanded', String(open));
    trigger.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  }
  trigger?.addEventListener('click', () => setOpen(!document.body.classList.contains('lhd-nav-open')));
  shade?.addEventListener('click', () => setOpen(false));
  sidebar?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setOpen(false)));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') setOpen(false); });
  window.matchMedia('(min-width: 901px)').addEventListener('change', e => {if(e.matches) setOpen(false)});
  const inp = document.querySelector('section#search input,section#verify-project input');
  const btn = [...document.querySelectorAll('section#search button,section#verify-project button')].find(b => b.textContent.includes('Search Registry'));
  if (inp && btn) {
    const result = document.createElement('p');
    result.style.cssText = 'font-size:13px;margin-top:12px;color:#0a4a2e';
    btn.parentElement?.append(result);
    btn.addEventListener('click', () => {
      result.textContent = inp.value.trim() ? 'Search term: ' + inp.value.trim() + '. This offline demonstration cannot confirm live project registry results.' : 'Enter a project serial number to search.';
    });
  }
});
