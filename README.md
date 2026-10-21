# Moongirl was in love with the ocean

A short, bittersweet visual novel with a point-and-click scene, and the localization-ready UI design system built to run it. Plain HTML, CSS and JavaScript, playable in Japanese, English and Portuguese.

**[▶ Play the demo](https://iggieselig.github.io/moongirl/)** · **[Figma file](#)**

> 🚧 Work in progress. This README doubles as the project's case study and will grow with it.

## The story

Moongirl is staring at the ocean. You can talk to her, call her, follow her, but she can't hear you. The choices change how it feels, not where it goes, until the one moment where acting, not speaking, might reach her.

## The problem

Game UI is usually designed in one language and translated later. Text that fits in Japanese overflows in English or Portuguese, line breaks land in the wrong place, and readability options are added as an afterthought. Working in game localization QA, I see these bugs constantly.

## The approach

Design the UI system so localization and accessibility are built into the foundation, not patched in.

- **Tokens first.** Color, type, spacing, bevels, texture and motion live in `src/styles/tokens.css`. Components never use raw values, and themes (default, sepia, high contrast) only redefine tokens.
- **Text lives outside the code.** All strings are in `src/i18n/*.json`, so writers and translators never touch code. Missing translations fall back to English instead of leaving a blank.
- **Japanese typography done right.** Native `<ruby>` furigana, strict kinsoku line breaking, separate font stacks and line heights for Japanese and Latin text.
- **Pseudo-localization built in.** A QA locale that accents every character, pads text ~40% and brackets it, exposing hard-coded strings and truncation instantly.
- **Layouts that survive longer text.** The choice menu is stacked on top of the dialogue box, so a longer translation pushes it up instead of overlapping it. Sizes scale fluidly with the screen.
- **Accessibility as a setting, not a mode.** Text size, text speed (including instant), high contrast, reduced motion, keyboard play and screen-reader announcements.

## Visual direction

"Modern retro": warm dusk colours, Windows-98-style bevelled boxes (light on the top and left edges, shadow on the bottom and right), frosted glass with heavy noise, and mono type.

## Components

| Component | Status |
| --- | --- |
| Design tokens (color, type, spacing, bevels, texture, motion, themes) | ✅ |
| Dialogue box (typewriter, nameplate, furigana, advance cursor) | ✅ |
| Choice menu (keyboard + mouse, hover shift, number keys) | ✅ |
| Scene engine (scenes, branching choices, jumps) | ✅ |
| Story progress indicator | ✅ |
| Settings panel (language, text size, speed, theme, furigana) | ✅ |
| Point-and-click hotspots, inventory | ⬜ |
| Music and ambient sound | ⬜ |
| Backlog / history | ⬜ |

## Process

<!-- Research, sketches, Figma iterations, decisions and what changed after testing. -->

## Run it locally

```bash
npm install
npm run dev
```

## Stack

HTML · CSS · JavaScript · [Vite](https://vitejs.dev/) · GitHub Pages
