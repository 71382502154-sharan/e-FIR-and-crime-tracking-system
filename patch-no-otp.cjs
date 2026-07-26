const fs = require('fs');
let file = fs.readFileSync('src/pages/Login.tsx', 'utf8');

file = file.replace(
  "const [role, setRole] = useState<'citizen' | 'officer'>('citizen');",
  "const [role, setRole] = useState<'citizen' | 'officer' | 'admin'>('citizen');"
);

const loginSubmitFind = `    if (role === 'citizen') {
      navigate('/citizen');
    } else {
      navigate('/police');
    }`;

const loginSubmitReplace = `    if (role === 'citizen') {
      navigate('/citizen');
    } else if (role === 'officer') {
      navigate('/police');
    } else {
      navigate('/admin');
    }`;

file = file.replace(loginSubmitFind, loginSubmitReplace);

const roleToggleFind = `<div className="flex p-1 bg-white/40 rounded-lg mb-8 relative border border-white/50 shadow-inner overflow-hidden">
              <div 
                className={cn(
                  "absolute inset-y-1 w-[calc(50%-4px)] bg-white rounded-md shadow-sm transition-transform duration-300 ease-in-out",
                  role === 'officer' ? "translate-x-full" : "translate-x-0"
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
            </div>`;

const roleToggleReplace = `<div className="flex p-1 bg-white/40 rounded-lg mb-8 relative border border-white/50 shadow-inner overflow-hidden">
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
                onClick={() => setRole('admin')}
                type="button"
              >
                Admin
              </button>
            </div>`;

file = file.replace(roleToggleFind, roleToggleReplace);

const extraFieldsFind = `{!isLoginMode && (`;
const extraFieldsReplace = `{!isLoginMode && role !== 'admin' && (`;

file = file.replace(extraFieldsFind, extraFieldsReplace);

const formBottomFind = `                      {role === 'citizen' ? text['login.userId'] : text['login.officerId']}`;
const formBottomReplace = `                      {role === 'citizen' ? text['login.userId'] : role === 'officer' ? text['login.officerId'] : 'Admin ID'}`;

file = file.replace(formBottomFind, formBottomReplace);

fs.writeFileSync('src/pages/Login.tsx', file);
