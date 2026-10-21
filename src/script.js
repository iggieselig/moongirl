/* ============================================
   Moongirl was in love with the ocean — the script
   The text lives in src/i18n/*.json; this file only says the ORDER and the BRANCHES.

   Each scene is a list of steps. A step can be:
     { line: 'key' }                       → a line of text (narrator by default)
     { line: 'key', speaker: 'moongirl' }  → a line said by a character
     { choice: 'key', options: [           → a question with buttons
         { label: 'key', goto: 'scene' },
       ] }
     { goto: 'scene' }                     → jump to another scene
   ============================================ */

export const START = 's1';

export const scenes = {
  // ---------- S1: on the beach ----------
  s1: [
    { line: 'mg.title' },
    { line: 'mg.s1.intro' },
    {
      choice: 'mg.s1.talk',
      options: [
        { label: 'mg.yes', goto: 's1_yes' },
        { label: 'mg.no', goto: 's1_no' },
      ],
    },
  ],

  s1_yes: [
    { line: 'mg.s1.cantHear' },
    {
      choice: 'mg.s1.callAgain',
      options: [
        { label: 'mg.yes', goto: 's1_reach' },
        { label: 'mg.no', goto: 's1_watch' },
      ],
    },
  ],

  s1_no: [
    { line: 'mg.s1.walks' },
    { goto: 's2' },
  ],

  s1_reach: [
    { line: 'mg.s1.reach' },
    { goto: 's2' },
  ],

  s1_watch: [
    { line: 'mg.s1.watch' },
    { goto: 's2_no' }, // giving up on calling her skips the chance to follow
  ],

  // ---------- S2: toward the sea ----------
  s2: [
    {
      choice: 'mg.s2.follow',
      options: [
        { label: 'mg.yes', goto: 's2_yes' },
        { label: 'mg.no', goto: 's2_no' },
      ],
    },
  ],

  s2_yes: [
    { line: 'mg.s2.swim' },
    { goto: 's3' },
  ],

  s2_no: [
    { line: 'mg.s2.stay' },
    { line: 'mg.s2.dissolve' },
    { line: 'mg.s2.wave' },
    { line: 'mg.s2.alone' },
    { goto: 'end_alone' },
  ],

  // ---------- S3: in the water (exploration + inventory come next) ----------
  s3: [
    { line: 'mg.s3.feet' },
    { line: 'mg.s3.wip' },
    {
      choice: 'mg.end.toBeContinued',
      options: [{ label: 'mg.playAgain', goto: START }],
    },
  ],

  // ---------- Endings ----------
  end_alone: [
    {
      choice: 'mg.end.gameOver',
      options: [{ label: 'mg.playAgain', goto: START }],
    },
  ],
};
