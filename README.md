[![make.fun · best-spot-the-difference-game-20261121-0451](https://make.fun/badge/best-spot-the-difference-game-20261121-0451.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)
[![rank](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/ruri08219/best-spot-the-difference-game-20261121-0451/rank.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)
[![reward](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/ruri08219/best-spot-the-difference-game-20261121-0451/reward.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)

# Twin Tales — Spot the Difference

Two pictures hang side by side. They look the same — but **seven tiny things**
changed between them. Find them all before the clock embarrasses you.

A complete spot-the-difference game that runs offline in a desktop browser
from static files: no network, no build step, no libraries. Every picture is
painted fresh in code with Canvas 2D, every sound is synthesized live with
WebAudio.

## How to play

- Open `game/index.html` in a desktop browser (or serve the folder with any
  static server: `python3 -m http.server` inside `game/`).
- Click a difference on either picture — it gets a green ring and a check.
- Wrong clicks cost 25 points. Hints cost 25 points too.
- Finish all three scenes to win. Fewer mistakes, more stars.

## The three scenes

| # | Scene | What hides there |
|---|-------|------------------|
| 1 | Sunny Garden | Sunglasses on the sun, a missing cloud, a tulip that changed colour, vanished apples, a butterfly, a fence picket, a cat |
| 2 | Harbor at Dusk | A lighthouse beam gone dark, a missing star, a re-coloured sail, a seagull, a crate turned barrel, a jumping fish, a lost flag |
| 3 | Cozy Kitchen | A cat off its chair, a teapot gone quiet, a clock with a new time, an apple turned orange, a shut curtain, a new mug, a moonlit picture |

Each scene hides exactly 7 differences. The counter in the header always shows
how many you have found and how many remain.

## Keyboard

- `H` hint (reveals one unfound difference for 3 seconds)
- `R` restart the level (or the whole game from a results screen)
- `1` / `2` / `3` jump between scenes
- `N` / `Enter` advance from a results screen
- `M` mute

## Scoring

- +100 points per difference found
- −25 per wrong click, −25 per hint
- Level bonus up to +200 for a fast finish
- 3 stars for a flawless scene, 2 for at most two slips, 1 otherwise
- Your best total score is kept in the browser (localStorage)

## Files

- `game/index.html` — the page: header, two picture panels, footer
- `game/style.css` — the warm paper-and-ink theme
- `game/scenes.js` — the three hand-drawn scenes (Canvas 2D, fixed art)
- `game/app.js` — game logic: clicks, markers, timer, score, hints, screens
- `game/audio.js` — the WebAudio synth (chimes, buzzes, fanfares)
- `main.ts` — the make.fun hand-in program: copies `game/` + `screenshots/`
  to `/output` and writes `dossier.json` with `vendor/makefun-game.ts`
- `screenshots/` — real renders of the game's own code: title, mid-play with
  3 of 7 found, a second scene mid-play, and a flawless level finish

## License

MIT — see `LICENSE`.
