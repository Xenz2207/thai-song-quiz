const fs = require('node:fs');
const assert = require('node:assert/strict');
const { pathToFileURL } = require('node:url');
const { chromium } = require('playwright');
const { initials, puzzleTitle, blanks } = require('../scripts/generate-puzzle-hints.cjs');
(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
    await page.goto(pathToFileURL(require('node:path').resolve('index.html')).href);
    const catalog = await page.evaluate(() => songs);
    await page.evaluate(() => document.fonts.ready);
    for (const song of catalog) {
      assert(/\p{Extended_Pictographic}/u.test(song.hint_1), `${song.title}: emoji puzzle required`);
      assert(!/[ก-๙A-Za-z]/u.test(song.hint_1), `${song.title}: emoji clue must not reveal title`);
      assert(song.hint_2.split(' - ').every(x => /^[ก-ฮA-Z0-9]$/u.test(x)), `${song.title}: initials only`);
      assert(song.hint_4.includes('_'), `${song.title}: missing letters required`);
      assert(song.hint_4.replace(/[\s_]/g, '').length > 0, `${song.title}: retained letters required`);
      assert.notEqual(song.hint_4.replace(/\s/g,''), song.title.replace(/\s/g,''));
      assert.equal(song.hint_3, song.artist, `${song.title}: artist or band on third card`);
      assert.equal(song.hint_2, initials(song.puzzle_title));
      assert.equal(song.puzzle_title, puzzleTitle(song.title));
      const source = [...new Intl.Segmenter('th',{granularity:'grapheme'}).segment(song.puzzle_title)].map(x=>x.segment);
      const puzzle = song.hint_4.split(' ').filter(x=>x!=='/');
      assert.equal(puzzle.length, source.filter(x=>!/^\s+$/.test(x) && x!=='/').length, song.title);
      const letters = source.filter(x=>!/^\s+$/.test(x) && x!=='/');
      puzzle.forEach((x,i)=>assert(x==='_' || x===letters[i],`${song.title}: incorrect retained letter`));
    }
    const whale = catalog.find(s => s.title === 'วาฬเกยตื้น');
    assert.equal(whale.hint_1, '🐋 🏖️');
    assert.equal(catalog.find(s => s.title === 'ฝนตกไหม').hint_1, '🌧️ ☔ ❓');
    assert.equal(initials('ขอให้เธอใจดี'), 'ข - ห - ธ - จ - ด');
    assert.equal(initials('ซ่อนกลิ่น'), 'ซ - ก');
    assert.equal(initials('เธอคือกาแฟในตอนเช้า'), 'ธ - ค - ก - น - ต - ช');
    assert(blanks('ข้างกัน',123).includes('_'));
    for (const title of ['วาฬเกยตื้น','ฝนตกไหม','ฟ้า']) {
      await page.evaluate(title => { song = songs.find(s => s.title === title); opened.clear(); answered = false; score = 100; renderHints(); updateScore(); }, title);
      for (const index of [0,1,3]) await page.locator('.hint').nth(index).click();
      assert.equal(await page.evaluate(() => score), 70);
      assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
      assert((await page.locator('.hint').nth(0).innerText()).includes('อีโมจิ'));
      assert((await page.locator('.hint').nth(1).innerText()).includes('พยัญชนะต้น'));
      assert((await page.locator('.hint').nth(3).innerText()).includes('อักษรที่หายไป'));
    }
    const overflowing = await page.evaluate(() => {
      const bad = [];
      for (const item of songs) {
        song = item; opened = new Set([0,1,2,3]); answered = false; renderHints();
        if (document.documentElement.scrollWidth > innerWidth) bad.push(item.title);
      }
      return bad;
    });
    assert.deepEqual(overflowing, [], 'all puzzles fit mobile viewport');
    console.log('PASS: all 1000 emoji, initial-letter and missing-letter puzzles; examples; scoring and mobile layout.');
  } finally { await browser.close(); }
})().catch(e => { console.error(e); process.exitCode = 1; });
