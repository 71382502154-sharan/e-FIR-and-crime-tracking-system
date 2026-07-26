const fs = require('fs');
let css = fs.readFileSync('src/index.css', 'utf8');

// Remove the global * hiding rule
const toRemove = `@layer base {  * {    -ms-overflow-style: none; /* IE and Edge */    scrollbar-width: none; /* Firefox */  }  *::-webkit-scrollbar {    display: none; /* Chrome, Safari and Opera */  }}`;
css = css.replace(toRemove, '');
css = css.replace(/@layer base \{.*?\}\}/s, ''); // just in case

// Let's add a modern thin scrollbar to everything instead
const thinScrollbar = `
@layer base {
  * {
    scrollbar-width: thin;
    scrollbar-color: rgba(156, 163, 175, 0.5) transparent;
  }
  *::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }
  *::-webkit-scrollbar-track {
    background: transparent;
  }
  *::-webkit-scrollbar-thumb {
    background-color: rgba(156, 163, 175, 0.5);
    border-radius: 20px;
  }
  *::-webkit-scrollbar-thumb:hover {
    background-color: rgba(156, 163, 175, 0.8);
  }
}
`;

css += thinScrollbar;
fs.writeFileSync('src/index.css', css);
