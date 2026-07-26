import React from 'react';
import { X, HelpCircle, Phone, Mail, MapPin } from 'lucide-react';

interface HelpContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'help' | 'contact';
}

export default function HelpContactModal({ isOpen, onClose, type }: HelpContactModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="p-6">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {type === 'help' ? (
            <div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                <HelpCircle className="w-6 h-6 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Help Center</h2>
              <p className="text-slate-600 mb-6">Find answers to common questions and learn how to use the dashboard effectively.</p>
              
              <div className="space-y-3">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <h3 className="font-semibold text-slate-900 mb-1">How to file an FIR?</h3>
                  <p className="text-sm text-slate-600">Click on the "File New Case" button and fill in all required incident details.</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <h3 className="font-semibold text-slate-900 mb-1">How to update a case status?</h3>
                  <p className="text-sm text-slate-600">Navigate to "My Cases", click on a specific case, and use the status dropdown.</p>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                <Phone className="w-6 h-6 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Contact Admin</h2>
              <p className="text-slate-600 mb-6">Get in touch with the system administrator for technical support or access issues.</p>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                  <div className="p-2 bg-white rounded-lg shadow-sm">
                    <Mail className="w-5 h-5 text-slate-700" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Email Support</p>
                    <p className="font-semibold text-slate-900">admin@ksp.gov.in</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                  <div className="p-2 bg-white rounded-lg shadow-sm">
                    <Phone className="w-5 h-5 text-slate-700" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Phone Support</p>
                    <p className="font-semibold text-slate-900">1-800-425-XXXX</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                  <div className="p-2 bg-white rounded-lg shadow-sm">
                    <MapPin className="w-5 h-5 text-slate-700" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Headquarters</p>
                    <p className="font-semibold text-slate-900">Nrupathunga Road, Bengaluru</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button 
            onClick={onClose}
            className="px-5 py-2.5 bg-slate-900 text-white font-semibold rounded-xl hover:bg-slate-800 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
