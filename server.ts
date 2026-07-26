const fs = require('fs');
let file = fs.readFileSync('src/pages/Login.tsx', 'utf8');

const match = /const handleSendOtp = async \(\) => \{[\s\S]*?const handleVerifyOtp = async \(\) => \{[\s\S]*?finally \{\s*if \(!isMockSupabase\) setIsLoading\(false\);\s*\}\s*\};/m;

file = file.replace(match, '');

fs.writeFileSync('src/pages/Login.tsx', file);
