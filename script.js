const legacySongs = [
  { title:"วัดใจ", artist:"Silly Fools", year:2002, kind:"วงร็อก", syllables:2, hints:["ชื่อเพลงสั้นเพียง 2 พยางค์", "วงร็อกที่มีเพลงดังอย่าง ‘ขี้หึง’ และ ‘น้ำลาย’", "ชื่อเพลงเหมือนการทดสอบความกล้าหรือความจริงใจ", "บรรยากาศชวนให้เลือกเดินหน้าทั้งที่ผลยังไม่แน่นอน"] },
  { title:"ทางผ่าน", artist:"BIG ASS", year:2000, kind:"วงร็อก", syllables:2, hints:["ชื่อเพลง 2 พยางค์ และเกี่ยวกับการเดินทาง", "ศิลปินเป็นวงร็อกชื่อภาษาอังกฤษตัวพิมพ์ใหญ่", "คนเล่าเรื่องรู้สึกว่าตัวเองเป็นเพียงจุดชั่วคราว", "คำใบ้ภาพ: ถนนที่ไม่มีใครหยุดพัก"] },
  { title:"ความซื่อสัตย์", artist:"Bodyslam", year:2003, kind:"วงร็อก", syllables:3, hints:["ชื่อเพลง 3 พยางค์ เป็นคุณธรรมข้อหนึ่ง", "ผลงานจากวงร็อกที่มี ตูน อาทิวราห์ เป็นนักร้องนำ", "เล่าความสัมพันธ์ที่ต้องการความจริงใจมากกว่าคำสวยหรู", "คำสำคัญในชื่อขึ้นต้นด้วย ‘ความ’"] },
  { title:"เล่นของสูง", artist:"BIG ASS", year:2004, kind:"วงร็อก", syllables:3, hints:["ชื่อเพลง 3 พยางค์ เป็นสำนวนไทย", "ศิลปินเป็นวงเดียวกับเพลง ‘ทางผ่าน’", "เปรียบความรักกับการเอื้อมถึงสิ่งที่เกินตัว", "ชื่อเพลงมีคำที่ตรงข้ามกับ ‘ต่ำ’"] },
  { title:"ยื้อ", artist:"Potato", year:2005, kind:"วงร็อก", syllables:1, hints:["ชื่อเพลงมีเพียง 1 พยางค์", "วงร็อกชื่อเดียวกับวัตถุดิบทำเฟรนช์ฟรายส์", "ใจความคือการพยายามรั้งสิ่งที่กำลังจะจากไป", "คำเดียวในชื่อเป็นกริยาที่ใช้เมื่อไม่อยากปล่อย"] },
  { title:"ฤดูที่ฉันเหงา", artist:"Flure", year:2006, kind:"วงดนตรี", syllables:5, hints:["ชื่อเพลงยาว 5 พยางค์", "ศิลปินเป็นวงดนตรีอัลเทอร์เนทีฟจากยุค 2000", "ใช้ช่วงเวลาของปีแทนอารมณ์โดดเดี่ยว", "ชื่อมีทั้งคำบอกเวลาและสรรพนามบุรุษที่หนึ่ง"] },
  { title:"ยิ่งรู้ยิ่งไม่เข้าใจ", artist:"Bodyslam", year:2007, kind:"วงร็อก", syllables:6, hints:["ชื่อเพลงเป็นประโยคยาว 6 พยางค์", "วงร็อกเจ้าของเพลง ‘แสงสุดท้าย’", "ยิ่งค้นหาคำตอบกลับยิ่งสับสน", "ชื่อมีคำว่า ‘ยิ่ง’ ซ้ำ 2 ครั้ง"] },
  { title:"ความรัก", artist:"Bodyslam", year:2008, kind:"วงร็อก", syllables:2, hints:["ชื่อเพลง 2 พยางค์ เป็นหัวข้อใหญ่ของเพลงป๊อปจำนวนมาก", "ศิลปินเป็นวง ไม่ใช่ศิลปินเดี่ยว", "เปรียบสิ่งหนึ่งที่ทั้งสวยงามและสร้างความเจ็บปวดได้", "ชื่อเพลงขึ้นต้นด้วย ‘ความ’ และลงท้ายด้วยสิ่งที่ทุกคนตามหา"] },
  { title:"โปรดส่งใครมารักฉันที", artist:"Instinct", year:2007, kind:"วงร็อก", syllables:7, hints:["ชื่อเพลงเป็นประโยคขอร้อง 7 พยางค์", "ศิลปินเป็นวงร็อกชื่อภาษาอังกฤษที่แปลว่าสัญชาตญาณ", "คนเล่าเรื่องกำลังขอให้ความเหงาจบลง", "ในชื่อมีทั้งคำว่า ‘ใคร’ และ ‘ฉัน’"] },
  { title:"เบา เบา", artist:"Singular", year:2010, kind:"ดูโอ", syllables:2, hints:["ชื่อเพลงเป็นคำ 1 พยางค์ที่เขียนซ้ำ", "ศิลปินเป็นดูโอที่โดดเด่นด้วยเสียงร้องและกีตาร์", "อารมณ์เพลงนุ่ม สบาย และค่อยเป็นค่อยไป", "ชื่อเพลงบอกระดับเสียงหรือแรงที่ไม่หนัก"] },
  { title:"ร่มสีเทา", artist:"วัชราวลี", year:2011, kind:"วงดนตรี", syllables:3, hints:["ชื่อเพลง 3 พยางค์ มีวัตถุหนึ่งชิ้นและหนึ่งสี", "ชื่อศิลปินเป็นคำไทย ไม่ใช่ชื่อคนคนเดียว", "มองความทุกข์และความสุขว่าอยู่ร่วมกันได้", "วัตถุในชื่อใช้ป้องกันแดดและฝน"] },
  { title:"ไกลแค่ไหนคือใกล้", artist:"Getsunova", year:2012, kind:"วงดนตรี", syllables:5, hints:["ชื่อเพลง 5 พยางค์ มีคำตรงข้ามอยู่ในชื่อเดียวกัน", "ศิลปินเป็นวงเจ้าของแนวคิด ‘ความต่างที่ลงตัว’", "ตั้งคำถามถึงระยะห่างที่ยังไม่พอให้ได้อยู่ข้างกัน", "ชื่อขึ้นต้นด้วย ‘ไกล’ แต่จบด้วยอีกความหมายหนึ่ง"] },
  { title:"ภูมิแพ้กรุงเทพ", artist:"ป้าง นครินทร์ feat. ตั๊กแตน ชลดา", year:2013, kind:"ศิลปินคู่พิเศษ", syllables:4, hints:["ชื่อเพลง 4 พยางค์ ผสมอาการป่วยกับชื่อเมือง", "ร้องร่วมกันโดยนักร้องชายสายร็อกและนักร้องหญิงลูกทุ่ง", "เล่าเสน่ห์ของชีวิตต่างจังหวัดตัดกับเมืองหลวง", "ชื่อมีคำว่าเมืองหลวงของประเทศไทย"] },
  { title:"คุกเข่า", artist:"COCKTAIL", year:2012, kind:"วงร็อก", syllables:2, hints:["ชื่อเพลง 2 พยางค์ เป็นท่าทางของร่างกาย", "ศิลปินเป็นวงร็อกชื่อเดียวกับเครื่องดื่มผสม", "ผู้เล่าเรื่องยอมลดศักดิ์ศรีเพื่อขอให้ความรักอยู่ต่อ", "คำใบ้ภาพ: หัวเข่าทั้งสองข้างแตะพื้น"] },
  { title:"เชือกวิเศษ", artist:"LABANOON", year:2015, kind:"วงร็อก", syllables:3, hints:["ชื่อเพลง 3 พยางค์ มีสิ่งของกับคุณสมบัติเหนือจริง", "วงร็อกจากภาคใต้ที่มีเพลง ‘191’", "แม้มีสิ่งผูกมัดพิเศษ ก็รั้งคนหมดใจไม่ได้", "สิ่งของในชื่อใช้ผูกหรือมัด"] },
  { title:"คู่ชีวิต", artist:"COCKTAIL", year:2015, kind:"วงร็อก", syllables:3, hints:["ชื่อเพลง 3 พยางค์ หมายถึงคนที่จะอยู่ด้วยกันยาวนาน", "ศิลปินเป็นวงเดียวกับเพลง ‘คุกเข่า’", "เป็นคำสัญญาถึงการร่วมทุกข์ร่วมสุข", "ชื่อเริ่มด้วยคำที่หมายถึงสองสิ่งที่อยู่ด้วยกัน"] },
  { title:"ซ่อนกลิ่น", artist:"ปาล์มมี่", year:2018, kind:"ศิลปินเดี่ยวหญิง", syllables:2, hints:["ชื่อเพลง 2 พยางค์ เป็นกริยารวมกับสิ่งที่มองไม่เห็น", "นักร้องหญิงเดี่ยวลูกครึ่งไทย-เบลเยียม", "ความทรงจำยังคงหลงเหลือ แม้พยายามเก็บมันไว้", "ชื่อมีสิ่งที่รับรู้ได้ด้วยจมูก"] },
  { title:"ถอย", artist:"Gliss", year:2017, kind:"วงดนตรี", syllables:1, hints:["ชื่อเพลงมีเพียงคำเดียว 1 พยางค์", "ศิลปินเป็นวงดนตรีชื่อภาษาอังกฤษสั้น ๆ", "เลือกเว้นระยะเมื่อรู้ว่าอีกคนไม่ได้รู้สึกเหมือนกัน", "คำในชื่อเป็นการเคลื่อนที่ตรงข้ามกับเดินหน้า"] },
  { title:"รักติดไซเรน", artist:"ไอซ์ พาริส และ แพรวา ณิชาภัทร", year:2019, kind:"ศิลปินคู่", syllables:4, hints:["ชื่อเพลง 4 พยางค์ เชื่อมความรักกับเสียงรถฉุกเฉิน", "ร้องคู่โดยนักแสดงจากซีรีส์เกี่ยวกับห้องฉุกเฉิน", "เพลงจังหวะสนุกที่ถามว่าความรักส่งสัญญาณถึงกันหรือไม่", "หนึ่งคำในชื่อคือเสียงเตือนที่ดังบนรถพยาบาล"] },
  { title:"ฝนตกไหม", artist:"Three Man Down", year:2019, kind:"วงดนตรี", syllables:3, hints:["ชื่อเพลงเป็นคำถาม 3 พยางค์เกี่ยวกับอากาศ", "วงดนตรีชื่ออังกฤษที่มีตัวเลขซ่อนอยู่ในความหมาย", "ใช้เรื่องอากาศเป็นข้ออ้างในการแสดงความห่วงใยคนเก่า", "ชื่อจบด้วยคำถามสั้น ๆ ว่า ‘ไหม’"] },
  { title:"ถ้าเขาจะรัก (ยืนเฉยๆ เขาก็รัก)", artist:"First Anuwat", year:2020, kind:"ศิลปินเดี่ยวชาย", syllables:9, hints:["ชื่อหลักพร้อมวงเล็บยาวรวมประมาณ 9 พยางค์", "นักร้องชายเดี่ยวชื่อเล่นภาษาอังกฤษแปลว่า ‘อันดับหนึ่ง’", "แนวคิดคือคนที่ใช่ไม่ต้องพยายามจนเสียตัวตน", "ชื่อมีคำว่า ‘รัก’ ซ้ำทั้งก่อนและในวงเล็บ"] },
  { title:"ดึงดัน", artist:"COCKTAIL feat. ตั๊ก ศิริพร", year:2020, kind:"วงร่วมศิลปินหญิง", syllables:2, hints:["ชื่อเพลง 2 พยางค์และมีเสียงต้นคล้ายกัน", "วงร็อกร่วมร้องกับนักร้องหญิงรุ่นใหญ่สายพลังเสียง", "รู้ว่าควรหยุด แต่หัวใจยังฝืนไปต่อ", "ชื่อเพลงหมายถึงการฝืนหรือไม่ยอมเปลี่ยนใจ"] },
  { title:"ทน", artist:"SPRITE x GUYGEEGEE", year:2021, kind:"ศิลปินดูโอโปรเจกต์", syllables:1, hints:["ชื่อเพลง 1 พยางค์", "ผลงานร่วมของแร็ปเปอร์ไทยชาย 2 คน", "ชื่อคือสิ่งที่คนทำเมื่อยังไม่ยอมแพ้ต่อสถานการณ์", "เพลงนี้เคยสร้างกระแสไกลถึงชาร์ตระดับโลก"] },
  { title:"สองใจ", artist:"ดา เอ็นโดรฟิน", year:2021, kind:"ศิลปินเดี่ยวหญิง", syllables:2, hints:["ชื่อเพลง 2 พยางค์และมีตัวเลขอยู่ในความหมาย", "นักร้องหญิงเดี่ยวเสียงทรงพลัง อดีตนักร้องนำวง Endorphine", "เล่าความเจ็บปวดเมื่อความรักไม่ได้มีเพียงคนเดียว", "ชื่อขึ้นต้นด้วยจำนวนที่มากกว่าหนึ่ง"] },
  { title:"ทรงอย่างแบด", artist:"Paper Planes", year:2022, kind:"วงดนตรี", syllables:3, hints:["ชื่อเพลง 3 พยางค์ ผสมภาษาไทยกับคำอังกฤษ", "ศิลปินเป็นวงชื่อเดียวกับเครื่องบินกระดาษ", "เพลงร็อกพังก์ที่กลายเป็นเพลงฮิตในหมู่เด็ก ๆ", "คำสุดท้ายของชื่อแปลว่า ‘ไม่ดี’ ในภาษาอังกฤษ"] },
  { title:"นะหน้าทอง", artist:"โจอี้ ภูวศิษฐ์", year:2022, kind:"ศิลปินเดี่ยวชาย", syllables:3, hints:["ชื่อเพลง 3 พยางค์ อ้างถึงพิธีเสริมเสน่ห์แบบไทย", "นักร้องชายเดี่ยวที่ผสมเสียงพิณกับดนตรีร่วมสมัย", "ขอให้คนรักหลงใหลโดยไม่ต้องพึ่งมนตร์ใด", "ชื่อมีอวัยวะบนใบหน้าและโลหะมีค่า"] },
  { title:"ผู้ถูกเลือกให้ผิดหวัง (ดอกไม้ฤดูหนาว)", artist:"เรนิษรา", year:2022, kind:"ดูโอ", syllables:11, hints:["ชื่อเพลงหลักยาว และมีชื่อรองอยู่ในวงเล็บ", "ศิลปินเป็นดูโอชายหญิง", "เปรียบคนที่ไม่สมหวังกับดอกไม้ที่ผลิบานผิดฤดู", "ในชื่อมีคำตรงข้ามทางอารมณ์ระหว่าง ‘เลือก’ กับ ‘ผิดหวัง’"] },
  { title:"ดาวหางฮัลเลย์", artist:"fellow fellow", year:2023, kind:"ดูโอ", syllables:4, hints:["ชื่อเพลงประมาณ 4 พยางค์ เป็นวัตถุบนท้องฟ้า", "ศิลปินเป็นดูโอที่ใช้คำอังกฤษคำเดิมซ้ำ 2 ครั้ง", "เปรียบการรอพบใครสักคนกับเหตุการณ์ที่นาน ๆ เกิดครั้ง", "ชื่อมีวัตถุท้องฟ้าที่กลับมาใกล้โลกเป็นคาบ"] },
  { title:"ซ่อน(ไม่)หา", artist:"Jeff Satur", year:2024, kind:"ศิลปินเดี่ยวชาย", syllables:3, hints:["ชื่อเพลง 3 พยางค์ มีวงเล็บคั่นกลางคำคุ้นเคย", "นักร้องชายเดี่ยวที่ทำงานทั้งเพลงไทยและสากล", "คนหนึ่งซ่อนตัว แต่อีกคนเลือกไม่ตามหาอีกแล้ว", "ถ้าเอาคำในวงเล็บออก ชื่อจะกลายเป็นชื่อการละเล่นเด็ก"] },
  { title:"ใจเป็นนาย กายเป็นบ่าว", artist:"เล็ก รัชเมศฐ์", year:2025, kind:"ศิลปินเดี่ยวชาย", syllables:6, hints:["ชื่อเพลง 6 พยางค์ เป็นวลีเปรียบเทียบเจ้านายกับผู้รับใช้", "นักร้องชายเดี่ยวเสียงเข้มในแนวโฟล์กร็อก", "หัวใจสั่งให้ร่างกายต้องทำตาม แม้จะเหนื่อยหรือเจ็บ", "ชื่อมีอวัยวะ 2 ส่วน และฐานะคน 2 ระดับ"] }
];

