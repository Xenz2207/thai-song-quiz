const fs = require('node:fs');
const assert = require('node:assert/strict');
const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    const response = await page.goto('https://thai-song-quiz-two.vercel.app/', { waitUntil: 'load' });
    assert.equal(response.status(), 200);
    assert.equal(await page.locator('[data-category]').count(), 6);
    const localSongs = JSON.parse(fs.readFileSync('index.html', 'utf8').match(/const songs = (\[[\s\S]*?\]);/)[1]);
    assert.deepEqual(await page.evaluate(() => songs), localSongs);
    const results = [];
    for (const category of ['80s', '90s', '2000s', '2010s', '2020s']) {
      await page.locator(`[data-category="${category}"]`).click();
      assert.equal(await page.evaluate(() => categorySongs().length), 200);
      const playback = await page.evaluate(() => new Promise(resolve => {
        const song = categorySongs()[0];
        const audio = new Audio(song.audio_url);
        audio.muted = true;
        const timer = setTimeout(() => finish(false), 30000);
        const finish = ok => { clearTimeout(timer); audio.onplaying = audio.onerror = null; audio.pause(); audio.removeAttribute('src'); audio.load(); resolve({ title: song.title, ok }); };
        audio.onplaying = () => finish(true);
        audio.onerror = () => finish(false);
        audio.play().catch(() => finish(false));
      }));
      assert(playback.ok, `${category}: ${playback.title}`);
      results.push({ category, count: 200, ...playback });
    }
    await page.locator('[data-category="all"]').click();
    assert.equal(await page.evaluate(() => categorySongs().length), 1000);
    await page.locator('.hint').first().click();
    await page.locator('#reveal').click();
    await page.locator('#next').click();
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    assert.deepEqual(errors, []);
    fs.writeFileSync('docs/production-validation.json', JSON.stringify({ checked_at: new Date().toISOString(), url: page.url(), version: 'v1.1.0', anonymousBrowser: true, status: 200, catalogMatchesLocal: true, totalSongs: 1000, categories: results, mixedPool: 1000, mobileOverflow: false, gameInteractions: 'hint, reveal, next round', pageErrors: errors }, null, 2));
    console.log('PASS: public production; catalog matches all 1000 songs; five eras, real audio in each era, mixed pool, game controls and mobile layout.');
  } finally { await browser.close(); }
})().catch(e => { console.error(e); process.exitCode = 1; });
