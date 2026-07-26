const fs = require('fs');
let file = fs.readFileSync('src/components/RichTextEditor.tsx', 'utf8');

if (!file.includes("@tiptap/extension-link")) {
  file = file.replace(
    "import Placeholder from '@tiptap/extension-placeholder';",
    "import Placeholder from '@tiptap/extension-placeholder';\nimport Link from '@tiptap/extension-link';"
  );

  file = file.replace(
    "StarterKit,",
    "StarterKit,\n      Link.configure({\n        openOnClick: false,\n        HTMLAttributes: {\n          class: 'text-indigo-600 underline font-medium cursor-pointer hover:text-indigo-800',\n        },\n      }),"
  );

  fs.writeFileSync('src/components/RichTextEditor.tsx', file);
}
