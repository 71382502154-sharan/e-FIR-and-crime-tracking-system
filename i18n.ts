import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Link from '@tiptap/extension-link';
import { Bold, Italic, List, ListOrdered, Quote } from 'lucide-react';
import { cn } from '../lib/utils';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  evidence?: { id: string; title: string; type: string; url: string; }[];
}

import { Paperclip, Image as ImageIcon, FileVideo } from 'lucide-react';

const MenuBar = ({ editor, evidence }: { editor: any, evidence?: any[] }) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="flex items-center gap-1 p-2 border-b border-white/20 bg-white/40 rounded-t-lg">
      <button
        onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleBold().run(); }}
        className={cn("p-1.5 rounded hover:bg-white/50 transition-colors", editor.isActive('bold') ? "bg-white/80 text-primary shadow-sm" : "text-slate-600")}
      >
        <Bold className="w-4 h-4" />
      </button>
      <button
        onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleItalic().run(); }}
        className={cn("p-1.5 rounded hover:bg-white/50 transition-colors", editor.isActive('italic') ? "bg-white/80 text-primary shadow-sm" : "text-slate-600")}
      >
        <Italic className="w-4 h-4" />
      </button>
      <div className="w-px h-4 bg-slate-300 mx-1" />
      <button
        onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleBulletList().run(); }}
        className={cn("p-1.5 rounded hover:bg-white/50 transition-colors", editor.isActive('bulletList') ? "bg-white/80 text-primary shadow-sm" : "text-slate-600")}
      >
        <List className="w-4 h-4" />
      </button>
      <button
        onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleOrderedList().run(); }}
        className={cn("p-1.5 rounded hover:bg-white/50 transition-colors", editor.isActive('orderedList') ? "bg-white/80 text-primary shadow-sm" : "text-slate-600")}
      >
        <ListOrdered className="w-4 h-4" />
      </button>
      <div className="w-px h-4 bg-slate-300 mx-1" />
      <button
        onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleBlockquote().run(); }}
        className={cn("p-1.5 rounded hover:bg-white/50 transition-colors", editor.isActive('blockquote') ? "bg-white/80 text-primary shadow-sm" : "text-slate-600")}
      >
        <Quote className="w-4 h-4" />
      </button>

      {evidence && evidence.length > 0 && (
        <>
          <div className="w-px h-4 bg-slate-300 mx-1" />
          <div className="relative group">
            <button
              onClick={(e) => e.preventDefault()}
              className="p-1.5 rounded hover:bg-white/50 transition-colors text-slate-600 flex items-center gap-1"
              title="Attach Evidence"
            >
              <Paperclip className="w-4 h-4" />
            </button>
            <div className="absolute left-0 top-full mt-1 w-64 bg-white border border-slate-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 p-1 flex flex-col gap-1">
              <span className="text-[10px] font-bold text-slate-500 uppercase px-2 pt-1 pb-0.5">Attach Evidence</span>
              {evidence.map(ev => (
                <button
                  key={ev.id}
                  onClick={(e) => {
                    e.preventDefault();
                    const icon = ev.type === 'video' ? '🎥' : ev.type === 'image' ? '🖼️' : '📄';
                    const linkHTML = `<a href="${ev.url}" class="text-indigo-600 underline font-medium cursor-pointer hover:text-indigo-800" target="_blank">${icon} ${ev.title} (${ev.id})</a>&nbsp;`;
                    editor.chain().focus().insertContent(linkHTML).run();
                  }}
                  className="text-left px-2 py-1.5 hover:bg-slate-50 rounded text-xs text-slate-700 flex items-center gap-2"
                >
                  {ev.type === 'video' ? <FileVideo className="w-3 h-3 text-indigo-500" /> : <ImageIcon className="w-3 h-3 text-emerald-500" />}
                  <span className="truncate">{ev.title}</span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default function RichTextEditor({ content, onChange, placeholder = 'Write something...', evidence }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-indigo-600 underline font-medium cursor-pointer hover:text-indigo-800',
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none focus:outline-none min-h-[120px] p-4 text-slate-700 outline-none',
      },
    },
  });

  return (
    <div className="border border-white/40 bg-white/30 backdrop-blur-sm rounded-lg overflow-hidden flex flex-col shadow-sm focus-within:border-indigo-400 focus-within:ring-1 focus-within:ring-indigo-400 transition-all">
      <MenuBar editor={editor} evidence={evidence} />
      <div className="bg-white/60 scrollbar-hide max-h-64 overflow-y-auto">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
