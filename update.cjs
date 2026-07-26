const fs = require('fs');
let file = fs.readFileSync('src/types.ts', 'utf8');

const newTypes = `export interface Note {
  id: string;
  authorId: string;
  authorName: string;
  content: string;
  createdAt: string;
}

export interface FIR {
  id: string;
  userId?: string;
  firNumber: string;
  title: string;
  description: string;
  dateFiled: string;
  station: string;
  status: FIRStatus;
  severity: FRSeverity;
  type: string;
  notes?: Note[];
}`;

file = file.replace(/export interface FIR \{[\s\S]*?\}/, newTypes);
fs.writeFileSync('src/types.ts', file);
