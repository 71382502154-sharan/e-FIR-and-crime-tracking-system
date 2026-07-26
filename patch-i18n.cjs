const fs = require('fs');
let file = fs.readFileSync('src/pages/CitizenDashboard.tsx', 'utf8');

file = file.replace(
  "import { Building2 } from 'lucide-react';",
  "import { Building2, Map as MapIcon } from 'lucide-react';\nimport AnalyticsDashboard from '../components/AnalyticsDashboard';"
);

file = file.replace(
  "const [isPoliceStationsOpen, setIsPoliceStationsOpen] = useState(false);",
  "const [isPoliceStationsOpen, setIsPoliceStationsOpen] = useState(false);\n  const [activeTab, setActiveTab] = useState<'home' | 'heatmap'>('home');"
);

// We need to wrap the existing main content in activeTab === 'home'
// Let's find a unique string to replace
file = file.replace(
  "{/* Welcome Banner */}",
  "{activeTab === 'home' ? (\n          <>\n        {/* Welcome Banner */}"
);

file = file.replace(
  "              </div>\n            )}\n          </div>\n        </section>\n      </main>",
  "              </div>\n            )}\n          </div>\n        </section>\n          </>\n        ) : (\n          <div className=\"mt-4\">\n            <AnalyticsDashboard readOnly={true} />\n          </div>\n        )}\n      </main>"
);

// Add Heatmap to Desktop menu
const desktopMenuFind = `<button className="flex items-center gap-3 px-4 py-3 bg-white/50 text-primary font-bold rounded-xl shadow-sm border border-white/40 text-sm">
            <LayoutDashboard className="w-5 h-5 fill-primary/20" /> {text['nav.home']}
          </button>
          <button className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-white/40 hover:translate-x-1 transition-all duration-200 rounded-xl text-sm font-semibold">
            <FolderOpen className="w-5 h-5" /> {text['nav.myCases']}
          </button>`;

const desktopMenuReplace = `<button 
            onClick={() => setActiveTab('home')}
            className={\`flex items-center gap-3 px-4 py-3 font-bold rounded-xl shadow-sm border text-sm \${activeTab === 'home' ? 'bg-white/50 text-primary border-white/40' : 'text-on-surface-variant border-transparent hover:bg-white/40 hover:translate-x-1 transition-all duration-200'}\`}>
            <LayoutDashboard className={\`w-5 h-5 \${activeTab === 'home' ? 'fill-primary/20' : ''}\`} /> {text['nav.home']}
          </button>
          <button 
            onClick={() => setActiveTab('heatmap')}
            className={\`flex items-center gap-3 px-4 py-3 font-bold rounded-xl shadow-sm border text-sm \${activeTab === 'heatmap' ? 'bg-white/50 text-primary border-white/40' : 'text-on-surface-variant border-transparent hover:bg-white/40 hover:translate-x-1 transition-all duration-200'}\`}>
            <MapIcon className={\`w-5 h-5 \${activeTab === 'heatmap' ? 'fill-primary/20' : ''}\`} /> Heatmap
          </button>`;
          
file = file.replace(desktopMenuFind, desktopMenuReplace);

// Add Heatmap to Mobile menu
const mobileMenuFind = `<button className="flex flex-col items-center text-primary font-bold">
          <LayoutDashboard className="w-6 h-6 fill-primary/20" />
          <span className="text-[10px] mt-1 font-semibold">{text['nav.home']}</span>
        </button>
        <button className="flex flex-col items-center text-on-surface-variant">
          <FolderOpen className="w-6 h-6" />
          <span className="text-[10px] mt-1 font-semibold">{text['nav.myCases']}</span>
        </button>`;
        
const mobileMenuReplace = `<button onClick={() => setActiveTab('home')} className={\`flex flex-col items-center \${activeTab === 'home' ? 'text-primary font-bold' : 'text-on-surface-variant'}\`}>
          <LayoutDashboard className={\`w-6 h-6 \${activeTab === 'home' ? 'fill-primary/20' : ''}\`} />
          <span className="text-[10px] mt-1 font-semibold">{text['nav.home']}</span>
        </button>
        <button onClick={() => setActiveTab('heatmap')} className={\`flex flex-col items-center \${activeTab === 'heatmap' ? 'text-primary font-bold' : 'text-on-surface-variant'}\`}>
          <MapIcon className={\`w-6 h-6 \${activeTab === 'heatmap' ? 'fill-primary/20' : ''}\`} />
          <span className="text-[10px] mt-1 font-semibold">Heatmap</span>
        </button>`;
        
file = file.replace(mobileMenuFind, mobileMenuReplace);

fs.writeFileSync('src/pages/CitizenDashboard.tsx', file);
