const fs = require('fs');
let file = fs.readFileSync('src/pages/Login.tsx', 'utf8');

const match = /\{!useOtp \? \([\s\S]*?\{isLoading \? <Loader2 className="w-5 h-5 animate-spin" \/> : \(\!otpSent \? "Send OTP" : "Verify & Login"\)\}\s*<\/button>\s*<\/div>\s*\)\}/m;

const replacement = `<div className="flex flex-wrap md:flex-nowrap items-end gap-4">
                  <div className="flex-1 min-w-[200px]">
                    <label className="block text-sm font-semibold text-on-surface mb-2" htmlFor="userId">
                      {role === 'citizen' ? text['login.userId'] : text['login.officerId']}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Badge className="w-5 h-5 text-[#00b4d8]" />
                      </div>
                      <input 
                        className="bg-white/50 block w-full pl-10 pr-3 py-2 border border-white/60 rounded-lg text-on-surface text-sm transition-all duration-200 focus:bg-white/80 focus:ring-2 focus:ring-primary/50 outline-none" 
                        id="userId" 
                        placeholder="Enter ID" 
                        type="text"
                        value={id}
                        onChange={(e) => setId(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="flex-1 min-w-[200px]">
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-sm font-semibold text-on-surface" htmlFor="password">{text['login.password']}</label>
                      {isLoginMode && (
                        <a className="text-[10px] font-semibold text-primary hover:text-[#00b4d8] transition-colors hover:underline" href="#">{text['login.forgot']}</a>
                      )}
                    </div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="w-5 h-5 text-[#00b4d8]" />
                      </div>
                      <input 
                        className="bg-white/50 block w-full pl-10 pr-10 py-2 border border-white/60 rounded-lg text-on-surface text-sm transition-all duration-200 focus:bg-white/80 focus:ring-2 focus:ring-primary/50 outline-none" 
                        id="password" 
                        placeholder="Enter Password" 
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <button 
                    className="bg-gradient-to-r from-primary to-[#00b4d8] text-white px-6 py-2 rounded-lg font-semibold shadow-md hover:scale-105 transition-transform h-[42px] flex-shrink-0 disabled:opacity-50" 
                    type="submit"
                    disabled={isLoading}
                  >
                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (isLoginMode ? text['login.submit'] : text['login.signup'])}
                  </button>
                </div>`;

file = file.replace(match, replacement);

fs.writeFileSync('src/pages/Login.tsx', file);
