const fs = require('fs');
let file = fs.readFileSync('src/lib/pdfGenerator.ts', 'utf8');

file = file.replace(
  "addField('Station', fir.station);\n  \n  yPos += 10;",
  "addField('Station', fir.station);\n  addField('Location / Address', fir.location || 'Not Provided');\n  addField('Incident Date', fir.incidentDate ? `${fir.incidentDate} ${fir.incidentTime || ''}` : 'Not Provided');\n  \n  yPos += 10;"
);

file = file.replace(
  "addField('Role', user?.role === 'citizen' ? 'Citizen' : 'Officer');\n  yPos += 10;",
  "addField('Role', user?.role === 'citizen' ? 'Citizen' : 'Officer');\n  addField('Phone', user?.phone || 'Not Provided');\n  addField('Email', user?.email || 'Not Provided');\n  addField('Address / Area', user?.area || 'Not Provided');\n  yPos += 10;"
);

const evidenceSection = `
  // 4. Evidence Details
  if (fir.evidence && fir.evidence.length > 0) {
    if (yPos > doc.internal.pageSize.getHeight() - 60) {
      doc.addPage();
      yPos = 20;
    }
    addSectionTitle('Evidence Attached');
    fir.evidence.forEach(ev => {
      if (yPos > doc.internal.pageSize.getHeight() - 40) {
        doc.addPage();
        yPos = 20;
      }
      addField('Title', ev.title);
      addField('Type', ev.type.toUpperCase());
      addField('Reference ID', ev.id);
      
      if (ev.type === 'image' && ev.url && ev.url.startsWith('data:image')) {
        try {
          doc.addImage(ev.url, 'JPEG', leftMargin, yPos, 80, 80);
          yPos += 85;
        } catch (e) {
          console.error("Could not add image to PDF", e);
        }
      } else if (ev.url && !ev.url.startsWith('data:')) {
         addField('Link', ev.url);
      }
      yPos += 10;
    });
  }
`;

file = file.replace(
  "// Footer",
  evidenceSection + "\n  // Footer"
);

fs.writeFileSync('src/lib/pdfGenerator.ts', file);
