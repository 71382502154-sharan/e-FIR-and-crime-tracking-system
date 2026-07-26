const fs = require('fs');
let css = fs.readFileSync('src/index.css', 'utf8');

css = css.replace(/@layer base \{\s*\*\s*\{\s*-ms-overflow-style:\s*none;\s*\/\*\s*IE and Edge\s*\*\/\s*scrollbar-width:\s*none;\s*\/\*\s*Firefox\s*\*\/\s*\}\s*\*\::-webkit-scrollbar\s*\{\s*display:\s*none;\s*\/\*\s*Chrome, Safari and Opera\s*\*\/\s*\}\s*\}/g, '');

fs.writeFileSync('src/index.css', css);
