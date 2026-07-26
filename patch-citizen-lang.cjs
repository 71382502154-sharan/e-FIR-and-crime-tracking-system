const fs = require('fs');

let content = fs.readFileSync('src/components/LegalLibraryModal.tsx', 'utf8');

const targetDivStart = `<div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-hide">`;
const newTargetDivStart = `<div ref={tabsRef} className="flex gap-2 overflow-x-auto pb-1 sm:pb-0" style={{ scrollBehavior: 'smooth' }}>`;

content = content.replace(targetDivStart, newTargetDivStart);
fs.writeFileSync('src/components/LegalLibraryModal.tsx', content);
