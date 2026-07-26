const fs = require('fs');
let file = fs.readFileSync('src/components/AnalyticsDashboard.tsx', 'utf8');

const networkGraphHeader = `<div className="flex justify-between items-start mb-6">
  <div>
    <h3 className="font-bold text-slate-800 mb-2">Entity Relationship Graph</h3>
    <p className="text-xs text-slate-500">Interactive force-directed graph mapping suspects to locations and Modus Operandi (MO).</p>
  </div>
  <div className="flex gap-2">
    <button onClick={() => {
      const nodeName = window.prompt('Enter new node name (e.g. Suspect D):');
      if (nodeName) {
        setGraphData({
          ...graphData,
          nodes: [...graphData.nodes, { id: nodeName, group: 1, type: 'suspect' }]
        });
      }
    }} className="px-3 py-1 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded text-xs font-bold flex items-center gap-1 transition-colors">
      <Plus className="w-3 h-3" /> Add Node
    </button>
    <button onClick={() => {
      const source = window.prompt('Enter source node name:');
      const target = window.prompt('Enter target node name:');
      if (source && target) {
        setGraphData({
          ...graphData,
          links: [...graphData.links, { source, target, value: 1 }]
        });
      }
    }} className="px-3 py-1 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded text-xs font-bold flex items-center gap-1 transition-colors">
      <Plus className="w-3 h-3" /> Add Link
    </button>
  </div>
</div>`;

file = file.replace(
  '<h3 className="font-bold text-slate-800 mb-2">Entity Relationship Graph</h3>\n                <p className="text-xs text-slate-500 mb-6">Interactive force-directed graph mapping suspects to locations and Modus Operandi (MO).</p>',
  networkGraphHeader
);

fs.writeFileSync('src/components/AnalyticsDashboard.tsx', file);
