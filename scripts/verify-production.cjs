const { spawnSync } = require('node:child_process');
const path = require('node:path');
const result = spawnSync(process.execPath, [path.join(__dirname, '../tests/multiple-choice.cjs')], {
  cwd: path.join(__dirname, '..'),
  env: { ...process.env, BASE_URL: process.env.BASE_URL || 'https://thai-song-quiz-two.vercel.app/', VERIFY_AUDIO: '1' },
  stdio: 'inherit'
});
if (result.error) throw result.error;
process.exitCode = result.status ?? 1;