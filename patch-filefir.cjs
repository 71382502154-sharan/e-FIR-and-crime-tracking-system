const fs = require('fs');
let file = fs.readFileSync('src/components/AnalyticsDashboard.tsx', 'utf8');

const findCode = `<button onClick={() => { setIsAddingGeo(!isAddingGeo); setCurrentPolygon([]); }} className={\`px-3 py-1.5 rounded-md text-xs font-bold flex items-center gap-1 transition-colors shadow-sm \${isAddingGeo ? "bg-slate-800 text-white" : "bg-indigo-600 text-white hover:bg-indigo-700"}\`}><Edit className="w-3.5 h-3.5" /> {isAddingGeo ? "Exit Editor Mode" : "Editor Mode"}</button>`;
const replaceCode = `{!readOnly && (
                          <button onClick={() => { setIsAddingGeo(!isAddingGeo); setCurrentPolygon([]); }} className={\`px-3 py-1.5 rounded-md text-xs font-bold flex items-center gap-1 transition-colors shadow-sm \${isAddingGeo ? "bg-slate-800 text-white" : "bg-indigo-600 text-white hover:bg-indigo-700"}\`}><Edit className="w-3.5 h-3.5" /> {isAddingGeo ? "Exit Editor Mode" : "Editor Mode"}</button>
                        )}`;

file = file.replace(findCode, replaceCode);
fs.writeFileSync('src/components/AnalyticsDashboard.tsx', file);
