const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const { pathToFileURL } = require('node:url');
const { chromium } = require('playwright');

(async () => {
  fs.mkdirSync('.catalog-work', { recursive: true });
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 1280, height: 1000 } });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    const response = await page.goto(process.env.BASE_URL || pathToFileURL(path.resolve('index.html')).href);
    if (process.env.BASE_URL) assert.equal(response.status(), 200);
    await page.waitForFunction(() => typeof choices !== 'undefined' && choices.title?.length === 4);
    const localSongs = JSON.parse(fs.readFileSync('index.html', 'utf8').match(/const songs = (\[[\s\S]*?\]);/)[1]);
    assert.deepEqual(await page.evaluate(() => songs), localSongs, 'deployed catalog matches reviewed source');
    assert.equal(localSongs.length, 1152);
    assert.equal(await page.locator('#titleChoices button').count(), 4);
    assert.equal(await page.locator('#artistChoices button').count(), 4);
    assert.equal(await page.locator('#score').textContent(), '0');
    assert.equal(await page.locator('#storeLink').count(), 0, 'no answer URL before answering');
    const inspected = await page.evaluate(() => {
      const ids = [];
      for (let i = 0; i < songs.length; i++) {
        if (i) startRound();
        ids.push(song.track_id);
        for (const kind of ['title', 'artist']) {
          const correct = kind === 'title' ? titleOf(song) : song.artist;
          if (choices[kind].length !== 4 || new Set(choices[kind].map(normalize)).size !== 4 || choices[kind].filter(value => normalize(value) === normalize(correct)).length !== 1) {
            throw new Error(`Invalid choices: ${song.track_id}/${kind}`);
          }
        }
      }
      return ids;
    });
    assert.equal(new Set(inspected).size, localSongs.length, 'no repeats until deck exhausted');
    await page.locator('.hint').first().click();
    assert.equal(await page.locator('#score').textContent(), '0', 'clues are free');
    const first = await page.evaluate(() => ({ title: titleOf(song), artist: song.artist }));
    await page.locator('#titleChoices button').filter({ has: page.getByText(first.title, { exact: true }) }).click();
    assert.equal(await page.locator('#score').textContent(), '100');
    assert.equal(await page.locator('#titleChoices button:disabled').count(), 4);
    await page.locator('#titleChoices button').first().dispatchEvent('click');
    assert.equal(await page.locator('#score').textContent(), '100', 'cannot answer same question twice');
    await page.locator('#artistChoices button').filter({ has: page.getByText(first.artist, { exact: true }) }).click();
    assert.equal(await page.locator('#result').isVisible(), true);
    assert((await page.locator('#resultText').textContent()).includes('200 / 200'));
    assert.equal(await page.evaluate(() => playHistory.length), 1);
    await page.locator('#reveal').dispatchEvent('click');
    assert.equal(await page.evaluate(() => playHistory.length), 1, 'completed round recorded once');
    await page.locator('#next').click();
    assert.equal(await page.locator('#score').textContent(), '0');
    const wrongTitle = await page.evaluate(() => choices.title.find(value => normalize(value) !== normalize(titleOf(song))));
    await page.locator('#titleChoices button').filter({ has: page.getByText(wrongTitle, { exact: true }) }).click();
    assert.equal(await page.locator('#titleChoices .incorrect').count(), 1);
    assert.equal(await page.locator('#titleChoices .correct').count(), 1);
    const artist = await page.evaluate(() => song.artist);
    await page.locator('#artistChoices button').filter({ has: page.getByText(artist, { exact: true }) }).click();
    assert((await page.locator('#resultText').textContent()).includes('100 / 200'));
    await page.locator('#next').click();
    await page.locator('#reveal').click();
    assert((await page.locator('#resultText').textContent()).includes('0 / 200'));
    await page.locator('#next').click();
    const pools = [['thai-hits', 500], ['80s', 200], ['90s', 200], ['2000s', 200], ['2010s', 200], ['2020s', 200], ['lukthung', 50], ['artist-mix', 217], ['all', 1152]];
    for (const [id, count] of pools) {
      await page.locator(`[data-category="${id}"]`).click();
      assert.equal(await page.evaluate(() => categorySongs().length), count);
      assert.equal(await page.locator('#score').textContent(), '0');
      assert.equal(await page.locator('#titleChoices button:enabled').count(), 4);
      assert.equal(await page.evaluate(() => playHistory.length), 3);
    }
    if (process.env.VERIFY_AUDIO === '1') {
      await page.locator('#listen').click();
      await page.waitForFunction(() => activeAudio && !audioLoading && !activeAudio.paused && activeAudio.currentTime > 0, null, { timeout: 45000 });
      assert.equal(await page.locator('#score').textContent(), '0');
      await page.locator('#listen').click();
      assert.equal(await page.evaluate(() => activeAudio.paused), true);
      await page.locator('#listen').click();
      await page.waitForFunction(() => activeAudio && !audioLoading && !activeAudio.paused);
      await page.locator('[data-category="90s"]').click();
      assert.equal(await page.evaluate(() => activeAudio), null);
      console.log('PASS: real iTunes playback, pause/resume, free listening and cancellation.');
    }
    await page.evaluate(() => {
      window.nativePlay = HTMLMediaElement.prototype.play;
      HTMLMediaElement.prototype.play = function () { return new Promise((resolve, reject) => { window.lateReject = reject; }); };
    });
    await page.locator('#listen').click();
    await page.locator('[data-category="artist-mix"]').click();
    const newId = await page.evaluate(() => song.track_id);
    await page.evaluate(() => lateReject(new DOMException('Late failure', 'NotSupportedError')));
    assert.equal(await page.evaluate(() => song.track_id), newId);
    assert.equal(await page.locator('#score').textContent(), '0');
    await page.evaluate(() => { HTMLMediaElement.prototype.play = function () { return Promise.reject(new DOMException('Gesture required', 'NotAllowedError')); }; });
    await page.locator('#listen').click();
    await page.waitForFunction(() => !audioLoading);
    assert.equal(await page.evaluate(() => song.track_id), newId, 'autoplay rejection allows retry');
    await page.evaluate(() => { HTMLMediaElement.prototype.play = function () { return Promise.reject(new DOMException('Missing preview', 'NotSupportedError')); }; });
    await page.locator('#listen').click();
    await page.waitForFunction(id => song.track_id !== id, newId);
    assert.equal(await page.evaluate(() => playHistory.length), 3);
    await page.evaluate(() => { HTMLMediaElement.prototype.play = window.nativePlay; });
    await page.evaluate(() => { categorySongs().forEach(item => unavailableIds.add(item.track_id)); deck = []; startRound(); });
    assert.equal(await page.locator('#retryPool').isVisible(), true);
    assert.equal(await page.locator('#titleChoices button').count(), 0);
    assert.equal(await page.locator('#reveal').isDisabled(), true);
    await page.locator('#retryPool').click();
    assert.equal(await page.locator('#titleChoices button:enabled').count(), 4);
    for (const width of [320, 390, 768, 1280]) {
      await page.setViewportSize({ width, height: 844 });
      assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `layout fits ${width}px`);
    }
    await page.setViewportSize({ width: 390, height: 844 });
    await page.screenshot({ path: '.catalog-work/multiple-choice-mobile.png', fullPage: true });
    assert.deepEqual(errors, []);
    const report = { checkedAt: new Date().toISOString(), url: page.url(), version: require('../package.json').version, songs: localSongs.length, uniqueQuestionsChecked: inspected.length, categories: Object.fromEntries(pools), realAudio: process.env.VERIFY_AUDIO === '1', scoresVerified: [0, 100, 200], mobileWidths: [320, 390, 768, 1280], pageErrors: errors };
    fs.writeFileSync('.catalog-work/multiple-choice-validation.json', JSON.stringify(report, null, 2));
    console.log('PASS: 1152 question sets, four unique choices, scoring/locking, wrong answers, skip, history, nine categories, no repeats, stale audio, retries, empty pool, mobile layout and no JavaScript errors.');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
