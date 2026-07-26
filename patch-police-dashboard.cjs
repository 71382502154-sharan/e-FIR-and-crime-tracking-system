const fs = require('fs');
let file = fs.readFileSync('src/pages/Login.tsx', 'utf8');

const loginFind = `  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoginMode) {
      login(id, role);
    } else {
      signup(id, role, name || 'New User');
    }`;

const loginReplace = `  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (role === 'admin') {
      if (id !== 'ksp@2026.government.in' || password !== '16092007') {
        toast.error('Invalid admin credentials');
        return;
      }
    }
    
    if (isLoginMode) {
      login(id, role);
    } else {
      signup(id, role, name || 'New User');
    }`;

file = file.replace(loginFind, loginReplace);
fs.writeFileSync('src/pages/Login.tsx', file);
