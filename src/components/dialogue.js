/* ============================================
   Dialogue box component
   - typewriter effect at a configurable speed
   - furigana markup: {漢字|かんじ} becomes <ruby>漢字<rt>かんじ</rt></ruby>
   - ruby units appear whole, so readings never show up half-typed
   ============================================ */

const RUBY = /\{([^|}]+)\|([^}]+)\}/g;

/** Split a line into segments: single characters, or whole ruby units. */
export function parseLine(text) {
  const segments = [];
  let last = 0;
  for (const m of text.matchAll(RUBY)) {
    for (const ch of text.slice(last, m.index)) segments.push({ ch });
    segments.push({ base: m[1], reading: m[2] });
    last = m.index + m[0].length;
  }
  for (const ch of text.slice(last)) segments.push({ ch });
  return segments;
}

/** Plain text (no readings) for screen readers. */
export function plainText(text) {
  return text.replace(RUBY, '$1');
}

export function renderSegment(seg) {
  if (seg.ch !== undefined) return document.createTextNode(seg.ch);
  const ruby = document.createElement('ruby');
  ruby.append(seg.base);
  const rt = document.createElement('rt');
  rt.textContent = seg.reading;
  ruby.append(rt);
  return ruby;
}

export function createDialogue(root) {
  const nameEl = root.querySelector('[data-name]');
  const textEl = root.querySelector('[data-text]');
  const srEl = root.querySelector('[data-sr]');

  let timer = null;
  let segments = [];
  let index = 0;
  let onDone = null;

  function finish() {
    clearInterval(timer);
    timer = null;
    textEl.replaceChildren(...segments.map(renderSegment));
    index = segments.length;
    root.classList.add('is-done');
    const done = onDone;
    onDone = null;
    done?.(); // e.g. show the choice buttons once a question has finished typing
  }

  return {
    /** Show a line. msPerChar = 0 shows it instantly. whenDone runs once the line is fully shown. */
    show(name, text, msPerChar, speaker, whenDone = null) {
      clearInterval(timer);
      timer = null;
      onDone = whenDone;
      nameEl.textContent = name;
      nameEl.hidden = !name;
      nameEl.dataset.speaker = speaker;
      srEl.textContent = (name ? name + ': ' : '') + plainText(text);
      segments = parseLine(text);
      index = 0;
      textEl.replaceChildren();
      root.classList.remove('is-done');

      if (!msPerChar) return finish();
      timer = setInterval(() => {
        textEl.append(renderSegment(segments[index++]));
        if (index >= segments.length) finish();
      }, msPerChar);
    },
    isTyping: () => timer !== null,
    finish,
  };
}
