const $ = id => document.getElementById(id);
const categories = {
  all: { label: 'สุ่มทุกหมวด' },
  'thai-hits': { label: 'เพลงฮิตไทย', collection: 'thai-hits' },
  '80s': { label: '80s' },
  '90s': { label: '90s' },
  '2000s': { label: '2000s' },
  '2010s': { label: '2010–2019' },
  '2020s': { label: '2020–2026' },
  lukthung: { label: 'ลูกทุ่งยอดฮิต', collection: 'lukthung' },
  'artist-mix': { label: 'รวมศิลปิน', collection: 'artist-mix' }
};
const hintMeta = [
  { key: 'hint_1', label: 'อีโมจิ' },
  { key: 'hint_2', label: 'พยัญชนะต้น' },
  { key: 'hint_4', label: 'อักษรที่หายไป' }
];
const playHistory = [];
const unavailableIds = new Set();
let selectedCategory = 'all', deck = [], song = null, previousId = null;
let score = 0, round = 1, answered = false, audioLoading = false;
let choices = {}, selections = {}, opened = new Set();
let activeAudio = null, audioTimer = null, audioGeneration = 0;

function titleOf(item) { return item.puzzle_title || item.title; }
function normalize(value) { return value.trim().toLocaleLowerCase('th'); }
function shuffle(items) {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
function categorySongs() {
  const category = categories[selectedCategory];
  if (selectedCategory === 'all') return songs;
  return songs.filter(item => category.collection
    ? item.collections?.includes(category.collection) : item.category === selectedCategory);
}
function yearText(item) {
  return `ปี ${item.release_year + 543} (${item.release_year})`;
}
function updateScore() { $('score').textContent = score; }
function stopAudio() {
  audioGeneration++;
  clearTimeout(audioTimer);
  audioLoading = false;
  if (activeAudio) {
    activeAudio.onplaying = activeAudio.onpause = activeAudio.onended = activeAudio.onerror = null;
    activeAudio.pause();
    activeAudio.removeAttribute('src');
    activeAudio.load();
    activeAudio = null;
  }
}
function generateChoices(correct, values) {
  const unique = new Map(values.map(value => [normalize(value), value]));
  unique.delete(normalize(correct));
  return shuffle([correct, ...shuffle([...unique.values()]).slice(0, 3)]);
}
function renderChoices() {
  for (const kind of ['title', 'artist']) {
    const container = $(`${kind}Choices`);
    container.replaceChildren();
    if (!song) continue;
    const correct = kind === 'title' ? titleOf(song) : song.artist;
    (choices[kind] || []).forEach((value, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'choice';
      button.disabled = selections[kind] !== undefined || answered;
      const letter = document.createElement('span');
      letter.className = 'choice-letter';
      letter.textContent = ['ก', 'ข', 'ค', 'ง'][index];
      const label = document.createElement('span');
      label.textContent = value;
      button.append(letter, label);
      if (selections[kind] !== undefined) {
        const isCorrect = normalize(value) === normalize(correct);
        const isSelected = selections[kind] === value;
        button.classList.toggle('correct', isCorrect);
        button.classList.toggle('incorrect', isSelected && !isCorrect);
        if (isCorrect || isSelected) {
          const mark = document.createElement('span');
          mark.className = 'choice-mark';
          mark.textContent = isCorrect ? '✓ ถูกต้อง' : '✗ คำตอบของคุณ';
          button.append(mark);
        }
      }
      button.addEventListener('click', () => selectChoice(kind, value));
      container.append(button);
    });
  }
}
function selectChoice(kind, value) {
  if (!song || answered || selections[kind] !== undefined || !choices[kind]?.includes(value)) return;
  selections[kind] = value;
  const correct = kind === 'title' ? titleOf(song) : song.artist;
  const isCorrect = normalize(value) === normalize(correct);
  if (isCorrect) score += 100;
  updateScore();
  renderChoices();
  $('quizStatus').textContent = `${kind === 'title' ? 'ชื่อเพลง' : 'ศิลปิน'}: ${isCorrect ? 'ตอบถูก +100 คะแนน' : 'ตอบผิด'} · ${selections.title !== undefined && selections.artist !== undefined ? 'ตอบครบแล้ว' : 'เลือกคำตอบอีกข้อได้เลย'}`;
  if (selections.title !== undefined && selections.artist !== undefined) finishRound();
  else document.querySelector(`#${kind === 'title' ? 'artist' : 'title'}Choices button`)?.focus();
}
function renderHints() {
  $('hints').replaceChildren();
  if (!song) return;
  hintMeta.forEach((hint, index) => {
    const isOpen = opened.has(index);
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `hint ${isOpen ? 'open' : 'hint-closed'}`;
    button.disabled = isOpen || answered;
    button.setAttribute('aria-expanded', String(isOpen));
    const copy = document.createElement('span');
    copy.className = 'hint-copy';
    const label = document.createElement('span');
    label.className = 'hint-top';
    label.textContent = hint.label;
    const content = document.createElement('span');
    content.className = 'hint-text';
    content.textContent = isOpen ? song[hint.key] : 'แตะเพื่อเปิดคำใบ้';
    copy.append(label, content);
    button.append(copy);
    button.addEventListener('click', () => {
      if (answered || opened.has(index)) return;
      opened.add(index);
      renderHints();
    });
    $('hints').append(button);
  });
}
function renderHistory() {
  $('historyCount').textContent = `${playHistory.length} รอบ`;
  $('historyList').replaceChildren();
  if (!playHistory.length) {
    const empty = document.createElement('div');
    empty.className = 'history-empty';
    empty.textContent = 'เพลงแรกกำลังรอคุณอยู่';
    $('historyList').append(empty);
  }
  for (const item of playHistory) {
    const row = document.createElement('div');
    row.className = 'history-item';
    const details = document.createElement('div');
    const title = document.createElement('div');
    title.className = 'history-song';
    title.textContent = item.title;
    const info = document.createElement('div');
    info.className = 'history-round';
    info.textContent = `รอบ ${item.round} · ${item.artist}`;
    const points = document.createElement('div');
    points.className = 'history-score';
    points.textContent = `${item.score} / 200`;
    details.append(title, info);
    row.append(details, points);
    $('historyList').append(row);
  }
}
function startRound(message = '') {
  stopAudio();
  deck = deck.filter(item => !unavailableIds.has(item.track_id));
  if (!deck.length) {
    deck = shuffle(categorySongs().filter(item => !unavailableIds.has(item.track_id)));
    if (deck.length > 1 && deck.at(-1).track_id === previousId) {
      [deck[0], deck[deck.length - 1]] = [deck[deck.length - 1], deck[0]];
    }
  }
  song = deck.pop() || null;
  previousId = song?.track_id ?? previousId;
  score = 0; answered = false; selections = {}; choices = {}; opened = new Set();
  if (song) {
    choices.title = generateChoices(titleOf(song), songs.map(titleOf));
    choices.artist = generateChoices(song.artist, songs.map(item => item.artist));
  }
  $('roundArea').hidden = false;
  $('result').classList.remove('show');
  $('round').textContent = String(round).padStart(2, '0');
  $('listen').textContent = '▶ ฟังเสียงเพลง';
  $('listen').disabled = !song;
  $('reveal').disabled = !song;
  $('retryPool').hidden = !!song;
  $('songYear').textContent = song ? `หมวด ${categories[selectedCategory].label}` : 'ยังไม่มีเพลงที่พร้อมเล่น';
  const categoryText = `${categories[selectedCategory].label} · ${categorySongs().length} เพลง`;
  $('catalogCount').textContent = `คลังเพลง ${categoryText}`;
  $('categoryStatus').textContent = categoryText;
  $('audioStatus').textContent = message || (song ? 'ฟังตัวอย่าง 30 วินาทีได้ฟรี แล้วเลือกชื่อเพลงและศิลปิน' : 'เสียงทุกเพลงไม่พร้อมใช้งาน โปรดตรวจการเชื่อมต่อแล้วลองใหม่');
  $('quizStatus').textContent = song ? 'ตอบได้ข้อละ 1 ครั้ง · ถูกข้อละ 100 คะแนน' : '';
  updateScore(); renderChoices(); renderHints();
}
function finishRound() {
  if (answered || !song) return;
  answered = true;
  stopAudio();
  $('roundArea').hidden = true;
  $('answerTitle').textContent = song.title;
  $('resultMeta').textContent = `${song.artist} · ${song.album}\n${yearText(song)}`;
  $('resultSource').href = song.source_url;
  $('yearSource').href = song.year_source || song.source_url;
  $('resultText').textContent = `คะแนนรอบนี้ ${score} / 200 คะแนน · ชื่อเพลง: ${selections.title === undefined ? 'ไม่ได้ตอบ' : normalize(selections.title) === normalize(titleOf(song)) ? 'ถูก' : 'ผิด'} · ศิลปิน: ${selections.artist === undefined ? 'ไม่ได้ตอบ' : normalize(selections.artist) === normalize(song.artist) ? 'ถูก' : 'ผิด'}`;
  playHistory.unshift({ title: song.title, artist: song.artist, score, round });
  renderHistory();
  $('result').classList.add('show');
  $('next').focus();
}
function selectCategory(id) {
  if (!Object.hasOwn(categories, id) || id === selectedCategory) return;
  selectedCategory = id;
  document.querySelectorAll('[data-category]').forEach(button => {
    const selected = button.dataset.category === id;
    button.classList.toggle('selected', selected);
    button.setAttribute('aria-pressed', String(selected));
  });
  deck = []; round++;
  startRound();
}
function playAudio() {
  if (!song || answered || audioLoading) return;
  if (activeAudio && !activeAudio.paused) { activeAudio.pause(); return; }
  if (!activeAudio) {
    const player = document.createElement('audio');
    player.id = 'audio'; player.hidden = true; player.preload = 'none';
    $('audio').replaceWith(player);
    activeAudio = player;
    player.src = song.audio_url;
  }
  const player = activeAudio;
  const generation = ++audioGeneration;
  const isCurrent = () => !answered && activeAudio === player && audioGeneration === generation;
  audioLoading = true; $('listen').disabled = true;
  $('audioStatus').textContent = 'กำลังโหลดตัวอย่างเสียง…';
  const fail = error => {
    if (!isCurrent()) return;
    if (error?.name === 'NotAllowedError' || !navigator.onLine) {
      stopAudio(); $('listen').disabled = false; $('listen').textContent = '▶ ลองฟังอีกครั้ง';
      $('audioStatus').textContent = 'ยังเล่นเสียงไม่ได้ ตรวจการเชื่อมต่อแล้วกดฟังอีกครั้ง';
      return;
    }
    unavailableIds.add(song.track_id);
    startRound('เสียงเพลงเดิมไม่พร้อม เปลี่ยนเพลงให้แล้ว · ไม่บันทึกรอบที่เสียงเสีย');
  };
  player.onplaying = () => {
    if (!isCurrent()) return;
    clearTimeout(audioTimer); audioLoading = false;
    $('listen').disabled = false; $('listen').textContent = '❚❚ หยุดเสียงชั่วคราว';
    $('audioStatus').textContent = 'กำลังเล่นตัวอย่างเสียง · ฟังซ้ำได้ฟรี';
  };
  player.onpause = () => {
    if (!isCurrent() || audioLoading || player.ended) return;
    $('listen').textContent = '▶ ฟังต่อ';
    $('audioStatus').textContent = 'หยุดชั่วคราว · กดฟังต่อได้';
  };
  player.onended = () => {
    if (!isCurrent()) return;
    $('listen').textContent = '↻ ฟังอีกครั้ง'; $('listen').disabled = false;
    $('audioStatus').textContent = 'ตัวอย่างเสียงจบแล้ว · ฟังซ้ำได้ฟรี';
  };
  player.onerror = fail;
  audioTimer = setTimeout(() => fail(new Error('timeout')), 20000);
  player.play().catch(fail);
}
$('totalSongs').textContent = songs.length.toLocaleString('en-US');
$('allSongsCount').textContent = `${songs.length.toLocaleString('en-US')} เพลง`;
document.querySelectorAll('[data-category]').forEach(button => button.addEventListener('click', () => selectCategory(button.dataset.category)));
$('listen').addEventListener('click', playAudio);
$('reveal').addEventListener('click', finishRound);
$('next').addEventListener('click', () => { round++; startRound(); $('listen').focus(); });
$('retryPool').addEventListener('click', () => { unavailableIds.clear(); deck = []; startRound(); });
window.addEventListener('pagehide', stopAudio);
renderHistory(); startRound();
