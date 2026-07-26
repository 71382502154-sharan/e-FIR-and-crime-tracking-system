import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { Bell, Menu, LayoutDashboard, FolderOpen, Archive, Scale, Download, FileText, Clock, AlertTriangle, TrendingUp, Search, Eye, UserPlus, Edit, CheckCircle, XCircle, ChevronLeft, ChevronRight, HelpCircle, Phone } from 'lucide-react';
import { useAppStore } from '../store/appStore';
import { format } from 'date-fns';
import { FIR, FIRStatus } from '../types';
import { cn } from '../lib/utils';
import { t } from '../lib/i18n';
import LanguageSelector from '../components/LanguageSelector';
import { generatePoliceReportPdf } from '../lib/pdfGenerator';
import FIRDetailsModal from '../components/FIRDetailsModal';
import LegalLibraryModal from '../components/LegalLibraryModal';
import ProfileModal from '../components/ProfileModal';
import NotificationsModal from '../components/NotificationsModal';
import AnalyticsDashboard from '../components/AnalyticsDashboard';
import VaultModal from '../components/VaultModal';
import HelpContactModal from '../components/HelpContactModal';

const DashboardCharts = React.lazy(() => import('../components/DashboardCharts'));

export default function PoliceDashboard() {
  const navigate = useNavigate();
  const { user, firs, logout, updateFIRStatus, language, setLanguage, registeredUsers } = useAppStore();
  const text = t[language];
  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [selectedFir, setSelectedFir] = useState<FIR | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLegalLibraryOpen, setIsLegalLibraryOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'home' | 'myCases' | 'evidenceVault' | 'analytics'>('home');
  const [vaultCaseId, setVaultCaseId] = useState<string | null>(null);

  if (!user || user.role !== 'officer') {
    return <Navigate to="/" replace />;
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const currentDate = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const filteredFirs = firs.filter(f => 
    (searchQuery === '' || f.firNumber.toLowerCase().includes(searchQuery.toLowerCase()) || f.title.toLowerCase().includes(searchQuery.toLowerCase())) &&
    (severityFilter === '' || f.severity.toLowerCase() === severityFilter.toLowerCase()) &&
    (typeFilter === '' || f.type.toLowerCase().includes(typeFilter.toLowerCase())) &&
    (activeTab === 'myCases' ? (f.status === 'Under Investigation' || f.status === 'Verified & Active') : true)
  );

  const pendingCount = firs.filter(f => f.status === 'Pending Verification').length;
  const emergencyCount = firs.filter(f => f.severity === 'High').length;

  return (
    <div className="min-h-screen flex font-sans antialiased text-[#1a1c1c] relative">
      {/* Background Image */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-fixed z-0"
        style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCERFN6LeKGNLL6U_6wq7LaYEg-8ahhVJF2UksEHEEOYYF-b3IcEpbgYjMBfMfCS_e53sngU_leon5YbH6dF4LhYrom0QT5f1vDS0N-g96xVi7nm9JC-MhkJlT2WPOjuDbmmUw1c43lwLQh2Pl2VU0FyV8MJqM1nlqL-U1_YMRdKD2VHmM0b30UYTiAzf3f8UJ0y8g4dy3QXxoAiYlWMRxBliQW4b_8sDiDzEj0FAXh2hQXws92jKt9JDA3qM1hOMZ3Rg")'}}
      />

      {/* Top App Bar (Mobile) */}
      <header className="md:hidden fixed top-0 w-full z-50 flex justify-between items-center px-4 h-16 bg-white/40 backdrop-blur-xl border-b border-white/40 shadow-sm">
        <div className="flex items-center gap-2">
          <img src="/karnataka-logo.svg" alt="Logo" className="w-8 h-8 object-contain" />
          <h1 className="text-xl font-display font-bold text-primary">KSP FIR System</h1>
        </div>
        <div className="flex items-center gap-4 text-primary">
          <button onClick={() => setIsNotificationsOpen(true)}><Bell className="w-6 h-6" /></button>
          <button><Menu className="w-6 h-6" /></button>
        </div>
      </header>

      {/* Main Canvas */}
      <main className="flex-1 md:ml-64 md:mr-0 pt-20 md:pt-8 p-4 md:p-8 lg:p-12 min-h-screen relative z-10 w-full max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="relative z-50 flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 bg-white/60 backdrop-blur-md p-6 rounded-2xl border border-white/50 shadow-sm">
          <div>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-on-surface mb-2">
              {activeTab === 'home' ? text['police.dashboard'] : activeTab === 'myCases' ? 'My Cases' : activeTab === 'analytics' ? 'Analytics Dashboard' : 'Evidence Vault'}
            </h1>
            <p className="text-base text-on-surface-variant">{text['police.zone']} • {currentDate}</p>
          </div>
          <div className="flex gap-3">
            <LanguageSelector variant="outline" />
            <button 
              onClick={() => generatePoliceReportPdf(filteredFirs, user)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg text-sm font-semibold hover:opacity-90 transition-all shadow-[0_4px_14px_0_rgba(0,118,255,0.39)]"
            >
              <Download className="w-4 h-4" /> Generate Report PDF
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        {activeTab === 'home' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Stat 1 */}
          <div className="bg-white/60 backdrop-blur-xl rounded-xl p-6 border border-white/50 shadow-[0_8px_32px_rgba(31,38,135,0.07)] flex flex-col justify-between hover-lift">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-primary-container/20 rounded-lg">
                <FileText className="w-6 h-6 text-primary fill-primary/20" />
              </div>
              <span className="text-xs text-on-surface-variant bg-white/50 backdrop-blur-sm px-2 py-1 rounded-full border border-white/30 font-semibold">{text['police.total']}</span>
            </div>
            <div>
              <h3 className="text-4xl font-display font-bold text-on-surface">{firs.length}</h3>
              <p className="text-xs text-green-700 font-bold flex items-center gap-1 mt-1">
                <TrendingUp className="w-3.5 h-3.5" /> +12% this week
              </p>
            </div>
          </div>

          {/* Stat 2 */}
          <div className="bg-white/60 backdrop-blur-xl rounded-xl p-6 border border-white/50 shadow-[0_8px_32px_rgba(31,38,135,0.07)] flex flex-col justify-between relative overflow-hidden hover-lift">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-yellow-400/20 rounded-full blur-xl"></div>
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div className="p-2 bg-secondary-container/50 rounded-lg">
                <Clock className="w-6 h-6 text-secondary fill-secondary/20" />
              </div>
              <span className="text-xs text-on-surface-variant bg-white/50 backdrop-blur-sm px-2 py-1 rounded-full border border-white/30 font-semibold">{text['police.pending']}</span>
            </div>
            <div className="relative z-10">
              <h3 className="text-4xl font-display font-bold text-on-surface">{pendingCount}</h3>
              <p className="text-xs text-on-surface-variant mt-1 font-semibold">Requires immediate review</p>
            </div>
          </div>

          {/* Stat 3 */}
          <div className="bg-red-50/70 backdrop-blur-xl rounded-xl p-6 border border-red-200/50 shadow-[0_8px_32px_rgba(255,0,0,0.1)] flex flex-col justify-between hover-lift">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-red-600 fill-red-600/20" />
              </div>
              <span className="text-xs text-red-600 font-bold bg-white/60 backdrop-blur-sm px-2 py-1 rounded-full border border-red-200 animate-pulse">{text['police.emergency']}</span>
            </div>
            <div>
              <h3 className="text-4xl font-display font-bold text-red-600">{emergencyCount}</h3>
              <p className="text-xs text-red-800 mt-1 font-semibold">Active severe incidents</p>
            </div>
          </div>
        </div>
        )}

        {/* Charts Section */}
        {activeTab === 'home' && (
          <React.Suspense fallback={<div className="h-64 flex items-center justify-center">Loading charts...</div>}>
            <DashboardCharts firs={firs} />
          </React.Suspense>
        )}

        {/* Table Section */}
        {(activeTab === 'home' || activeTab === 'myCases') && (
        <div className="bg-white/60 backdrop-blur-xl rounded-xl border border-white/50 shadow-[0_8px_32px_rgba(31,38,135,0.07)] overflow-hidden">
          <div className="p-6 border-b border-white/40 bg-white/30 flex flex-col md:flex-row justify-between items-center gap-4">
            <h2 className="text-xl font-display font-bold text-on-surface whitespace-nowrap">{text['police.active']}</h2>
            <div className="flex flex-row items-center gap-3 w-full justify-end flex-wrap">
              <div className="relative flex-grow max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant" />
                <input 
                  className="w-full pl-10 pr-4 py-2 border border-white/50 rounded-full bg-white/50 backdrop-blur-sm text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors shadow-inner outline-none" 
                  placeholder="Search FIR No..." 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <select 
                className="border border-white/50 rounded-full px-4 py-2 bg-white/50 backdrop-blur-sm text-sm text-on-surface focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-sm outline-none font-semibold"
                value={severityFilter}
                onChange={(e) => setSeverityFilter(e.target.value)}
              >
                <option value="">All Severities</option>
                <option value="high">High Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="low">Low Priority</option>
              </select>
              <select 
                className="border border-white/50 rounded-full px-4 py-2 bg-white/50 backdrop-blur-sm text-sm text-on-surface focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-sm outline-none font-semibold"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                <option value="">All Types</option>
                <option value="theft">Theft</option>
                <option value="fraud">Fraud</option>
                <option value="robbery">Robbery</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/40 text-sm font-semibold text-on-surface-variant border-b border-white/40">
                  <th className="p-4">FIR No.</th>
                  <th className="p-4">Complainant</th>
                  <th className="p-4">Date Filed</th>
                  <th className="p-4">Type</th>
                  <th className="p-4">Severity</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm bg-white/20 font-medium">
                {filteredFirs.map((fir) => (
                  <tr key={fir.id} className="border-b border-white/30 hover:bg-white/40 transition-colors group">
                    <td className="p-4 font-bold text-primary">{fir.firNumber}</td>
                    <td className="p-4 font-semibold text-slate-700">{registeredUsers.find(u => u.id === fir.userId)?.name || 'Unknown'}</td>
                    <td className="p-4 text-on-surface-variant">{format(new Date(fir.dateFiled), 'MMM dd, HH:mm a')}</td>
                    <td className="p-4">{fir.title}</td>
                    <td className="p-4">
                      <span className={cn(
                        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold border",
                        fir.severity === 'High' ? "bg-red-100 text-red-700 border-red-200" :
                        fir.severity === 'Medium' ? "bg-yellow-100 text-yellow-800 border-yellow-200" :
                        "bg-gray-100 text-gray-700 border-gray-200"
                      )}>
                        <span className={cn(
                          "w-1.5 h-1.5 rounded-full",
                          fir.severity === 'High' ? "bg-red-600" :
                          fir.severity === 'Medium' ? "bg-yellow-500" : "bg-gray-500"
                        )}></span> {fir.severity}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={cn(
                        "text-xs font-semibold",
                        fir.status === 'Pending Assignment' ? "text-secondary font-bold" : "text-on-surface-variant"
                      )}>{fir.status}</span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2 transition-opacity">
                        <button 
                          onClick={() => {
                            setSelectedFir(fir);
                            setIsModalOpen(true);
                          }}
                          className="p-2 text-primary hover:bg-white/60 rounded-full transition-colors" 
                          title="View Details"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        {fir.status === 'Pending Verification' ? (
                          <>
                            <button onClick={() => updateFIRStatus(fir.id, 'Pending Assignment')} className="p-2 text-green-600 hover:bg-white/60 rounded-full transition-colors" title="Approve">
                              <CheckCircle className="w-5 h-5" />
                            </button>
                            <button onClick={() => updateFIRStatus(fir.id, 'Closed')} className="p-2 text-red-600 hover:bg-white/60 rounded-full transition-colors" title="Reject">
                              <XCircle className="w-5 h-5" />
                            </button>
                          </>
                        ) : fir.status === 'Pending Assignment' ? (
                          <button onClick={() => updateFIRStatus(fir.id, 'Under Investigation')} className="p-2 text-on-surface-variant hover:bg-white/60 rounded-full transition-colors" title="Assign Officer">
                            <UserPlus className="w-5 h-5" />
                          </button>
                        ) : (
                          <button className="p-2 text-on-surface-variant hover:bg-white/60 rounded-full transition-colors" title="Update Status">
                            <Edit className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-4 border-t border-white/40 bg-white/30 flex items-center justify-between">
            <span className="text-xs font-semibold text-on-surface-variant">Showing 1 to {firs.length} of {firs.length} entries</span>
            <div className="flex gap-1 items-center">
              <button className="p-1 text-on-surface-variant hover:bg-white/50 rounded-full disabled:opacity-50" disabled><ChevronLeft className="w-5 h-5" /></button>
              <button className="px-3 py-1 bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-md text-sm font-bold rounded-full">1</button>
              <button className="px-3 py-1 text-on-surface-variant hover:bg-white/50 text-sm font-semibold rounded-full">2</button>
              <button className="px-3 py-1 text-on-surface-variant hover:bg-white/50 text-sm font-semibold rounded-full">3</button>
              <button className="p-1 text-on-surface-variant hover:bg-white/50 rounded-full"><ChevronRight className="w-5 h-5" /></button>
            </div>
          </div>
        </div>
        )}

        {/* Evidence Vault Section */}
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
            ))}
          </div>
        )}

        {/* Analytics Section */}
        {activeTab === 'analytics' && (
          <AnalyticsDashboard />
        )}

      </main>

      {/* SideNavBar (Desktop) */}
      <nav className="hidden md:flex flex-col h-screen w-64 fixed left-0 top-0 py-2 gap-2 bg-white/40 backdrop-blur-xl border-r border-white/40 shadow-[10px_0_30px_rgba(0,0,0,0.05)] z-40">
        <div className="px-6 py-4 flex flex-col items-center border-b border-white/30 mb-4 cursor-pointer hover:bg-white/20 transition-colors rounded-xl mx-2" onClick={() => setIsProfileOpen(true)} title="Edit Profile">
          <div className="w-20 h-20 flex items-center justify-center mb-3">
            <img src="/karnataka-logo.svg" alt="Karnataka Logo" className="w-full h-full object-contain drop-shadow-md" />
          </div>
          <h2 className="text-xl font-display font-bold text-primary text-center">{user?.name || 'Officer'}</h2>
          <p className="text-xs font-semibold text-on-surface-variant text-center">{user?.station || 'Central Zone, KA'}</p>
          <div className="text-xs text-on-surface-variant font-medium cursor-pointer hover:underline mt-2" onClick={(e) => { e.stopPropagation(); handleLogout(); }}>Log Out</div>
        </div>

        <div className="flex-1 px-4 flex flex-col gap-1 overflow-y-auto">
          <button onClick={() => setActiveTab('home')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-200 ${activeTab === 'home' ? 'bg-white/50 backdrop-blur-sm text-primary font-bold shadow-sm border border-white/40' : 'text-on-surface-variant hover:bg-white/40 hover:translate-x-1'}`}>
            <LayoutDashboard className={`w-5 h-5 ${activeTab === 'home' ? 'fill-primary/20' : ''}`} /> Home
          </button>
          <button onClick={() => setActiveTab('myCases')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-200 ${activeTab === 'myCases' ? 'bg-white/50 backdrop-blur-sm text-primary font-bold shadow-sm border border-white/40' : 'text-on-surface-variant hover:bg-white/40 hover:translate-x-1'}`}>
            <FolderOpen className={`w-5 h-5 ${activeTab === 'myCases' ? 'fill-primary/20' : ''}`} /> My Cases
          </button>
          <button onClick={() => setActiveTab('evidenceVault')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-200 ${activeTab === 'evidenceVault' ? 'bg-white/50 backdrop-blur-sm text-primary font-bold shadow-sm border border-white/40' : 'text-on-surface-variant hover:bg-white/40 hover:translate-x-1'}`}>
            <Archive className={`w-5 h-5 ${activeTab === 'evidenceVault' ? 'fill-primary/20' : ''}`} /> Evidence Vault
          </button>
          <button onClick={() => setActiveTab('analytics')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-200 ${activeTab === 'analytics' ? 'bg-white/50 backdrop-blur-sm text-primary font-bold shadow-sm border border-white/40' : 'text-on-surface-variant hover:bg-white/40 hover:translate-x-1'}`}>
            <TrendingUp className={`w-5 h-5 ${activeTab === 'analytics' ? 'fill-primary/20' : ''}`} /> Analytics
          </button>
          <button 
            onClick={() => setIsLegalLibraryOpen(true)}
            className="w-full flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-white/40 hover:translate-x-1 transition-all duration-200 rounded-lg text-sm font-semibold"
          >
            <Scale className="w-5 h-5" /> Legal Library
          </button>
        </div>

        <div className="px-4 pt-4 border-t border-white/30 flex flex-col gap-1 pb-4">
          <button 
            onClick={() => setIsHelpOpen(true)}
            className="w-full flex items-center gap-3 px-4 py-2 text-on-surface-variant hover:bg-white/40 hover:translate-x-1 transition-all duration-200 rounded-lg text-sm font-semibold text-left"
          >
            <HelpCircle className="w-5 h-5" /> Help Center
          </button>
          <button 
            onClick={() => setIsContactOpen(true)}
            className="w-full flex items-center gap-3 px-4 py-2 text-on-surface-variant hover:bg-white/40 hover:translate-x-1 transition-all duration-200 rounded-lg text-sm font-semibold text-left"
          >
            <Phone className="w-5 h-5" /> Contact Admin
          </button>
        </div>

        <div className="px-4 py-4 border-t border-white/30">
          <button 
            onClick={() => navigate('/file-fir')}
            className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-3 rounded-lg text-sm font-bold shadow-[0_4px_14px_rgba(0,118,255,0.39)] hover:shadow-[0_6px_20px_rgba(0,118,255,0.23)] hover:-translate-y-0.5 transition-all"
          >
            File New Case
          </button>
        </div>
      </nav>

      {vaultCaseId && (
        <VaultModal
          isOpen={!!vaultCaseId}
          onClose={() => setVaultCaseId(null)}
          caseId={vaultCaseId}
        />
      )}
      <FIRDetailsModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        fir={selectedFir}
        user={user}
      />
      <LegalLibraryModal
        isOpen={isLegalLibraryOpen}
        onClose={() => setIsLegalLibraryOpen(false)}
      />
      
      <HelpContactModal 
        isOpen={isHelpOpen} 
        onClose={() => setIsHelpOpen(false)} 
        type="help" 
      />
      <HelpContactModal 
        isOpen={isContactOpen} 
        onClose={() => setIsContactOpen(false)} 
        type="contact" 
      />

      {isProfileOpen && <ProfileModal onClose={() => setIsProfileOpen(false)} />}
      <NotificationsModal isOpen={isNotificationsOpen} onClose={() => setIsNotificationsOpen(false)} />
    </div>
  );
}
