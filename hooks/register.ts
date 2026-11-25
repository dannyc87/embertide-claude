import type { Register, ThemeSetArgs, ThemeSound, ThemeStyle } from 'claude-code'

import { makeColors } from './make-colors.js'

// EmberTide, from ~/Projects/embertide. Dark only, as the terminal theme is.
const VERSION = '0.5.2'
const PAGE = '#001219'
const FOREGROUND = '#e9d8a6'
const BRIGHT = '#f6ebca'
const AMBER = '#ee9b00'
const CYAN = '#00b4d8'
// The prompt row takes the color of the app's message box (surface-3, sampled
// from a screenshot), lighter than the page. The reply is the page color itself,
// EmberTide's background, marked off by its border.
const PROMPT_BOX = 'surface-3'
const REPLY_BOX = PAGE
// EmberTide's bright black (#566165) is under 4.5:1 on the page, so dim text is lighter.
const DIM = '#8c9896'
// A 48 by 40 box with corners of radius 12, as the app's own boxes have (measured
// from a screenshot), its outline inset half a point for the border.
const ROUNDED_BOX =
  'M12 0.5H36A11.5 11.5 0 0 1 47.5 12V28A11.5 11.5 0 0 1 36 39.5H12A11.5 11.5 0 0 1 0.5 28V12A11.5 11.5 0 0 1 12 0.5Z'

const { theme, problems } = makeColors({
  label: 'EmberTide Terminal',
  only: 'dark',
  // No `codeTheme`: the app's own code theme colors code from the roles below,
  // which is the EmberTide palette. Naming a bundled theme would replace that.
  // The text stop of a role also colors code: keywords, literals and variables. It
  // is pinned to the EmberTide color, where the generator would make a pastel.
  roles: {
    accent: { seed: '#00b4d8', stops: { 300: '#00b4d8' } },
    danger: '#c23626',
    success: '#199647',
    warning: { seed: AMBER, stops: { 300: AMBER } },
    pro: { seed: '#ab51e3', stops: { 300: '#b866ea' } },
  },
  dark: {
    gray: {
      anchors: {
        'surface-0': PAGE,
        'surface-1': '#00161f',
        'surface-2': '#021a23',
        'surface-3': '#04212c',
        'text-primary': FOREGROUND,
        'text-secondary': '#cdbf95',
        'text-muted': DIM,
      },
    },
    git: {
      added: '#8fe259',
      removed: '#da5b2d',
      modified: '#febd5c',
      merged: '#cf76ff',
      closed: '#e5604a',
      conflicting: AMBER,
      draft: DIM,
    },
  },
})

// The app draws its own boxes (thinking, tasks, questions, code, the message box)
// and a look can't reshape them. So every row here takes the app's surface and
// border colors and a small radius, to sit beside those boxes as one family. No
// backdrop: over one the app frosts its own boxes, and they stop matching.
const STYLE: ThemeStyle = {
  Text: { fontFamily: ['code'], fontSize: 13, lineHeight: 20 },
  Heading: { fontFamily: ['code'], fontWeight: 'bold', color: AMBER, letterSpacing: 0.5 },
  // A row with a prompt chevron beside the first line. The chevron sits in the top
  // left corner of the sliced drawing, so a tall message keeps one chevron. The
  // drawing is the whole shape: a rounded box with the app's border.
  UserMessage: {
    color: BRIGHT,
    backgroundColor: PROMPT_BOX,
    paddingLeft: 30,
    paddingRight: 12,
    paddingY: 8,
    shadow: 'none',
    fill: {
      vector: {
        // Wider than the left and right cuts together (28 + 12), or no middle is left.
        viewBox: [48, 40],
        slice: [24, 12, 12, 28],
        paths: [
          { d: ROUNDED_BOX, color: PROMPT_BOX },
          { d: ROUNDED_BOX, strokeWidth: 1, color: 'border' },
          { d: 'M12 14L16 18L12 22', strokeWidth: 2, color: AMBER },
        ],
      },
    },
  },
  // Each run of words in a reply is a box as the prompt row is, in the page
  // color, with a cyan caret inside it beside the first line. `backgroundColor`
  // matches the drawing's middle, so no patch shows under the words.
  AssistantMessage: {
    // Stated, or the app turns the words white to suit a raw background.
    color: FOREGROUND,
    backgroundColor: REPLY_BOX,
    lineHeight: 20,
    paddingLeft: 30,
    paddingRight: 12,
    paddingY: 8,
    shadow: 'none',
    fill: {
      vector: {
        // Wider than the left and right cuts together (28 + 12), or no middle is left.
        viewBox: [48, 40],
        slice: [24, 12, 12, 28],
        paths: [
          { d: ROUNDED_BOX, color: REPLY_BOX },
          { d: ROUNDED_BOX, strokeWidth: 1, color: 'border' },
          { d: 'M12 14L16 18L12 22', strokeWidth: 2, color: CYAN },
        ],
      },
    },
  },
  // Tool rows keep the app's own box, and take the code font and the dim color.
  ToolUse: { fontFamily: ['code'], color: DIM },
}

// Quiet square-wave blips, as a PC speaker makes. Off until the speaker in the
// title bar is pressed. No cue for a tool call: it would play too often.
const SOUND: ThemeSound = {
  cues: {
    send: { layers: [{ wave: 'square', notes: ['C6'], gain: 0.12, release: 0.05 }] },
    done: { layers: [{ wave: 'square', notes: ['E5', 'A5'], step: 0.08, gain: 0.12, release: 0.08 }] },
    ask: { layers: [{ wave: 'square', notes: ['G5', 'G5'], step: 0.14, gain: 0.12, release: 0.06 }] },
    error: {
      layers: [{ wave: 'saw', notes: ['A2'], gain: 0.15, release: 0.25, filter: { type: 'lowpass', hz: 900 } }],
    },
  },
}

const COLORS_ONLY: ThemeSetArgs = { colors: theme }
const STYLED: ThemeSetArgs = { ...COLORS_ONLY, style: STYLE }
// Fullest first: a build that doesn't take `sound` or `style` refuses the whole set.
const LOOKS: readonly ThemeSetArgs[] = [{ ...STYLED, sound: SOUND }, STYLED, COLORS_ONLY]

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    const unpainted = problems.find(line => line.startsWith("Desktop won't paint"))

    if (unpainted !== undefined) {
      $.ui.toast(unpainted)
    }

    // Says so when a fuller look was refused, and why.
    const names = ['full look', 'look without sound', 'colors only']
    let refused = ''

    for (const [index, look] of LOOKS.entries()) {
      try {
        const set = await $.theme.set(look)
        const drawn = set.isDrawn ? '' : ` (not drawn: ${set.reason})`

        // Quiet when the full look is drawn.
        if (index > 0 || !set.isDrawn) {
          $.ui.toast(`EmberTide ${VERSION}: ${names[index]} set${drawn}${refused}`)
        }
        break
      } catch (error) {
        refused = `. Refused: ${String(error).slice(0, 200)}`
        $.ui.log(String(error))
      }
    }

    return next(e)
  })
}
