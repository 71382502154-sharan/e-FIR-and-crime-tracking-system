const fs = require('fs');
let file = fs.readFileSync('src/components/AnalyticsDashboard.tsx', 'utf8');

const navFind = `{/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 bg-white/40 p-1.5 rounded-xl border border-white/50 backdrop-blur-md w-fit">`;
const navReplace = `{/* Navigation Tabs */}
      {!readOnly && (
      <div className="flex flex-wrap gap-2 bg-white/40 p-1.5 rounded-xl border border-white/50 backdrop-blur-md w-fit">`;

file = file.replace(navFind, navReplace);

const navCloseFind = `        <button 
          onClick={() => setActiveSubTab('ai')}
          className={\`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 \${activeSubTab === 'ai' ? 'bg-white shadow-sm text-indigo-700' : 'text-slate-600 hover:bg-white/50'}\`}
        >
          <BarChart3 className="w-4 h-4" /> AI Predictive Models
        </button>
      </div>`;

const navCloseReplace = `        <button 
          onClick={() => setActiveSubTab('ai')}
          className={\`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 \${activeSubTab === 'ai' ? 'bg-white shadow-sm text-indigo-700' : 'text-slate-600 hover:bg-white/50'}\`}
        >
          <BarChart3 className="w-4 h-4" /> AI Predictive Models
        </button>
      </div>
      )}`;
      
file = file.replace(navCloseFind, navCloseReplace);

fs.writeFileSync('src/components/AnalyticsDashboard.tsx', file);
