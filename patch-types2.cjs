const fs = require('fs');
let file = fs.readFileSync('src/pages/PoliceDashboard.tsx', 'utf8');

file = file.replace(
  "import AnalyticsDashboard from '../components/AnalyticsDashboard';",
  "import AnalyticsDashboard from '../components/AnalyticsDashboard';\nimport VaultModal from '../components/VaultModal';"
);

file = file.replace(
  "const [activeTab, setActiveTab] = useState<'home' | 'myCases' | 'evidenceVault' | 'analytics'>('home');",
  "const [activeTab, setActiveTab] = useState<'home' | 'myCases' | 'evidenceVault' | 'analytics'>('home');\n  const [vaultCaseId, setVaultCaseId] = useState<string | null>(null);"
);

const vaultFind = `{[
              { case: '1041', files: 2, size: 32 },
              { case: '1040', files: 3, size: 4 },
              { case: '1039', files: 3, size: 34 },
              { case: '1038', files: 2, size: 17 },
              { case: '1037', files: 3, size: 21 },
              { case: '1036', files: 1, size: 11 }
            ].map((item, i) => (
              <div key={i} className="bg-white/60 backdrop-blur-xl rounded-xl border border-white/50 shadow-[0_8px_32px_rgba(31,38,135,0.07)] p-4 flex flex-col items-center text-center hover-lift cursor-pointer">
                <div className="w-16 h-16 bg-primary-container/20 rounded-full flex items-center justify-center mb-4 shadow-sm">
                  <Archive className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-semibold text-on-surface">Case #{item.case}</h3>
                <p className="text-xs text-on-surface-variant mt-1 font-medium">{item.files} files • {item.size}MB</p>
                <div className="mt-4 pt-4 border-t border-white/30 w-full flex justify-between items-center text-primary">
                  <span className="text-xs font-bold">View Vault</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            ))}`;

const vaultReplace = `{[
              { case: '1041', files: 2, size: 32 },
              { case: '1040', files: 3, size: 4 },
              { case: '1039', files: 3, size: 34 },
              { case: '1038', files: 2, size: 17 },
              { case: '1037', files: 3, size: 21 },
              { case: '1036', files: 1, size: 11 }
            ].map((item, i) => (
              <div key={i} onClick={() => setVaultCaseId(item.case)} className="bg-white/60 backdrop-blur-xl rounded-xl border border-white/50 shadow-[0_8px_32px_rgba(31,38,135,0.07)] p-4 flex flex-col items-center text-center hover-lift cursor-pointer transition-all hover:bg-white/80 active:scale-[0.98]">
                <div className="w-16 h-16 bg-primary-container/20 rounded-full flex items-center justify-center mb-4 shadow-sm">
                  <Archive className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-semibold text-on-surface">Case #{item.case}</h3>
                <p className="text-xs text-on-surface-variant mt-1 font-medium">{item.files} files • {item.size}MB</p>
                <div className="mt-4 pt-4 border-t border-white/30 w-full flex justify-between items-center text-primary">
                  <span className="text-xs font-bold">View Vault</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            ))}`;

file = file.replace(vaultFind, vaultReplace);

const modalsFind = `<FIRDetailsModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        fir={selectedFir}
        user={user}
        onStatusChange={updateFIRStatus}
      />`;

const modalsReplace = `<FIRDetailsModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        fir={selectedFir}
        user={user}
        onStatusChange={updateFIRStatus}
      />
      <VaultModal 
        isOpen={!!vaultCaseId}
        onClose={() => setVaultCaseId(null)}
        caseId={vaultCaseId || ''}
      />`;

file = file.replace(modalsFind, modalsReplace);

fs.writeFileSync('src/pages/PoliceDashboard.tsx', file);
