# Guess The Songs — 4 ช้อยส์

เว็บเกมทายเพลงไทย 1,152 เพลง ตอบชื่อเพลงและศิลปินอย่างละ 4 ตัวเลือก (ก ข ค ง) ตอบได้ข้อละครั้ง ถูกข้อละ 100 คะแนน รวมรอบละ 200 คะแนน ฟังเสียงตัวอย่างและเปิดคำใบ้ได้ฟรี ตอบครบสองข้อเพื่อดูผล หรือข้ามเพื่อเฉลย เก็บประวัติรอบที่เล่นและสุ่มโดยไม่ซ้ำจนกว่าจะครบหมวด

## เล่นและดาวน์โหลด

- เว็บ: https://thai-song-quiz-two.vercel.app/
- [APK Android ต้นฉบับ v1.0.0](https://github.com/Xenz2207/thai-song-quiz/releases/tag/android-v1.0.0)

APK เดิมเป็นแอป Kotlin + Jetpack Compose ซึ่ง Vercel รันโดยตรงไม่ได้ เวอร์ชันเว็บ `1.0.0-web.1` นี้นำรูปแบบการตอบ 4 ช้อยส์กลับมาใช้ในเบราว์เซอร์ ใช้คลังเพลงและธีมของเว็บเดิม พร้อมตัวเลือกชื่อเพลง/ศิลปินและสรุปคะแนน เว็บนี้ไม่ใช่ซอร์ส Android v1.0.0 ที่กู้คืนแบบตรงตัว ไฟล์ APK ใน Release เป็นไฟล์ต้นฉบับที่เก็บไว้โดยไม่แก้ไข

## ยืนยันไฟล์ APK ต้นฉบับ

- ชื่อ: `GuessTheSongs-v1.0.0.apk`
- Android package: `com.guessthesongs.app`
- Manifest: `versionName='1.0.0'`, `versionCode='1'`
- SHA256: `FEBC6DE01D0311A6E938A0C5FFE17C008E7DC250A09F3623146E65964D0BC7CD`
- ตรวจพบเพลง 1,152 เพลงใน `assets/songs.json` ภายใน APK

## พัฒนาและตรวจสอบ

เว็บ static ไม่ต้องมี framework เปิด `index.html` ได้โดยตรง สคริปต์ `npm run build` คัดลอกเฉพาะ `index.html`, `styles.css`, `multiple-choice.js` ไป `dist` สำหรับเผยแพร่

```powershell
npm.cmd ci
npm.cmd test
$env:VERIFY_AUDIO = '1'
npm.cmd test
```

ต้องมี Microsoft Edge สำหรับทดสอบด้วย Playwright ตรวจตัวเลือกของเพลงทั้ง 1,152 เพลง คะแนน 0/100/200 การตอบซ้ำ หมวดหมู่ การยกเลิกเสียง และขนาดหน้าจอ 320–1280 px เมื่อเปิด `VERIFY_AUDIO=1` จะทดสอบเล่นเสียงจริงจาก iTunes ด้วย

```powershell
$env:BASE_URL = 'https://thai-song-quiz-two.vercel.app/'
$env:VERIFY_AUDIO = '1'
npm.cmd test
```

บันทึกผลที่ `.catalog-work/multiple-choice-validation.json` การตรวจเสียงเป็นการสุ่มทดสอบเพลงจริงหนึ่งเพลง หากแหล่งเสียงไม่พร้อม เกมจะเปลี่ยนเพลงให้โดยไม่บันทึกรอบที่เสีย

## Deploy และย้อนกลับ

ใช้ Vercel โปรเจกต์ `thai-song-quiz` เก็บ deployment ID เดิมก่อนเปลี่ยน production และทดสอบ deployment ใหม่ก่อน promote ใช้ `vercel rollback <previous-deployment-id>` หากต้องย้อนกลับ Git branch แยกจาก `main` จนกว่าการทดสอบจะผ่าน และใช้ `git revert <release-commit>` เพื่อย้อนเฉพาะการเปลี่ยนแปลงนี้

เสียงเป็นตัวอย่างสตรีมจาก iTunes ไม่ได้บรรจุหรือแคชไฟล์เพลง ลิงก์ Apple Music จะแสดงหลังเฉลยเพื่อไม่ให้ชื่อเพลงรั่วก่อนตอบ