const songs = window.SONGS || legacySongs;

const easyClues = {
  "วัดใจ":"มีคำว่า ‘ใจ’ อยู่ในชื่อเพลง",
  "ทางผ่าน":"มีคำว่า ‘ผ่าน’ อยู่ในชื่อเพลง",
  "ความซื่อสัตย์":"มีคำว่า ‘ซื่อสัตย์’ อยู่ในชื่อเพลง",
  "เล่นของสูง":"มีคำว่า ‘สูง’ อยู่ในชื่อเพลง",
  "ยื้อ":"ชื่อขึ้นต้นด้วย ‘ย’ และมีเพียงคำเดียว",
  "ฤดูที่ฉันเหงา":"มีคำว่า ‘เหงา’ อยู่ในชื่อเพลง",
  "ยิ่งรู้ยิ่งไม่เข้าใจ":"มีคำว่า ‘เข้าใจ’ และคำว่า ‘ยิ่ง’ อยู่ในชื่อ",
  "ความรัก":"มีคำว่า ‘รัก’ อยู่ในชื่อเพลง",
  "โปรดส่งใครมารักฉันที":"มีคำว่า ‘รักฉัน’ อยู่ติดกันในชื่อเพลง",
  "เบา เบา":"คำว่า ‘เบา’ ปรากฏ 2 ครั้งในชื่อเพลง",
  "ร่มสีเทา":"มีคำว่า ‘สีเทา’ อยู่ในชื่อเพลง",
  "ไกลแค่ไหนคือใกล้":"มีทั้งคำว่า ‘ไกล’ และ ‘ใกล้’ ในชื่อเพลง",
  "ภูมิแพ้กรุงเทพ":"มีคำว่า ‘กรุงเทพ’ อยู่ในชื่อเพลง",
  "คุกเข่า":"มีคำว่า ‘เข่า’ อยู่ในชื่อเพลง",
  "เชือกวิเศษ":"มีคำว่า ‘วิเศษ’ อยู่ในชื่อเพลง",
  "คู่ชีวิต":"มีคำว่า ‘ชีวิต’ อยู่ในชื่อเพลง",
  "ซ่อนกลิ่น":"มีคำว่า ‘ซ่อน’ อยู่ในชื่อเพลง",
  "ถอย":"ชื่อขึ้นต้นด้วย ‘ถ’ และมีเพียงคำเดียว",
  "รักติดไซเรน":"มีคำว่า ‘รัก’ อยู่หน้าชื่อเพลง",
  "ฝนตกไหม":"มีคำว่า ‘ฝน’ อยู่ในชื่อเพลง",
  "ถ้าเขาจะรัก (ยืนเฉยๆ เขาก็รัก)":"มีคำว่า ‘เขาจะรัก’ อยู่ในชื่อหลัก",
  "ดึงดัน":"ชื่อเพลงมีคำขึ้นต้นด้วยเสียง ‘ด’ ทั้งสองพยางค์",
  "ทน":"ชื่อขึ้นต้นด้วย ‘ท’ และมีเพียงคำเดียว",
  "สองใจ":"มีคำว่า ‘ใจ’ อยู่ท้ายชื่อเพลง",
  "ทรงอย่างแบด":"มีคำว่า ‘แบด’ อยู่ในชื่อเพลง",
  "นะหน้าทอง":"มีคำว่า ‘ทอง’ อยู่ในชื่อเพลง",
  "ผู้ถูกเลือกให้ผิดหวัง (ดอกไม้ฤดูหนาว)":"มีคำว่า ‘ผิดหวัง’ อยู่ในชื่อหลัก",
  "ดาวหางฮัลเลย์":"มีคำว่า ‘ดาว’ อยู่หน้าชื่อเพลง",
  "ซ่อน(ไม่)หา":"มีคำว่า ‘ไม่’ อยู่ในวงเล็บกลางชื่อ",
  "ใจเป็นนาย กายเป็นบ่าว":"มีคำว่า ‘ใจ’ อยู่หน้าชื่อเพลง"
};

