import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMapEvents, Polygon, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
  LineChart, Line 
} from 'recharts';
import * as d3 from 'd3';
import { toast } from 'react-hot-toast';
import { useAppStore } from "../store/appStore";
import { useMemo } from "react";
import { Brain, AlertTriangle, TrendingUp, Users, Activity, Map as MapIcon, Share2, ShieldAlert, Loader2, Plus, Edit, X, Trash2 } from 'lucide-react';

const getRiskColor = (risk: string) => {
  switch(risk) {
    case 'High': return '#ef4444'; // red-500
    case 'Medium': return '#f59e0b'; // amber-500
    case 'Low': return '#3b82f6'; // blue-500
    default: return '#94a3b8'; // slate-400
  }
};


const ChangeView = ({ center, zoom }: { center: [number, number], zoom: number }) => {
  const map = useMap();
  map.setView(center, zoom);
  return null;
};

const MapEventsComponent = ({ isAdding, onAdd }: { isAdding: boolean, onAdd: (latlng: any) => void }) => {
  useMapEvents({
    click(e) {
      if (isAdding) {
        onAdd(e.latlng);
      }
    }
  });
  return null;
};

// Network Graph Component
const NetworkGraph = ({ graphData }: { graphData: any }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !graphData || !graphData.nodes || !graphData.links) return;
    
    // Clear previous SVG content for hot reloads
    d3.select(svgRef.current).selectAll("*").remove();

    const width = svgRef.current.clientWidth;
    const height = 400;

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height);

    // Create a simulation with several forces
    const nodes = graphData.nodes.map((d: any) => ({ ...d }));
    const nodeIds = new Set(nodes.map((n: any) => n.id));
    const links = graphData.links.filter((l: any) => {
      const sourceId = typeof l.source === 'object' ? l.source.id : l.source;
      const targetId = typeof l.target === 'object' ? l.target.id : l.target;
      return nodeIds.has(sourceId) && nodeIds.has(targetId);
    }).map((d: any) => ({ ...d }));

    const simulation = d3.forceSimulation(nodes as any)
      .force('link', d3.forceLink(links).id((d: any) => d.id).distance(100))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collide', d3.forceCollide().radius(30));

    // Draw links
    const link = svg.append('g')
      .selectAll('line')
      .data(links)
      .join('line')
      .attr('stroke', '#cbd5e1')
      .attr('stroke-opacity', 0.6)
      .attr('stroke-width', (d: any) => Math.sqrt(d.value) * 2);

    // Draw nodes
    const node = svg.append('g')
      .selectAll('g')
      .data(nodes)
      .join('g')
      .call(d3.drag<any, any>()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended) as any);

    // Node circles
    node.append('circle')
      .attr('r', 16)
      .attr('fill', (d: any) => {
        if (d.type === 'suspect') return '#ef4444'; // Red
        if (d.type === 'victim') return '#3b82f6'; // Blue
        if (d.type === 'location') return '#10b981'; // Green
        return '#8b5cf6'; // Purple for MO
      })
      .attr('stroke', '#fff')
      .attr('stroke-width', 2);

    // Node labels
    node.append('text')
      .attr('dx', 20)
      .attr('dy', 5)
      .text((d: any) => d.id)
      .attr('font-size', '12px')
      .attr('fill', '#334155')
      .attr('font-weight', '500');

    simulation.on('tick', () => {
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);

      node
        .attr('transform', (d: any) => `translate(${d.x},${d.y})`);
    });

    // Drag functions
    function dragstarted(event: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event: any) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event: any) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }
  }, [graphData]);

  return (
    <div className="w-full h-[400px] bg-white/50 backdrop-blur-sm rounded-xl border border-white/50 shadow-inner overflow-hidden relative">
      <svg ref={svgRef} className="w-full h-full" />
      
      {/* Graph Legend */}
      <div className="absolute bottom-4 left-4 bg-white/80 p-3 rounded-lg shadow-sm border border-white flex flex-col gap-2 text-xs">
        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-red-500"></div> Suspect</div>
        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-blue-500"></div> Victim</div>
        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-emerald-500"></div> Location</div>
        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-purple-500"></div> Modus Operandi</div>
      </div>
    </div>
  );
};

