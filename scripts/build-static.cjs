const fs = require('node:fs');
fs.mkdirSync('dist', { recursive: true });
for (const name of ['index.html', 'styles.css', 'multiple-choice.js']) {
  fs.copyFileSync(name, `dist/${name}`);
}
console.log('Built static site: index.html, styles.css, multiple-choice.js');