const clueLabels = ["คำใบ้ที่ 1", "คำใบ้ที่ 2", "คำใบ้ที่ 3", "คำใบ้ที่ 4", "คำใบ้ที่ 5"];
let order = [];
let round = 0;
let score = 0;
let opened = 0;
let revealed = false;
let audioUsed = false;
let audioTimer = null;
let bgContext = null;
let bgMaster = null;
let bgTimer = null;
let bgPlaying = false;
const bgVoices = new Set();
let gameMode = "clue";
const previewCache = new Map();

const clueGrid = document.querySelector("#clue-grid");
const answerPanel = document.querySelector("#answer-panel");
const answerTitle = document.querySelector("#answer-title");
const answerDetail = document.querySelector("#answer-detail");
const revealButton = document.querySelector("#reveal-button");
const nextButton = document.querySelector("#next-button");
const audioButton = document.querySelector("#audio-button");
const audioStatus = document.querySelector("#audio-status");
const audioPreview = document.querySelector("#audio-preview");
const musicToggle = document.querySelector("#music-toggle");
const musicLabel = document.querySelector("#music-label");
const gameSection = document.querySelector(".game");
const clueModeButton = document.querySelector("#clue-mode");
const audioModeButton = document.querySelector("#audio-mode");
const guessInput = document.querySelector("#guess-input");
const guessFeedback = document.querySelector("#guess-feedback");