export default function AnalyticsDashboard({ readOnly = false }: { readOnly?: boolean }) {
  const [activeSubTab, setActiveSubTab] = useState<'geo' | 'network' | 'ai'>('geo');
  
  const firs = useAppStore(state => state.firs);
  const customGeoPoints = useAppStore(state => state.customGeoPoints);
  const addCustomGeoPoint = useAppStore(state => state.addCustomGeoPoint);
  const removeCustomGeoPoint = useAppStore(state => state.removeCustomGeoPoint);
  const customPolygons = useAppStore(state => state.customPolygons);
  const addCustomPolygon = useAppStore(state => state.addCustomPolygon);
  const removeCustomPolygon = useAppStore(state => state.removeCustomPolygon);

  // Data States
  const [geoData, setGeoData] = useState<any[]>([]);
  const [hiddenIds, setHiddenIds] = useState<Set<string | number>>(new Set());
  
  const displayedGeoData = useMemo(() => {
    const storeIncidents = firs.map(fir => {
      if (!fir.location) return null;
      const match = fir.location.match(/([\d.-]+),\s*([\d.-]+)/);
      if (!match) return null;
      return {
        id: fir.id,
        lat: parseFloat(match[1]),
        lng: parseFloat(match[2]),
        type: fir.type,
        risk: fir.severity, // High, Medium, Low
        date: fir.dateFiled.split('T')[0]
      };
    }).filter(Boolean);
    
    // De-duplicate based on id
    const mergedMap = new Map();
    geoData.forEach(p => mergedMap.set(p.id, p));
    customGeoPoints.forEach(p => mergedMap.set(p.id, p));
    storeIncidents.forEach(inc => {
      if (inc && !mergedMap.has(inc.id)) {
        mergedMap.set(inc.id, inc);
      }
    });
    return Array.from(mergedMap.values()).filter(p => !hiddenIds.has(p.id));
  }, [geoData, firs, customGeoPoints, hiddenIds]);

  const [alerts, setAlerts] = useState<any[]>([]);
  const [hotspots, setHotspots] = useState<any[]>([]);
  const [mapCenter, setMapCenter] = useState<[number, number]>([12.9716, 77.5946]);
  const [mapZoom, setMapZoom] = useState(11);
  const [isAddingGeo, setIsAddingGeo] = useState(false);
  const [editorMode, setEditorMode] = useState<'pin' | 'boundary'>('pin');
  const [currentPolygon, setCurrentPolygon] = useState<[number, number][]>([]);
  const [polygons, setPolygons] = useState<any[]>([]);

  const displayedPolygons = useMemo(() => {
    const map = new Map();
    polygons.forEach(p => map.set(p.id, p));
    customPolygons.forEach(p => map.set(p.id, p));
    return Array.from(map.values()).filter(p => !hiddenIds.has(p.id));
  }, [polygons, customPolygons, hiddenIds]);

  const [selectedRisk, setSelectedRisk] = useState<'High' | 'Medium' | 'Low'>('High');
  const [isEditingGraph, setIsEditingGraph] = useState(false);

  
  const [graphData, setGraphData] = useState<any>(null);
  const [syndicates, setSyndicates] = useState<any[]>([]);
  
  const [predictiveData, setPredictiveData] = useState<any[]>([]);
  const [aiMetrics, setAiMetrics] = useState<any>(null);
  
  const [loading, setLoading] = useState(true);

  const handleMapClick = (latlng: any) => {
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
      setGeoData(prev => [...prev, newPoint]);
      addCustomGeoPoint(newPoint);
    } else {
      setCurrentPolygon(prev => [...prev, [latlng.lat, latlng.lng]]);
    }
  };

  const completeBoundary = () => {
    if (currentPolygon.length > 2) {
      const poly = { id: Date.now(), points: currentPolygon, risk: selectedRisk };
      setPolygons(prev => [...prev, poly]);
      addCustomPolygon(poly);
    }
    setCurrentPolygon([]);
  };
  
  const cancelBoundary = () => {
    setCurrentPolygon([]);
  };

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      setLoading(true);
      try {
        const [geoRes, networkRes, aiRes] = await Promise.all([
          fetch('/api/analytics/geo'),
          fetch('/api/analytics/network'),
          fetch('/api/analytics/predictive')
        ]);
        
        if (!geoRes.ok || !networkRes.ok || !aiRes.ok) {
           throw new Error(`Analytics API error: Geo(${geoRes.status}) Network(${networkRes.status}) AI(${aiRes.status})`);
        }
        
        const parseRes = async (res: Response) => {
          const text = await res.text();
          try {
            return JSON.parse(text);
          } catch (e) {
             throw new Error(`Failed to parse JSON: ${text}`);
          }
        };

        const geoJson = await parseRes(geoRes);
        setGeoData(geoJson.incidents || []);
        setAlerts(geoJson.alerts || []);
        setHotspots(geoJson.hotspots || []);
        
        const networkJson = await parseRes(networkRes);
        setGraphData({ nodes: networkJson.nodes || [], links: networkJson.links || [] });
        setSyndicates(networkJson.syndicates || []);
        
        const aiJson = await parseRes(aiRes);
        setPredictiveData(aiJson.timeline || []);
        setAiMetrics(aiJson.metrics || null);
        
      } catch (error) {
        console.error("Error fetching analytics data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAnalyticsData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] bg-white/60 backdrop-blur-md rounded-2xl border border-white/50 shadow-sm">
        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mb-4" />
        <p className="text-slate-600 font-medium">Initializing AI Engine & Analyzing Datasets...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Navigation Tabs */}
      {!readOnly && (
      <div className="flex flex-wrap gap-2 bg-white/40 p-1.5 rounded-xl border border-white/50 backdrop-blur-md w-fit">
        <button 
          onClick={() => setActiveSubTab('geo')}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${activeSubTab === 'geo' ? 'bg-white shadow-sm text-indigo-700' : 'text-slate-600 hover:bg-white/50'}`}
        >
          <MapIcon className="w-4 h-4" /> Geospatial Intel
        </button>
      </div>
      )}

      {/* Content Area */}
      <div className="min-h-[500px]">
        {/* Module 1: Geospatial */}
        {activeSubTab === 'geo' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="lg:col-span-3 bg-white/60 backdrop-blur-xl rounded-xl border border-white/50 shadow-sm p-4 h-[500px] relative z-0">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4 gap-4">
                  <h3 className="font-bold text-slate-800">Bengaluru District Live Heatmap</h3>
                  <div className="flex flex-wrap items-center gap-2 bg-slate-50 p-1.5 rounded-lg border border-slate-200">
                    
                    {isAddingGeo && (
                        <div className="flex items-center gap-1 bg-white p-1 rounded-md shadow-sm border border-slate-200 mr-2">
                           <button 
                             onClick={() => setEditorMode('pin')} 
                             className={`px-2 py-1 text-xs font-bold rounded ${editorMode === 'pin' ? 'bg-indigo-100 text-indigo-700' : 'text-slate-600 hover:bg-slate-100'}`}
                           >Pin Incident</button>
                           <button 
                             onClick={() => setEditorMode('boundary')} 
                             className={`px-2 py-1 text-xs font-bold rounded ${editorMode === 'boundary' ? 'bg-indigo-100 text-indigo-700' : 'text-slate-600 hover:bg-slate-100'}`}
                           >Define Boundary</button>
                        </div>
                    )}

                    <div className="flex gap-1 items-center">
                        <button 
                        onClick={() => isAddingGeo && setSelectedRisk('High')} 
                        className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded transition-colors ${isAddingGeo ? (selectedRisk === 'High' ? 'bg-red-50 text-red-700 ring-1 ring-red-200' : 'text-slate-600 hover:bg-slate-50 cursor-pointer') : 'text-slate-600 cursor-default'}`}
                        >
                        <div className="w-2 h-2 rounded-full bg-red-500"></div> High Risk
                        </button>
                        <button 
                        onClick={() => isAddingGeo && setSelectedRisk('Medium')} 
                        className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded transition-colors ${isAddingGeo ? (selectedRisk === 'Medium' ? 'bg-amber-50 text-amber-700 ring-1 ring-amber-200' : 'text-slate-600 hover:bg-slate-50 cursor-pointer') : 'text-slate-600 cursor-default'}`}
                        >
                        <div className="w-2 h-2 rounded-full bg-amber-500"></div> Medium
                        </button>
                        <button 
                        onClick={() => isAddingGeo && setSelectedRisk('Low')} 
                        className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded transition-colors ${isAddingGeo ? (selectedRisk === 'Low' ? 'bg-blue-50 text-blue-700 ring-1 ring-blue-200' : 'text-slate-600 hover:bg-slate-50 cursor-pointer') : 'text-slate-600 cursor-default'}`}
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
                        {!readOnly && (
                          <button onClick={() => { setIsAddingGeo(!isAddingGeo); setCurrentPolygon([]); }} className={`px-3 py-1.5 rounded-md text-xs font-bold flex items-center gap-1 transition-colors shadow-sm ${isAddingGeo ? "bg-slate-800 text-white" : "bg-indigo-600 text-white hover:bg-indigo-700"}`}><Edit className="w-3.5 h-3.5" /> {isAddingGeo ? "Exit Editor Mode" : "Editor Mode"}</button>
                        )}
                    </div>
                  </div>
                </div>
                
                <div className="w-full h-[calc(100%-40px)] rounded-lg overflow-hidden border border-slate-200">
                  <MapContainer center={[12.9716, 77.5946]} zoom={11} className="w-full h-full z-0">
                    <ChangeView center={mapCenter} zoom={mapZoom} />
                    <TileLayer
                      attribution='&copy; OpenStreetMap contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      className="map-tiles grayscale opacity-80" // Styling for modern dashboard look
                    />
                    <MapEventsComponent isAdding={isAddingGeo} onAdd={handleMapClick} />
                    {displayedPolygons.map(poly => (
                      <Polygon
                        key={poly.id}
                        positions={poly.points}
                        pathOptions={{ 
                          color: getRiskColor(poly.risk), 
                          fillColor: getRiskColor(poly.risk), 
                          weight: 2, 
                          fillOpacity: 0.3 
                        }}
                      >
                        <Popup>
                          <div className="p-1 min-w-[120px]">
                            <p className="font-bold text-sm">Risk Area</p>
                            <p className="text-xs text-slate-500 mb-2">Risk: <span style={{color: getRiskColor(poly.risk)}} className="font-semibold">{poly.risk}</span></p>
                            {!readOnly && (
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeCustomPolygon(poly.id);
                                  setHiddenIds(prev => new Set(prev).add(poly.id));
                                }}
                                className="w-full mt-2 px-2 py-1 bg-red-50 text-red-600 hover:bg-red-100 rounded text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
                              >
                                <Trash2 className="w-3 h-3" /> Remove Area
                              </button>
                            )}
                          </div>
                        </Popup>
                      </Polygon>
                    ))}
                    {currentPolygon.length > 0 && (
                      <Polyline 
                        positions={[...currentPolygon, currentPolygon[0]]} 
                        pathOptions={{ color: getRiskColor(selectedRisk), dashArray: '5, 5', weight: 2 }} 
                      />
                    )}
                    {displayedGeoData.map(point => ( 
                      <CircleMarker 
                        key={point.id}
                        center={[point.lat, point.lng]}
                        radius={point.risk === 'High' ? 12 : point.risk === 'Medium' ? 8 : 5}
                        fillColor={getRiskColor(point.risk)}
                        color={getRiskColor(point.risk)}
                        weight={1}
                        opacity={0.8}
                        fillOpacity={0.5}
                      >
                        <Popup>
                          <div className="p-1 min-w-[150px]">
                            <p className="font-bold text-sm">{point.type}</p>
                            <p className="text-xs text-slate-500">Risk: <span style={{color: getRiskColor(point.risk)}} className="font-semibold">{point.risk}</span></p>
                            <p className="text-xs text-slate-500 mb-2">{point.date}</p>
                            {!readOnly && (
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeCustomGeoPoint(point.id);
                                  setHiddenIds(prev => new Set(prev).add(point.id));
                                }}
                                className="w-full mt-2 px-2 py-1 bg-red-50 text-red-600 hover:bg-red-100 rounded text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
                              >
                                <Trash2 className="w-3 h-3" /> Remove Point
                              </button>
                            )}
                          </div>
                        </Popup>
                      </CircleMarker>
                    ))}
                  </MapContainer>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <div className="bg-white/60 backdrop-blur-xl rounded-xl border border-white/50 shadow-sm p-5">
                  <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-500" /> Automated Alerts
                  </h3>
                  <div className="space-y-3">
                    {alerts.map(alert => (
                      <div key={alert.id} className={`p-3 rounded-lg border ${alert.level === 'high' ? 'bg-red-50 border-red-100' : 'bg-amber-50 border-amber-100'}`}>
                        <p className={`text-xs font-bold mb-1 ${alert.level === 'high' ? 'text-red-600' : 'text-amber-600'}`}>{alert.type}</p>
                        <p className="text-xs text-slate-700">{alert.message}</p>
                        <span className="text-[10px] text-slate-400 mt-2 block">{alert.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="bg-white/60 backdrop-blur-xl rounded-xl border border-white/50 shadow-sm p-5 flex-1">
                   <h3 className="font-bold text-slate-800 mb-4">Hotspot Regions</h3>
                   <div className="space-y-4">
                      {hotspots.map((hotspot, idx) => (
                        <div key={idx} onClick={() => { if (hotspot.center) { setMapCenter(hotspot.center); setMapZoom(13); } }} className="cursor-pointer hover:bg-slate-50 p-2 -mx-2 rounded-lg transition-colors">
                          <div className="flex justify-between text-xs mb-1">
                            <span className="font-semibold">{hotspot.name}</span>
                            <span className={`font-bold ${hotspot.riskScore > 80 ? 'text-red-500' : hotspot.riskScore > 50 ? 'text-amber-500' : 'text-emerald-500'}`}>{hotspot.riskScore}%</span>
                          </div>
                          <div className="w-full bg-slate-200 rounded-full h-1.5">
                            <div className={`h-1.5 rounded-full ${hotspot.riskScore > 80 ? 'bg-red-500' : hotspot.riskScore > 50 ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{width: `${hotspot.riskScore}%`}}></div>
                          </div>
                        </div>
                      ))}
                   </div>
                </div>
              </div>
            </div>
          </div>
        )}


      </div>
    </div>
  );
}
