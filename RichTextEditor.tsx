import React from 'react';
import { Globe } from 'lucide-react';
import { useAppStore, Language } from '../store/appStore';
import { cn } from '../lib/utils';

interface Props {
  className?: string;
  variant?: 'light' | 'dark' | 'outline';
}

const languages: { code: Language; label: string }[] = [
  { code: 'en', label: 'English' },
  { code: 'kn', label: 'ಕನ್ನಡ' },
  { code: 'hi', label: 'हिंदी' },
  { code: 'ta', label: 'தமிழ்' },
  { code: 'te', label: 'తెలుగు' }
];

export default function LanguageSelector({ className, variant = 'outline' }: Props) {
  const { language, setLanguage } = useAppStore();
  
  return (
    <div className={cn("relative group", className)}>
      <button 
        className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors shadow-sm",
          variant === 'outline' ? "border border-slate-200 bg-white/40 backdrop-blur-sm text-slate-800 hover:bg-white/60" :
          variant === 'light' ? "bg-white/20 text-white border border-white/30 hover:bg-white/30" :
          "bg-slate-800 text-white hover:bg-slate-700"
        )}
      >
        <Globe className="w-4 h-4" /> 
        {languages.find(l => l.code === language)?.label || 'English'}
      </button>
      
      <div className="absolute right-0 mt-2 w-32 bg-white rounded-xl shadow-lg border border-slate-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-[99999] overflow-hidden transform origin-top-right scale-95 group-hover:scale-100">
        <div className="py-1">
          {languages.map((l) => (
            <button
              key={l.code}
              onClick={() => setLanguage(l.code)}
              className={cn(
                "w-full text-left px-4 py-2 text-sm font-medium hover:bg-slate-50 transition-colors",
                language === l.code ? "text-indigo-600 bg-indigo-50/50" : "text-slate-700"
              )}
            >
              {l.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