function shuffle(items) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function currentSong() { return songs[order[round]]; }

function scheduleTone(frequency, start, duration, volume, type = "sine") {
  const oscillator = bgContext.createOscillator();
  const gain = bgContext.createGain();
  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, start);
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(volume, start + 0.08);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  oscillator.connect(gain).connect(bgMaster);
  bgVoices.add(oscillator);
  oscillator.addEventListener("ended", () => bgVoices.delete(oscillator), { once: true });
  oscillator.start(start);
  oscillator.stop(start + duration + 0.05);
}

function scheduleMusicBar() {
  if (!bgPlaying || !bgContext) return;
  const start = bgContext.currentTime + 0.06;
  const chords = [
    [220.00, 261.63, 329.63],
    [174.61, 220.00, 261.63],
    [196.00, 246.94, 293.66],
    [164.81, 220.00, 261.63]
  ];
  const melody = [329.63, 392.00, 440.00, 392.00, 293.66, 329.63, 261.63, 293.66];
  chords.forEach((chord, chordIndex) => {
    const chordStart = start + chordIndex * 2;
    chord.forEach(frequency => scheduleTone(frequency, chordStart, 1.9, 0.032));
    scheduleTone(chord[0] / 2, chordStart, 1.7, 0.045, "triangle");
  });
  melody.forEach((frequency, index) => scheduleTone(frequency, start + index, 0.55, 0.024, "triangle"));
}

