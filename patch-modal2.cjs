const fs = require('fs');
let file = fs.readFileSync('src/pages/Login.tsx', 'utf8');

if (!file.includes('Navigation')) {
  file = file.replace(
    "import { Globe, Shield, UserCircle, Home, FolderOpen, Scale, Bell, PlusSquare, Badge, Lock, Smile, Fingerprint, Loader2, Phone, Mail, MapPin, Upload, FileImage } from 'lucide-react';",
    "import { Globe, Shield, UserCircle, Home, FolderOpen, Scale, Bell, PlusSquare, Badge, Lock, Smile, Fingerprint, Loader2, Phone, Mail, MapPin, Upload, FileImage, Navigation } from 'lucide-react';"
  );
}

// Add state
file = file.replace(
  "const [isLoading, setIsLoading] = useState(false);",
  "const [isLoading, setIsLoading] = useState(false);\n  const [isGettingLocation, setIsGettingLocation] = useState(false);"
);

const handleGetLocationCode = `
  const handleGetLocation = () => {
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
`;

// Insert the code before handleSendOtp
file = file.replace(
  "const handleSendOtp = async () => {",
  handleGetLocationCode + "\n\n  const handleSendOtp = async () => {"
);

const locationInputMatch = `<input 
                        className="bg-white/50 block w-full pl-10 pr-3 py-2 border border-white/60 rounded-lg text-on-surface text-sm transition-all duration-200 focus:bg-white/80 focus:ring-2 focus:ring-primary/50 outline-none" 
                        id="area" 
                        placeholder="Enter Living Area" 
                        type="text"
                        value={area}
                        onChange={(e) => setArea(e.target.value)}
                        required={!isLoginMode}
                      />`;

const locationInputReplacement = `<input 
                        className="bg-white/50 block w-full pl-10 pr-10 py-2 border border-white/60 rounded-lg text-on-surface text-sm transition-all duration-200 focus:bg-white/80 focus:ring-2 focus:ring-primary/50 outline-none" 
                        id="area" 
                        placeholder="Enter Living Area" 
                        type="text"
                        value={area}
                        onChange={(e) => setArea(e.target.value)}
                        required={!isLoginMode}
                      />
                      <button 
                        type="button" 
                        onClick={handleGetLocation} 
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-primary hover:text-primary/80 transition-colors"
                        disabled={isGettingLocation}
                        title="Get Current Location"
                      >
                        {isGettingLocation ? <Loader2 className="w-5 h-5 animate-spin" /> : <Navigation className="w-5 h-5" />}
                      </button>`;

file = file.replace(locationInputMatch, locationInputReplacement);

fs.writeFileSync('src/pages/Login.tsx', file);
