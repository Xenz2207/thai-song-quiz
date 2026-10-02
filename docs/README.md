# เอกสารโครงการ GuessTheSongs

ปรับปรุงวันที่ 2 ตุลาคม 2569 เพื่อบันทึกฟีเจอร์หมวดเพลงและคลัง 1,000 เพลง

| เอกสาร | เนื้อหา |
| --- | --- |
| [Prompt Log — Markdown](Prompt-Log-GuessTheSongs.md) | ต้นฉบับรายงานส่วน A–D, Prompt จริง, ประวัติแก้ไข 9 รอบ, ผลทดสอบ และรายชื่อ 1,000 เพลงแยกหมวด |
| [Prompt Log — Word](Prompt-Log-GuessTheSongs.docx) | ฉบับนำเข้า Google Docs หรือแก้รูปแบบใน Word; สร้างจาก Markdown เดียวกัน |
| [Prompt Log — PDF](Prompt-Log-GuessTheSongs.pdf) | ฉบับอ่านและพิมพ์; สร้างจาก Markdown เดียวกัน |
| [บันทึกการแก้ไขล่าสุด](CHANGELOG.md) | สรุปฟีเจอร์ ไฟล์ที่แก้ Prompt วันที่ 2 ตุลาคม และผลตรวจ |
| [หลักฐานตรวจคลัง](catalog-validation.json) | 1,000 เพลง, หมวดละ 200, SHA-256 ของชุดข้อมูล และผลเล่นเสียงรายเพลง |
| [ภาพหน้าจอ](images/) | ภาพจอคอมพิวเตอร์ ผลเฉลย/ประวัติ จอมือถือ หมวด 80s และหมวด 2020–2026 |

รายงานหลักเป็นแหล่งอ้างอิงประวัติและข้อความ Prompt ทั้งหมด ส่วน `catalog-audit.json` ที่รากโครงการเก็บหลักฐานเดิมของคลัง 200 เพลง ไม่ใช่รายงานตรวจ 1,000 เพลงล่าสุด

## สร้างเอกสารใหม่

ติดตั้ง Node.js 20+ และ Microsoft Edge จากนั้นรันจากรากโครงการ:

```sh
npm ci
node scripts/capture-report-images.cjs
node scripts/render-report.cjs
```

บน PowerShell ที่ไม่อนุญาต `npm.ps1` ให้ใช้ `npm.cmd ci` แทนคำสั่งแรก แก้เนื้อหาที่ `Prompt-Log-GuessTheSongs.md` แล้วสร้าง Word/PDF ใหม่ เพื่อให้ทั้งสามรูปแบบตรงกัน เครื่องมือสร้างรายงานเป็น dependency สำหรับผู้พัฒนา ผู้เล่นยังเปิด `index.html` ได้โดยไม่ต้องติดตั้ง

รุ่น v1.1.0 เปิดเล่นได้ที่ [Vercel](https://thai-song-quiz-two.vercel.app/) และโค้ดอยู่ใน [GitHub](https://github.com/Xenz2207/thai-song-quiz) หลักฐานตรวจเว็บจริงอยู่ใน [production-validation.json](production-validation.json) ส่วน Google Docs และ Classroom ยังต้องดำเนินการโดยเจ้าของงาน

หลักฐานก่อนแยกยุค 800 เพลงเก็บไว้ใน [catalog-validation-800.json](catalog-validation-800.json) เพื่อรักษาประวัติการตรวจเดิม
