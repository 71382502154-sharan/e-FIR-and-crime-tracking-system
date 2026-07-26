import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Globe, Shield, UserCircle, Home, FolderOpen, Scale, Bell, PlusSquare, Badge, Lock, Smile, Fingerprint, Loader2, Phone, Mail, MapPin, Upload, FileImage, Navigation } from 'lucide-react';
import { policeStations } from '../data/policeStations';
import { cn } from '../lib/utils';
import { supabase, isMockSupabase } from '../lib/supabase';
import toast from 'react-hot-toast';
import { useAppStore } from '../store/appStore';
import { t } from '../lib/i18n';
import LanguageSelector from '../components/LanguageSelector';

export default function Login() {
  const navigate = useNavigate();
  const login = useAppStore(state => state.login);
  const signup = useAppStore(state => state.signup);
  const { language, setLanguage } = useAppStore();
  const text = t[language];
  const [role, setRole] = useState<'citizen' | 'officer' | 'admin'>('citizen');
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [name, setName] = useState('');
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [area, setArea] = useState('');
  const [idProofName, setIdProofName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  const calculatePasswordStrength = (pass: string) => {
    let strength = 0;
    if (pass.length >= 8) strength += 1;
    if (/[A-Z]/.test(pass)) strength += 1;
    if (/[a-z]/.test(pass)) strength += 1;
    if (/[0-9]/.test(pass)) strength += 1;
    if (/[^A-Za-z0-9]/.test(pass)) strength += 1;
    return strength;
  };

  const passwordStrength = calculatePasswordStrength(password);
  
  const getPasswordStrengthColor = (strength: number) => {
    if (strength === 0) return 'bg-slate-200';
    if (strength <= 2) return 'bg-red-500';
    if (strength === 3) return 'bg-amber-500';
    if (strength === 4) return 'bg-blue-500';
    return 'bg-emerald-500';
  };
  
  const getPasswordStrengthText = (strength: number) => {
    if (strength === 0) return '';
    if (strength <= 2) return 'Weak';
    if (strength === 3) return 'Fair';
    if (strength === 4) return 'Good';
    return 'Strong';
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser');
      return;
    }

    setIsGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          // Simple reverse geocoding using Nominatim (OpenStreetMap)
          const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          if (!response.ok) throw new Error('Failed to fetch address');
          const data = await response.json();
          setArea(data.display_name || `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
          toast.success('Location fetched successfully');
        } catch (error) {
          console.error(error);
          setArea(`${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`);
          toast.success('Coordinates fetched');
        } finally {
          setIsGettingLocation(false);
        }
      },
      (error) => {
        console.error(error);
        toast.error('Failed to get location. Please allow location access.');
        setIsGettingLocation(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };


  

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!id.trim()) {
      toast.error('Please enter User ID');
      return;
    }

    if (!password) {
      toast.error('Please enter Password');
      return;
    }

    if (role === 'admin') {
      if (id !== 'ksp@2026.government.in' || password !== '16092007') {
        toast.error('Invalid admin credentials');
        return;
      }
      login(id, role, password);
      toast.success('Admin login successful!');
      navigate('/admin');
      return;
    }

    if (isLoginMode) {
      const result = login(id, role, password);
      if (!result.success) {
        toast.error(result.message || 'Login failed');
        return;
      }
      toast.success(result.message || 'Login successful!');
      if (role === 'citizen') {
        navigate('/citizen');
      } else {
        navigate('/police');
      }
    } else {
      if (!name.trim()) {
        toast.error('Please enter your full name');
        return;
      }
      if (role === 'citizen' && !idProofName) {
        toast.error('Please upload an ID Proof');
        return;
      }
      if (passwordStrength < 3) {
        toast.error('Please choose a stronger password (at least Fair)');
        return;
      }
      const result = signup({
        id,
        role,
        name,
        phone,
        email,
        area,
        station: role === 'officer' ? area : undefined,
        password
      });
      if (!result.success) {
        toast.error(result.message || 'Signup failed');
        return;
      }
      toast.success(result.message || 'Registration successful!');
      if (role === 'citizen') {
        navigate('/citizen');
      } else {
        navigate('/police');
      }
    }
  };

  return (
    <div className="min-h-screen w-full bg-surface-container text-on-surface font-sans antialiased relative overflow-y-auto flex items-center py-10">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center z-0 filter blur-sm scale-105 opacity-80"
        style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuA9btl50ySGaSRi4cJRl8EcxQfrdcFib1Ab6kplFaMyr4WnQjOiRiFqkresltDUe9eBRClrGFnQbUJDs_Njh1F0QysrntuCtXYIegYJ7iTFrV1yQI-1mMCycYPq0v1MFkSOcOSObunsTPadIBu6mKcY_McOMoyF4VRCJ0IaZAw8ballqh5TU15NJd-htgSDShe-5QQtG5HgPItEuSFUq0t_7xq_iIAuTyvJKyDOFDF2b8foDbU5CRVs1AOGa5DvZOejHg")'}}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-black/30 to-primary/20 z-0 mix-blend-multiply" />

      {/* Top Utility Bar */}
      <div className="absolute top-0 right-0 p-4 md:p-8 z-50 flex items-center gap-4">
        <LanguageSelector variant="light" />
      </div>

      <div className="relative z-10 w-full h-full flex flex-col md:flex-row justify-between">
        {/* Main Content Area */}
        <main className="flex-1 flex flex-col justify-center items-center px-4 md:px-16 lg:px-24 w-full">
          {/* Branding Section */}
          <div className="flex flex-col items-center text-center mb-8 w-full max-w-2xl">
            <div className="w-24 h-24 flex items-center justify-center mb-5">
              <img src="/karnataka-logo.svg" alt="Karnataka State Police Logo" className="w-full h-full object-contain drop-shadow-xl" />
            </div>
            <h1 className="text-3xl md:text-5xl font-display font-bold text-primary drop-shadow-sm">{text['app.title']}</h1>
            <p className="text-base text-on-surface-variant mt-2 font-medium">{text['app.subtitle']}</p>
          </div>

          {/* Login Card */}
          <div className="bg-white/30 backdrop-blur-xl border border-white/40 shadow-2xl rounded-2xl p-6 md:p-8 relative w-full max-w-2xl">
            {/* Role Toggle */}
            <div className="flex p-1 bg-white/40 rounded-lg mb-8 relative border border-white/50 shadow-inner overflow-hidden">
              <div 
                className={cn(
                  "absolute inset-y-1 w-[calc(33.33%-4px)] bg-white rounded-md shadow-sm transition-transform duration-300 ease-in-out",
                  role === 'citizen' ? "translate-x-0" : role === 'officer' ? "translate-x-[100%]" : "translate-x-[200%]"
                )} 
              />
              <button 
                className={cn("flex-1 py-2 text-sm font-semibold relative z-10 transition-colors", role === 'citizen' ? "text-primary" : "text-on-surface-variant")}
                onClick={() => setRole('citizen')}
                type="button"
              >
                {text['login.citizen']}
              </button>
              <button 
                className={cn("flex-1 py-2 text-sm font-semibold relative z-10 transition-colors", role === 'officer' ? "text-primary" : "text-on-surface-variant")}
                onClick={() => setRole('officer')}
                type="button"
              >
                {text['login.officer']}
              </button>
              <button 
                className={cn("flex-1 py-2 text-sm font-semibold relative z-10 transition-colors", role === 'admin' ? "text-primary" : "text-on-surface-variant")}
                onClick={() => { setRole('admin'); setIsLoginMode(true); }}
                type="button"
              >
                Admin
              </button>
            </div>

            <form className="space-y-4" onSubmit={handleLogin}>
              {!isLoginMode && (
                <>
                  <div className="w-full mb-4">
                    <label className="block text-sm font-semibold text-on-surface mb-2" htmlFor="name">
                      {text['login.name']}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <UserCircle className="w-5 h-5 text-[#00b4d8]" />
                      </div>
                      <input 
                        className="bg-white/50 block w-full pl-10 pr-3 py-2 border border-white/60 rounded-lg text-on-surface text-sm transition-all duration-200 focus:bg-white/80 focus:ring-2 focus:ring-primary/50 outline-none" 
                        id="name" 
                        placeholder="Enter Full Name" 
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required={!isLoginMode}
                      />
                    </div>
                  </div>

                  <div className="w-full mb-4">
                    <label className="block text-sm font-semibold text-on-surface mb-2" htmlFor="phone">
                      {text['login.phone']}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Phone className="w-5 h-5 text-[#00b4d8]" />
                      </div>
                      <input 
                        className="bg-white/50 block w-full pl-10 pr-3 py-2 border border-white/60 rounded-lg text-on-surface text-sm transition-all duration-200 focus:bg-white/80 focus:ring-2 focus:ring-primary/50 outline-none" 
                        id="phone" 
                        placeholder="Enter Phone Number" 
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required={!isLoginMode}
                      />
                    </div>
                  </div>

                  <div className="w-full mb-4">
                    <label className="block text-sm font-semibold text-on-surface mb-2" htmlFor="email">
                      {text['login.email']}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="w-5 h-5 text-[#00b4d8]" />
                      </div>
                      <input 
                        className="bg-white/50 block w-full pl-10 pr-3 py-2 border border-white/60 rounded-lg text-on-surface text-sm transition-all duration-200 focus:bg-white/80 focus:ring-2 focus:ring-primary/50 outline-none" 
                        id="email" 
                        placeholder="Enter Email Address" 
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required={!isLoginMode}
                      />
                    </div>
                  </div>

                  <div className="w-full mb-4">
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
                  </div>

                  <div className="w-full mb-4">
                    <label className="block text-sm font-semibold text-on-surface mb-2">
                      {text['login.idProof']}
                    </label>
                    <div className="relative">
                      <label className="bg-white/50 flex items-center justify-center w-full px-3 py-2 border border-white/60 border-dashed rounded-lg text-on-surface text-sm transition-all duration-200 hover:bg-white/80 cursor-pointer outline-none">
                        <input 
                          type="file" 
                          className="hidden" 
                          accept="image/*,.pdf"
                          onChange={(e) => setIdProofName(e.target.files?.[0]?.name || '')}
                        />
                        <div className="flex items-center gap-2">
                          {idProofName ? (
                            <>
                              <FileImage className="w-5 h-5 text-primary" />
                              <span className="truncate max-w-[200px] text-primary font-medium">{idProofName}</span>
                            </>
                          ) : (
                            <>
                              <Upload className="w-5 h-5 text-on-surface-variant" />
                              <span className="text-on-surface-variant font-medium">Click to upload photo/document</span>
                            </>
                          )}
                        </div>
                      </label>
                    </div>
                  </div>
                </>
              )}
              
              <div className="flex flex-wrap md:flex-nowrap items-end gap-4">
                  <div className="flex-1 min-w-[200px]">
                    <label className="block text-sm font-semibold text-on-surface mb-2" htmlFor="userId">
                      {role === 'citizen' ? text['login.userId'] : role === 'officer' ? text['login.officerId'] : 'Admin ID'}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Badge className="w-5 h-5 text-[#00b4d8]" />
                      </div>
                      <input 
                        className="bg-white/50 block w-full pl-10 pr-3 py-2 border border-white/60 rounded-lg text-on-surface text-sm transition-all duration-200 focus:bg-white/80 focus:ring-2 focus:ring-primary/50 outline-none" 
                        id="userId" 
                        placeholder="Enter ID" 
                        type="text"
                        value={id}
                        onChange={(e) => setId(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="flex-1 min-w-[200px]">
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-sm font-semibold text-on-surface" htmlFor="password">{text['login.password']}</label>
                      {isLoginMode && role !== 'admin' && (
                        <a className="text-[10px] font-semibold text-primary hover:text-[#00b4d8] transition-colors hover:underline" href="#">{text['login.forgot']}</a>
                      )}
                    </div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="w-5 h-5 text-[#00b4d8]" />
                      </div>
                      <input 
                        className="bg-white/50 block w-full pl-10 pr-10 py-2 border border-white/60 rounded-lg text-on-surface text-sm transition-all duration-200 focus:bg-white/80 focus:ring-2 focus:ring-primary/50 outline-none" 
                        id="password" 
                        placeholder="Enter Password" 
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                    {!isLoginMode && password.length > 0 && (
                      <div className="mt-2 space-y-1 animate-in fade-in slide-in-from-top-1">
                        <div className="flex gap-1 h-1.5">
                          {[1, 2, 3, 4, 5].map((index) => (
                            <div 
                              key={index} 
                              className={cn(
                                "h-full flex-1 rounded-full transition-colors duration-300",
                                index <= passwordStrength ? getPasswordStrengthColor(passwordStrength) : "bg-slate-200"
                              )} 
                            />
                          ))}
                        </div>
                        <p className={cn("text-[10px] font-semibold text-right", 
                          passwordStrength <= 2 ? "text-red-500" : 
                          passwordStrength === 3 ? "text-amber-500" : 
                          passwordStrength === 4 ? "text-blue-500" : 
                          "text-emerald-500"
                        )}>
                          {getPasswordStrengthText(passwordStrength)}
                        </p>
                      </div>
                    )}
                  </div>

                  <button 
                    className="bg-gradient-to-r from-primary to-[#00b4d8] text-white px-6 py-2 rounded-lg font-semibold shadow-md hover:scale-105 transition-transform h-[42px] flex-shrink-0 disabled:opacity-50" 
                    type="submit"
                    disabled={isLoading}
                  >
                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (isLoginMode ? text['login.submit'] : text['login.signup'])}
                  </button>
                </div>

              
              


              {role !== 'admin' && (
              <div className="text-sm font-semibold mt-6 text-center">
                <span className="text-on-surface-variant">
                  {isLoginMode ? text['login.noAccount'] : text['login.hasAccount']}{' '}
                </span>
                <button
                  type="button"
                  onClick={() => setIsLoginMode(!isLoginMode)}
                  className="text-primary hover:underline hover:text-[#00b4d8] transition-colors"
                >
                  {isLoginMode ? text['login.signup'] : text['login.submit']}
                </button>
              </div>
              )}

              {/* Demo Helper Banner */}
              {isLoginMode && role !== 'admin' && (
                <div className="mt-4 p-3 rounded-xl bg-white/60 backdrop-blur-sm border border-primary/20 text-xs text-on-surface flex items-center justify-between gap-2 shadow-sm">
                  <span>
                    💡 <strong className="text-primary font-semibold">Registered Demo ID:</strong> {role === 'citizen' ? '123456789012' : 'OFFICER001'}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setId(role === 'citizen' ? '123456789012' : 'OFFICER001');
                      setPassword('123456');
                    }}
                    className="text-[11px] font-bold text-primary hover:underline shrink-0 bg-primary/10 px-2.5 py-1 rounded-md border border-primary/20 transition-colors"
                  >
                    Auto-Fill Demo
                  </button>
                </div>
              )}
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
