import React, { useState, useEffect, useRef } from 'react';
import { FIR, User, CaseEntity, CaseLink } from '../types';
import { 
  X, Clock, ShieldCheck, CheckCircle2, UserCircle, Search, Calendar, 
  FileText, AlertTriangle, Download, MapPin, MessageSquare, Send, 
  Share2, Edit, Brain, Plus, Trash2, ShieldAlert, TrendingUp, Paperclip,
  Image, Video, File, Shield, Loader2
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '../lib/utils';
import { generateFIRPdf } from '../lib/pdfGenerator';
import { useAppStore } from '../store/appStore';
import * as d3 from 'd3';
import { toast } from 'react-hot-toast';
import Markdown from 'react-markdown';

interface FIRDetailsModalProps {
  fir: FIR | null;
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
}

// Case-specific Entity Relationship Graph component
const CaseNetworkGraph = ({ 
  entities, 
  links, 
  onUpdate 
}: { 
  entities: CaseEntity[]; 
  links: CaseLink[]; 
  onUpdate?: (newEntities: CaseEntity[], newLinks: CaseLink[]) => void;
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [nodeName, setNodeName] = useState('');
  const [nodeType, setNodeType] = useState<'suspect' | 'victim' | 'location' | 'mo'>('suspect');
  const [sourceNode, setSourceNode] = useState('');
  const [targetNode, setTargetNode] = useState('');

  const [editingEntityId, setEditingEntityId] = useState<string | null>(null);
  const [editingEntityName, setEditingEntityName] = useState('');

  const cleanLinks = (links || []).map(l => ({
    ...l,
    source: typeof l.source === 'object' ? (l.source as any).id : l.source,
    target: typeof l.target === 'object' ? (l.target as any).id : l.target
  }));

  useEffect(() => {
    if (!svgRef.current || !entities) return;

    d3.select(svgRef.current).selectAll("*").remove();
    
    if (entities.length === 0) return;

    const width = svgRef.current.clientWidth || 600;
    const height = 380;

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height);

    const nodes = entities.map(d => ({ ...d }));
    const nodeIds = new Set(nodes.map(n => n.id));
    
    const validLinks = cleanLinks.filter(l => {
      return nodeIds.has(l.source) && nodeIds.has(l.target);
    }).map(d => ({ ...d }));

    const simulation = d3.forceSimulation(nodes as any)
      .force('link', d3.forceLink(validLinks).id((d: any) => d.id).distance(110))
      .force('charge', d3.forceManyBody().strength(-350))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collide', d3.forceCollide().radius(35));

    const linkLines = svg.append('g')
      .selectAll('line')
      .data(validLinks)
      .join('line')
      .attr('stroke', '#cbd5e1')
      .attr('stroke-opacity', 0.8)
      .attr('stroke-width', (d: any) => (d.value ? d.value * 2 : 2));

    const nodeGroups = svg.append('g')
      .selectAll('g')
      .data(nodes)
      .join('g')
      .call(d3.drag<any, any>()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended) as any);

    nodeGroups.append('circle')
      .attr('r', 18)
      .attr('fill', (d: any) => {
        if (d.type === 'suspect') return '#ef4444';
        if (d.type === 'victim') return '#3b82f6';
        if (d.type === 'location') return '#10b981';
        return '#8b5cf6';
      })
      .attr('stroke', '#ffffff')
      .attr('stroke-width', 2.5)
      .attr('class', 'shadow-md transition-all cursor-pointer');

    nodeGroups.append('text')
      .attr('dx', 24)
      .attr('dy', 5)
      .text((d: any) => d.name || d.id)
      .attr('font-size', '12px')
      .attr('fill', '#1e293b')
      .attr('font-weight', '600')
      .attr('class', 'select-none');

    simulation.on('tick', () => {
      linkLines
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);

      nodeGroups
        .attr('transform', (d: any) => `translate(${d.x},${d.y})`);
    });

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
  }, [entities, cleanLinks]);

  const handleAddNode = () => {
    if (!nodeName.trim()) {
      toast.error('Please enter a node name');
      return;
    }
    const newId = nodeName.trim();
    if (entities.some(e => e.id.toLowerCase() === newId.toLowerCase())) {
      toast.error('Node already exists in graph');
      return;
    }
    const newEntities: CaseEntity[] = [...entities, { id: newId, name: newId, type: nodeType }];
    onUpdate?.(newEntities, cleanLinks);
    setNodeName('');
    toast.success(`Added ${nodeType}: ${newId}`);
  };

  const handleAddLink = () => {
    if (!sourceNode || !targetNode) {
      toast.error('Please select both source and target nodes');
      return;
    }
    if (sourceNode === targetNode) {
      toast.error('Cannot connect a node to itself');
      return;
    }
    const newLinks: CaseLink[] = [...cleanLinks, { source: sourceNode, target: targetNode, value: 2 }];
    onUpdate?.(entities, newLinks);
    setSourceNode('');
    setTargetNode('');
    toast.success(`Connected ${sourceNode} ↔ ${targetNode}`);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center bg-white/60 p-3 rounded-xl border border-white/50">
        <div>
          <h3 className="font-bold text-slate-800 text-sm">Entity Relationship Graph</h3>
          <p className="text-xs text-slate-500">Interactive force-directed graph mapping suspects to locations and Modus Operandi (MO).</p>
        </div>
        <button 
          onClick={() => setIsEditing(!isEditing)}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm ${
            isEditing ? 'bg-indigo-600 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200'
          }`}
        >
          <Edit className="w-3.5 h-3.5" />
          {isEditing ? 'Done Editing' : 'Edit Graph'}
        </button>
      </div>

      {isEditing && (
        <div className="bg-white/90 p-3 sm:p-4 rounded-xl border border-indigo-100 shadow-sm space-y-3 animate-in fade-in slide-in-from-top-2">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
            <div className="space-y-1.5 min-w-0">
              <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">1. Add Entity Node</label>
              <div className="flex flex-wrap sm:flex-nowrap gap-2 items-center">
                <input 
                  type="text" 
                  value={nodeName}
                  onChange={(e) => setNodeName(e.target.value)}
                  placeholder="e.g. Suspect B (Anand)"
                  className="flex-1 min-w-[120px] text-xs px-2.5 py-2 bg-white border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                />
                <select 
                  value={nodeType}
                  onChange={(e) => setNodeType(e.target.value as any)}
                  className="shrink-0 text-xs px-2 py-2 bg-white border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 font-semibold"
                >
                  <option value="suspect">Suspect</option>
                  <option value="victim">Victim</option>
                  <option value="location">Location</option>
                  <option value="mo">Modus Operandi</option>
                </select>
                <button 
                  onClick={handleAddNode}
                  className="shrink-0 px-3 py-2 bg-indigo-600 text-white rounded-lg text-xs font-bold hover:bg-indigo-700 transition-colors flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Add
                </button>
              </div>
            </div>

            <div className="space-y-1.5 min-w-0">
              <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">2. Connect Relationship Link</label>
              <div className="flex flex-wrap sm:flex-nowrap gap-2 items-center">
                <select 
                  value={sourceNode}
                  onChange={(e) => setSourceNode(e.target.value)}
                  className="flex-1 min-w-[90px] text-xs px-2 py-2 bg-white border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 truncate font-medium"
                >
                  <option value="">Source Node</option>
                  {entities.map(e => (
                    <option key={e.id} value={e.id}>{e.name || e.id}</option>
                  ))}
                </select>
                <select 
                  value={targetNode}
                  onChange={(e) => setTargetNode(e.target.value)}
                  className="flex-1 min-w-[90px] text-xs px-2 py-2 bg-white border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 truncate font-medium"
                >
                  <option value="">Target Node</option>
                  {entities.map(e => (
                    <option key={e.id} value={e.id}>{e.name || e.id}</option>
                  ))}
                </select>
                <button 
                  onClick={handleAddLink}
                  className="shrink-0 px-3 py-2 bg-indigo-600 text-white rounded-lg text-xs font-bold hover:bg-indigo-700 transition-colors flex items-center gap-1"
                >
                  <Share2 className="w-3.5 h-3.5" /> Connect
                </button>
              </div>
            </div>
          </div>
          
          {entities.length > 0 && (
            <div className="pt-3 border-t border-indigo-100">
              <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-2">3. Manage Existing Entities</label>
              <div className="flex flex-wrap gap-2">
                {entities.map(e => (
                  <div key={e.id} className="flex items-center gap-1 bg-white border border-slate-200 shadow-sm rounded-md py-1 pl-2.5 pr-1 text-xs transition-colors hover:border-indigo-200 hover:bg-indigo-50/30">
                    <span className="font-medium text-slate-700 truncate max-w-[120px]">
                      {editingEntityId === e.id ? (
                        <input
                          autoFocus
                          value={editingEntityName}
                          onChange={(ev) => setEditingEntityName(ev.target.value)}
                          onKeyDown={(ev) => {
                            if (ev.key === 'Enter') {
                              if (editingEntityName.trim() !== '') {
                                const newEntities = entities.map(ent => ent.id === e.id ? { ...ent, name: editingEntityName.trim() } : ent);
                                onUpdate?.(newEntities, cleanLinks);
                              }
                              setEditingEntityId(null);
                            }
                            if (ev.key === 'Escape') setEditingEntityId(null);
                          }}
                          onBlur={() => {
                            if (editingEntityName.trim() !== '') {
                              const newEntities = entities.map(ent => ent.id === e.id ? { ...ent, name: editingEntityName.trim() } : ent);
                              onUpdate?.(newEntities, cleanLinks);
                            }
                            setEditingEntityId(null);
                          }}
                          className="w-20 text-xs px-1 border border-indigo-300 rounded outline-none"
                        />
                      ) : (
                        e.name || e.id
                      )}
                    </span>
                    <div className="flex items-center ml-1">
                      <button 
                        onClick={() => {
                          setEditingEntityId(e.id);
                          setEditingEntityName(e.name || e.id);
                        }}
                        className="p-1 text-slate-400 hover:text-indigo-600 hover:bg-indigo-100 rounded transition-colors"
                        title="Edit name"
                      >
                        <Edit className="w-3 h-3" />
                      </button>
                      <button 
                        onClick={() => {
                          const newEntities = entities.filter(ent => ent.id !== e.id);
                          const newLinks = cleanLinks.filter(l => {
                            return l.source !== e.id && l.target !== e.id;
                          });
                          onUpdate?.(newEntities, newLinks);
                        }}
                        className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-100 rounded transition-colors"
                        title="Delete entity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="w-full h-[320px] sm:h-[380px] bg-white/70 backdrop-blur-sm rounded-2xl border border-white/60 shadow-inner overflow-hidden relative">
        <svg ref={svgRef} className="w-full h-full" />

        {/* Graph Legend */}
        <div className="absolute bottom-3 left-3 bg-white/95 p-2.5 rounded-xl shadow-md border border-white/80 flex flex-wrap sm:flex-col gap-1.5 text-[11px] font-semibold z-10 pointer-events-none max-w-[calc(100%-1.5rem)]">
          <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-red-500 shrink-0"></div> Suspect</div>
          <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-blue-500 shrink-0"></div> Victim</div>
          <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0"></div> Location</div>
          <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-purple-500 shrink-0"></div> Modus Operandi</div>
        </div>
      </div>
    </div>
  );
};

export default function FIRDetailsModal({ fir: initialFir, isOpen, onClose, user }: FIRDetailsModalProps) {
  const tabsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = tabsRef.current;
    if (!el) return;
    const handleWheel = (e: WheelEvent) => {
      if (e.deltaY !== 0) {
        e.preventDefault();
        el.scrollLeft += e.deltaY;
      }
    };
    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleWheel);
  }, [isOpen]);

  const { firs, registeredUsers, addFIRNote, updateFIREntities, addFIREvidence, updateFIRStatus, assignOfficer, unassignOfficer } = useAppStore();
  const [activeTab, setActiveTab] = useState<'overview' | 'graph' | 'ai' | 'notes' | 'evidence'>('overview');
  const [noteText, setNoteText] = useState('');
  const [evidenceTitle, setEvidenceTitle] = useState('');
  
  const [analyzingGraph, setAnalyzingGraph] = useState(false);
  const [graphAnalysisResult, setGraphAnalysisResult] = useState('');
  const [suggestedNodes, setSuggestedNodes] = useState<any[]>([]);
  const [suggestedLinks, setSuggestedLinks] = useState<any[]>([]);
  const [evidenceType, setEvidenceType] = useState<'image' | 'video' | 'document'>('document');

  const fir = firs.find(f => f.id === initialFir?.id) || initialFir;

  if (!isOpen || !fir) return null;

  const citizenUser = registeredUsers.find(u => u.id === fir.userId);

  const assignedOfficersList = registeredUsers.filter(u => u.role === 'officer' && fir.assignedOfficers?.includes(u.id));
  const availableOfficers = registeredUsers.filter(u => u.role === 'officer' && !fir.assignedOfficers?.includes(u.id) && u.station === fir.station);

  const entities = fir.entities || [
    { id: `Suspect A`, name: `Suspect A`, type: 'suspect' },
    { id: `Location: ${fir.station}`, name: `Location: ${fir.station}`, type: 'location' },
    { id: `Victim`, name: citizenUser?.name || 'Complainant', type: 'victim' },
    { id: `MO: ${fir.type}`, name: `MO: ${fir.type}`, type: 'mo' }
  ];

  const links = fir.links || [
    { source: `Suspect A`, target: `Location: ${fir.station}`, value: 2 },
    { source: `Suspect A`, target: `MO: ${fir.type}`, value: 2 },
    { source: `Victim`, target: `Location: ${fir.station}`, value: 1 }
  ];

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteText.trim() || !user) return;
    addFIRNote(fir.id, noteText, user.id, user.name);
    setNoteText('');
    toast.success('Investigation note added');
  };

  const handleAddEvidence = (e: React.FormEvent) => {
    e.preventDefault();
    if (!evidenceTitle.trim()) return;
    addFIREvidence(fir.id, {
      title: evidenceTitle,
      type: evidenceType,
      url: '#'
    });
    setEvidenceTitle('');
    toast.success('Evidence file linked to case');
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Pending Verification': return <Clock className="w-4 h-4 text-secondary" />;
      case 'Pending Assignment': return <UserCircle className="w-4 h-4 text-orange-600" />;
      case 'Under Investigation': return <Search className="w-4 h-4 text-blue-600" />;
      case 'Verified & Active': return <ShieldCheck className="w-4 h-4 text-primary" />;
      case 'Closed': return <CheckCircle2 className="w-4 h-4 text-on-surface-variant" />;
      default: return <ShieldCheck className="w-4 h-4 text-primary" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending Verification': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Pending Assignment': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Under Investigation': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Verified & Active': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Closed': return 'bg-slate-100 text-slate-700 border-slate-200';
      default: return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6">
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-md" 
        onClick={onClose}
      />
      
      <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden relative z-10 flex flex-col max-h-[92vh] border border-white/60 text-slate-800">
        
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-5 border-b border-slate-200 bg-white/70">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shadow-sm">
              <FileText className="w-6 h-6 text-primary" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-display font-bold text-slate-900">{fir.firNumber}</h2>
                <span className={cn("text-xs px-2.5 py-0.5 rounded-full font-bold border flex items-center gap-1", getStatusColor(fir.status))}>
                  {getStatusIcon(fir.status)}
                  {fir.status}
                </span>
              </div>
              <p className="text-sm font-semibold text-slate-600">{fir.title}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Sub-Tabs */}
        <div ref={tabsRef} className="flex border-b border-slate-200 bg-slate-50/80 px-6 pt-2 overflow-x-auto" style={{ scrollBehavior: 'smooth' }}>
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-3 font-bold text-xs md:text-sm border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${
              activeTab === 'overview' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileText className="w-4 h-4" /> Overview & Complainant
          </button>

          <button
            onClick={() => setActiveTab('graph')}
            className={`px-4 py-3 font-bold text-xs md:text-sm border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${
              activeTab === 'graph' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Share2 className="w-4 h-4" /> Entity Relationship Graph
          </button>

          <button
            onClick={() => setActiveTab('ai')}
            className={`px-4 py-3 font-bold text-xs md:text-sm border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${
              activeTab === 'ai' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Brain className="w-4 h-4" /> AI Case Intelligence
          </button>

          <button
            onClick={() => setActiveTab('notes')}
            className={`px-4 py-3 font-bold text-xs md:text-sm border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${
              activeTab === 'notes' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <MessageSquare className="w-4 h-4" /> Case Notes ({fir.notes?.length || 0})
          </button>

          <button
            onClick={() => setActiveTab('evidence')}
            className={`px-4 py-3 font-bold text-xs md:text-sm border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${
              activeTab === 'evidence' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Paperclip className="w-4 h-4" /> Evidence Vault ({fir.evidence?.length || 0})
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">

          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                  <div className="flex items-center gap-2 text-slate-500 mb-1">
                    <Calendar className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-wider">Date Filed</span>
                  </div>
                  <p className="font-bold text-slate-800">{format(new Date(fir.dateFiled), 'MMMM dd, yyyy HH:mm a')}</p>
                </div>

                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                  <div className="flex items-center gap-2 text-slate-500 mb-1">
                    <AlertTriangle className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-wider">Priority & Offense Type</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={cn(
                      "text-xs px-2.5 py-1 rounded-md font-bold",
                      fir.severity === 'High' ? "bg-red-100 text-red-700" :
                      fir.severity === 'Medium' ? "bg-amber-100 text-amber-800" : "bg-blue-100 text-blue-700"
                    )}>
                      {fir.severity} Priority
                    </span>
                    <span className="text-xs px-2.5 py-1 rounded-md font-bold bg-slate-200 text-slate-700">
                      {fir.type}
                    </span>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 md:col-span-2">
                  <div className="flex items-center gap-2 text-slate-500 mb-1">
                    <MapPin className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-wider">Jurisdiction & Location</span>
                  </div>
                  <p className="font-semibold text-slate-800">{fir.station}</p>
                  {fir.location && <p className="text-xs text-slate-500 mt-1">Coordinates: {fir.location}</p>}
                </div>

                {(user?.role === 'officer' || user?.role === 'admin') && (
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 md:col-span-2">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2 text-slate-500">
                        <UserCircle className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase tracking-wider">Complainant Information</span>
                      </div>
                      {user?.role === 'officer' && (
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-500">Update Status:</span>
                          <select 
                            value={fir.status}
                            onChange={(e) => updateFIRStatus(fir.id, e.target.value as any)}
                            className="text-xs bg-white border border-slate-300 rounded-md px-2 py-1 font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary"
                          >
                            <option value="Pending Verification">Pending Verification</option>
                            <option value="Under Investigation">Under Investigation</option>
                            <option value="Verified & Active">Verified & Active</option>
                            <option value="Pending Assignment">Pending Assignment</option>
                            <option value="Closed">Closed</option>
                          </select>
                        </div>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-3 rounded-lg border border-slate-200/80">
                      <div>
                        <span className="block text-xs font-semibold text-slate-400">Full Name</span>
                        <span className="font-bold text-slate-800">{citizenUser?.name || 'Complainant'}</span>
                      </div>
                      <div>
                        <span className="block text-xs font-semibold text-slate-400">Phone</span>
                        <span className="font-bold text-slate-800">{citizenUser?.phone || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="block text-xs font-semibold text-slate-400">Email</span>
                        <span className="font-bold text-slate-800">{citizenUser?.email || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="block text-xs font-semibold text-slate-400">Resident Area</span>
                        <span className="font-bold text-slate-800">{citizenUser?.area || 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                )}

                {(user?.role === 'officer' || user?.role === 'admin') && (
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 md:col-span-2">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2 text-slate-500">
                        <ShieldCheck className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase tracking-wider">Investigating Officers</span>
                      </div>
                      
                      {user?.role === 'officer' && (
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-500">Assign:</span>
                          <select 
                            onChange={(e) => {
                              if (e.target.value) {
                                assignOfficer(fir.id, e.target.value);
                                e.target.value = '';
                              }
                            }}
                            className="text-xs bg-white border border-slate-300 rounded-md px-2 py-1 font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary"
                            defaultValue=""
                          >
                            <option value="" disabled>Select Officer</option>
                            {availableOfficers.map(officer => (
                              <option key={officer.id} value={officer.id}>{officer.name} ({officer.station})</option>
                            ))}
                          </select>
                        </div>
                      )}
                    </div>
                    
                    {assignedOfficersList.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {assignedOfficersList.map(officer => (
                          <div key={officer.id} className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-2 shadow-sm">
                            <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                              <ShieldCheck className="w-3.5 h-3.5" />
                            </div>
                            <div>
                              <p className="text-xs font-bold text-slate-800">{officer.name}</p>
                              <p className="text-[10px] text-slate-500">{officer.station}</p>
                            </div>
                            {user?.role === 'officer' && (
                              <button 
                                onClick={() => unassignOfficer(fir.id, officer.id)}
                                className="ml-2 p-1 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
                                title="Remove assignment"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-slate-500 italic">No officers assigned to this case yet.</p>
                    )}
                  </div>
                )}

                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 md:col-span-2">
                  <div className="flex items-center gap-2 text-slate-500 mb-2">
                    <FileText className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-wider">FIR Incident Summary</span>
                  </div>
                  <p className="font-medium text-slate-800 leading-relaxed text-sm whitespace-pre-wrap">{fir.description}</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ENTITY RELATIONSHIP GRAPH */}
          {activeTab === 'graph' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Graph Container */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden min-h-[500px]">
                <CaseNetworkGraph 
                  entities={entities} 
                  links={links} 
                  onUpdate={(newEntities, newLinks) => updateFIREntities(fir.id, newEntities, newLinks)} 
                />
              </div>
            </div>
          )}

          {/* TAB 3: AI CASE INTELLIGENCE */}
          {activeTab === 'ai' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in duration-200">
              
              {/* Left Column: Standard AI Features */}
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-4">
                  <div className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white rounded-xl p-5 shadow-sm">
                    <span className="text-xs font-bold text-indigo-200 uppercase tracking-wider">AI Case Risk Score</span>
                    <div className="flex items-baseline gap-2 mt-2">
                      <h3 className="text-4xl font-display font-bold text-indigo-300">{fir.aiAnalysis?.riskScore || 75}%</h3>
                      <span className="text-xs font-semibold text-red-400 flex items-center gap-1">
                        <TrendingUp className="w-3.5 h-3.5" /> High Urgency
                      </span>
                    </div>
                    <p className="text-xs text-indigo-100/80 mt-3">Calculated via incident severity, location risk indices, and MO match probability.</p>
                  </div>

                  <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                    <h4 className="font-bold text-sm text-slate-800 mb-2 flex items-center gap-2">
                      <Brain className="w-4 h-4 text-indigo-600" /> AI Executive Pattern Summary
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed mb-3">
                      {fir.aiAnalysis?.summary || `Pattern analysis indicates potential correlation with recent ${fir.type} incidents reported across adjacent precincts.`}
                    </p>
                    <div className="flex flex-col gap-2">
                      <span className="px-2.5 py-1.5 bg-indigo-50 text-indigo-700 rounded-md text-xs font-bold border border-indigo-100 break-words">
                        MO Pattern: {fir.aiAnalysis?.moPattern || fir.type}
                      </span>
                      <span className="px-2.5 py-1.5 bg-amber-50 text-amber-700 rounded-md text-xs font-bold border border-amber-100 break-words">
                        Identified Suspects: {fir.aiAnalysis?.suspectsIdentified?.join(', ') || 'Under Investigation'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 space-y-3">
                  <h4 className="font-bold text-sm text-slate-800 flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-red-500" /> Recommended Pre-emptive Actions for Investigating Officer
                  </h4>
                  <ul className="space-y-2">
                    {(fir.aiAnalysis?.recommendedActions || [
                      'Review CCTV footage from surrounding intersections within 2 hours of incident',
                      'Conduct neighborhood inquiry and cross-examine suspect records',
                      'Issue alert to nearby police checkpoints'
                    ]).map((action, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 font-medium">
                        <div className="w-5 h-5 rounded-full bg-red-100 text-red-700 font-bold flex items-center justify-center shrink-0 text-[10px]">
                          {idx + 1}
                        </div>
                        <span>{action}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Right Column: AI Crime Link Analysis Section */}
              <div className="space-y-4 flex flex-col h-full">
                <div className="flex flex-col items-start gap-4 bg-indigo-50 border border-indigo-100 rounded-xl p-4 shrink-0">
                  <div>
                    <h4 className="text-sm font-bold text-indigo-900 flex items-center gap-2">
                      <Brain className="w-4 h-4" /> AI Crime Link Analysis
                    </h4>
                    <p className="text-xs text-indigo-700/70 mt-1">
                      Deploy AI to inspect knowledge graph structure and find missing links.
                    </p>
                  </div>
                  <button
                    onClick={async () => {
                      setAnalyzingGraph(true);
                      setGraphAnalysisResult('');
                      setSuggestedNodes([]);
                      setSuggestedLinks([]);
                      try {
                        const res = await fetch('/api/ai-link-analysis', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ 
                            entities, 
                            links, 
                            firDetails: { 
                              type: fir.type, 
                              description: fir.description, 
                              location: fir.location,
                              notes: fir.notes,
                              evidence: fir.evidence
                            } 
                          })
                        });
                        const data = await res.json();
                        if (data.analysis) {
                          setGraphAnalysisResult(data.analysis);
                          if (data.suggestedNodes) setSuggestedNodes(data.suggestedNodes);
                          if (data.suggestedLinks) setSuggestedLinks(data.suggestedLinks);
                        } else {
                          toast.error(data.error || 'Failed to analyze graph');
                        }
                      } catch(err) {
                        toast.error('AI Analysis failed');
                      } finally {
                        setAnalyzingGraph(false);
                      }
                    }}
                    disabled={analyzingGraph}
                    className="shrink-0 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-2 shadow-sm disabled:opacity-50 whitespace-nowrap"
                  >
                    {analyzingGraph ? <Loader2 className="w-4 h-4 animate-spin" /> : <Brain className="w-4 h-4" />}
                    {analyzingGraph ? 'Analyzing...' : 'Inspect with AI'}
                  </button>
                </div>

                {graphAnalysisResult && (
                  <div className="bg-slate-900 text-slate-100 rounded-xl p-5 border border-slate-800 shadow-inner relative max-h-[600px] flex flex-col flex-1">
                    <div className="flex justify-between items-center mb-4 shrink-0">
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
                    </div>
                    
                    <div className="overflow-y-auto pr-2 flex-1">
                      <div className="text-sm text-slate-300 leading-relaxed prose prose-invert prose-sm max-w-none mb-6">
                        <Markdown>{graphAnalysisResult}</Markdown>
                      </div>
                    
                    {((suggestedNodes && suggestedNodes.length > 0) || (suggestedLinks && suggestedLinks.length > 0)) && (
                      <div className="pt-5 border-t border-slate-800">
                        <h5 className="text-sm font-bold text-indigo-300 mb-4 uppercase tracking-wider flex items-center gap-2">
                          <Plus className="w-4 h-4" /> Suggested Additions
                        </h5>
                        <div className="flex flex-col gap-4">
                          {/* Nodes column */}
                          {suggestedNodes && suggestedNodes.length > 0 && (
                            <div className="space-y-3">
                              <h6 className="text-xs font-semibold text-slate-400 uppercase">Nodes</h6>
                              {suggestedNodes.map((node, idx) => (
                                <div key={idx} className="flex flex-col bg-slate-800/50 p-3 rounded-lg border border-slate-700/50 gap-2">
                                  <div className="flex items-center gap-2">
                                    <span className="font-bold text-slate-200">{node.id}</span>
                                    <span className="px-1.5 py-0.5 bg-slate-700 text-slate-300 text-[10px] uppercase rounded">{node.type}</span>
                                  </div>
                                  <p className="text-xs text-slate-400">{node.reason}</p>
                                  <button 
                                    onClick={() => {
                                      if (entities.find(e => e.id === node.id)) {
                                        toast.error('Entity already exists');
                                        return;
                                      }
                                      const newEntities = [...entities, { id: node.id, name: node.id, type: node.type }];
                                      updateFIREntities(fir.id, newEntities, links);
                                      toast.success('Added suggested entity');
                                      setSuggestedNodes(prev => prev.filter((_, i) => i !== idx));
                                    }}
                                    className="mt-1 w-full px-3 py-1.5 bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/40 rounded text-xs font-bold transition-colors text-center"
                                  >
                                    Add Node
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                          
                          {/* Links column */}
                          {suggestedLinks && suggestedLinks.length > 0 && (
                            <div className="space-y-3">
                              <h6 className="text-xs font-semibold text-slate-400 uppercase">Connections</h6>
                              {suggestedLinks.map((link, idx) => (
                                <div key={idx} className="flex flex-col bg-slate-800/50 p-3 rounded-lg border border-slate-700/50 gap-2">
                                  <div className="flex items-center gap-2 font-mono text-xs text-slate-300">
                                    <span className="font-bold text-slate-200 truncate" title={link.source}>{link.source}</span>
                                    <Share2 className="w-3 h-3 text-indigo-400 shrink-0" />
                                    <span className="font-bold text-slate-200 truncate" title={link.target}>{link.target}</span>
                                  </div>
                                  <p className="text-xs text-slate-400">{link.reason}</p>
                                  <button 
                                    onClick={() => {
                                      const sourceExists = entities.find(e => e.id === link.source);
                                      const targetExists = entities.find(e => e.id === link.target);
                                      if (!sourceExists || !targetExists) {
                                        toast.error('Both nodes must exist before adding a link');
                                        return;
                                      }
                                      const cleanLinks = (links || []).map(l => ({
                                        ...l,
                                        source: typeof l.source === 'object' ? (l.source as any).id : l.source,
                                        target: typeof l.target === 'object' ? (l.target as any).id : l.target
                                      }));
                                      const newLinks = [...cleanLinks, { source: link.source, target: link.target, value: 2 }];
                                      updateFIREntities(fir.id, entities, newLinks);
                                      toast.success('Added suggested link');
                                      setSuggestedLinks(prev => prev.filter((_, i) => i !== idx));
                                    }}
                                    className="mt-1 w-full px-3 py-1.5 bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/40 rounded text-xs font-bold transition-colors text-center"
                                  >
                                    Add Link
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: CASE NOTES */}
          {activeTab === 'notes' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <form onSubmit={handleAddNote} className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Add Official Investigation Note</label>
                <textarea 
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  placeholder="Record case updates, witness statements, or field findings..."
                  className="w-full text-xs p-3 bg-white border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-primary min-h-[80px]"
                />
                <div className="flex justify-end">
                  <button 
                    type="submit" 
                    className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-lg shadow-sm hover:opacity-90 transition-opacity flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" /> Save Note
                  </button>
                </div>
              </form>

              <div className="space-y-3">
                <h4 className="font-bold text-xs uppercase text-slate-500 tracking-wider">Investigation Log Timeline</h4>
                {(!fir.notes || fir.notes.length === 0) ? (
                  <div className="text-center py-8 text-xs text-slate-400 font-medium">No notes recorded yet for this case.</div>
                ) : (
                  fir.notes.map((note) => (
                    <div key={note.id} className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-sm space-y-1">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-slate-800">{note.authorName}</span>
                        <span className="text-[10px] text-slate-400">{format(new Date(note.createdAt), 'MMM dd, HH:mm')}</span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">{note.content}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 5: EVIDENCE VAULT */}
          {activeTab === 'evidence' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {(user?.role === 'officer' || user?.role === 'admin') && (
                <form onSubmit={handleAddEvidence} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Link Digital Evidence File</label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={evidenceTitle}
                      onChange={(e) => setEvidenceTitle(e.target.value)}
                      placeholder="Evidence Title (e.g. CCTV Gate Footage)"
                      className="flex-1 text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-primary font-medium"
                    />
                    <select 
                      value={evidenceType}
                      onChange={(e) => setEvidenceType(e.target.value as any)}
                      className="text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-primary font-semibold"
                    >
                      <option value="video">Video Footage</option>
                      <option value="image">Image / Photo</option>
                      <option value="document">Document File</option>
                    </select>
                    <button 
                      type="submit"
                      className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-lg shadow-sm hover:opacity-90 transition-opacity flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" /> Attach
                    </button>
                  </div>
                </form>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(!fir.evidence || fir.evidence.length === 0) ? (
                  <div className="col-span-full text-center py-8 text-xs text-slate-400 font-medium">No evidence files attached to this case.</div>
                ) : (
                  fir.evidence.map((ev) => (
                    <div key={ev.id} className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center">
                          {ev.type === 'video' ? <Video className="w-5 h-5 text-indigo-600" /> :
                           ev.type === 'image' ? <Image className="w-5 h-5 text-emerald-600" /> :
                           <File className="w-5 h-5 text-amber-600" />}
                        </div>
                        <div>
                          <h5 className="font-bold text-xs text-slate-800">{ev.title}</h5>
                          <span className="text-[10px] text-slate-400 uppercase font-semibold">{ev.type} File</span>
                        </div>
                      </div>
                      <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded text-[10px] font-bold">Verified</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-between items-center">
          <span className="text-xs font-semibold text-slate-500">Case ID: {fir.id}</span>
          <div className="flex gap-3">
            <button
              onClick={() => generateFIRPdf(fir, user)}
              className="px-4 py-2 bg-white border border-slate-300 rounded-xl text-primary text-xs font-bold hover:bg-slate-50 shadow-sm flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-4 h-4" /> Download Official FIR PDF
            </button>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-primary text-white rounded-xl text-xs font-bold shadow-sm hover:opacity-90 transition-opacity"
            >
              Close
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