async function toggleBackgroundMusic() {
  if (!bgContext) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) {
      musicLabel.textContent = "ไม่รองรับเสียง";
      musicToggle.disabled = true;
      return;
    }
    bgContext = new AudioContextClass();
    bgMaster = bgContext.createGain();
    bgMaster.gain.value = 0.13;
    bgMaster.connect(bgContext.destination);
  }
  await bgContext.resume();
  bgPlaying = !bgPlaying;
  musicToggle.setAttribute("aria-pressed", String(bgPlaying));
  musicLabel.textContent = bgPlaying ? "ปิดเพลง" : "เปิดเพลง";
  if (bgPlaying) {
    bgMaster.gain.setTargetAtTime(0.13, bgContext.currentTime, 0.08);
    clearInterval(bgTimer);
    scheduleMusicBar();
    bgTimer = setInterval(scheduleMusicBar, 8000);
  } else {
    clearInterval(bgTimer);
    bgTimer = null;
    bgMaster.gain.setTargetAtTime(0.0001, bgContext.currentTime, 0.08);
    bgVoices.forEach(voice => {
      try { voice.stop(bgContext.currentTime + 0.1); } catch {}
    });
    bgVoices.clear();
  }
}

function duckBackgroundMusic(ducked) {
  if (!bgPlaying || !bgContext) return;
  bgMaster.gain.setTargetAtTime(ducked ? 0.015 : 0.13, bgContext.currentTime, 0.12);
}

