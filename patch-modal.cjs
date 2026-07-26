const fs = require('fs');
let file = fs.readFileSync('src/components/LegalLibraryModal.tsx', 'utf8');

const importStatement = "import { t } from '../lib/i18n';\nimport { LEGAL_DATA } from '../data/legalData';";
file = file.replace("import { t } from '../lib/i18n';", importStatement);

const match = /const LEGAL_DATA = \[\s*\{[\s\S]*?category: 'Traffic'\s*\}\s*\];/m;
file = file.replace(match, '');

fs.writeFileSync('src/components/LegalLibraryModal.tsx', file);
