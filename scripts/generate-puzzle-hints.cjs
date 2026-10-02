// Generates static, editable title puzzles; never changes audio/catalog metadata.
const fs = require('node:fs');
const assert = require('node:assert/strict');
const wordSegmenter = new Intl.Segmenter('th', { granularity: 'word' });
const graphemeSegmenter = new Intl.Segmenter('th', { granularity: 'grapheme' });
const groups = `
❤️|รัก ความรัก Love L.O.V.E Rak
💭|คิด คิดถึง คำนึง ฝัน เพ้อ ภาวนา หวัง นึกถึง ความคิดถึง นิยาย นิยาม นิรันดร์
💔|อกหัก แตกหัก ร้าว นอกใจ ตัดใจ เสียใจ ใจร้าย ใจร้าว เจ็บ ปวด บาดแผล แผล ช้ำ ปอน ทรมาน พัง เจ็บปวด SCAR Pain Paiiinntt
🫀|ใจ หัวใจ ดวงใจ จิต ใจกลาง ใจดี Jai
🫵|เธอ คุณ เจ้า แก มึง you You YOU Your ur Tur
🙋|ฉัน ผม ข้า เรา กู I me Me ME
👤|คน ตัว มนุษย์ เจ้าของ ผู้
👥|กัน ด้วย คู่ ร่วม เคียง ข้าง สอง Both
🙏|ขอ วอน ขออภัย ขอโทษ ขอบใจ โปรด อ้อนวอน วิงวอน ขอร้อง Please ภาวนา
🎁|ให้ ฝาก มอบ รับ แสดงออก สิ่งของ รางวัล
🤗|กอด Hug ห่ม อบอุ่น Arm
💋|จูบ Kiss kiss คิส
🤝|ผูกพัน ยินยอม ยอม สัญญา มั่น จง สิทธิ์ ไว้ใจ เชื่อ
💯|จริง จริงใจ แท้ จริงๆ ชัวร์ แน่นอน มั่นใจ
✅|ใช่ ดี ดูดี Good good GOOD ดีใจ ข่าวดี เป็นไร ได้ ทำได้ OK โอเค
🚫|ไม่ อย่า ไม่มี ไร้ ห้าม NO No Don't Not not Forbidden
❓|ไหม ใคร ทำไม อะไร ไหน มั้ย มั๊ย รึ ไง หรือ คำถาม Who What WHAT Guess
🤷|ไม่รู้ งง งงี้ งั้น อ้าว เอาไง สับสน
👂|รู้ ได้ยิน เสียง ฟัง ข่าว ข่าวลือ
🗣️|บอก พูด คำ ถ้อยคำ ข้อความ ถาม ตอบ ทัก SAY Call CALL โทร
🫢|แอบ ลับ เงียบ ซ่อนกลิ่น ซ่อน Secret secret Mute
👀|ดู มอง เห็น สายตา แวว รู้จัก eyes Sight
😭|น้ำตา ร้องไห้ เสียใจ CRY Cry cry น้ำตาซึม
😢|เหงา เดียวดาย เดียว ดาย เศร้า อาลัย ว่าง Loneliness Lonely Alone alone
🥺|น้อยใจ สงสาร แง น้อย ควร สมควร
😊|ยิ้ม สบาย ยินดี สุข สบายใจ รื่นรมย์ สนุก Euphoria รื่นเริง
😡|โกรธ เกลียด เดือด โมโห อารมณ์ หึง Jealous
😱|ตกใจ กลัว Fear แพ้ หวั่น
🤪|บ้า โรคจิต ฟีล ซ่า ซ่าส์ บ๊อง บ้าบอ
😴|หลับ หลับตา นอน ละเมอ ฝันดี
😮‍💨|เหนื่อย ท้อ ยาก ลำบาก ถอน หายใจ ลมหายใจ
🤫|ลืม หาย จาง Forgotten ลืมได้ จำนน
🧠|จำ จดจำ ทบทวน Memory Remind remember เข้าใจ คิดมาก รู้สึก
🕰️|เวลา รอ คอย นาน ตลอด เสมอ เมื่อ ครั้ง ช่วง ตอน Time TIME Wait waiting ชั่วโมง
⏸️|หยุด พัก พอ พอแล้ว พอดี FREEZE
⏳|ก่อน สาย ที่สุด สุดท้าย Last last สุด End Finally
☀️|ตะวัน อาทิตย์ แสง สว่าง Sunshine sunshine Day day เช้า Morning morning รุ่ง
🌙|จันทร์ พระจันทร์ เดือน คืน ค่ำ ดึก เที่ยงคืน Midnight Moon
📅|วัน วันนี้ วันนั้น วันไหน พรุ่งนี้ พรุ่ง วันวาน อดีต ปี ยาม กาล สักวัน Yesterday Everyday today
🌧️|ฝน Rain rain
☁️|ฟ้า ท้องฟ้า SKY Sky sky เมฆ Skyfall
🌈|รุ้ง rainbow Rainbow
⭐|ดาว ดวง เจิด จรัส ดาวตก star starlost
🌊|ทะเล คลื่น SEA Sea sea ฝั่ง น้ำ
💨|ลม สายลม พัด โบยบิน
🌫️|หมอก ฝุ่น ควัน
🌷|ดอกไม้ บุษบา ดอก บาน ช่อ มาลี Blooming Flower
🌳|ใบไม้ ต้น ไม้ ฟืน Earth โลก
🌾|ฟาง ข้าว ผืน ดิน ทราย ตื้น
🏙️|เมือง กรุงเทพ กรุงเทพมหานคร สุขุมวิท วิภาวดี เมืองใหญ่
🏠|บ้าน เรือน ห้อง ที่พัก home Home House House
🚪|ประตู
🪟|หน้าต่าง กระจก กระจกเงา ภาพลวงตา
🛏️|เตียง หมอน
👨|ชาย ผู้ชาย พ่อ สมชาย นาย หนุ่ม Boys Boy boy brother
👩|สาว ผู้หญิง หญิง เธอเอง Susan Joan
👰|เจ้าสาว วิวาห์
👼|นางฟ้า เทวดา เทวี นาง มาตา Pha Nang
👑|ราชา พระเจ้า กษัตริย์ เจ้าตาก ยิ่งใหญ่ ครอง พิภพ
👴|ปู่ เฒ่า ลุง
👵|ป้า ยาย แม่สาย แม่ Mother
👶|เด็ก เกิด น้อง หนู Baby baby Kid Kids2
🧑‍🤝‍🧑|เพื่อน FRIEND friend Best BEST สนิท
🎤|เพลง ร้อง ดนตรี คอนเสิร์ต ดี.เจ ดี.เจ. Song song ทำนอง เต้นรำ Dance เต้น ดับเครื่องชน
🎸|ร็อค กีตาร์
🥁|จังหวะ บูม
🏃|วิ่ง ถอย หนี เดิน ไป Move Away away Run
🛣️|ทาง ผ่าน ระหว่าง ข้าม ลู่ ทางเดิน แยก
↔️|ใกล้ ไกล ห่าง ห่างไกล คนละ ขนาน ต่าง เปลี่ยน เท่ากัน กลับ
📍|ตรง ที่ ใน อยู่ แห่ง ณ นี่ มุม ข้างๆ ข้าง ในใจ
⬆️|ขึ้น สูง ยิ่ง ใหญ่ ล้น มากกว่า
⬇️|ลง ตก หล่น ล้ม หลุม ลด ก้ม
➡️|ต่อ Next คืนมา กลับมา แลก
🎨|วาด สี ภาพ รูป Proof จำลอง
🖼️|Silhouette เงา
📖|บันทึก เรื่อง นิทาน ประวัติศาสตร์ Diary
✉️|จดหมาย ส่ง ไปรษณีย์
📝|กระดาษ เขียน ปากกา เครื่องหมาย ตอบกลับ
🔐|เก็บ ล็อค ล็อก ขัง บ่วง ผูก
🔓|เปิด ปล่อย เลิก พลิก
🧹|ล้าง เช็ด กวาด
🌺|ราตรี รำเพย สร้อย มาลา สำอาง หอม น้ำหอม กลิ่น
🤒|ไข้ ภูมิแพ้ ป่วย ยา หมอ ดูแล
☠️|ตาย พิษ ยาพิษ
🔥|ไฟ ร้อน Firework Fire fire
❄️|หนาว เย็น ใจเย็น
🔋|แรง กำลัง เติม น้ำมัน
🛢️|ถัง ทินเนอร์
🗑️|ขยะ ทิ้ง เศษ
🌿|กัญชา ผักชี
🍳|ไข่ เจียว
🌶️|พริก
🐟|ปลา ทู
🐃|ควาย
🐕|หมา สุนัข
🐋|วาฬ
🐢|เต่า กระดอง ดอยเต่า
🐸|คางคก
🦇|ค้างคาว
🦋|BUTTERFLY Butterfly butterfly ผีเสื้อ
🐝|ผึ้ง
🐦|นก ฝูง
🐷|หมู
💎|เพชร ทอง precious
🍊|ส้ม
🍫|Chocolate chocolate
☕|กาแฟ coffee Coffee
🍷|ไวน์ Wine
👅|ลิ้น น้ำลาย
👄|ปาก แก้ม
✋|มือ แขน ถา หัตถา จับ คว้า กุม
🦶|เท้า เตะ รอย ขา
🧥|เสื้อ เชิ้ต สวม ห่มผ้า
👖|JEANS Jeans jeans
🎩|หมวก
💇|ผมทรง
🤡|หลอก แกล้ง ปลอม แสร้ง เสแสร้ง Pretend TEST
🥊|กัด สู้ สงคราม รบ ขุนศึก แชมป์ win แพ้ LOSER Loser
🎮|เกม เล่น
🤓|เฉิ่ม เดียงสา เดียง ง่าย โง่ Teacher เรียน สอน
🔮|พรหม ลิขิต วาสนา โชค ลาง Magic มายากล มหัศจรรย์ คาถา เสน่ห์ มนต์ เนรมิต
💸|จน คนจน ตกงาน ค่า พันธ์ทิพย์
💰|เงิน ร้อย พัน หมื่น แสน ล้าน
⛰️|ดอย ภูเขา ดอยเต่า
🚲|จักรยาน
🚗|รถ
🚂|Train train
🚑|ไซเรน Ambulance ฉุกเฉิน ฉุด
💨|หายใจ ลมหายใจ
🥳|คึกคัก ร่าเริง เฮ้ จงเจริญ
✂️|ตัด
💪|อดทน ทน เก่ง ทรหด ยืนยง
🧍|ยืน ยืนอยู่
📸|ภาพยนตร์ ละคร
🔴|แดง
⚫|ดำ
⚪|ขาว
🟡|เหลือง
🩶|เทา
🔵|คราม
🧩|ปัญหา สรุป เหตุผล Reason
📏|วัด ขนาด มาก เต็ม ครึ่ง นิด เล็ก น้อยเดียว
🎯|เลือก ต้องการ อยาก ต้อง need wanna WANT
🔄|อีก ซ้ำ AGAIN Same SAME ทบทวน
💞|แฟน จีบ เจ้าชู้ Lover lover Darling ที่รัก จัส
🫂|ปลอบ ปลอดภัย Safe safe ดูแล หวง ห่วง
🍃|ร่ม ริม ลอย เคว้งคว้าง
🪑|โต๊ะ
💼|งาน
🧴|พลาสติก
📦|ตู้ ห่อ สิ่ง
🪨|หิน ก้อน
🧛|ดูด
♾️|กัลปาวสาน ตลอดไป นิรันดร์ Forever forever ever
🧭|ทิศ ใต้ เหนือ ซ้าย
🏖️|หัวหิน Huahin หัวหิน ทะเลทราย oasis
🇯🇵|เจแปน ซาโยนาระ
🎈|อิสระ FREE free
💥|สุดฤทธิ์ ฤทธิ์ เดช บูม ระเบิด
🫨|ตะลึง สะดุ้ง
😬|อ้ำอึ้ง อ่าง ติดอ่าง เขิน อาย
💫|เคลิ้ม มึน
🌻|สวย สวยงาม นางงาม
🤏|แค่ เพียง เท่านั้น นิดนึง
🫰|ชอบ Like like
🔍|ค้น หา แสวงหา
🎭|หน้ากาก ฉบับ
🔗|สัมพันธ์ ผูกพัน
💾|ไว้
💡|สว่าง รู้แจ้ง
👨‍⚖️|จำเลย Defendant สิทธิ์
📱|589 3375 CALL โทร
1️⃣|หนึ่ง เดียว First One first
2️⃣|สอง
3️⃣|สาม
4️⃣|สี่
5️⃣|ห้า
🔟|10 สิบ
💯|100
`;
const meanings = new Map();
for (const row of groups.trim().split('\n')) {
  const [emoji, words] = row.split('|');
  for (const word of words.trim().split(/\s+/)) meanings.set(word.toLowerCase(), emoji);
}
const overrides = {
  'วาฬเกยตื้น': '🐋 🏖️',
  'ฝนตกไหม': '🌧️ ☔ ❓',
  'ซ่อนกลิ่น': '🙈 🌺',
  'เธอคือกาแฟในตอนเช้า': '🫵 ☕ 🌅',
  'ข้างกัน': '🧍 ↔️ 🧍',
  'ขอให้เธอใจดี': '🙏 🫵 ❤️ 😇',
};
const manual = fs.existsSync('scripts/puzzle-title-overrides.json') ? JSON.parse(fs.readFileSync('scripts/puzzle-title-overrides.json','utf8')) : {};
const compounds = { ใจดี: ['ใจ','ดี'], ใจร้าย: ['ใจ','ร้าย'], ซ่อนกลิ่น: ['ซ่อน','กลิ่น'], ใจเย็น: ['ใจ','เย็น'], น้อยใจ: ['น้อย','ใจ'], ไม่รู้: ['ไม่','รู้'], ไม่ใช่: ['ไม่','ใช่'], น้ำตา: ['น้ำ','ตา'], ใจหาย: ['ใจ','หาย'], คิดถึง: ['คิด','ถึง'], ฝังใจ: ['ฝัง','ใจ'], ตัดใจ: ['ตัด','ใจ'], ลงใจ: ['ลง','ใจ'], คิดมาก: ['คิด','มาก'] };
function puzzleTitle(title) {
  // Catalog qualifiers and featured artist credits are not part of the puzzle.
  return title.replace(/\s*\([^)]*\)/g, '').replace(/\s*\[[^\]]*\]/g, '').replace(/\s+(?:feat\.?|ft\.?|featuring)\s*.*/i, '').trim() || title;
}
function wordsFor(title) {
  return [...wordSegmenter.segment(title)].filter(x => x.isWordLike).flatMap(x => compounds[x.segment] || [x.segment]);
}
function initials(title) {
  return wordsFor(title).map(w => w.match(/[ก-ฮ]/u)?.[0] || w.match(/[a-zA-Z0-9]/)?.[0]?.toUpperCase()).filter(Boolean).join(' - ');
}
function blanks(title, seed) {
  const units = [...graphemeSegmenter.segment(title)].map(x => x.segment);
  const letters = units.map((u,i) => /[ก-ฮะ-ๅa-zA-Z0-9]/u.test(u) ? i : -1).filter(i => i >= 0);
  const count = Math.max(1, Math.min(letters.length - 1, Math.round(letters.length * .45)));
  // Stable selection; mask whole graphemes so tone marks cannot become orphaned.
  const ranked = letters.map(i => ({ i, n: ((i + 1) * 2654435761 + seed * 1597334677) >>> 0 })).sort((a,b) => a.n-b.n);
  const hidden = new Set(ranked.slice(0,count).map(x => x.i));
  return units.map((u,i) => hidden.has(i) ? '_' : /\s/.test(u) ? ' / ' : u).join(' ').replace(/\s+/g,' ').trim();
}
function generate() {
const html = fs.readFileSync('index.html','utf8');
const songs = JSON.parse(html.match(/const songs = (\[[\s\S]*?\]);/)[1]);
const missing = [];
for (const song of songs) {
  const base = puzzleTitle(song.title);
  const words = wordsFor(base);
  const clues = words.map(w => meanings.get(w.toLowerCase())).filter(Boolean);
  song.hint_1 = overrides[base] || manual[base] || clues.join(' ');
  if (!song.hint_1) missing.push({ title: song.title, base, words });
  song.hint_2 = initials(base);
  song.hint_3 = song.artist;
  song.hint_4 = blanks(base, song.track_id);
  song.puzzle_title = base;
  assert(song.hint_2, 'No initials: '+base);
}
if (missing.length) {
  fs.mkdirSync('.catalog-work',{recursive:true});
  fs.writeFileSync('.catalog-work/missing-emoji.json',JSON.stringify(missing,null,2));
  console.log('Needs curated emoji:',missing.length, missing.map(x=>x.base).join(' | '));
  process.exitCode = 1;
} else {
  let output = html.replace(/const songs = \[[\s\S]*?\];/, 'const songs = [\n'+songs.map(s=>'  '+JSON.stringify(s)).join(',\n')+'\n];');
  output = output.replace("{ key: 'hint_1', icon: '🔢', label: 'คำใบ้ที่ 1 · ลักษณะชื่อเพลง' }", "{ key: 'hint_1', icon: '🧩', label: 'คำใบ้ที่ 1 · อีโมจิ' }");
  output = output.replace("{ key: 'hint_2', icon: '🎙️', label: 'คำใบ้ที่ 2 · ศิลปิน' }", "{ key: 'hint_2', icon: '🔤', label: 'คำใบ้ที่ 2 · พยัญชนะต้น' }");
  output = output.replace("{ key: 'hint_3', icon: '💌', label: 'คำใบ้ที่ 3 · เรื่องราว / แนวเพลง' }", "{ key: 'hint_3', icon: '🎙️', label: 'คำใบ้ที่ 3 · ศิลปิน / วง' }");
  output = output.replace("{ key: 'hint_4', icon: '🔎', label: 'คำใบ้ที่ 4 · คำในชื่อเพลง' }", "{ key: 'hint_4', icon: '🔎', label: 'คำใบ้ที่ 4 · อักษรที่หายไป' }");
  fs.writeFileSync('index.html',output);
  console.log('Updated four hints for all '+songs.length+' songs.');
}
}
module.exports = { puzzleTitle, wordsFor, initials, blanks };
if (require.main === module) generate();
