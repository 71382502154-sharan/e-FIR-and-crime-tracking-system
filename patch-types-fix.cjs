const fs = require('fs');
let file = fs.readFileSync('src/components/ProfileModal.tsx', 'utf8');

if (!file.includes('Navigation')) {
  file = file.replace(
    "import { X, User, Phone, Mail, MapPin } from 'lucide-react';",
    "import { X, User, Phone, Mail, MapPin, Navigation, Loader2 } from 'lucide-react';"
  );
}

file = file.replace(
  "const [area, setArea] = useState(user.area || '');",
  "const [area, setArea] = useState(user.area || '');\n  const [isGettingLocation, setIsGettingLocation] = useState(false);"
);

const handleGetLocationCode = `
  const handleGetLocation = () => {
    if (!navigator.geolocation) return;
    setIsGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const response = await fetch(\`https://nominatim.openstreetmap.org/reverse?format=json&lat=\${latitude}&lon=\${longitude}\`);
          if (!response.ok) throw new Error('Failed to fetch address');
          const data = await response.json();
          setArea(data.display_name || \`\${latitude.toFixed(4)}, \${longitude.toFixed(4)}\`);
        } catch (error) {
          console.error(error);
          setArea(\`\${position.coords.latitude.toFixed(4)}, \${position.coords.longitude.toFixed(4)}\`);
        } finally {
          setIsGettingLocation(false);
        }
      },
      () => {
        setIsGettingLocation(false);
      }
    );
  };
`;

file = file.replace(
  "const handleSubmit = (e: React.FormEvent) => {",
  handleGetLocationCode + "\n\n  const handleSubmit = (e: React.FormEvent) => {"
);

const locationInputMatch = `<input 
                type="text"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/50 outline-none"
              />`;

const locationInputReplacement = `<input 
                type="text"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                className="w-full pl-10 pr-10 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/50 outline-none"
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

fs.writeFileSync('src/components/ProfileModal.tsx', file);
