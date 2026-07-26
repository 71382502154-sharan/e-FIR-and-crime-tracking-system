const fs = require('fs');
let file = fs.readFileSync('src/components/AnalyticsDashboard.tsx', 'utf8');

file = file.replace(
  "export default function AnalyticsDashboard() {",
  "export default function AnalyticsDashboard({ readOnly = false }: { readOnly?: boolean }) {"
);

const editorModeFind = `{!isAddingGeo ? (
                      <button 
                        onClick={() => setIsAddingGeo(true)}
                        className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-sm font-bold shadow-sm hover:bg-indigo-700 transition-colors"
                      >
                        <Edit className="w-4 h-4" /> Editor Mode
                      </button>
                    ) : (`;

const editorModeReplace = `{!readOnly && (!isAddingGeo ? (
                      <button 
                        onClick={() => setIsAddingGeo(true)}
                        className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-sm font-bold shadow-sm hover:bg-indigo-700 transition-colors"
                      >
                        <Edit className="w-4 h-4" /> Editor Mode
                      </button>
                    ) : (`

file = file.replace(editorModeFind, editorModeReplace);

const editorModeCloseFind = `                      </button>
                    )}`;

const editorModeCloseReplace = `                      </button>
                    ))}`;

file = file.replace(editorModeCloseFind, editorModeCloseReplace);

fs.writeFileSync('src/components/AnalyticsDashboard.tsx', file);
