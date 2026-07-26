const fs = require('fs');
let file = fs.readFileSync('src/components/RichTextEditor.tsx', 'utf8');

if (!file.includes("evidence?: any[];")) {
  file = file.replace(
    "placeholder?: string;\n}",
    "placeholder?: string;\n  evidence?: { id: string; title: string; type: string; url: string; }[];\n}"
  );

  file = file.replace(
    "const MenuBar = ({ editor }: { editor: any }) => {",
    "import { Paperclip, Image as ImageIcon, FileVideo } from 'lucide-react';\n\nconst MenuBar = ({ editor, evidence }: { editor: any, evidence?: any[] }) => {"
  );

  const evidenceMenuCode = `
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
                    const linkHTML = \`<a href="\${ev.url}" class="text-indigo-600 underline font-medium cursor-pointer hover:text-indigo-800" target="_blank">\${icon} \${ev.title} (\${ev.id})</a>&nbsp;\`;
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
  );`;

  file = file.replace(
    "    </div>\n  );\n};",
    evidenceMenuCode
  );

  file = file.replace(
    "export default function RichTextEditor({ content, onChange, placeholder = 'Write something...' }: RichTextEditorProps) {",
    "export default function RichTextEditor({ content, onChange, placeholder = 'Write something...', evidence }: RichTextEditorProps) {"
  );

  file = file.replace(
    "<MenuBar editor={editor} />",
    "<MenuBar editor={editor} evidence={evidence} />"
  );
  
  fs.writeFileSync('src/components/RichTextEditor.tsx', file);
}
