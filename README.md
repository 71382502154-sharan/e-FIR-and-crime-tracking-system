const fs = require('fs');
let file = fs.readFileSync('src/components/ProfileModal.tsx', 'utf8');

file = file.replace(
  "import { X, UserCircle, Phone, Mail, MapPin } from 'lucide-react';",
  "import { X, UserCircle, Phone, Mail, MapPin, Navigation, Loader2 } from 'lucide-react';"
);

file = file.replace(
  "const [area, setArea] = useState(user?.area || '');",
  "const [area, setArea] = useState(user?.area || '');\n  const [isGettingLocation, setIsGettingLocation] = useState(false);"
);

fs.writeFileSync('src/components/ProfileModal.tsx', file);
