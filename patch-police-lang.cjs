const fs = require('fs');
let file = fs.readFileSync('src/pages/Login.tsx', 'utf8');

file = file.replace(
  "import { cn } from '../lib/utils';",
  "import { cn } from '../lib/utils';\nimport { supabase } from '../lib/supabase';\nimport toast from 'react-hot-toast';"
);

file = file.replace(
  "const [idProofName, setIdProofName] = useState('');",
  "const [idProofName, setIdProofName] = useState('');\n  const [useOtp, setUseOtp] = useState(false);\n  const [otp, setOtp] = useState('');\n  const [otpSent, setOtpSent] = useState(false);\n  const [isLoading, setIsLoading] = useState(false);"
);

file = file.replace(
  "const handleLogin = (e: React.FormEvent) => {",
  `const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (useOtp && !otpSent) {
      handleSendOtp();
      return;
    }
    
    if (useOtp && otpSent) {
      handleVerifyOtp();
      return;
    }
`
);

const otpFunctions = `
  const handleSendOtp = async () => {
    if (!phone) {
      toast.error('Please enter a phone number');
      return;
    }
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        phone: phone.startsWith('+') ? phone : '+91' + phone, // Assuming India by default if no country code
      });
      if (error) throw error;
      setOtpSent(true);
      toast.success('OTP sent to your phone');
    } catch (error: any) {
      toast.error(error.message || 'Failed to send OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) {
      toast.error('Please enter the OTP');
      return;
    }
    setIsLoading(true);
    try {
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
      setIsLoading(false);
    }
  };
`;

file = file.replace(
  "const handleLogin = (e: React.FormEvent) => {",
  otpFunctions + "\n  const handleLogin = (e: React.FormEvent) => {"
);

fs.writeFileSync('src/pages/Login.tsx', file);