function stopAudio() {
  if (audioTimer) clearTimeout(audioTimer);
  audioTimer = null;
  audioPreview.pause();
  audioPreview.currentTime = 0;
  duckBackgroundMusic(false);
}

function normalizeText(value) {
  return value.toLocaleLowerCase("th-TH").replace(/[^a-z0-9ก-๙]/g, "");
}

function searchItunes(term) {
  return new Promise((resolve, reject) => {
    const callbackName = `itunesCallback_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    const script = document.createElement("script");
    const cleanup = () => {
      clearTimeout(timeout);
      script.remove();
      delete window[callbackName];
    };
    const timeout = setTimeout(() => {
      cleanup();
      reject(new Error("catalog timeout"));
    }, 8000);

    window[callbackName] = data => {
      cleanup();
      resolve(data);
    };
    script.onerror = () => {
      cleanup();
      reject(new Error("catalog unavailable"));
    };
    script.src = `https://itunes.apple.com/search?term=${encodeURIComponent(term)}&entity=song&limit=8&country=TH&callback=${callbackName}`;
    document.head.append(script);
  });
}

async function playAudioHint() {
  if (revealed) return;
  if (!audioPreview.paused) {
    stopAudio();
    audioButton.innerHTML = "<span aria-hidden='true'>▶</span> เล่นคำใบ้เสียง 10 วิ";
    audioStatus.textContent = "หยุดเสียงแล้ว";
    return;
  }
  if (!audioUsed) {
    audioUsed = true;
    opened += 1;
  }

  stopAudio();
  audioButton.disabled = true;
  audioButton.textContent = "กำลังค้นหาเสียง…";
  audioStatus.textContent = "ค้นหาตัวอย่างเพลงจาก iTunes Catalog";

  try {
    const song = currentSong();
    let previewUrl = previewCache.get(song.title);
    if (!previewUrl) {
      const data = await searchItunes(`${song.title} ${song.artist}`);
      const target = normalizeText(song.title.split("(")[0]);
      const match = data.results.find(item => item.previewUrl && normalizeText(item.trackName).includes(target));
      if (!match) throw new Error("preview unavailable");
      previewUrl = match.previewUrl;
      previewCache.set(song.title, previewUrl);
    }

    audioPreview.src = previewUrl;
    duckBackgroundMusic(true);
    await audioPreview.play();
    audioButton.disabled = false;
    audioButton.textContent = "หยุดคำใบ้เสียง";
    audioStatus.textContent = "คำใบ้เสียงจะหยุดอัตโนมัติ (ตัวอย่างอาจไม่เริ่มจากวินาทีแรกของเพลง)";
    audioTimer = setTimeout(() => {
      stopAudio();
      audioButton.disabled = false;
      audioButton.innerHTML = "<span aria-hidden='true'>↻</span> ฟังอีกครั้ง";
      audioStatus.textContent = "เล่นคำใบ้เสียงครบ 10 วินาทีแล้ว";
    }, 10000);
  } catch {
    audioButton.disabled = true;
    audioButton.textContent = "ไม่มีตัวอย่างเสียงเพลงนี้";
    audioStatus.textContent = "ใช้คำใบ้ข้อความ 5 ป้ายแทนได้ตามปกติ";
  }
}

