import React from 'react';
import { X, FileText, Download, Archive, Image as ImageIcon } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface VaultModalProps {
  isOpen: boolean;
  onClose: () => void;
  caseId: string;
}

export default function VaultModal({ isOpen, onClose, caseId }: VaultModalProps) {
  if (!isOpen) return null;

  // Mock files for the vault
  const mockFiles = [
    { name: `FIR_Document_${caseId}.pdf`, type: 'pdf', size: '2.4 MB', date: 'Oct 12, 2023' },
    { name: 'Evidence_Photo_1.jpg', type: 'image', size: '5.1 MB', date: 'Oct 14, 2023' },
    { name: 'Witness_Statement.pdf', type: 'pdf', size: '1.2 MB', date: 'Oct 15, 2023' },
  ];

  const handleDownload = (fileName: string) => {
    // Mock download by creating a dummy Blob and triggering download
    try {
      const blob = new Blob([`Mock content for ${fileName}`], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success(`Downloading ${fileName}`);
    } catch (e) {
      toast.error(`Failed to download ${fileName}`);
    }
  };

  const getFileIcon = (type: string) => {
    if (type === 'image') return <ImageIcon className="w-8 h-8 text-blue-500" />;
    return <FileText className="w-8 h-8 text-red-500" />;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#f0f4f8] rounded-2xl w-full max-w-2xl flex flex-col shadow-2xl overflow-hidden border border-white">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 md:p-6 border-b border-white/60 bg-gradient-to-r from-primary/10 to-transparent">
          <div className="flex items-center gap-3">
            <div className="bg-primary/20 p-2 rounded-lg">
              <Archive className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-on-surface">Evidence Vault</h2>
              <p className="text-sm text-slate-500">Case #{caseId}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/50 rounded-full transition-colors text-slate-500 hover:text-slate-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 md:p-6 overflow-y-auto bg-white/20">
          <div className="space-y-4">
            {mockFiles.map((file, idx) => (
              <div key={idx} className="bg-white/60 backdrop-blur-sm border border-white/80 rounded-xl p-4 flex items-center justify-between hover:shadow-md transition-all">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-slate-100 rounded-lg">
                    {getFileIcon(file.type)}
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800">{file.name}</h4>
                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                      <span>{file.size}</span>
                      <span>•</span>
                      <span>{file.date}</span>
                    </div>
                  </div>
                </div>
                
                <button 
                  onClick={() => handleDownload(file.name)}
                  className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary hover:bg-primary/20 rounded-lg font-medium transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span className="hidden sm:inline">Download</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
