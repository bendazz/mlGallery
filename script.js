/* Data-driven gallery: loads topics and apps from data/gallery.json */

const state = {
  topics: [],
  active: { topic: null, app: null },
};

async function loadData() {
  const res = await fetch('./data/gallery.json', { cache: 'no-store' });
  if (!res.ok) throw new Error(`Failed to load gallery.json: ${res.status}`);
  const data = await res.json();
  state.topics = data.topics || [];
}

function el(tag, attrs = {}, ...children) {
  const e = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === 'class') e.className = v;
    else if (k === 'dataset') Object.assign(e.dataset, v);
    else if (k.startsWith('on') && typeof v === 'function') e.addEventListener(k.substring(2), v);
    else if (v !== undefined && v !== null) e.setAttribute(k, v);
  }
  for (const c of children.flat()) {
    if (c == null) continue;
    e.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
  }
  return e;
}

function renderMenu(filter = '') {
  const menu = document.getElementById('menu');
  menu.innerHTML = '';
  const normalized = filter.trim().toLowerCase();

  for (const topic of state.topics) {
    const section = el('section', { class: 'section' });
    const header = el('div', { class: 'section-header' },
      el('span', {}, topic.title || 'Untitled topic'),
      el('span', { class: 'details' }, `${(topic.apps || []).length} app(s)`) 
    );

    const body = el('div', { class: 'section-body' });

    // Normalize topic apps: allow either array of strings (URLs) or objects with { url, title?, ... }
    const normalizedApps = (topic.apps || []).map((a) =>
      typeof a === 'string' ? { url: a } : a
    );

    const apps = normalizedApps.filter(a =>
      !normalized ||
      (topic.title || '').toLowerCase().includes(normalized) ||
  (a.url || '').toLowerCase().includes(normalized)
    );

    if (apps.length === 0 && normalized) {
      // Skip empty sections when searching
      continue;
    }

    for (const app of apps) {
      const link = el('a', {
        class: 'app-link', href: '#',
        onclick: (e) => { e.preventDefault(); selectApp(topic, app); }
      },
        el('div', { class: 'name' }, app.url)
      );
      body.appendChild(link);
    }

    header.addEventListener('click', () => {
      body.classList.toggle('hidden');
    });

    section.appendChild(header);
    section.appendChild(body);
    menu.appendChild(section);
  }
}

function selectApp(topic, app) {
  state.active = { topic, app };

  const iframe = document.getElementById('viewer');
  const openBtn = document.getElementById('openNewTab');
  const breadcrumb = document.getElementById('breadcrumb');
  const message = document.getElementById('message');

  const url = app.url;
  iframe.src = url || 'about:blank';
  openBtn.href = url || '#';

  breadcrumb.textContent = `${topic.title || 'Topic'} › ${app.url || ''}`;

  // Show message for same-origin local apps only once they failed to load? Hard to detect. Hide default message now.
  message.classList.add('hidden');
}

function initUI() {
  const search = document.getElementById('search');
  search.addEventListener('input', (e) => renderMenu(e.target.value));
}

async function main() {
  initUI();
  try {
    await loadData();
    renderMenu('');
  } catch (err) {
    console.error(err);
    const menu = document.getElementById('menu');
    menu.textContent = 'Failed to load gallery data.';
  }
}

main();
