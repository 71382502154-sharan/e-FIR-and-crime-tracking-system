const fs = require('fs');
let file = fs.readFileSync('src/components/AnalyticsDashboard.tsx', 'utf8');

if (!file.includes("Polygon,")) {
    file = file.replace(
        "import { MapContainer, TileLayer, CircleMarker, Popup, useMapEvents } from 'react-leaflet';",
        "import { MapContainer, TileLayer, CircleMarker, Popup, useMapEvents, Polygon, Polyline } from 'react-leaflet';"
    );
}

if (!file.includes("setEditorMode")) {
    file = file.replace(
        "const [isAddingGeo, setIsAddingGeo] = useState(false);",
        "const [isAddingGeo, setIsAddingGeo] = useState(false);\n  const [editorMode, setEditorMode] = useState<'pin' | 'boundary'>('pin');\n  const [currentPolygon, setCurrentPolygon] = useState<[number, number][]>([]);\n  const [polygons, setPolygons] = useState<any[]>([]);"
    );

    file = file.replace(
        /const handleMapClick = \(latlng: any\) => \{[\s\S]*?setIsAddingGeo\(false\);\n  \};/,
        `const handleMapClick = (latlng: any) => {
    if (!isAddingGeo) return;
    if (editorMode === 'pin') {
      const newPoint = {
        id: Date.now(),
        lat: latlng.lat,
        lng: latlng.lng,
        type: 'New Report',
        risk: selectedRisk,
        date: new Date().toISOString().split('T')[0]
      };
      setGeoData([...geoData, newPoint]);
    } else {
      setCurrentPolygon([...currentPolygon, [latlng.lat, latlng.lng]]);
    }
  };

  const completeBoundary = () => {
    if (currentPolygon.length > 2) {
      setPolygons([...polygons, { id: Date.now(), points: currentPolygon, risk: selectedRisk }]);
    }
    setCurrentPolygon([]);
  };
  
  const cancelBoundary = () => {
    setCurrentPolygon([]);
  };`
    );

    const mapCodeToReplace = `{geoData.map(point => (`;
    const newMapCode = `
                    {polygons.map(poly => (
                      <Polygon
                        key={poly.id}
                        positions={poly.points}
                        pathOptions={{ 
                          color: getRiskColor(poly.risk), 
                          fillColor: getRiskColor(poly.risk), 
                          weight: 2, 
                          fillOpacity: 0.3 
                        }}
                      />
                    ))}
                    {currentPolygon.length > 0 && (
                      <Polyline 
                        positions={[...currentPolygon, currentPolygon[0]]} 
                        pathOptions={{ color: getRiskColor(selectedRisk), dashArray: '5, 5', weight: 2 }} 
                      />
                    )}
                    {geoData.map(point => (`

    file = file.replace(mapCodeToReplace, newMapCode.trim() + " ");
    
    // Replace header UI
    const headerRegex = /<div className="flex justify-between items-center mb-4">[\s\S]*?<\/div>\s*<\/div>/;
    
    const newHeader = `<div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4 gap-4">
                  <h3 className="font-bold text-slate-800">Bengaluru District Live Heatmap</h3>
                  <div className="flex flex-wrap items-center gap-2 bg-slate-50 p-1.5 rounded-lg border border-slate-200">
                    
                    {isAddingGeo && (
                        <div className="flex items-center gap-1 bg-white p-1 rounded-md shadow-sm border border-slate-200 mr-2">
                           <button 
                             onClick={() => setEditorMode('pin')} 
                             className={\`px-2 py-1 text-xs font-bold rounded \${editorMode === 'pin' ? 'bg-indigo-100 text-indigo-700' : 'text-slate-600 hover:bg-slate-100'}\`}
                           >Pin Incident</button>
                           <button 
                             onClick={() => setEditorMode('boundary')} 
                             className={\`px-2 py-1 text-xs font-bold rounded \${editorMode === 'boundary' ? 'bg-indigo-100 text-indigo-700' : 'text-slate-600 hover:bg-slate-100'}\`}
                           >Define Boundary</button>
                        </div>
                    )}

                    <div className="flex gap-1 items-center">
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
                    </div>

                    <div className="flex gap-2 items-center ml-2 border-l border-slate-300 pl-4">
                        {isAddingGeo && editorMode === 'boundary' && currentPolygon.length > 0 && (
                            <>
                              <button onClick={completeBoundary} className="px-3 py-1 rounded text-xs font-bold bg-emerald-100 text-emerald-700 hover:bg-emerald-200 transition-colors">Complete</button>
                              <button onClick={cancelBoundary} className="px-3 py-1 rounded text-xs font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors">Clear</button>
                            </>
                        )}
                        <button onClick={() => { setIsAddingGeo(!isAddingGeo); setCurrentPolygon([]); }} className={\`px-3 py-1.5 rounded-md text-xs font-bold flex items-center gap-1 transition-colors shadow-sm \${isAddingGeo ? "bg-slate-800 text-white" : "bg-indigo-600 text-white hover:bg-indigo-700"}\`}><Edit className="w-3.5 h-3.5" /> {isAddingGeo ? "Exit Editor Mode" : "Editor Mode"}</button>
                    </div>
                  </div>
                </div>`;
    
    file = file.replace(headerRegex, newHeader);
    
    fs.writeFileSync('src/components/AnalyticsDashboard.tsx', file);
}
