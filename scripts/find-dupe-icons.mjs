import { readFileSync, readdirSync, statSync } from 'fs';
import { join, relative } from 'path';

function walkDir(dir) {
  const files = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!['node_modules', '.next', '.git', 'dist'].includes(entry.name)) {
        files.push(...walkDir(fullPath));
      }
    } else if (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts')) {
      files.push(fullPath);
    }
  }
  return files;
}

const srcDir = join(process.cwd(), 'src');
const issues = [];

for (const file of walkDir(srcDir)) {
  const content = readFileSync(file, 'utf-8');

  // Collect all named imports from @phosphor-icons/react
  const allImports = [];
  const namedImportRegex = /import\s*\{([^}]+)\}\s*from\s*['"]@phosphor-icons\/react['"]/gs;
  let match;
  while ((match = namedImportRegex.exec(content)) !== null) {
    const names = match[1]
      .split(',')
      .map(s => s.trim().split(/\s+as\s+/)[0].trim())
      .filter(Boolean);
    allImports.push(...names);
  }

  const dupes = allImports.filter((name, i) => allImports.indexOf(name) !== i);
  if (dupes.length > 0) {
    issues.push({ file: relative(srcDir, file), dupes: [...new Set(dupes)] });
  }
}

if (issues.length === 0) {
  console.log('No duplicate icon imports found.');
} else {
  console.log('Files with duplicate icon imports:');
  issues.forEach(({ file, dupes }) => console.log(`  ${file}: ${dupes.join(', ')}`));
  console.log(`\nTotal: ${issues.length} file(s) affected`);
}
