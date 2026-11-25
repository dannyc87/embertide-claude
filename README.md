# EmberTide for Claude

A look for the Claude desktop app (Code tab) that dresses it as a terminal in the
[EmberTide](https://github.com/dannyc87/embertide) colors.

## What it changes

- **Colors**: the whole app palette, dark mode only, built from the EmberTide
  background (`#001219`), foreground (`#e9d8a6`) and accent colors.
- **Type**: messages, headings and tool rows use the app's code font at 13 points.
- **Your messages**: a rounded box with an amber prompt chevron.
- **Replies**: a rounded box in the page color with a cyan chevron.
- **Code**: syntax colors come from the palette, so code blocks use EmberTide too.
- **Sound**: quiet square-wave cues for send, done, question and error. They are
  off until you press the speaker in the session's title bar.

The app's own boxes (thinking, tasks, questions, code blocks, the message box)
keep their shape. Only their colors change. The terminal and editor extensions
draw no look.

## Install

At the prompt of a terminal session:

```
/plugin install embertide-terminal --marketplace dannyc87/embertide-claude
```

From a shell:

```
claude plugin install embertide-terminal --marketplace dannyc87/embertide-claude
```

In the desktop app: click + next to the prompt box, then Plugins, then Add
marketplace with `dannyc87/embertide-claude`, then Add plugin.

## Change it

The look is one file, `hooks/register.ts`. `hooks/make-colors.js` is the design
system's color generator, copied from Claude Code. Leave it as it is, and copy it
again when Claude Code updates.

## License

MIT. See [LICENSE](LICENSE).
