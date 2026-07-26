const fs = require('fs');
let file = fs.readFileSync('src/pages/Login.tsx', 'utf8');

file = file.replace(
  "const [useOtp, setUseOtp] = useState(false);\n  const [otp, setOtp] = useState('');\n  const [otpSent, setOtpSent] = useState(false);\n",
  ""
);

file = file.replace(
  `  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (useOtp && !otpSent) {
      handleSendOtp();
      return;
    }
    
    if (useOtp && otpSent) {
      handleVerifyOtp();
      return;
    }

    e.preventDefault();`,
  `  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();`
);

const handleSendOtpBlock = `  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser');
      return;
    }

    setIsGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          // Simple reverse geocoding using Nominatim (OpenStreetMap)
          const response = await fetch(\`https://nominatim.openstreetmap.org/reverse?format=json&lat=\${latitude}&lon=\${longitude}\`);
          if (!response.ok) throw new Error('Failed to fetch address');
          const data = await response.json();
          setArea(data.display_name || \`\${latitude.toFixed(4)}, \${longitude.toFixed(4)}\`);
          toast.success('Location fetched successfully');
        } catch (error) {
          console.error(error);
          setArea(\`\${position.coords.latitude.toFixed(4)}, \${position.coords.longitude.toFixed(4)}\`);
          toast.success('Coordinates fetched');
        } finally {
          setIsGettingLocation(false);
        }
      },
      (error) => {
        console.error(error);
        toast.error('Failed to get location. Please allow location access.');
        setIsGettingLocation(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

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
          toast.success('OTP sent to your phone');
          setIsLoading(false);
        }, 1000);
        return;
      }

      const { data, error } = await supabase.auth.signInWithOtp({
        phone: phone.startsWith('+') ? phone : '+91' + phone, // Must be in full E.164 international format (with the '+' sign)
      });
      if (error) {
        console.error('Error sending OTP:', error.message);
        throw error;
      } else {
        console.log('OTP sent successfully!');
      }
      setOtpSent(true);
      toast.success('OTP sent to your phone');
    } catch (error: any) {
      toast.error(error.message || 'Failed to send OTP');
    } finally {
      if (!isMockSupabase) setIsLoading(false);
    }
  };

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
          if (otp.length > 0) {
            toast.success('Phone verified successfully');
            if (isLoginMode) {
              login(phone, role);
            } else {
              signup(phone, role, name || 'New User');
            }
            if (role === 'citizen') navigate('/citizen');
            else navigate('/police');
          } else {
            toast.error('Invalid OTP');
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
      if (isLoginMode) {
        login(phone, role);
      } else {
        signup(phone, role, name || 'New User');
      }
      if (role === 'citizen') navigate('/citizen');
      else navigate('/police');
    } catch (error: any) {
      toast.error(error.message || 'Invalid OTP');
    } finally {
      if (!isMockSupabase) setIsLoading(false);
    }
  };`;

file = file.replace(handleSendOtpBlock, `  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser');
      return;
    }

    setIsGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          // Simple reverse geocoding using Nominatim (OpenStreetMap)
          const response = await fetch(\`https://nominatim.openstreetmap.org/reverse?format=json&lat=\${latitude}&lon=\${longitude}\`);
          if (!response.ok) throw new Error('Failed to fetch address');
          const data = await response.json();
          setArea(data.display_name || \`\${latitude.toFixed(4)}, \${longitude.toFixed(4)}\`);
          toast.success('Location fetched successfully');
        } catch (error) {
          console.error(error);
          setArea(\`\${position.coords.latitude.toFixed(4)}, \${position.coords.longitude.toFixed(4)}\`);
          toast.success('Coordinates fetched');
        } finally {
          setIsGettingLocation(false);
        }
      },
      (error) => {
        console.error(error);
        toast.error('Failed to get location. Please allow location access.');
        setIsGettingLocation(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };`);

fs.writeFileSync('src/pages/Login.tsx', file);
