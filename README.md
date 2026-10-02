# Thai Song Quiz

A Thai music guessing game with clue cards, Apple Music/iTunes preview audio, scoring, and round history.

Choose from **80s (1980–1989)**, **90s (1990–1999)**, **2000s (2000–2009)**, **2010–2019**, and **2020–2026**, each containing 200 songs. **Random / all eras** combines all 1,000 songs. Songs do not repeat until the selected pool is exhausted. Switching categories stops audio, starts a fresh round at 100 points, and preserves completed round history.

Songs are selected from Apple Music Thai essentials playlists, annual Top Songs: Thailand playlists, Thai Pop Supreme/Viral Thai Pop, hits compilations, and the existing curated catalog. Each record includes its selection source, catalog credits, and release-year source. Documented corrections distinguish original release years from reissue dates. In-game listening streams iTunes previews (usually 30 seconds); links open the song on Apple Music.

The app is a static site. Open `index.html` directly in a browser or deploy the project to any static hosting provider.

Play [v1.1.0 on Vercel](https://thai-song-quiz-two.vercel.app/). See the [release](https://github.com/Xenz2207/thai-song-quiz/releases/tag/v1.1.0) and [documentation](docs/README.md).

## Deploy

This project is configured for Vercel's static hosting defaults. No build step or dependencies are required.

## Validation

The latest playback evidence and catalog counts are in `docs/catalog-validation.json`.

For development checks, install Node.js 20+ and Microsoft Edge, then run:

```sh
npm ci
npm test
npm run test:audio
```

After a complete successful audio run, `node scripts/write-catalog-report.cjs` updates the checked-in catalog report. Category changes create a fresh shuffle for the selected era.

Playwright is a development dependency only. `npm test` checks category filtering, shuffle exhaustion, switching during audio loading, scoring, playback retries, history, and mobile overflow. `npm run test:audio` streams every preview in Edge and verifies that it reaches the playing event; it writes a fresh local report to `.catalog-work/expanded/final-playback.json`. It requires an internet connection. The report reflects availability at the recorded check time.