function renderRound() {
  const song = currentSong();
  opened = 0;
  revealed = false;
  audioUsed = false;
  stopAudio();
  document.querySelector("#round-label").textContent = `เพลงที่ ${round + 1}`;
  document.querySelector("#era-label").textContent = `ยุค ${Math.floor(song.year / 5) * 5} · ${song.kind}`;
  document.querySelector("#played").textContent = round;
  answerPanel.classList.remove("revealed");
  answerTitle.textContent = "ยังไม่เปิดเฉลย";
  answerDetail.textContent = "ลองเปิดคำใบ้ก่อน แล้วค่อยตัดสินใจ";
  revealButton.disabled = false;
  nextButton.disabled = true;
  audioButton.disabled = false;
  audioButton.innerHTML = "<span aria-hidden='true'>▶</span> คำใบ้เสียง 10 วิ";
  audioStatus.textContent = "";
  guessInput.value = "";
  guessFeedback.textContent = "";
  guessFeedback.className = "";
  nextButton.innerHTML = round === songs.length - 1 ? "ดูผลรวม <span aria-hidden='true'>→</span>" : "เพลงถัดไป <span aria-hidden='true'>→</span>";
  clueGrid.innerHTML = "";

  song.hints.forEach((hint, index) => {
    const card = document.createElement("button");
    card.className = "clue-card";
    card.type = "button";
    card.setAttribute("aria-label", `เปิดคำใบ้ที่ ${index + 1}`);
    card.innerHTML = `<span class="clue-inner"><span class="clue-face clue-front"><span class="clue-number">CLUE 0${index + 1}</span><strong>${clueLabels[index]}</strong><span class="tap-label">กดเพื่อเปิดป้าย</span></span><span class="clue-face clue-back"><span class="clue-type">${clueLabels[index]}</span><span class="clue-text">${hint}</span></span></span>`;
    card.addEventListener("click", () => {
      if (card.classList.contains("open") || revealed) return;
      card.classList.add("open");
      card.disabled = true;
      opened += 1;
    });
    clueGrid.append(card);
  });
  renderProgress();
}

