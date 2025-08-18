import fs from 'fs';
import path from 'path';

const pidFile = path.join(__dirname, '../.preview.pid');

if (fs.existsSync(pidFile)) {
  const pid = Number(fs.readFileSync(pidFile, 'utf8'));
  try {
    process.kill(pid);
  } catch (err) {
    // ignore
  }
  fs.unlinkSync(pidFile);
}

