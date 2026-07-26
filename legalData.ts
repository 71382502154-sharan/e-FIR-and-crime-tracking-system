import React from 'react';
import { X, Bell, Info, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { cn } from '../lib/utils';
import { useAppStore } from '../store/appStore';

export default function NotificationsModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { user } = useAppStore();
  
  if (!isOpen) return null;

  const notifications = user?.role === 'officer' ? [
    { id: 1, type: 'alert', title: 'New High Priority Case', message: 'A new high severity case has been assigned to your zone.', time: '10 min ago', read: false },
    { id: 2, type: 'info', title: 'System Update', message: 'KSP portal maintenance scheduled for tonight at 2 AM.', time: '2 hours ago', read: true },
    { id: 3, type: 'success', title: 'Case Closed', message: 'Case #FIR-2023-001 has been successfully closed.', time: '1 day ago', read: true },
  ] : user?.role === 'admin' ? [
    { id: 1, type: 'alert', title: 'System Alert', message: 'Unusual login activity detected in North Zone.', time: '5 min ago', read: false },
    { id: 2, type: 'info', title: 'New Officer Registered', message: 'Officer ID OFF045 requires approval.', time: '1 hour ago', read: false },
  ] : [
    { id: 1, type: 'success', title: 'FIR Update', message: 'Your FIR #FIR-9872 has been verified by the assigned officer.', time: 'Just now', read: false },
    { id: 2, type: 'info', title: 'Advisory', message: 'Beware of recent cyber frauds reported in your area.', time: '3 hours ago', read: true },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose}>
      <div 
        className="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2 text-slate-800 font-bold">
            <Bell className="w-5 h-5 text-indigo-500" />
            <span>Notifications</span>
          </div>
          <button 
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-2">
          {notifications.map(notification => (
            <div 
              key={notification.id} 
              className={cn(
                "p-3 mb-2 rounded-xl flex gap-3 transition-colors hover:bg-slate-50 cursor-pointer border",
                notification.read ? "bg-white border-transparent" : "bg-indigo-50/30 border-indigo-100/50"
              )}
            >
              <div className="mt-0.5">
                {notification.type === 'alert' && <ShieldAlert className="w-5 h-5 text-rose-500" />}
                {notification.type === 'info' && <Info className="w-5 h-5 text-blue-500" />}
                {notification.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <h4 className={cn("text-sm font-bold", notification.read ? "text-slate-700" : "text-slate-900")}>
                    {notification.title}
                  </h4>
                  <span className="text-[10px] text-slate-400 font-medium whitespace-nowrap ml-2">
                    {notification.time}
                  </span>
                </div>
                <p className="text-xs text-slate-600 font-medium leading-relaxed">
                  {notification.message}
                </p>
              </div>
            </div>
          ))}
          
          {notifications.length === 0 && (
            <div className="py-8 flex flex-col items-center justify-center text-slate-400">
              <Bell className="w-8 h-8 mb-2 opacity-50" />
              <p className="text-sm font-medium">No new notifications</p>
            </div>
          )}
        </div>
        
        {notifications.length > 0 && (
          <div className="p-3 border-t border-slate-100 text-center bg-slate-50">
            <button className="text-xs font-bold text-indigo-600 hover:text-indigo-700 hover:underline">
              Mark all as read
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
