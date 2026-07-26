const fs = require('fs');
let file = fs.readFileSync('src/pages/CitizenDashboard.tsx', 'utf8');

file = file.replace(
  "import ProfileModal from '../components/ProfileModal';",
  "import ProfileModal from '../components/ProfileModal';\nimport PoliceStationsModal from '../components/PoliceStationsModal';\nimport { Building2 } from 'lucide-react';"
);

file = file.replace(
  "const [isProfileOpen, setIsProfileOpen] = useState(false);",
  "const [isProfileOpen, setIsProfileOpen] = useState(false);\n  const [isPoliceStationsOpen, setIsPoliceStationsOpen] = useState(false);"
);

// Desktop menu
const desktopMenuFind = `<button 
            onClick={() => setIsLegalLibraryOpen(true)}
            className="w-full flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-white/40 hover:translate-x-1 transition-all duration-200 rounded-xl text-sm font-semibold"
          >
            <HelpCircle className="w-5 h-5" /> {text['nav.help']}
          </button>`;
          
const desktopMenuReplace = `<button 
            onClick={() => setIsPoliceStationsOpen(true)}
            className="w-full flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-white/40 hover:translate-x-1 transition-all duration-200 rounded-xl text-sm font-semibold"
          >
            <Building2 className="w-5 h-5" /> Police Stations
          </button>
          <button 
            onClick={() => setIsLegalLibraryOpen(true)}
            className="w-full flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-white/40 hover:translate-x-1 transition-all duration-200 rounded-xl text-sm font-semibold"
          >
            <HelpCircle className="w-5 h-5" /> {text['nav.help']}
          </button>`;
          
file = file.replace(desktopMenuFind, desktopMenuReplace);

// Mobile menu
const mobileMenuFind = `<button 
          onClick={() => setIsLegalLibraryOpen(true)}
          className="flex flex-col items-center text-on-surface-variant"
        >
          <HelpCircle className="w-6 h-6" />
          <span className="text-[10px] mt-1 font-semibold">{text['nav.help']}</span>
        </button>`;

const mobileMenuReplace = `<button 
          onClick={() => setIsPoliceStationsOpen(true)}
          className="flex flex-col items-center text-on-surface-variant"
        >
          <Building2 className="w-6 h-6" />
          <span className="text-[10px] mt-1 font-semibold">Stations</span>
        </button>
        <button 
          onClick={() => setIsLegalLibraryOpen(true)}
          className="flex flex-col items-center text-on-surface-variant"
        >
          <HelpCircle className="w-6 h-6" />
          <span className="text-[10px] mt-1 font-semibold">{text['nav.help']}</span>
        </button>`;
        
file = file.replace(mobileMenuFind, mobileMenuReplace);

const modalsFind = `<FIRDetailsModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        fir={selectedFir}
        user={user}
      />`;
      
const modalsReplace = `<FIRDetailsModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        fir={selectedFir}
        user={user}
      />
      <PoliceStationsModal 
        isOpen={isPoliceStationsOpen}
        onClose={() => setIsPoliceStationsOpen(false)}
      />`;
      
file = file.replace(modalsFind, modalsReplace);

fs.writeFileSync('src/pages/CitizenDashboard.tsx', file);
