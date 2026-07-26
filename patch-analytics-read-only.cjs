const fs = require('fs');

let content = fs.readFileSync('src/components/FIRDetailsModal.tsx', 'utf8');

const targetStr = `<button 
                      onClick={() => {
                        setGraphAnalysisResult('');
                        setSuggestedNodes([]);
                        setSuggestedLinks([]);
                      }}
                      className="absolute top-4 right-4 p-1 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-md transition-colors z-10"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <h4 className="text-sm font-bold text-indigo-400 mb-4 flex items-center gap-2 uppercase tracking-wider shrink-0">
                      <ShieldAlert className="w-4 h-4" /> AI Different POV Report
                    </h4>`;

const newStr = `<div className="flex justify-between items-center mb-4 shrink-0">
                      <h4 className="text-sm font-bold text-indigo-400 flex items-center gap-2 uppercase tracking-wider">
                        <ShieldAlert className="w-4 h-4" /> AI Different POV Report
                      </h4>
                      <button 
                        onClick={() => {
                          setGraphAnalysisResult('');
                          setSuggestedNodes([]);
                          setSuggestedLinks([]);
                        }}
                        className="p-1 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-md transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>`;

if (content.includes(targetStr)) {
    content = content.replace(targetStr, newStr);
    fs.writeFileSync('src/components/FIRDetailsModal.tsx', content);
    console.log("Success");
} else {
    console.log("Target string not found");
}
