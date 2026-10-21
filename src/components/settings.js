/* ============================================
   Settings: state, persistence and the panel's controls
   ============================================ */

const STORAGE_KEY = 'vn-ui-kit:settings';

export const defaults = {
  lang: 'ja',
  textScale: 1,
  textSpeed: 3, // 1 = slow ... 5 = instant
  theme: 'default',
  furigana: true,
};

// Milliseconds per character for each speed step
const SPEED_MS = { 1: 110, 2: 75, 3: 50, 4: 25, 5: 0 };
export const msPerChar = (speed) => SPEED_MS[speed] ?? SPEED_MS[3];

export function loadSettings() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return { ...defaults, ...saved };
  } catch {
    return { ...defaults };
  }
}

function save(settings) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch {
    /* private mode or blocked storage: settings just won't persist */
  }
}

/** Apply settings that are purely visual (tokens / classes on <html>). */
export function applyVisualSettings(s) {
  const html = document.documentElement;
  html.style.setProperty('--text-scale', s.textScale);
  if (s.theme === 'default') delete html.dataset.theme;
else html.dataset.theme = s.theme;
  html.classList.toggle('no-furigana', !s.furigana);
}

/** Wire the <dialog> controls. onChange(settings, changedKey) runs after every change. */
export function bindSettingsPanel(dialog, settings, onChange) {
  const q = (sel) => dialog.querySelector(sel);

  dialog.querySelectorAll('input[name="lang"]').forEach((r) => {
    r.checked = r.value === settings.lang;
  });
  q('#text-scale').value = settings.textScale;
  q('#text-speed').value = settings.textSpeed;
  dialog.querySelectorAll('input[name="theme"]').forEach((r) => {
  r.checked = r.value === settings.theme;
});
  q('#furigana').checked = settings.furigana;

  dialog.addEventListener('input', (e) => {
    const el = e.target;
    let key;
    if (el.name === 'lang') { key = 'lang'; settings.lang = el.value; }
    else if (el.id === 'text-scale') { key = 'textScale'; settings.textScale = Number(el.value); }
    else if (el.id === 'text-speed') { key = 'textSpeed'; settings.textSpeed = Number(el.value); }
    else if (el.name === 'theme') { key = 'theme'; settings.theme = el.value; }
    else if (el.id === 'furigana') { key = 'furigana'; settings.furigana = el.checked; }
    else return;
    save(settings);
    onChange(settings, key);
  });
}
