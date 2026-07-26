const fs = require('fs');
let file = fs.readFileSync('src/pages/PoliceDashboard.tsx', 'utf8');

file = file.replace(
  "import { t } from '../lib/i18n';",
  "import { t } from '../lib/i18n';\nimport LanguageSelector from '../components/LanguageSelector';"
);

file = file.replace(
  /<button\s*onClick=\{\(\) => setLanguage\(language === 'en' \? 'kn' : 'en'\)\}\s*className="flex items-center gap-2 px-4 py-2 border border-white\/50 bg-white\/40 backdrop-blur-sm rounded-lg text-sm font-semibold text-on-surface hover:bg-white\/60 transition-colors shadow-sm"\s*>\s*<Globe className="w-4 h-4" \/> \{language === 'en' \? 'ಕನ್ನಡ' : 'English'\}\s*<\/button>/,
  "<LanguageSelector variant=\"outline\" />"
);

fs.writeFileSync('src/pages/PoliceDashboard.tsx', file);
