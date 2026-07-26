const fs = require('fs');
let file = fs.readFileSync('src/index.css', 'utf8');

if (!file.includes('@plugin "@tailwindcss/typography"')) {
  file = file.replace('@import "tailwindcss";', '@import "tailwindcss";\n@plugin "@tailwindcss/typography";');
  fs.writeFileSync('src/index.css', file);
}
