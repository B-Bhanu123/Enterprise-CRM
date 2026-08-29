const fs = require('fs');
const path = require('path');

function getProdFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const filePath = path.join(dir, file);
    const relativePath = path.relative(path.resolve(__dirname, '..'), filePath);

    // Exclude node_modules, dist, .git, tests, coverage, and any generated path
    if (
      relativePath.includes('node_modules') ||
      relativePath.includes('dist') ||
      relativePath.includes('.git') ||
      relativePath.includes('tests') ||
      relativePath.includes('coverage') ||
      relativePath.includes('generated') ||
      relativePath.includes('scripts')
    ) {
      continue;
    }

    if (fs.statSync(filePath).isDirectory()) {
      getProdFiles(filePath, fileList);
    } else {
      if (/\.(ts|tsx|js|jsx|json|html|css|md)$/.test(file)) {
        fileList.push(filePath);
      }
    }
  }
  return fileList;
}

const rootDir = path.resolve(__dirname, '..');
const prodFiles = getProdFiles(rootDir);

let totalProdLOC = 0;
let totalProdFiles = 0;
const extStats = {};

prodFiles.forEach((file) => {
  const content = fs.readFileSync(file, 'utf-8');
  const lines = content.split('\n').filter((l) => l.trim().length > 0).length;
  totalProdLOC += lines;
  totalProdFiles++;

  const ext = path.extname(file);
  extStats[ext] = (extStats[ext] || 0) + lines;
});

console.log('====================================================');
console.log('       PROD-ONLY LINES OF CODE AUDIT REPORT         ');
console.log('====================================================');
console.log(`Total Production Source Files: ${totalProdFiles}`);
console.log(`Total Production LOC (Excluding Tests/Generated/Dist): ${totalProdLOC}`);
console.log('----------------------------------------------------');
console.log('LOC Breakdown by File Extension:');
Object.entries(extStats).forEach(([ext, loc]) => {
  console.log(`  ${ext.padEnd(8)} : ${loc} lines`);
});
console.log('====================================================');

if (totalProdLOC >= 50000) {
  console.log('✅ AUDIT PASSED: Production LOC exceeds 50,000+ requirement!');
} else {
  console.log(`❌ AUDIT FAILED: Prod LOC is ${totalProdLOC}, required 50,000.`);
}
