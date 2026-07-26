const fs = require('fs');
let file = fs.readFileSync('src/pages/FileFIR.tsx', 'utf8');

file = file.replace(
  "import { t } from '../lib/i18n';",
  "import { t } from '../lib/i18n';\nimport LanguageSelector from '../components/LanguageSelector';"
);

file = file.replace(
  /<div className="flex bg-black\/30 rounded-lg p-1 border border-white\/10">[\s\S]*?<\/div>/,
  "<LanguageSelector variant=\"light\" />"
);

fs.writeFileSync('src/pages/FileFIR.tsx', file);
