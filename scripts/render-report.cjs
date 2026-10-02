// Markdown is the source of truth; regenerate both DOCX and PDF from it.
const fs = require('node:fs');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const MarkdownIt = require('markdown-it');
const { chromium } = require('playwright');
const D = require('docx');
const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, HeadingLevel, Footer, PageNumber, AlignmentType, ImageRun, ExternalHyperlink, PageOrientation, SectionType } = D;
const source = 'docs/Prompt-Log-GuessTheSongs.md';
const markdown = fs.readFileSync(source, 'utf8');
const parser = new MarkdownIt({ html: true, linkify: false });
const tokens = parser.parse(markdown, {});
const sections = [];
let current;
let paragraphCount = 0;
function startSection(title) {
  const landscape = title.startsWith('ส่วน C — บันทึกการปรับแก้') || title.startsWith('ภาคผนวก 4');
  current = { title, landscape, children: [] }; sections.push(current);
}
function runs(children, style = {}) {
  const output = [];
  let bold = false, italics = false, target = null, linked = [];
  for (const token of children || []) {
    if (token.type === 'strong_open') { bold = true; continue; }
    if (token.type === 'strong_close') { bold = false; continue; }
    if (token.type === 'em_open') { italics = true; continue; }
    if (token.type === 'em_close') { italics = false; continue; }
    if (token.type === 'link_open') { target = token.attrGet('href'); linked = []; continue; }
    if (token.type === 'link_close') {
      output.push(new ExternalHyperlink({ link: target, children: linked })); target = null; continue;
    }
    let run;
    if (token.type === 'image') {
      const file = path.resolve('docs', token.attrGet('src'));
      if (!file.startsWith(path.resolve('docs') + path.sep)) throw Error('Image outside docs');
      const data = fs.readFileSync(file);
      const width = data.readUInt32BE(16), height = data.readUInt32BE(20);
      const scale = Math.min(580 / width, 690 / height, 1);
      run = new ImageRun({ type: 'png', data, transformation: { width: Math.round(width * scale), height: Math.round(height * scale) }, altText: { title: token.content, description: token.content, name: path.basename(file) } });
    } else if (token.type === 'softbreak' || token.type === 'hardbreak' || token.type === 'html_inline' && /<br\s*\/?\s*>/i.test(token.content)) {
      run = new TextRun({ break: 1 });
    } else if (token.type === 'text' || token.type === 'code_inline') {
      run = new TextRun({ text: token.content, font: token.type === 'code_inline' ? 'Consolas' : 'Tahoma', size: 22, bold, italics, ...style, ...(target ? { color: '503AB2', underline: {} } : {}) });
    } else { throw Error('Unsupported inline token: ' + token.type); }
    (target ? linked : output).push(run);
  }
  return output;
}
function paragraph(children, options = {}) {
  paragraphCount++;
  return new Paragraph({ children, spacing: { after: 140, line: 290 }, ...options });
}
let listDepth = 0;
for (let i = 0; i < tokens.length; i++) {
  const t = tokens[i];
  if (t.type === 'heading_open') {
    const inline = tokens[++i];
    const level = +t.tag.slice(1);
    if (level === 1) startSection(inline.content);
    current.children.push(paragraph(runs(inline.children, { bold: true, color: '503AB2', size: level === 1 ? 38 : level === 2 ? 27 : 23 }), { heading: level === 1 ? HeadingLevel.HEADING_1 : level === 2 ? HeadingLevel.HEADING_2 : HeadingLevel.HEADING_3, keepNext: true }));
    i++; continue;
  }
  if (t.type === 'bullet_list_open' || t.type === 'ordered_list_open') { listDepth++; continue; }
  if (t.type === 'bullet_list_close' || t.type === 'ordered_list_close') { listDepth--; continue; }
  if (t.type === 'list_item_open' || t.type === 'list_item_close') continue;
  if (t.type === 'paragraph_open') {
    const inline = tokens[++i];
    const image = inline.children?.find(t => t.type === 'image');
    current.children.push(paragraph(runs(inline.children), { ...(listDepth ? { bullet: { level: listDepth - 1 } } : {}), ...(image ? { alignment: AlignmentType.CENTER, keepNext: true } : {}) }));
    if (image) current.children.push(paragraph([new TextRun({ text: image.content, font: 'Tahoma', size: 19, color: '666666' })], { alignment: AlignmentType.CENTER }));
    i++; continue;
  }
  if (t.type === 'fence' || t.type === 'code_block') {
    for (const line of t.content.trimEnd().split('\n')) current.children.push(paragraph([new TextRun({ text: line || ' ', font: t.info === 'javascript' ? 'Consolas' : 'Tahoma', size: 20 })], { shading: { fill: 'F5F2FA' }, spacing: { after: 45, line: 260 } }));
    continue;
  }
  if (t.type === 'table_open') {
    const rows = []; let cells = []; let header = false;
    for (++i; i < tokens.length && tokens[i].type !== 'table_close'; i++) {
      const item = tokens[i];
      if (item.type === 'tr_open') cells = [];
      if (item.type === 'th_open' || item.type === 'td_open') header = item.type === 'th_open';
      if (item.type === 'inline') cells.push({ children: item.children, header });
      if (item.type === 'tr_close') rows.push(cells);
    }
    const columns = rows[0].length;
    current.children.push(new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, rows: rows.map((row,index) => new TableRow({ tableHeader: index === 0, children: row.map(cell => new TableCell({ width: { size: 100 / columns, type: WidthType.PERCENTAGE }, shading: cell.header ? { fill: 'EDE7FC' } : undefined, margins: { top: 75, bottom: 75, left: 90, right: 90 }, children: [paragraph(runs(cell.children, { size: 19, bold: cell.header }), { spacing: { after: 50, line: 255 } })] })) })) }));
    current.children.push(paragraph([])); continue;
  }
  if (t.type === 'hr') continue;
  throw Error('Unsupported block token: ' + t.type);
}
const footer = new Footer({ children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: 'หน้า ', font: 'Tahoma', size: 18 }), new TextRun({ children: [PageNumber.CURRENT], font: 'Tahoma', size: 18 })] })] });
const doc = new Document({ creator: 'Codex', title: 'Prompt Log — คำใบ้ทายเพลงฮิต', description: 'ฉบับปรับปรุง 2 ตุลาคม 2569: 10 รอบแก้ไขและ 1,000 เพลง', styles: { default: { document: { run: { font: 'Tahoma', size: 22 } } } }, sections: sections.map(s => ({ properties: { type: SectionType.NEXT_PAGE, page: { size: { width: 11906, height: 16838, orientation: s.landscape ? PageOrientation.LANDSCAPE : PageOrientation.PORTRAIT }, margin: { top: 950, bottom: 950, left: s.landscape ? 820 : 1050, right: s.landscape ? 820 : 1050 } } }, footers: { default: footer }, children: s.children })) });
function escapeHtml(s) { return s.replace(/[&<>"']/g,c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
const defaultImage = parser.renderer.rules.image;
parser.renderer.rules.image = (imageTokens, index, options, env, renderer) => {
  const token = imageTokens[index];
  token.attrSet('src', pathToFileURL(path.resolve('docs', token.attrGet('src'))).href);
  return defaultImage(imageTokens, index, options, env, renderer);
};
let body = '';
for (const section of markdown.split(/(?=^# )/m).filter(s => s.trim())) {
  const title = section.match(/^# (.*)/)?.[1] || '';
  const landscape = title.startsWith('ส่วน C — บันทึกการปรับแก้') || title.startsWith('ภาคผนวก 4');
  const content = parser.render(section).replace(/<p>(<img[^>]*alt="([^"]*)"[^>]*>)<\/p>/g, '<figure>$1<figcaption>$2</figcaption></figure>');
  body += `<section class="${landscape ? 'landscape' : 'portrait'}">${content}</section>`;
}
const reportHtml = `<!doctype html><html lang="th"><head><meta charset="utf-8"><title>${escapeHtml('Prompt Log — คำใบ้ทายเพลงฮิต')}</title><style>
@page portrait{size:A4 portrait;margin:17mm 17mm 20mm}@page landscape{size:A4 landscape;margin:14mm 14mm 18mm}
body{font:11pt/1.6 Tahoma,sans-serif;color:#252038;margin:0}.portrait{page:portrait;break-before:page}.landscape{page:landscape;break-before:page}section:first-child{break-before:auto}h1{font-size:20pt;color:#503ab2;line-height:1.35;margin:0 0 16px}h2{font-size:13pt;color:#503ab2;margin:18px 0 8px;break-after:avoid}h3{font-size:12pt;color:#503ab2;break-after:avoid}p{margin:0 0 10px;orphans:3;widows:3}table{border-collapse:collapse;width:100%;table-layout:fixed;margin:12px 0 18px;font-size:9.5pt;line-height:1.5}td,th{border:1px solid #d4cde6;padding:6px;vertical-align:top;overflow-wrap:anywhere}th{background:#ede7fc;text-align:left}thead{display:table-header-group}tr{break-inside:auto}a{color:#503ab2}pre{font:10pt/1.6 Tahoma,sans-serif;white-space:pre-wrap;overflow-wrap:anywhere;background:#f5f2fa;border-left:3px solid #8064cd;padding:12px}pre code{font:inherit}code{font:9pt Consolas,Tahoma,monospace}img{max-width:100%;max-height:220mm;width:auto;height:auto;object-fit:contain}figure{text-align:center;break-inside:avoid;margin:14px 0}figcaption{font-size:10pt;color:#555;margin-top:7px}hr{border:0;margin:0}
</style></head><body>${body}</body></html>`;
(async () => {
  const target = '.report-work/report.html';
  fs.mkdirSync('.report-work', { recursive: true });
  fs.writeFileSync(target, reportHtml);
  fs.writeFileSync('docs/Prompt-Log-GuessTheSongs.docx', await Packer.toBuffer(doc));
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  try {
    const page = await browser.newPage();
    await page.goto(pathToFileURL(path.resolve(target)).href, { waitUntil: 'load' });
    await page.evaluate(() => document.fonts.ready);
    const images = await page.locator('img').evaluateAll(images => images.map(img => ({ src: img.src, loaded: img.complete && img.naturalWidth > 0 })));
    const expectedImages = tokens.filter(t=>t.type==='inline').flatMap(t=>t.children||[]).filter(t=>t.type==='image').length;
    if (images.length !== expectedImages || images.some(img => !img.loaded)) throw Error('Report images failed to load: ' + JSON.stringify(images));
    await page.pdf({ path: 'docs/Prompt-Log-GuessTheSongs.pdf', preferCSSPageSize: true, printBackground: true });
  } finally { await browser.close(); }
  console.log(`Rendered DOCX and PDF from Markdown: ${sections.length} sections, ${paragraphCount} paragraphs.`);
})().catch(e => { console.error(e); process.exitCode = 1; });