function setGameMode(mode) {
  gameMode = mode;
  stopAudio();
  gameSection.classList.toggle("audio-mode", mode === "audio");
  clueModeButton.classList.toggle("active", mode === "clue");
  audioModeButton.classList.toggle("active", mode === "audio");
  clueModeButton.setAttribute("aria-pressed", String(mode === "clue"));
  audioModeButton.setAttribute("aria-pressed", String(mode === "audio"));
  document.querySelector(".subhead").textContent = mode === "clue"
    ? "เปิดคำใบ้ทีละป้าย ยิ่งเปิดน้อย ยิ่งได้คะแนนมาก"
    : "ฟังตัวอย่างเสียง 10 วินาที แล้วพิมพ์ชื่อเพลงที่ได้ยิน";
  audioButton.innerHTML = "<span aria-hidden='true'>▶</span> เล่นคำใบ้เสียง 10 วิ";
  if (mode === "audio") setTimeout(() => audioButton.focus(), 0);
}

function checkGuess() {
  if (revealed) return;
  const guess = normalizeText(guessInput.value);
  if (!guess) {
    guessFeedback.textContent = "พิมพ์ชื่อเพลงก่อนตรวจคำตอบ";
    guessFeedback.className = "wrong";
    return;
  }
  const song = currentSong();
  const fullTitle = normalizeText(song.title);
  const mainTitle = normalizeText(song.title.split("(")[0]);
  if (guess === fullTitle || guess === mainTitle) {
    guessFeedback.textContent = "ถูกต้อง! เปิดเฉลยและรับคะแนนแล้ว";
    guessFeedback.className = "correct";
    revealAnswer();
  } else {
    guessFeedback.textContent = "ยังไม่ถูก ลองฟังอีกครั้งหรือเปิดเฉลยได้";
    guessFeedback.className = "wrong";
  }
}

function revealAnswer() {
  if (revealed) return;
  revealed = true;
  stopAudio();
  const song = currentSong();
  const gained = Math.max(10, 50 - opened * 10);
  score += gained;
  document.querySelector("#score").textContent = score;
  answerPanel.classList.add("revealed");
  answerTitle.textContent = song.title;
  answerDetail.textContent = `${song.artist} · ${song.year} · +${gained} คะแนน`;
  revealButton.disabled = true;
  nextButton.disabled = false;
  [...clueGrid.children].forEach(card => { card.disabled = true; });
}

function renderProgress() {
  const container = document.querySelector("#song-progress");
  container.innerHTML = "";
  songs.forEach((_, index) => {
    const dot = document.createElement("span");
    dot.className = `progress-dot${index < round ? " done" : ""}${index === round ? " current" : ""}`;
    dot.textContent = index < round ? "✓" : index + 1;
    container.append(dot);
  });
}

function nextRound() {
  if (!revealed) return;
  if (round === songs.length - 1) {
    answerTitle.textContent = `จบเกม · ${score} คะแนน`;
    const averageHints = Math.max(0, (songs.length * 50 - score) / (songs.length * 10));
    answerDetail.textContent = `คุณใช้คำใบ้เฉลี่ยประมาณ ${averageHints.toFixed(1)} ครั้งต่อเพลง ลองเริ่มใหม่เพื่อทำคะแนนให้สูงกว่าเดิม`;
    nextButton.disabled = true;
    document.querySelector("#played").textContent = songs.length;
    [...document.querySelectorAll(".progress-dot")].forEach(dot => { dot.className = "progress-dot done"; dot.textContent = "✓"; });
    return;
  }
  round += 1;
  renderRound();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function resetGame() {
  order = shuffle(songs.map((_, index) => index));
  round = 0;
  score = 0;
  document.querySelector("#score").textContent = score;
  document.querySelector("#total-songs").textContent = songs.length;
  renderRound();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

revealButton.addEventListener("click", revealAnswer);
nextButton.addEventListener("click", nextRound);
audioButton.addEventListener("click", playAudioHint);
musicToggle.addEventListener("click", toggleBackgroundMusic);
clueModeButton.addEventListener("click", () => setGameMode("clue"));
audioModeButton.addEventListener("click", () => setGameMode("audio"));
document.querySelector("#check-button").addEventListener("click", checkGuess);
guessInput.addEventListener("keydown", event => {
  if (event.key === "Enter") checkGuess();
});
document.querySelector("#reset-button").addEventListener("click", resetGame);
resetGame();
setGameMode(window.location.hash === "#audio" ? "audio" : "clue");
