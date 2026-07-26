const fs = require('fs');
let file = fs.readFileSync('src/pages/CitizenDashboard.tsx', 'utf8');

file = file.replace(
  "import { t } from '../lib/i18n';",
  "import { t } from '../lib/i18n';\nimport LanguageSelector from '../components/LanguageSelector';"
);

file = file.replace(
  /<div className="flex bg-white\/40 rounded-full p-1 border border-white\/50 shadow-inner">[\s\S]*?<\/div>/,
  "<LanguageSelector variant=\"outline\" />"
);

fs.writeFileSync('src/pages/CitizenDashboard.tsx', file);
