const fs = require('fs');
let file = fs.readFileSync('src/pages/Login.tsx', 'utf8');

file = file.replace(
  "onClick={() => setRole('admin')}",
  "onClick={() => { setRole('admin'); setIsLoginMode(true); }}"
);

const forgotFind = `{isLoginMode && (
                        <a className="text-[10px] font-semibold text-primary hover:text-[#00b4d8] transition-colors hover:underline" href="#">{text['login.forgot']}</a>
                      )}`;
const forgotReplace = `{isLoginMode && role !== 'admin' && (
                        <a className="text-[10px] font-semibold text-primary hover:text-[#00b4d8] transition-colors hover:underline" href="#">{text['login.forgot']}</a>
                      )}`;
file = file.replace(forgotFind, forgotReplace);

const signupFind = `<div className="text-sm font-semibold mt-6 text-center">
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
              </div>`;
const signupReplace = `{role !== 'admin' && (
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
              )}`;
file = file.replace(signupFind, signupReplace);

fs.writeFileSync('src/pages/Login.tsx', file);
