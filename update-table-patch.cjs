const fs = require('fs');
let file = fs.readFileSync('src/pages/PoliceDashboard.tsx', 'utf8');

// Add registeredUsers to destructuring
file = file.replace(
  "const { user, firs, logout, updateFIRStatus, language, setLanguage } = useAppStore();",
  "const { user, firs, logout, updateFIRStatus, language, setLanguage, registeredUsers } = useAppStore();"
);

// Add table header
file = file.replace(
  "<th className=\"p-4\">FIR No.</th>",
  "<th className=\"p-4\">FIR No.</th>\n                  <th className=\"p-4\">Complainant</th>"
);

// Add table cell
file = file.replace(
  "<td className=\"p-4 font-bold text-primary\">{fir.firNumber}</td>",
  "<td className=\"p-4 font-bold text-primary\">{fir.firNumber}</td>\n                    <td className=\"p-4 font-semibold text-slate-700\">{registeredUsers.find(u => u.id === fir.userId)?.name || 'Unknown'}</td>"
);

fs.writeFileSync('src/pages/PoliceDashboard.tsx', file);
