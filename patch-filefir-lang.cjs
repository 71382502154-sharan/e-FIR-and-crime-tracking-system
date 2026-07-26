const fs = require('fs');
let file = fs.readFileSync('src/App.tsx', 'utf8');

file = file.replace(
  "import PoliceDashboard from './pages/PoliceDashboard';",
  "import PoliceDashboard from './pages/PoliceDashboard';\nimport AdminDashboard from './pages/AdminDashboard';"
);

file = file.replace(
  '<Route path="/police" element={<PoliceDashboard />} />',
  '<Route path="/police" element={<PoliceDashboard />} />\n        <Route path="/admin" element={<AdminDashboard />} />'
);

fs.writeFileSync('src/App.tsx', file);
