const fs = require('fs');
let file = fs.readFileSync('src/pages/FileFIR.tsx', 'utf8');

file = file.replace(
  /addFIR\(\{\s*title: formData.title \|\| formData.crimeType \|\| 'Incident Report',\s*description: formData.description,\s*type: formData.crimeType,\s*station: 'Central Zone',\s*severity: 'Medium'\s*\}\);/m,
  `// Convert evidence files to base64 for the PDF and store
      Promise.all(formData.evidenceFiles.map(file => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            resolve({
              id: 'EVID-' + Math.random().toString(36).substr(2, 6).toUpperCase(),
              title: file.name,
              type: file.type.startsWith('image/') ? 'image' : file.type.startsWith('video/') ? 'video' : 'document',
              url: reader.result
            });
          };
          reader.readAsDataURL(file);
        });
      })).then((evidenceArray) => {
        addFIR({
          title: formData.title || formData.crimeType || 'Incident Report',
          description: formData.description,
          type: formData.crimeType,
          station: 'Central Zone',
          severity: 'Medium',
          location: formData.address,
          incidentDate: formData.incidentDate,
          incidentTime: formData.incidentTime,
          evidence: evidenceArray as any[]
        });
        toast.success('FIR successfully submitted!');
        navigate('/citizen');
      });`
);

fs.writeFileSync('src/pages/FileFIR.tsx', file);
