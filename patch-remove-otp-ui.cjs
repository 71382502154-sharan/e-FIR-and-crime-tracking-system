const fs = require('fs');
let file = fs.readFileSync('src/components/FIRDetailsModal.tsx', 'utf8');

file = file.replace(
  "import React from 'react';",
  "import React, { useState } from 'react';"
);

file = file.replace(
  "import { X, Clock, ShieldCheck, CheckCircle2, UserCircle, Search, Calendar, FileText, AlertTriangle, Download, Phone, MapPin } from 'lucide-react';",
  "import { X, Clock, ShieldCheck, CheckCircle2, UserCircle, Search, Calendar, FileText, AlertTriangle, Download, Phone, MapPin, MessageSquare, Send } from 'lucide-react';"
);

file = file.replace(
  "import { useAppStore } from '../store/appStore';",
  "import { useAppStore } from '../store/appStore';\nimport RichTextEditor from './RichTextEditor';"
);

file = file.replace(
  "const { registeredUsers } = useAppStore();",
  "const { registeredUsers, addFIRNote } = useAppStore();\n  const [noteContent, setNoteContent] = useState('');"
);

const notesSection = `
            {user?.role === 'officer' && (
              <div className="bg-white/40 rounded-xl p-4 border border-white/50 shadow-sm md:col-span-2">
                <div className="flex items-center gap-2 text-on-surface-variant mb-4">
                  <MessageSquare className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">Internal Investigation Notes</span>
                </div>
                
                {/* Existing Notes */}
                {fir.notes && fir.notes.length > 0 && (
                  <div className="space-y-4 mb-6">
                    {fir.notes.map(note => (
                      <div key={note.id} className="bg-white/60 p-3 rounded-lg border border-slate-200 shadow-sm">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-xs font-bold text-slate-700 flex items-center gap-1"><UserCircle className="w-3 h-3"/> {note.authorName}</span>
                          <span className="text-[10px] text-slate-500 font-medium">{format(new Date(note.createdAt), 'MMM dd, HH:mm')}</span>
                        </div>
                        <div className="text-sm text-slate-700 prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: note.content }} />
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Add Note */}
                <div className="space-y-3">
                  <RichTextEditor content={noteContent} onChange={setNoteContent} placeholder="Add an internal note..." />
                  <div className="flex justify-end">
                    <button
                      onClick={() => {
                        if (noteContent.trim() && user) {
                          addFIRNote(fir.id, noteContent, user.id, user.name);
                          setNoteContent('');
                        }
                      }}
                      disabled={!noteContent.trim()}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 shadow-sm flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Send className="w-4 h-4" /> Add Note
                    </button>
                  </div>
                </div>
              </div>
            )}
`;

file = file.replace(
  "</div>\n        </div>\n        <div className=\"p-4 border-t border-white/20 bg-white/40 flex justify-end gap-3\">",
  "  " + notesSection.trim().replace(/\n/g, '\n              ') + "\n          </div>\n        </div>\n        <div className=\"p-4 border-t border-white/20 bg-white/40 flex justify-end gap-3\">"
);

fs.writeFileSync('src/components/FIRDetailsModal.tsx', file);
