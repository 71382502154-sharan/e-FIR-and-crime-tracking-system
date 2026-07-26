import React, { useState, useEffect, useRef } from 'react';
import { X, Search, Scale, FileText, ChevronRight } from 'lucide-react';
import { cn } from '../lib/utils';
import { useAppStore } from '../store/appStore';
import { t } from '../lib/i18n';
import { LEGAL_DATA } from '../data/legalData';

interface LegalLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
}



export default function LegalLibraryModal({ isOpen, onClose }: LegalLibraryModalProps) {
  const tabsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = tabsRef.current;
    if (!el) return;
    const handleWheel = (e: WheelEvent) => {
      if (e.deltaY !== 0) {
        e.preventDefault();
        el.scrollLeft += e.deltaY;
      }
    };
    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleWheel);
  }, [isOpen]);

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const { language } = useAppStore();
  const text = t[language];

  if (!isOpen) return null;

  const getCategoryName = (cat: string) => {
    if (language === 'en') return cat;
    const map: Record<string, string> = {
      'All': text['legal.all'],
      'Property': text['cat.property'],
      'Fraud': text['cat.fraud'],
      'Body': text['cat.body'],
      'Women': text['cat.women'],
      'Other': text['cat.other'],
      'Cyber': text['cat.cyber'],
      'Traffic': text['cat.traffic']
    };
    return map[cat] || cat;
  };

  const categories = ['All', ...Array.from(new Set(LEGAL_DATA.map(d => d.category)))];

  const filteredData = LEGAL_DATA.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase()) || 
                         item.section.toLowerCase().includes(search.toLowerCase()) ||
                         item.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm" 
        onClick={onClose}
      />
      <div className="bg-surface/95 backdrop-blur-md rounded-2xl shadow-xl w-full max-w-4xl h-[85vh] overflow-hidden relative z-10 flex flex-col border border-white/50">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-white/20 bg-white/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-container/80 backdrop-blur-sm flex items-center justify-center shadow-sm">
              <Scale className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-display font-bold text-primary">{text['legal.title']}</h2>
              <p className="text-sm font-semibold text-on-surface-variant">{text['legal.subtitle']}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-on-surface-variant hover:bg-white/60 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar */}
        <div className="p-4 border-b border-white/20 bg-white/20 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
            <input 
              type="text" 
              placeholder={text['legal.search']} 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white/60 border border-white/40 rounded-xl py-2.5 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm font-semibold placeholder:text-on-surface-variant/70"
            />
          </div>
          <div ref={tabsRef} className="flex gap-2 overflow-x-auto pb-1 sm:pb-0" style={{ scrollBehavior: 'smooth' }}>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={cn(
                  "px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-colors border",
                  selectedCategory === cat 
                    ? "bg-primary text-white border-primary shadow-sm" 
                    : "bg-white/50 text-on-surface-variant border-white/40 hover:bg-white/70"
                )}
              >
                {getCategoryName(cat)}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 scrollbar-hide bg-surface-variant/30">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredData.map(item => (
              <div key={item.id} className="bg-white/60 border border-white/40 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <span className="inline-block px-2.5 py-1 bg-primary-container/50 text-primary rounded-md text-[10px] font-bold uppercase tracking-wider mb-2">
                      {getCategoryName(item.category)}
                    </span>
                    <h3 className="font-bold text-lg text-on-surface">{item.section}</h3>
                    <p className="font-semibold text-primary">{item.title}</p>
                  </div>
                  <FileText className="w-5 h-5 text-on-surface-variant opacity-50" />
                </div>
                <div className="space-y-3 mt-4">
                  <div>
                    <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">{text['legal.definition']}</p>
                    <p className="text-sm text-on-surface font-medium leading-relaxed">{item.description}</p>
                  </div>
                  <div className="p-3 bg-red-50/50 rounded-lg border border-red-100">
                    <p className="text-xs font-bold text-red-800 uppercase tracking-wider mb-1">{text['legal.punishment']}</p>
                    <p className="text-sm text-red-900 font-medium">{item.punishment}</p>
                  </div>
                </div>
              </div>
            ))}
            
            {filteredData.length === 0 && (
              <div className="col-span-full py-12 flex flex-col items-center justify-center text-on-surface-variant">
                <Scale className="w-12 h-12 mb-3 opacity-20" />
                <p className="font-semibold text-lg">{text['legal.noRecords']}</p>
                <p className="text-sm">{text['legal.tryAdjusting']}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
