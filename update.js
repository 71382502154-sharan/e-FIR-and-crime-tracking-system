const fs = require('fs');
const content = fs.readFileSync('src/components/FIRDetailsModal.tsx', 'utf8');

const targetStart = `          {/* TAB 3: AI CASE INTELLIGENCE */}`;
const targetEnd = `          {/* TAB 4: CASE NOTES */}`;

const startIndex = content.indexOf(targetStart);
const endIndex = content.indexOf(targetEnd);

if (startIndex === -1 || endIndex === -1) {
  console.error('Could not find target strings');
  process.exit(1);
}

const replacement = `          {/* TAB 3: AI CASE INTELLIGENCE */}
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
                      {fir.aiAnalysis?.summary || \`Pattern analysis indicates potential correlation with recent \${fir.type} incidents reported across adjacent precincts.\`}
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
                <div className="flex justify-between items-center bg-indigo-50 border border-indigo-100 rounded-xl p-4 shrink-0">
                  <div>
                    <h4 className="text-sm font-bold text-indigo-900 flex items-center gap-2">
                      <Brain className="w-4 h-4" /> AI Crime Link Analysis
                    </h4>
                    <p className="text-xs text-indigo-700/70 mt-1">
                      Deploy CBI-grade AI detective to inspect knowledge graph structure and find missing links.
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
                    className="ml-3 shrink-0 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-2 shadow-sm disabled:opacity-50 whitespace-nowrap"
                  >
                    {analyzingGraph ? <Loader2 className="w-4 h-4 animate-spin" /> : <Brain className="w-4 h-4" />}
                    {analyzingGraph ? 'Analyzing...' : 'Inspect with AI'}
                  </button>
                </div>

                {graphAnalysisResult && (
                  <div className="bg-slate-900 text-slate-100 rounded-xl p-5 border border-slate-800 shadow-inner relative max-h-[600px] flex flex-col flex-1">
                    <button 
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
                      <ShieldAlert className="w-4 h-4" /> CBI Detective Report
                    </h4>
                    
                    <div className="overflow-y-auto custom-scrollbar pr-2 flex-1">
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
\n`;

const newContent = content.substring(0, startIndex) + replacement + content.substring(endIndex);
fs.writeFileSync('src/components/FIRDetailsModal.tsx', newContent);
console.log('Successfully updated AI tab layout.');
