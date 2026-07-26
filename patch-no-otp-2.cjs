const fs = require('fs');
let file = fs.readFileSync('src/pages/Login.tsx', 'utf8');

file = file.replace(
  /<div className="absolute top-0 right-0 p-4 md:p-8 z-50 flex items-center gap-4">\s*<LanguageSelector variant="light" \/>\s*<\/div>\s*<\/div>/,
  '<div className="absolute top-0 right-0 p-4 md:p-8 z-50 flex items-center gap-4">\n        <LanguageSelector variant="light" />\n      </div>'
);

fs.writeFileSync('src/pages/Login.tsx', file);
