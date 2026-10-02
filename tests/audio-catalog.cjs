// Run: node tests/audio-catalog.cjs [input JSON] [output report JSON]
// Tests actual browser decoding and playback; audio is streamed and never saved.
const fs = require('node:fs');
const { chromium } = require('playwright');
const html = fs.readFileSync('index.html','utf8');
const songs = process.argv[2] ? JSON.parse(fs.readFileSync(process.argv[2],'utf8')) : JSON.parse(html.match(/const songs = (\[[\s\S]*?\]);/)[1]);
const output = process.argv[3] || '.catalog-work/expanded/final-playback.json';
fs.mkdirSync(require('node:path').dirname(output), { recursive: true });
(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  try {
    const page = await browser.newPage();
    page.on('console', msg => console.log(msg.text()));
    await page.goto('about:blank');
    const results = await page.evaluate(async songs => {
      let cursor = 0;
      const results = [];
      await Promise.all(Array.from({ length: 8 }, async () => {
        while (cursor < songs.length) {
          const song = songs[cursor++];
          let report;
          for (let attempt = 1; attempt <= 2; attempt++) {
            report = await new Promise(resolve => {
              const audio = new Audio();
              audio.muted = true;
              let done = false;
              const finish = (ok,error) => {
                if (done) return; done = true;
                clearTimeout(timer); audio.onplaying = audio.onerror = null;
                const duration = Number.isFinite(audio.duration) ? audio.duration : null;
                audio.pause(); audio.removeAttribute('src'); audio.load();
                resolve({ track_id: song.track_id, title: song.title, category: song.category, ok, duration, error, attempt });
              };
              const timer = setTimeout(() => finish(false, 'timeout'), 25000);
              audio.onplaying = () => finish(true,null);
              audio.onerror = () => finish(false, 'MediaError ' + audio.error?.code);
              audio.src = song.audio_url;
              audio.play().catch(e => finish(false,e.name));
            });
            if (report.ok) break;
          }
          results.push(report);
          if (results.length % 50 === 0) console.log(`Playback ${results.length}/${songs.length} · passed ${results.filter(r=>r.ok).length}`);
        }
      }));
      return results;
    }, songs);
    fs.writeFileSync(output, JSON.stringify({ checked_at: new Date().toISOString(), browser: 'Microsoft Edge (Chromium)', method: 'Muted streaming playback reached playing event; no audio saved.', results },null,2));
    console.log('PASS',results.filter(s=>s.ok).length,'/',results.length);
    if (results.some(s=>!s.ok)) { console.log(results.filter(s=>!s.ok)); process.exitCode = 1; }
  } finally { await browser.close(); }
})().catch(e => { console.error(e); process.exitCode = 1; });
