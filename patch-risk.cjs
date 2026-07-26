const fs = require('fs');
let file = fs.readFileSync('src/components/FIRDetailsModal.tsx', 'utf8');

file = file.replace(
  '<RichTextEditor content={noteContent} onChange={setNoteContent} placeholder="Add an internal note..." />',
  '<RichTextEditor content={noteContent} onChange={setNoteContent} placeholder="Add an internal note..." evidence={fir.evidence} />'
);

fs.writeFileSync('src/components/FIRDetailsModal.tsx', file);
