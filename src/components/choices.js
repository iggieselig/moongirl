/* ============================================
   Choice buttons component
   - shown after the question has finished typing
   - keyboard: Tab / arrow keys to move, Enter to pick, or press 1, 2, 3...
   - labels support furigana markup, like dialogue lines
   ============================================ */

import { parseLine, renderSegment } from './dialogue.js';

// Remember whether the player is using the keyboard or a mouse/touch,
// so the "shifted" hover look only shows on focus for keyboard players.
let usingKeyboard = false;
const choiceGroups = new Set();
function setInputMode(keyboard) {
  usingKeyboard = keyboard;
  choiceGroups.forEach((el) => { el.dataset.input = keyboard ? 'keyboard' : 'pointer'; });
}
document.addEventListener('keydown', () => setInputMode(true), true);
document.addEventListener('pointerdown', () => setInputMode(false), true);

export function createChoices(root) {
  let onPick = null;
  choiceGroups.add(root);
  root.dataset.input = 'pointer';

  function hide() {
    root.hidden = true;
    root.replaceChildren();
    onPick = null;
  }

  function buttons() {
    return [...root.querySelectorAll('button')];
  }

  root.addEventListener('keydown', (e) => {
    const list = buttons();
    const i = list.indexOf(document.activeElement);
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
      e.preventDefault();
      list[(i + 1) % list.length].focus();
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
      e.preventDefault();
      list[(i - 1 + list.length) % list.length].focus();
    }
  });

  // Number keys pick an option directly (1 = first option)
  document.addEventListener('keydown', (e) => {
    if (root.hidden || !onPick) return;
    const n = Number(e.key);
    if (n >= 1 && n <= buttons().length) buttons()[n - 1].click();
  });

  return {
    /**
     * options: [{ text, value }]. onChoose(value) runs when one is picked.
     * keepFocus: re-render without stealing focus (used when the language changes).
     */
    show(question, options, onChoose, { keepFocus = false } = {}) {
      const focusedIndex = buttons().indexOf(document.activeElement);
      root.replaceChildren();
      root.setAttribute('aria-label', question);
      onPick = onChoose;

      options.forEach((opt, i) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'choice';
        btn.append(...parseLine(opt.text).map(renderSegment));
        btn.addEventListener('click', (e) => {
          e.stopPropagation(); // don't also count as "advance the dialogue"
          const pick = onPick;
          hide();
          pick?.(opt.value);
        });
        root.append(btn);
      });

      root.hidden = false;
      const target = keepFocus && focusedIndex >= 0 ? focusedIndex : 0;
      root.dataset.input = usingKeyboard ? 'keyboard' : 'pointer';
      buttons()[target]?.focus();
    },
    hide,
    isOpen: () => !root.hidden,
  };
}
