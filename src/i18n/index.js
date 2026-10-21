import ja from './ja.json';
import en from './en.json';
import pt from './pt.json';

let locales; // built lazily, after the pseudo helpers below are defined
const getLocales = () => (locales ??= { ja, en, pt, pseudo: buildPseudo(en) });

// Which HTML lang attribute each locale uses (pseudo is English underneath)
const htmlLang = { ja: 'ja', en: 'en', pt: 'pt', pseudo: 'en' };

let current = 'ja';

export function setLang(lang) {
  current = getLocales()[lang] ? lang : 'ja';
  document.documentElement.lang = htmlLang[current];
  document.documentElement.dataset.locale = current;
}

export function getLang() {
  return current;
}

/** Look up a dotted key like "ui.settings". Falls back to English, then to the key itself. */
export function t(key) {
  return lookup(getLocales()[current], key) ?? lookup(en, key) ?? key;
}

/** Fill every element marked with data-i18n / data-i18n-aria. */
export function applyStaticStrings(root = document) {
  root.querySelectorAll('[data-i18n]').forEach((el) => {
    el.textContent = t(el.dataset.i18n);
  });
  root.querySelectorAll('[data-i18n-aria]').forEach((el) => {
    el.setAttribute('aria-label', t(el.dataset.i18nAria));
  });
}

function lookup(obj, key) {
  return key.split('.').reduce((o, k) => (o == null ? undefined : o[k]), obj);
}

/* ------------------------------------------------------------
   Pseudo-localization (a standard LQA technique)
   - accents every letter, so hard-coded strings stand out
   - pads text ~40%, to simulate languages that run longer
   - wraps in brackets, so truncation is easy to spot
   ------------------------------------------------------------ */
const accentMap = {
  a: 'á', b: 'ƀ', c: 'ç', d: 'ð', e: 'é', f: 'ƒ', g: 'ĝ', h: 'ĥ', i: 'î', j: 'ĵ',
  k: 'ķ', l: 'ļ', m: 'ɱ', n: 'ñ', o: 'ö', p: 'þ', q: 'ǫ', r: 'ŕ', s: 'š', t: 'ţ',
  u: 'û', v: 'ṽ', w: 'ŵ', x: 'ẋ', y: 'ý', z: 'ž',
  A: 'Å', B: 'Ɓ', C: 'Ç', D: 'Ð', E: 'É', F: 'Ƒ', G: 'Ĝ', H: 'Ĥ', I: 'Î', J: 'Ĵ',
  K: 'Ķ', L: 'Ļ', M: 'Ṁ', N: 'Ñ', O: 'Ö', P: 'Þ', Q: 'Ǫ', R: 'Ŕ', S: 'Š', T: 'Ţ',
  U: 'Û', V: 'Ṽ', W: 'Ŵ', X: 'Ẋ', Y: 'Ý', Z: 'Ž',
};

function pseudoString(str) {
  if (!str) return str;
  const accented = [...str].map((ch) => accentMap[ch] ?? ch).join('');
  const padding = ' ' + '·'.repeat(Math.ceil(str.length * 0.4));
  return `[${accented}${padding}]`;
}

function buildPseudo(obj) {
  if (typeof obj === 'string') return pseudoString(obj);
  return Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, buildPseudo(v)]));
}
