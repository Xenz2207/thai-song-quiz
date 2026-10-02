const fs = require('node:fs');
const crypto = require('node:crypto');
const assert = require('node:assert/strict');
const html = fs.readFileSync('index.html','utf8');
const songs = JSON.parse(html.match(/const songs = (\[[\s\S]*?\]);/)[1]);
const playback = JSON.parse(fs.readFileSync('.catalog-work/expanded/final-playback.json','utf8'));
const byId = new Map(playback.results.map(r => [r.track_id, r]));
assert.equal(songs.length, 1000);
assert.equal(new Set(songs.map(s => s.track_id)).size, 1000);
assert(songs.every(s => byId.get(s.track_id)?.ok && byId.get(s.track_id)?.title === s.title));
const categories = [
  { id: '80s', years: [1980,1989] },
  { id: '90s', years: [1990,1999] },
  { id: '2000s', years: [2000,2009] },
  { id: '2010s', years: [2010,2019] },
  { id: '2020s', years: [2020,2026] }
].map(c => ({...c, count: songs.filter(s => s.release_year >= c.years[0] && s.release_year <= c.years[1]).length}));
assert(categories.every(c => c.count === 200));
const report = {
  checked_at: playback.checked_at,
  catalog_sha256: crypto.createHash('sha256').update(JSON.stringify(songs)).digest('hex'),
  total_songs: songs.length,
  unique_track_ids: new Set(songs.map(s => s.track_id)).size,
  unique_titles: new Set(songs.map(s => s.title)).size,
  categories,
  mixed_category: { id: 'all', count: songs.length },
  selection_method: 'Apple Music Thai essentials playlists, Top Songs: Thailand annual playlists, Thai Pop Supreme/Viral Thai Pop, publisher hits compilations, and the existing reviewed Thai hits catalog. Each song in index.html includes selection_source and selection_reason. Playlist and compilation membership is evidence of curation, not an independently audited chart ranking.',
  year_method: 'Prefer studio album/single publisher track dates over compilation and reissue dates. Preserve previously reviewed date corrections and record additional sourced corrections in year_source. Exclude known pre-era songs, cover collections, live, karaoke, instrumental, and explicitly labeled remakes. Publisher dates can differ between original singles and albums.',
  playback: { browser: playback.browser, method: playback.method, passed: songs.filter(s => byId.get(s.track_id)?.ok).length, failed: 0, duration: 'iTunes preview excerpts, usually around 30 seconds; not full recordings.', availability: 'Verified at checked_at. External preview availability can change; the app replaces failed tracks within the selected category.' },
  application_checks: ['Five eras with 200 songs each and 1000 in the combined pool', '2010–2019 and 2020–2026 have separate pools without overlap', 'No duplicate titles or track IDs', 'Category-only shuffle, no repetition for one complete pool', 'Mixed pool reaches every song once', 'Category switch starts a fresh round, clears hints and score, and stops audio', 'Late audio rejection cannot change the new category round', 'Completed history persists after category changes', 'Unavailable category can recover or switch to another available category', 'Audio scoring once, replay and pause, source failures, autoplay restrictions', '390px mobile viewport without horizontal overflow; no JavaScript errors'],
  songs: songs.map(s => ({ track_id: s.track_id, title: s.title, artist: s.artist, category: s.category, release_year: s.release_year, playback: { ok: byId.get(s.track_id).ok, duration: byId.get(s.track_id).duration } }))
};
fs.mkdirSync('docs',{recursive:true});
fs.writeFileSync('docs/catalog-validation.json',JSON.stringify(report,null,2) + '\n');
console.log(`Catalog report written: ${songs.length} songs, 200 per era, ${report.playback.passed} browser playback checks passed.`);
