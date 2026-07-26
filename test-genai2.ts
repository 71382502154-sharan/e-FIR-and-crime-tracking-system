const fs = require('fs');
let file = fs.readFileSync('src/components/AnalyticsDashboard.tsx', 'utf8');

if (!file.includes("selectedRisk")) {
  file = file.replace(
    "const [isAddingGeo, setIsAddingGeo] = useState(false);",
    "const [isAddingGeo, setIsAddingGeo] = useState(false);\n  const [selectedRisk, setSelectedRisk] = useState<'High' | 'Medium' | 'Low'>('High');"
  );

  file = file.replace(
    "risk: 'Medium',",
    "risk: selectedRisk,"
  );

  const newLegend = `
                  <div className="flex gap-2">
                    <button 
                      onClick={() => isAddingGeo && setSelectedRisk('High')} 
                      className={\`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded transition-colors \${isAddingGeo ? (selectedRisk === 'High' ? 'bg-red-50 text-red-700 ring-1 ring-red-200' : 'text-slate-600 hover:bg-slate-50 cursor-pointer') : 'text-slate-600 cursor-default'}\`}
                    >
                      <div className="w-2 h-2 rounded-full bg-red-500"></div> High Risk
                    </button>
                    <button 
                      onClick={() => isAddingGeo && setSelectedRisk('Medium')} 
                      className={\`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded transition-colors \${isAddingGeo ? (selectedRisk === 'Medium' ? 'bg-amber-50 text-amber-700 ring-1 ring-amber-200' : 'text-slate-600 hover:bg-slate-50 cursor-pointer') : 'text-slate-600 cursor-default'}\`}
                    >
                      <div className="w-2 h-2 rounded-full bg-amber-500"></div> Medium
                    </button>
                    <button 
                      onClick={() => isAddingGeo && setSelectedRisk('Low')} 
                      className={\`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded transition-colors \${isAddingGeo ? (selectedRisk === 'Low' ? 'bg-blue-50 text-blue-700 ring-1 ring-blue-200' : 'text-slate-600 hover:bg-slate-50 cursor-pointer') : 'text-slate-600 cursor-default'}\`}
                    >
                      <div className="w-2 h-2 rounded-full bg-blue-500"></div> Low
                    </button>
                    <button onClick={() => setIsAddingGeo(!isAddingGeo)} className={\`ml-4 px-3 py-1 rounded text-xs font-bold flex items-center gap-1 transition-colors \${isAddingGeo ? "bg-indigo-600 text-white" : "bg-indigo-50 text-indigo-700 hover:bg-indigo-100"}\`}><Plus className="w-3 h-3" /> {isAddingGeo ? "Click Map to Add" : "Add Crime Area"}</button>
                  </div>`;

  const oldLegendRegex = /<div className="flex gap-2">[\s\S]*?<\/div>/;
  
  // Find the legend which is inside the header
  const headerMatch = file.match(/<div className="flex justify-between items-center mb-4">[\s\S]*?<\/div>\s*<\/div>/);
  if (headerMatch) {
    const headerStr = headerMatch[0];
    const newHeaderStr = headerStr.replace(oldLegendRegex, newLegend.trim());
    file = file.replace(headerStr, newHeaderStr);
    fs.writeFileSync('src/components/AnalyticsDashboard.tsx', file);
  } else {
    console.log("Could not find header");
  }
}
