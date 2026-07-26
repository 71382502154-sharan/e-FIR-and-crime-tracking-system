const fs = require('fs');
let file = fs.readFileSync('src/pages/PoliceDashboard.tsx', 'utf8');

// replace the button text
file = file.replace(
  "<Download className=\"w-4 h-4\" /> {text['police.report']}",
  "<Download className=\"w-4 h-4\" /> Generate Report PDF"
);

// replace evidence vault section
const oldVault = `        {/* Evidence Vault Section */}
        {activeTab === 'evidenceVault' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white/60 backdrop-blur-xl rounded-xl border border-white/50 shadow-[0_8px_32px_rgba(31,38,135,0.07)] p-4 flex flex-col items-center text-center hover-lift cursor-pointer">
                <div className="w-16 h-16 bg-primary-container/20 rounded-full flex items-center justify-center mb-4 shadow-sm">
                  <Archive className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-semibold text-on-surface">Case #{1042 - i}</h3>
                <p className="text-xs text-on-surface-variant mt-1 font-medium">{Math.floor(Math.random() * 5) + 1} files • {Math.floor(Math.random() * 50) + 1}MB</p>
                <div className="mt-4 pt-4 border-t border-white/30 w-full flex justify-between items-center text-primary">
                  <span className="text-xs font-bold">View Vault</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            ))}
          </div>
        )}`;

const newVault = `        {/* Evidence Vault Section */}
        {activeTab === 'evidenceVault' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[
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
            ))}
          </div>
        )}`;

file = file.replace(oldVault, newVault);

fs.writeFileSync('src/pages/PoliceDashboard.tsx', file);
