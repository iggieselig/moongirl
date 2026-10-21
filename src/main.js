import './styles/tokens.css';
import './styles/base.css';
import './styles/components.css';

import { setLang, t, applyStaticStrings } from './i18n/index.js';
import { createDialogue, parseLine, renderSegment } from './components/dialogue.js';
import { createChoices } from './components/choices.js';
import {
  loadSettings,
  applyVisualSettings,
  bindSettingsPanel,
  msPerChar,
} from './components/settings.js';
import { scenes, START } from './script.js';

const settings = loadSettings();
const stage = document.getElementById('stage');
const settingsDialog = document.getElementById('settings');
const dialogue = createDialogue(document.getElementById('dialogue'));
const choices = createChoices(document.getElementById('choices'));

// Where we are in the story
let sceneId = START;
let stepIndex = 0;

function goTo(id) {
  if (!scenes[id]) {
    console.error(`Scene "${id}" doesn't exist in script.js`);
    return;
  }
  sceneId = id;
  stepIndex = 0;
  stage.dataset.scene = id; // lets CSS change the background per scene
  updatePhases(id);
  showStep();
}

function showStep({ animate = true } = {}) {
  const step = scenes[sceneId][stepIndex];
  if (!step) return; // end of a scene with no goto: just stop

  // A pure jump: go straight to the next scene
  if (step.goto && !step.line && !step.choice) return goTo(step.goto);

  const speaker = step.speaker ?? 'narrator';
  const text = t(step.line ?? step.choice);
  const speed = animate ? msPerChar(settings.textSpeed) : 0;

  if (step.choice) {
    choices.hide();
    // Show the question, and the buttons once it has finished typing
    dialogue.show(t(`names.${speaker}`), text, speed, speaker, () => {
      choices.show(
        text,
        step.options.map((o) => ({ text: t(o.label), value: o.goto })),
        (target) => goTo(target),
        { keepFocus: !animate },
      );
    });
  } else {
    dialogue.show(t(`names.${speaker}`), text, speed, speaker);
  }
}

// Which moon phase (act) each scene belongs to: s1… = 1, s2… = 2, s3… = 3, endings = 4
function actOf(id) {
  if (id.startsWith('end')) return 4;
  return Number(id.match(/^s(\d)/)?.[1] ?? 1);
}

function updatePhases(id) {
  const act = actOf(id);
  document.querySelectorAll('#phases .phase').forEach((el) => {
    const n = Number(el.dataset.phase);
    el.classList.toggle('is-current', n === act);
    el.classList.toggle('is-past', n < act);
  });
  document.getElementById('phases').setAttribute('aria-label', `${t('ui.progress')} ${act} / 4`);
}

function renderTitle() {
  const title = t('ui.gameTitle');
  document.getElementById('game-title').replaceChildren(...parseLine(title).map(renderSegment));
  document.title = title.replace(/\{([^|}]+)\|[^}]+\}/g, '$1');
}

function advance() {
  stage.classList.add('has-advanced'); // hides the "click to continue" hint after the first time
  if (choices.isOpen()) return; // waiting for the player to pick
  if (dialogue.isTyping()) return dialogue.finish();
  stepIndex += 1;
  showStep();
}

// --- Input: click / tap anywhere on the stage, or Enter / Space
stage.addEventListener('click', (e) => {
  if (e.target.closest('.toolbar, .choices-wrap')) return;
  advance();
});

document.addEventListener('keydown', (e) => {
  if (settingsDialog.open) return;
  if (e.target.closest('button, input')) return;
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    advance();
  }
});

// --- Music button (placeholder: no sound yet, it only remembers on/off)
const musicBtn = document.getElementById('music-btn');
musicBtn.addEventListener('click', () => {
  const on = musicBtn.getAttribute('aria-pressed') !== 'true';
  musicBtn.setAttribute('aria-pressed', String(on));
});

// --- Settings panel
document.getElementById('settings-btn').addEventListener('click', () => settingsDialog.showModal());

bindSettingsPanel(settingsDialog, settings, (s, key) => {
  applyVisualSettings(s);
  if (key === 'lang') {
    setLang(s.lang);
    applyStaticStrings();
    renderTitle();
    updatePhases(sceneId);
    showStep({ animate: false }); // re-render current line in the new language, no retyping
  }
});

// --- Boot
setLang(settings.lang);
applyVisualSettings(settings);
applyStaticStrings();
renderTitle();
goTo(START);
