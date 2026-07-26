import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { Shield, Users, Search, UserCircle, Building2, BarChart3, FileText, Brain } from 'lucide-react';
import { useAppStore } from '../store/appStore';
import AnalyticsDashboard from '../components/AnalyticsDashboard';
import { policeStations } from '../data/policeStations';
import FIRDetailsModal from '../components/FIRDetailsModal';
import { FIR } from '../types';
import { format } from 'date-fns';
import { cn } from '../lib/utils';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user, registeredUsers, firs, logout } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'users' | 'cases' | 'stations' | 'analytics'>('cases');
  const [selectedFir, setSelectedFir] = useState<FIR | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!user || user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const citizens = registeredUsers.filter(u => u.role === 'citizen');
  const officers = registeredUsers.filter(u => u.role === 'officer');

  const filteredCitizens = citizens.filter(u => 
    u.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredOfficers = officers.filter(u => 
    u.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredStations = policeStations.filter(station => 
    station.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    station.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredFirs = firs.filter(fir => 
    fir.firNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    fir.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    fir.station.toLowerCase().includes(searchQuery.toLowerCase()) ||
    fir.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#f9f9f9] text-[#1a1c1c] font-sans antialiased relative">
      <div 
        className="fixed inset-0 bg-cover bg-center bg-fixed z-0"
        style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCo1wZDMvOkynJpEwl1tdj7bSz7yOvs98ICJ9murFu0rCvkCTc5qyW3VRPpQkd4M2cmP8wCsIJJdQ01nF3pXlZqF4b0ye-VIuHzLhL1IqYLpr5DvGkmLNeKCPoItZm9OEXNr6125hgtYimKI6U-RiVC4IoMg79_zq57W2JRjbDqbTi3MeG1G1mdAmNMt23ZOEUh6330O0COynLS-V8MHJLviBIhyP-PcI7X6HfdTvKD2VOmwgYSfWeKJIbWwlW2qKP1GQ")'}}
      />

      {/* Main Content Area */}
      <main className="flex-1 md:ml-64 pt-6 px-4 md:px-10 pb-24 md:pb-12 w-full z-10 mx-auto">
        
        {/* Welcome Banner */}
        <section className="relative z-50 mb-8">
          <div className="glass-panel rounded-2xl p-6 flex justify-between items-start md:items-center flex-col md:flex-row gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-display font-bold text-primary mb-1 drop-shadow-sm">System Administration</h1>
              <p className="text-base text-on-surface-variant font-medium">Manage and analyze all police stations, officers, citizens, and individual case files.</p>
            </div>
            
            {activeTab !== 'analytics' && (
              <div className="relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
                <input 
                  type="text" 
                  placeholder={
                    activeTab === 'users' ? "Search users..." : 
                    activeTab === 'stations' ? "Search stations..." : "Search cases..."
                  }
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-white/60 border border-white/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm font-semibold shadow-sm w-64"
                />
              </div>
            )}
          </div>
        </section>

        {/* CASES TAB */}
        {activeTab === 'cases' && (
          <div className="bg-white/60 backdrop-blur-xl rounded-2xl border border-white/50 shadow-sm p-6 mb-8">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                  <FileText className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-800">State Cases & FIR Directory</h2>
                  <p className="text-sm font-medium text-slate-500">Full detailed analysis, entity relationship graphs, and AI pattern reports for every FIR.</p>
                </div>
              </div>
              <span className="px-3 py-1 bg-primary/10 text-primary font-bold rounded-full text-xs">
                {firs.length} Total Cases
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredFirs.length === 0 ? (
                <div className="col-span-full text-center py-12 text-slate-500 font-medium">No case files match your search filter.</div>
              ) : (
                filteredFirs.map((fir) => (
                  <div 
                    key={fir.id} 
                    className="bg-white/80 backdrop-blur-md rounded-2xl border border-white/80 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4 group"
                  >
                    <div>
                      <div className="flex justify-between items-start gap-2 mb-2">
                        <span className="text-xs font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-md">
                          {fir.firNumber}
                        </span>
                        <span className={cn(
                          "text-[10px] px-2 py-0.5 rounded-full font-bold uppercase",
                          fir.severity === 'High' ? "bg-red-100 text-red-700" :
                          fir.severity === 'Medium' ? "bg-amber-100 text-amber-800" : "bg-blue-100 text-blue-700"
                        )}>
                          {fir.severity} Priority
                        </span>
                      </div>

                      <h3 className="font-bold text-slate-900 text-base group-hover:text-primary transition-colors">{fir.title}</h3>
                      <p className="text-xs text-slate-500 line-clamp-2 mt-1">{fir.description}</p>
                    </div>

                    <div className="space-y-2 pt-3 border-t border-slate-100 text-xs text-slate-600 font-medium">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Station:</span>
                        <span className="font-semibold text-slate-800">{fir.station}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Date Filed:</span>
                        <span>{format(new Date(fir.dateFiled), 'MMM dd, yyyy')}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400">Risk Score:</span>
                        <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                          {fir.aiAnalysis?.riskScore || 75}%
                        </span>
                      </div>
                    </div>

                    <button 
                      onClick={() => {
                        setSelectedFir(fir);
                        setIsModalOpen(true);
                      }}
                      className="w-full mt-2 py-2.5 bg-primary text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors shadow-sm"
                    >
                      <Brain className="w-4 h-4" /> View Detailed Analysis & Graph
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* USERS TAB */}
        {activeTab === 'users' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="bg-white/60 backdrop-blur-xl rounded-xl border border-white/50 shadow-sm p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center border border-blue-200">
                  <Shield className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-800">Police Officers</h2>
                  <p className="text-sm font-medium text-slate-500">Registered official accounts</p>
                </div>
              </div>
              
              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                {filteredOfficers.length === 0 ? (
                  <div className="text-center py-8 text-slate-500 font-medium">No officers found.</div>
                ) : (
                  filteredOfficers.map((officer) => (
                    <div key={officer.id} className="flex items-center justify-between p-4 bg-white/50 rounded-xl border border-white/60 shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                          <UserCircle className="w-6 h-6 text-blue-500" />
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-800">{officer.name}</h4>
                          <p className="text-xs font-semibold text-slate-500">ID: {officer.id}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="inline-block px-2.5 py-1 bg-blue-100 text-blue-700 rounded-md text-xs font-bold uppercase tracking-wider mb-1">
                          Officer
                        </span>
                        {officer.station && <p className="text-xs font-medium text-slate-500">{officer.station}</p>}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="bg-white/60 backdrop-blur-xl rounded-xl border border-white/50 shadow-sm p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center border border-emerald-200">
                  <Users className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-800">Citizens</h2>
                  <p className="text-sm font-medium text-slate-500">Registered citizen accounts</p>
                </div>
              </div>
              
              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                {filteredCitizens.length === 0 ? (
                  <div className="text-center py-8 text-slate-500 font-medium">No citizens found.</div>
                ) : (
                  filteredCitizens.map((citizen) => (
                    <div key={citizen.id} className="flex items-center justify-between p-4 bg-white/50 rounded-xl border border-white/60 shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center">
                          <UserCircle className="w-6 h-6 text-emerald-500" />
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-800">{citizen.name}</h4>
                          <p className="text-xs font-semibold text-slate-500">ID: {citizen.id}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="inline-block px-2.5 py-1 bg-emerald-100 text-emerald-700 rounded-md text-xs font-bold uppercase tracking-wider mb-1">
                          Citizen
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* STATIONS TAB */}
        {activeTab === 'stations' && (
          <div className="bg-white/60 backdrop-blur-xl rounded-xl border border-white/50 shadow-sm p-6 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center border border-indigo-200">
                <Building2 className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-800">Police Stations Directory</h2>
                <p className="text-sm font-medium text-slate-500">Complete list of stations and contact details</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[600px] overflow-y-auto pr-2">
              {filteredStations.length === 0 ? (
                <div className="col-span-full text-center py-8 text-slate-500 font-medium">No stations found.</div>
              ) : (
                filteredStations.map((station, index) => (
                  <div key={index} className="flex flex-col p-4 bg-white/50 rounded-xl border border-white/60 shadow-sm hover:shadow-md transition-shadow">
                    <h4 className="font-bold text-slate-800 mb-2">{station.name}</h4>
                    <p className="text-xs font-medium text-slate-600 mb-4 flex-1 line-clamp-3">{station.address}</p>
                    <div className="text-xs font-semibold text-slate-500 mt-auto pt-3 border-t border-slate-200/50">
                      <div className="flex items-center justify-between mb-1">
                        <span>Email:</span>
                        <span className="text-primary truncate ml-2" title={station.email}>{station.email || 'N/A'}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Phone:</span>
                        <span className="text-slate-700">{station.phone || 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ANALYTICS TAB */}
        {activeTab === 'analytics' && (
          <div className="mb-8">
             <AnalyticsDashboard readOnly={false} />
          </div>
        )}

      </main>

      {/* SideNavBar */}
      <nav className="hidden md:flex flex-col h-screen w-64 fixed left-0 top-0 glass-panel border-r border-white/40 py-2 gap-2 z-40 shadow-[10px_0_30px_-15px_rgba(0,0,0,0.1)]">
        <div className="px-6 py-4 border-b border-white/30 mb-2 flex flex-col items-center text-center">
          <img src="/karnataka-logo.svg" alt="Karnataka Logo" className="w-16 h-16 object-contain mb-3 drop-shadow-md" />
          <div className="text-xl font-display font-bold text-primary mb-1 drop-shadow-sm">Admin Portal</div>
          <div className="flex items-center gap-3 mt-3">
            <div className="w-10 h-10 rounded-full border-2 border-white shadow-sm bg-primary/20 flex items-center justify-center">
               <Shield className="w-6 h-6 text-primary" />
            </div>
            <div className="text-left">
              <div className="text-sm text-on-surface font-bold">{user?.name || 'Admin'}</div>
              <div className="text-xs text-on-surface-variant font-medium cursor-pointer hover:underline" onClick={handleLogout}>Log Out</div>
            </div>
          </div>
        </div>

        <div className="flex-1 px-4 flex flex-col gap-1">
          <button 
            onClick={() => setActiveTab('cases')}
            className={`flex items-center gap-3 px-4 py-3 font-bold rounded-xl shadow-sm border text-sm transition-all duration-200 ${activeTab === 'cases' ? 'bg-white/50 text-primary border-white/40' : 'text-on-surface-variant border-transparent hover:bg-white/40 hover:translate-x-1'}`}>
            <FileText className={`w-5 h-5 ${activeTab === 'cases' ? 'fill-primary/20' : ''}`} /> Case Files Analysis
          </button>

          <button 
            onClick={() => setActiveTab('users')}
            className={`flex items-center gap-3 px-4 py-3 font-bold rounded-xl shadow-sm border text-sm transition-all duration-200 ${activeTab === 'users' ? 'bg-white/50 text-primary border-white/40' : 'text-on-surface-variant border-transparent hover:bg-white/40 hover:translate-x-1'}`}>
            <Users className={`w-5 h-5 ${activeTab === 'users' ? 'fill-primary/20' : ''}`} /> User Directory
          </button>
          
          <button 
            onClick={() => setActiveTab('stations')}
            className={`flex items-center gap-3 px-4 py-3 font-bold rounded-xl shadow-sm border text-sm transition-all duration-200 ${activeTab === 'stations' ? 'bg-white/50 text-primary border-white/40' : 'text-on-surface-variant border-transparent hover:bg-white/40 hover:translate-x-1'}`}>
            <Building2 className={`w-5 h-5 ${activeTab === 'stations' ? 'fill-primary/20' : ''}`} /> Police Stations
          </button>

          <button 
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center gap-3 px-4 py-3 font-bold rounded-xl shadow-sm border text-sm transition-all duration-200 ${activeTab === 'analytics' ? 'bg-white/50 text-primary border-white/40' : 'text-on-surface-variant border-transparent hover:bg-white/40 hover:translate-x-1'}`}>
            <BarChart3 className={`w-5 h-5 ${activeTab === 'analytics' ? 'fill-primary/20' : ''}`} /> Heatmap & Analytics
          </button>
        </div>
      </nav>
      
      {/* Mobile Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-white/40 shadow-lg z-50 pb-safe">
        <div className="flex justify-around items-center p-3">
          <button 
            onClick={() => setActiveTab('cases')} 
            className={`flex flex-col items-center ${activeTab === 'cases' ? 'text-primary font-bold' : 'text-on-surface-variant'}`}>
            <FileText className={`w-6 h-6 ${activeTab === 'cases' ? 'fill-primary/20' : ''}`} />
            <span className="text-[10px] mt-1 font-semibold">Cases</span>
          </button>

          <button 
            onClick={() => setActiveTab('users')} 
            className={`flex flex-col items-center ${activeTab === 'users' ? 'text-primary font-bold' : 'text-on-surface-variant'}`}>
            <Users className={`w-6 h-6 ${activeTab === 'users' ? 'fill-primary/20' : ''}`} />
            <span className="text-[10px] mt-1 font-semibold">Users</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('stations')} 
            className={`flex flex-col items-center ${activeTab === 'stations' ? 'text-primary font-bold' : 'text-on-surface-variant'}`}>
            <Building2 className={`w-6 h-6 ${activeTab === 'stations' ? 'fill-primary/20' : ''}`} />
            <span className="text-[10px] mt-1 font-semibold">Stations</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('analytics')} 
            className={`flex flex-col items-center ${activeTab === 'analytics' ? 'text-primary font-bold' : 'text-on-surface-variant'}`}>
            <BarChart3 className={`w-6 h-6 ${activeTab === 'analytics' ? 'fill-primary/20' : ''}`} />
            <span className="text-[10px] mt-1 font-semibold">Analytics</span>
          </button>
        </div>
      </nav>

      {/* Case Details Modal */}
      <FIRDetailsModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        fir={selectedFir}
        user={user}
      />

    </div>
  );
}
