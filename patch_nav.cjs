const fs = require('fs');
let file = fs.readFileSync('src/components/AnalyticsDashboard.tsx', 'utf8');

const networkGraphHeader = `
<div className="flex flex-col mb-6 gap-4">
  <div className="flex justify-between items-start">
    <div>
      <h3 className="font-bold text-slate-800 mb-2">Entity Relationship Graph</h3>
      <p className="text-xs text-slate-500">Interactive force-directed graph mapping suspects to locations and Modus Operandi (MO).</p>
    </div>
    <div className="flex gap-2">
      <button onClick={() => setIsEditingGraph(!isEditingGraph)} className={\`px-3 py-1 rounded text-xs font-bold flex items-center gap-1 transition-colors \${isEditingGraph ? 'bg-indigo-600 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}\`}>
        <Edit className="w-3 h-3" /> {isEditingGraph ? 'Done Editing' : 'Edit Graph'}
      </button>
    </div>
  </div>
  
  {isEditingGraph && (
    <div className="bg-white/80 p-3 rounded-lg border border-slate-200 shadow-sm flex flex-wrap gap-4 items-end animate-in fade-in slide-in-from-top-2">
      <div className="space-y-1">
        <label className="text-[10px] font-bold text-slate-500 uppercase">Add Node</label>
        <div className="flex gap-2">
          <input type="text" id="newNodeName" placeholder="Node Name" className="text-sm px-2 py-1 border border-slate-300 rounded outline-none focus:border-indigo-500" />
          <select id="newNodeType" className="text-sm px-2 py-1 border border-slate-300 rounded outline-none focus:border-indigo-500">
            <option value="suspect">Suspect</option>
            <option value="victim">Victim</option>
            <option value="location">Location</option>
            <option value="mo">Modus Operandi</option>
          </select>
          <button onClick={() => {
            const nameEl = document.getElementById('newNodeName') as HTMLInputElement;
            const typeEl = document.getElementById('newNodeType') as HTMLSelectElement;
            if (nameEl.value) {
              setGraphData({
                ...graphData,
                nodes: [...graphData.nodes, { id: nameEl.value, group: 1, type: typeEl.value }]
              });
              nameEl.value = '';
            }
          }} className="px-3 py-1 bg-indigo-600 text-white hover:bg-indigo-700 rounded text-xs font-bold transition-colors">
            Add
          </button>
        </div>
      </div>
      
      <div className="space-y-1 pl-4 border-l border-slate-200">
        <label className="text-[10px] font-bold text-slate-500 uppercase">Add Link</label>
        <div className="flex gap-2">
          <input type="text" id="newLinkSource" placeholder="Source Node" className="text-sm px-2 py-1 border border-slate-300 rounded outline-none focus:border-indigo-500 w-28" />
          <input type="text" id="newLinkTarget" placeholder="Target Node" className="text-sm px-2 py-1 border border-slate-300 rounded outline-none focus:border-indigo-500 w-28" />
          <button onClick={() => {
            const sourceEl = document.getElementById('newLinkSource') as HTMLInputElement;
            const targetEl = document.getElementById('newLinkTarget') as HTMLSelectElement;
            if (sourceEl.value && targetEl.value) {
              setGraphData({
                ...graphData,
                links: [...graphData.links, { source: sourceEl.value, target: targetEl.value, value: 1 }]
              });
              sourceEl.value = '';
              targetEl.value = '';
            }
          }} className="px-3 py-1 bg-indigo-600 text-white hover:bg-indigo-700 rounded text-xs font-bold transition-colors">
            Connect
          </button>
        </div>
      </div>
    </div>
  )}
</div>
`;

// Replace the previous header
const oldHeader = file.match(/<div className="flex justify-between items-start mb-6">[\s\S]*?<\/div>\s*<\/div>/)[0];
if (oldHeader) {
  file = file.replace(oldHeader, networkGraphHeader);
  fs.writeFileSync('src/components/AnalyticsDashboard.tsx', file);
} else {
  console.log("Could not find the old header");
}
