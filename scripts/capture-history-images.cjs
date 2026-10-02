// Recover original Git screenshots and capture unchanged historical code.
// Keeps the current checkout intact; all extracted code stays in ignored temp files.
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const assert = require('node:assert/strict');
const { execFileSync } = require('node:child_process');
const { pathToFileURL } = require('node:url');
const { chromium } = require('playwright');
const output = 'docs/images/history';
const work = '.report-work/history-snapshots';
const sha256 = data => crypto.createHash('sha256').update(data).digest('hex');
const git = (...args) => execFileSync('git', args, { maxBuffer: 15000000 });
const commitInfo = ref => ({ commit: git('rev-parse',ref).toString().trim(), commit_date: git('show','-s','--format=%cI',ref).toString().trim() });
fs.mkdirSync(output,{recursive:true});
fs.mkdirSync(work,{recursive:true});
const entries = [];
function record(file, label, source, demonstration) {
  const data = fs.readFileSync(path.join(output,file));
  entries.push({ file, label, ...source, demonstration, image_sha256: sha256(data), width: data.readUInt32BE(16), height: data.readUInt32BE(20) });
}
function recover(ref, sourceFile, file, label) {
  const data = git('show',`${ref}:${sourceFile}`);
  fs.writeFileSync(path.join(output,file),data);
  record(file,label,{ kind:'original_git_image', ...commitInfo(ref), source_file: sourceFile, source_image_sha256: sha256(data) }, 'Original screenshot bytes recovered from Git; no image editing. The commit date is the archive date, not a claimed screenshot capture time.');
}
function extract(ref, directory, files) {
  for (const file of files) {
    const target = path.resolve(directory,file);
    assert(target.startsWith(path.resolve(directory)+path.sep));
    fs.mkdirSync(path.dirname(target),{recursive:true});
    fs.writeFileSync(target,git('show',`${ref}:${file}`));
  }
}
(async () => {
  recover('8c93e05','docs/images/game-desktop.png','refresh-200-desktop.png','หน้าตาใหม่ 200 เพลง — ภาพเดิมจาก Git');
  recover('8c93e05','docs/images/result-history.png','refresh-200-result.png','เฉลยและประวัติ 200 เพลง — ภาพเดิมจาก Git');
  recover('8c93e05','docs/images/game-mobile.png','refresh-200-mobile.png','หน้าจอมือถือ 200 เพลง — ภาพเดิมจาก Git');
  recover('774a479','docs/images/game-desktop.png','v1.1.0-desktop.png','v1.1.0 แบ่ง 5 ยุค รวม 1,000 เพลง — ภาพเดิมจาก Git');
  recover('774a479','docs/images/categories-2020s-mobile.png','v1.1.0-2020s-mobile.png','v1.1.0 หมวด 2020–2026 ก่อนเปลี่ยนคำใบ้ — ภาพเดิมจาก Git');
  const browser = await chromium.launch({channel:'msedge',headless:true});
  try {
    for (const [ref, count, file, viewport] of [
      ['f670c6d',100,'legacy-100-desktop.png',{width:1280,height:1000}],
      ['5f2a458',200,'legacy-200-mobile.png',{width:390,height:1000}]
    ]) {
      const dir = path.join(work,ref);
      extract(ref,dir,['index.html','style.css','script.js','songs100.js','assets/stage-bg.png']);
      const page = await browser.newPage({viewport});
      await page.addInitScript(() => { Math.random = () => .57; });
      await page.goto(pathToFileURL(path.resolve(dir,'index.html')).href);
      await page.evaluate(() => document.fonts.ready);
      assert.equal(await page.locator('#total-songs').textContent(),String(count));
      await page.locator('#clue-grid button').first().click();
      await page.waitForTimeout(300);
      await page.screenshot({path:path.join(output,file)});
      record(file,`หน้าตาเดิม ${count} เพลง`,{kind:'reconstructed_from_git', ...commitInfo(ref), source_files:['index.html','style.css','script.js','songs100.js','assets/stage-bg.png'], html_sha256:sha256(fs.readFileSync(path.join(dir,'index.html'))), captured_at:new Date().toISOString()},'Captured now from unchanged historical Git files; fixed shuffle seed and opened one clue for a demonstration. This design comes from earlier merged Git history, not a claimed screenshot of a September prompt revision.');
      await page.close();
    }
    for (const [ref,file,label] of [
      ['8c93e05','clue-before-fix-mobile.png','ก่อนแก้รอบ 7: อยากร้องดังดัง ใช้คำใบ้ยาก'],
      ['b86161d','corrected-200-mobile.png','หลังแก้รอบ 7: อยากร้องดังดัง ใช้คำใบ้ร้อง']
    ]) {
      const dir = path.join(work,ref);
      extract(ref,dir,['index.html']);
      const page = await browser.newPage({viewport:{width:390,height:1000}});
      await page.goto(pathToFileURL(path.resolve(dir,'index.html')).href);
      await page.evaluate(() => { deck=[songs.find(item=>item.title==='อยากร้องดังดัง')]; startRound(); });
      await page.locator('.hint').nth(3).click();
      await page.evaluate(() => document.fonts.ready);
      await page.waitForTimeout(300);
      await page.locator('main').screenshot({path:path.join(output,file)});
      record(file,label,{kind:'reconstructed_from_git',...commitInfo(ref),source_files:['index.html'], html_sha256:sha256(fs.readFileSync(path.join(dir,'index.html'))),captured_at:new Date().toISOString()},'Captured now from unchanged historical HTML; selected อยากร้องดังดัง and opened clue 4 to compare the stored clue before and after the fix.');
      await page.close();
    }
    const local800 = process.argv[2] || '.catalog-work/expanded/app-before-split.html';
    if (fs.existsSync(local800)) {
      const html = fs.readFileSync(local800);
      const catalog = JSON.parse(html.toString().match(/const songs = (\[[\s\S]*?\]);/)[1]);
      assert.equal(catalog.length,800);
      for (const [file,viewport] of [['categories-800-desktop.png',{width:1280,height:1200}],['categories-800-mobile.png',{width:390,height:1000}]]) {
        const page800 = await browser.newPage({viewport});
        await page800.goto(pathToFileURL(path.resolve(local800)).href);
        assert.equal(await page800.locator('[data-category]').count(),5);
        await page800.locator('[data-category="80s"]').click();
        await page800.locator('.hint').first().click();
        await page800.evaluate(() => document.fonts.ready);
        await page800.waitForTimeout(300);
        await page800.locator('main').screenshot({path:path.join(output,file)});
        record(file,'รอบ 8 คลัง 800 เพลง ก่อนแยก 2010s / 2020s',{kind:'reconstructed_from_local_snapshot',source_file:local800,html_sha256:sha256(html),captured_at:new Date().toISOString()},'Captured now from the saved intermediate 800-song HTML; selected 80s and opened clue 1. No Git commit/tag exists for this intermediate snapshot.');
        await page800.close();
      }
    } else {
      // A collaborator may have the Git history without the original local snapshot.
      const previous = fs.existsSync(path.join(output,'manifest.json')) ? JSON.parse(fs.readFileSync(path.join(output,'manifest.json'),'utf8')).images : [];
      for (const item of previous.filter(x=>x.kind==='reconstructed_from_local_snapshot')) {
        assert.equal(sha256(fs.readFileSync(path.join(output,item.file))),item.image_sha256);
        entries.push(item);
      }
      console.log('800-song local snapshot unavailable; preserved any previously archived 800-song images.');
    }
  } finally { await browser.close(); }
  fs.writeFileSync(path.join(output,'manifest.json'),JSON.stringify({ updated_at:new Date().toISOString(), note:'Original archived images and current captures of historical code are distinguished explicitly. Current screenshots are in the parent images directory.',images:entries },null,2)+'\n');
  console.log(`Archived ${entries.length} historical screenshots with provenance and SHA-256 hashes.`);
})().catch(e=>{console.error(e);process.exitCode=1});
