const fs = require('fs');
let file = fs.readFileSync('src/pages/Login.tsx', 'utf8');

const idPasswordInputs = `
              {!useOtp ? (
                <div className="flex flex-wrap md:flex-nowrap items-end gap-4">
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
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {isLoginMode && (
                    <div className="w-full">
                      <label className="block text-sm font-semibold text-on-surface mb-2" htmlFor="loginPhone">
                        {text['login.phone']}
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Phone className="w-5 h-5 text-[#00b4d8]" />
                        </div>
                        <input 
                          className="bg-white/50 block w-full pl-10 pr-3 py-2 border border-white/60 rounded-lg text-on-surface text-sm transition-all duration-200 focus:bg-white/80 focus:ring-2 focus:ring-primary/50 outline-none" 
                          id="loginPhone" 
                          placeholder="Enter Phone Number" 
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          required
                          disabled={otpSent}
                        />
                      </div>
                    </div>
                  )}

                  {otpSent && (
                    <div className="w-full">
                      <label className="block text-sm font-semibold text-on-surface mb-2" htmlFor="otp">
                        Enter OTP
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Lock className="w-5 h-5 text-[#00b4d8]" />
                        </div>
                        <input 
                          className="bg-white/50 block w-full pl-10 pr-3 py-2 border border-white/60 rounded-lg text-on-surface text-sm transition-all duration-200 focus:bg-white/80 focus:ring-2 focus:ring-primary/50 outline-none" 
                          id="otp" 
                          placeholder="Enter 6-digit OTP" 
                          type="text"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  )}
                  
                  <button 
                    className="w-full bg-gradient-to-r from-primary to-[#00b4d8] text-white px-6 py-2 rounded-lg font-semibold shadow-md hover:scale-105 transition-transform flex items-center justify-center disabled:opacity-50 h-[42px]" 
                    type="submit"
                    disabled={isLoading}
                  >
                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (!otpSent ? "Send OTP" : "Verify & Login")}
                  </button>
                </div>
              )}
`;

file = file.replace(
  /<div className="flex flex-wrap md:flex-nowrap items-end gap-4">[\s\S]*?<\/button>\s*<\/div>/,
  idPasswordInputs
);

const otpToggle = `
              <div className="text-sm font-semibold mt-4 text-center mb-2">
                <button
                  type="button"
                  onClick={() => {
                    setUseOtp(!useOtp);
                    setOtpSent(false);
                    setOtp('');
                  }}
                  className="text-primary hover:underline hover:text-[#00b4d8] transition-colors"
                >
                  {useOtp ? "Use ID & Password instead" : "Login with Phone (OTP)"}
                </button>
              </div>
`;

file = file.replace(
  /<div className="text-sm font-semibold mt-6 text-center">/,
  otpToggle + '\n              <div className="text-sm font-semibold mt-6 text-center">'
);

fs.writeFileSync('src/pages/Login.tsx', file);
