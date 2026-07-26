import React, { useState } from 'react';
import { X, Search, MapPin, Phone, Mail, Building2, Shield } from 'lucide-react';
import { policeStations } from '../data/policeStations';

export default function PoliceStationsModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const filteredStations = policeStations.filter(station => 
    station.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    station.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#f0f4f8] rounded-2xl w-full max-w-3xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden border border-white">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 md:p-6 border-b border-white/60 bg-gradient-to-r from-primary/10 to-transparent">
          <div className="flex items-center gap-3">
            <div className="bg-primary/20 p-2 rounded-lg">
              <Building2 className="w-6 h-6 text-primary" />
            </div>
            <h2 className="text-xl font-bold text-on-surface">Police Stations in Karnataka</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/50 rounded-full transition-colors text-slate-500 hover:text-slate-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-white/60 bg-white/20">
          <div className="relative max-w-md mx-auto md:max-w-none">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by station name or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white/60 border border-white/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* Content */}
        <div className="p-4 md:p-6 overflow-y-auto flex-1 bg-[#f0f4f8]/50">
          {filteredStations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredStations.map((station, idx) => (
                <div key={idx} className="bg-white/70 backdrop-blur-md rounded-xl p-4 border border-white shadow-sm hover:shadow-md transition-shadow">
                  <h3 className="font-bold text-lg text-primary mb-2 flex items-start gap-2">
                    <Shield className="w-5 h-5 mt-0.5 flex-shrink-0" />
                    {station.name}
                  </h3>
                  
                  <div className="space-y-2 text-sm text-slate-600 mt-3">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 mt-0.5 text-slate-400 flex-shrink-0" />
                      <span>{station.address}</span>
                    </div>
                    
                    {station.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-slate-400 flex-shrink-0" />
                        <span>{station.phone}</span>
                      </div>
                    )}
                    
                    {station.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-slate-400 flex-shrink-0" />
                        <a href={`mailto:${station.email}`} className="text-primary hover:underline truncate">
                          {station.email}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-slate-500">
              <Building2 className="w-12 h-12 mx-auto mb-3 text-slate-300" />
              <p className="text-lg font-medium">No police stations found</p>
              <p className="text-sm">Try adjusting your search terms</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
