import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const [, , inputPath, mode = 'base64'] = process.argv;

if (!inputPath) {
  console.error('Usage: node scripts/fileToString.mjs <file-path> [base64|utf8]');
  process.exit(1);
}

const resolvedPath = resolve(process.cwd(), inputPath);

try {
  const buffer = readFileSync(resolvedPath);

  if (mode === 'utf8') {
    console.log(buffer.toString('utf8'));
  } else if (mode === 'base64') {
    console.log(buffer.toString('base64'));
  } else {
    console.error("Invalid mode. Use 'base64' or 'utf8'.");
    process.exit(1);
  }
} catch (error) {
  console.error(`Failed to read file: ${resolvedPath}`);
  console.error(error.message);
  process.exit(1);
}
