const fs = require('fs');
let file = fs.readFileSync('src/pages/Login.tsx', 'utf8');

file = file.replace(
  "import { supabase } from '../lib/supabase';",
  "import { supabase, isMockSupabase } from '../lib/supabase';"
);

const handleSendOtpReplacement = `
  const handleSendOtp = async () => {
    if (!phone) {
      toast.error('Please enter a phone number');
      return;
    }
    setIsLoading(true);
    try {
      if (isMockSupabase) {
        // Simulate OTP send for mock backend
        setTimeout(() => {
          setOtpSent(true);
          toast.success('Mock OTP sent to your phone (123456)');
          setIsLoading(false);
        }, 1000);
        return;
      }

      const { error } = await supabase.auth.signInWithOtp({
        phone: phone.startsWith('+') ? phone : '+91' + phone, // Assuming India by default if no country code
      });
      if (error) throw error;
      setOtpSent(true);
      toast.success('OTP sent to your phone');
    } catch (error: any) {
      toast.error(error.message || 'Failed to send OTP');
    } finally {
      if (!isMockSupabase) setIsLoading(false);
    }
  };
`;

const handleVerifyOtpReplacement = `
  const handleVerifyOtp = async () => {
    if (!otp) {
      toast.error('Please enter the OTP');
      return;
    }
    setIsLoading(true);
    try {
      if (isMockSupabase) {
        // Simulate OTP verification
        setTimeout(() => {
          if (otp === '123456') {
            toast.success('Phone verified successfully');
            if (isLoginMode) {
              login(phone, role);
            } else {
              signup(phone, role, name || 'New User');
            }
            if (role === 'citizen') navigate('/citizen');
            else navigate('/police');
          } else {
            toast.error('Invalid mock OTP. Use 123456');
          }
          setIsLoading(false);
        }, 1000);
        return;
      }

      const { error } = await supabase.auth.verifyOtp({
        phone: phone.startsWith('+') ? phone : '+91' + phone,
        token: otp,
        type: 'sms',
      });
      if (error) throw error;
      
      toast.success('Phone verified successfully');
      // Proceed with normal login/signup in the mock store
      if (isLoginMode) {
        login(phone, role);
      } else {
        signup(phone, role, name || 'New User');
      }
      
      if (role === 'citizen') navigate('/citizen');
      else navigate('/police');
      
    } catch (error: any) {
      toast.error(error.message || 'Failed to verify OTP');
    } finally {
      if (!isMockSupabase) setIsLoading(false);
    }
  };
`;

file = file.replace(/const handleSendOtp = async \(\) => \{[\s\S]*?const handleVerifyOtp/m, handleSendOtpReplacement.trim() + "\n\n  const handleVerifyOtp");
file = file.replace(/const handleVerifyOtp = async \(\) => \{[\s\S]*?const handleLogin =/m, handleVerifyOtpReplacement.trim() + "\n\n  const handleLogin =");

fs.writeFileSync('src/pages/Login.tsx', file);
