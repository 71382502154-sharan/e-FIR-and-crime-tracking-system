const fs = require('fs');
let file = fs.readFileSync('src/store/appStore.ts', 'utf8');

file = file.replace(
  "type: 'Robbery'\n  },",
  "type: 'Robbery',\n    evidence: [\n      { id: 'EVID-1', title: 'CCTV Footage - Main Gate', type: 'video', url: '#' },\n      { id: 'EVID-2', title: 'Broken Lock Photo', type: 'image', url: '#' }\n    ]\n  },"
);

file = file.replace(
  "type: 'Cyber Fraud'\n  },",
  "type: 'Cyber Fraud',\n    evidence: [\n      { id: 'EVID-3', title: 'Transaction Screenshot', type: 'image', url: '#' }\n    ]\n  },"
);

fs.writeFileSync('src/store/appStore.ts', file);
