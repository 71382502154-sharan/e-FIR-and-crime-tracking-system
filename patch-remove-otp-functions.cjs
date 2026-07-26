const fs = require('fs');
let file = fs.readFileSync('src/pages/Login.tsx', 'utf8');

if (!file.includes('policeStations')) {
  file = file.replace(
    "import { Globe, Shield, UserCircle, Home, FolderOpen, Scale, Bell, PlusSquare, Badge, Lock, Smile, Fingerprint, Loader2, Phone, Mail, MapPin, Upload, FileImage, Navigation } from 'lucide-react';",
    "import { Globe, Shield, UserCircle, Home, FolderOpen, Scale, Bell, PlusSquare, Badge, Lock, Smile, Fingerprint, Loader2, Phone, Mail, MapPin, Upload, FileImage, Navigation } from 'lucide-react';\nimport { policeStations } from '../data/policeStations';"
  );
}

const oldAreaInput = `<div className="w-full mb-4">
                    <label className="block text-sm font-semibold text-on-surface mb-2" htmlFor="area">
                      {text['login.area']}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MapPin className="w-5 h-5 text-[#00b4d8]" />
                      </div>
                      <input 
                        className="bg-white/50 block w-full pl-10 pr-10 py-2 border border-white/60 rounded-lg text-on-surface text-sm transition-all duration-200 focus:bg-white/80 focus:ring-2 focus:ring-primary/50 outline-none" 
                        id="area" 
                        placeholder="Enter Living Area" 
                        type="text"
                        value={area}
                        onChange={(e) => setArea(e.target.value)}
                        required={!isLoginMode}
                      />
                      <button 
                        type="button" 
                        onClick={handleGetLocation} 
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-primary hover:text-primary/80 transition-colors"
                        disabled={isGettingLocation}
                        title="Get Current Location"
                      >
                        {isGettingLocation ? <Loader2 className="w-5 h-5 animate-spin" /> : <Navigation className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>`;

const newAreaInput = `<div className="w-full mb-4">
                    <label className="block text-sm font-semibold text-on-surface mb-2" htmlFor="area">
                      {role === 'officer' ? 'Select Police Station' : 'Living Area / Address'}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MapPin className="w-5 h-5 text-[#00b4d8]" />
                      </div>
                      {role === 'officer' ? (
                        <select
                          className="bg-white/50 block w-full pl-10 pr-3 py-2 border border-white/60 rounded-lg text-on-surface text-sm transition-all duration-200 focus:bg-white/80 focus:ring-2 focus:ring-primary/50 outline-none appearance-none"
                          id="area"
                          value={area}
                          onChange={(e) => setArea(e.target.value)}
                          required={!isLoginMode}
                        >
                          <option value="">Select a Police Station</option>
                          {policeStations.map((station, idx) => (
                            <option key={idx} value={station.name}>{station.name}</option>
                          ))}
                        </select>
                      ) : (
                        <>
                          <input 
                            className="bg-white/50 block w-full pl-10 pr-10 py-2 border border-white/60 rounded-lg text-on-surface text-sm transition-all duration-200 focus:bg-white/80 focus:ring-2 focus:ring-primary/50 outline-none" 
                            id="area" 
                            placeholder="Enter Living Area" 
                            type="text"
                            value={area}
                            onChange={(e) => setArea(e.target.value)}
                            required={!isLoginMode}
                          />
                          <button 
                            type="button" 
                            onClick={handleGetLocation} 
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-primary hover:text-primary/80 transition-colors"
                            disabled={isGettingLocation}
                            title="Get Current Location"
                          >
                            {isGettingLocation ? <Loader2 className="w-5 h-5 animate-spin" /> : <Navigation className="w-5 h-5" />}
                          </button>
                        </>
                      )}
                    </div>
                  </div>`;

file = file.replace(oldAreaInput, newAreaInput);

fs.writeFileSync('src/pages/Login.tsx', file);
