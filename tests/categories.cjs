const fs = require('fs');
const assert = require('node:assert/strict');
const { pathToFileURL } = require('node:url');
const { chromium } = require('playwright');
fs.mkdirSync('.catalog-work', { recursive: true });
(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  try {
    const page = await browser.newPage();
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.goto(pathToFileURL(require('node:path').resolve('index.html')).href);
    assert.equal(await page.locator('[data-category]').count(), 6, 'six category buttons');
    const catalog = await page.evaluate(() => songs);
    assert.equal(catalog.length, 1000);
    assert.equal(new Set(catalog.map(s => s.track_id)).size, 1000);
    assert.equal(new Set(catalog.map(s => s.artist + '|' + s.title)).size, 1000);
    for (const [id, min, max] of [['80s',1980,1989],['90s',1990,1999],['2000s',2000,2009],['2010s',2010,2019],['2020s',2020,2026]]) {
      assert.equal(catalog.filter(s => s.release_year >= min && s.release_year <= max).length, 200);
      await page.locator(`[data-category="${id}"]`).click();
      assert.equal(await page.locator(`[data-category="${id}"]`).getAttribute('aria-pressed'), 'true');
      const drawn = await page.evaluate(() => {
        const drawn = [song];
        for (let i = 1; i < 200; i++) { startRound(); drawn.push(song); }
        return drawn;
      });
      assert.equal(new Set(drawn.map(s => s.track_id)).size, 200, 'no repeats within category');
      assert(drawn.every(s => s.release_year >= min && s.release_year <= max));
      await page.locator('.hint').first().click();
      assert.equal(await page.locator('#score').textContent(), '90');
      await page.locator('#reveal').click();
      assert.equal(await page.evaluate(() => activeAudio), null);
      await page.locator('[data-category="all"]').click();
      assert.equal(await page.locator('#score').textContent(), '100');
      assert.equal(await page.locator('#roundArea').isVisible(), true);
    }
    const all = await page.evaluate(() => { deck = []; const ids = []; for (let i = 0; i < 1000; i++) { startRound(); ids.push(song.track_id); } return ids; });
    assert.equal(new Set(all).size, 1000);
    // Switching while audio is loading must cancel stale callbacks and preserve history.
    await page.evaluate(() => { HTMLMediaElement.prototype.play = function () { return new Promise((resolve, reject) => { window.lateReject = reject; }); }; });
    await page.locator('#listen').click();
    await page.locator('[data-category="80s"]').click();
    const switchedId = await page.evaluate(() => song.track_id);
    await page.evaluate(() => lateReject(new DOMException('Late failure', 'NotSupportedError')));
    assert.equal(await page.evaluate(() => song.track_id), switchedId);
    assert.equal(await page.locator('#score').textContent(), '100');
    assert.equal(await page.evaluate(() => playHistory.length), 5);
    await page.evaluate(() => { songs.filter(s => s.release_year < 1990).forEach(s => unavailableIds.add(s.track_id)); deck = []; startRound(); });
    assert.equal(await page.locator('#retryPool').isVisible(), true);
    await page.locator('[data-category="90s"]').click();
    assert.equal(await page.locator('#listen').isEnabled(), true);
    await page.setViewportSize({ width: 390, height: 844 });
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
    await page.screenshot({ path: '.catalog-work/categories-mobile.png', fullPage: true });
    assert.deepEqual(errors, []);
    console.log('PASS: 1000 unique songs; five eras with 200 each; category switching; no-repeat shuffle; mixed pool; stale audio cancellation; history; category-specific failures; mobile layout.');
  } finally { await browser.close(); }
})().catch(e => { console.error(e); process.exitCode = 1; });
