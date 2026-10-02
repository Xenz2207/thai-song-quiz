const fs = require('node:fs');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { chromium } = require('playwright');
(async () => {
  fs.mkdirSync('docs/images', { recursive: true });
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 1280, height: 1200 }, deviceScaleFactor: 1 });
    await page.goto(pathToFileURL(path.resolve('index.html')).href);
    await page.evaluate(() => document.fonts.ready);
    const pick = async title => page.evaluate(title => {
      const item = songs.find(s => s.title === title);
      if (!item) throw Error('Missing demonstration song: ' + title);
      selectCategory(item.category);
      deck = [item]; startRound();
    }, title);
    await pick('วาดไว้');
    await page.locator('.hint').first().click();
    await page.locator('.hint').nth(3).click();
    await page.waitForTimeout(350);
    await page.locator('main').screenshot({ path: 'docs/images/game-desktop.png' });
    await page.locator('#reveal').click();
    await page.waitForTimeout(350);
    await page.locator('main').screenshot({ path: 'docs/images/result-history.png' });
    await page.locator('#next').click();
    await pick('ฟ้า');
    await page.setViewportSize({ width: 390, height: 844 });
    await page.locator('.hint').nth(3).click();
    await page.waitForTimeout(350);
    await page.locator('main').screenshot({ path: 'docs/images/game-mobile.png' });
    await page.locator('[data-category="80s"]').click();
    await page.locator('.hint').first().click();
    await page.waitForTimeout(350);
    await page.locator('main').screenshot({ path: 'docs/images/categories-mobile.png' });
    await page.locator('[data-category="2020s"]').click();
    await page.locator('.hint').first().click();
    await page.waitForTimeout(350);
    await page.locator('main').screenshot({ path: 'docs/images/categories-2020s-mobile.png' });
    await pick('วาฬเกยตื้น');
    for (let index = 0; index < 4; index++) await page.locator('.hint').nth(index).click();
    await page.waitForTimeout(350);
    await page.locator('main').screenshot({ path: 'docs/images/puzzle-hints-mobile.png' });
    console.log('Captured six current report screenshots.');
  } finally { await browser.close(); }
})().catch(e => { console.error(e); process.exitCode = 1; });
