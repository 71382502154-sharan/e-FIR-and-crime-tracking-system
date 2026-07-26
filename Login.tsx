import { jsPDF } from 'jspdf';
import { FIR, User } from '../types';
import { format } from 'date-fns';

export const generateFIRPdf = (fir: FIR, user: User | null) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Colors
  const primaryColor = '#1a365d';
  const secondaryColor = '#4a5568';
  const accentColor = '#3182ce';

  // Title / Header
  doc.setFillColor(26, 54, 93); // primaryColor rgb equivalent
  doc.rect(0, 0, pageWidth, 40, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('First Information Report (FIR)', pageWidth / 2, 20, { align: 'center' });
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(`Official Document - Karnataka State Police`, pageWidth / 2, 30, { align: 'center' });

  // Reset text color
  doc.setTextColor(0, 0, 0);
  
  let yPos = 60;
  const leftMargin = 20;

  const checkPageBreak = (neededHeight: number) => {
    if (yPos + neededHeight > doc.internal.pageSize.getHeight() - 25) {
      doc.addPage();
      yPos = 20;
    }
  };

  const addSectionTitle = (title: string) => {
    checkPageBreak(20);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(26, 54, 93);
    doc.text(title, leftMargin, yPos);
    
    // Underline
    doc.setDrawColor(200, 200, 200);
    doc.line(leftMargin, yPos + 2, pageWidth - leftMargin, yPos + 2);
    
    yPos += 12;
    doc.setTextColor(0, 0, 0);
  };

  const addField = (label: string, value: string) => {
    checkPageBreak(10);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text(`${label}:`, leftMargin, yPos);
    
    doc.setFont('helvetica', 'normal');
    doc.text(value, leftMargin + 40, yPos);
    yPos += 8;
  };

  // 1. FIR Details
  addSectionTitle('FIR Details');
  addField('FIR Number', fir.firNumber);
  addField('Date Filed', format(new Date(fir.dateFiled), 'dd MMM yyyy, HH:mm'));
  addField('Status', fir.status);
  addField('Severity', fir.severity);
  addField('Type', fir.type);
  addField('Station', fir.station);
  addField('Location / Address', fir.location || 'Not Provided');
  addField('Incident Date', fir.incidentDate ? `${fir.incidentDate} ${fir.incidentTime || ''}` : 'Not Provided');
  
  yPos += 5;

  // 2. Complainant Details
  addSectionTitle('Complainant Details');
  addField('Name', user?.name || 'N/A');
  addField('Citizen ID', user?.id || 'N/A');
  addField('Role', user?.role === 'citizen' ? 'Citizen' : 'Officer');

  yPos += 5;

  // 3. Incident Details
  addSectionTitle('Incident Details');
  addField('Title', fir.title);
  
  yPos += 5;
  checkPageBreak(20);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Description:', leftMargin, yPos);
  
  yPos += 7;
  doc.setFont('helvetica', 'normal');
  const splitDescription = doc.splitTextToSize(fir.description, pageWidth - leftMargin * 2);
  
  // handle splitDescription page breaks
  splitDescription.forEach((line: string) => {
    checkPageBreak(7);
    doc.text(line, leftMargin, yPos);
    yPos += 7;
  });

  yPos += 5;

  // Assigned Officers
  if (fir.assignedOfficers && fir.assignedOfficers.length > 0) {
    addSectionTitle('Assigned Officers');
    addField('Officer IDs', fir.assignedOfficers.join(', '));
    yPos += 5;
  }

  // Case Entities
  if (fir.entities && fir.entities.length > 0) {
    addSectionTitle('Case Entities');
    fir.entities.forEach(entity => {
      addField(entity.type.toUpperCase(), entity.name);
    });
    yPos += 5;
  }

  // Case Notes
  if (fir.notes && fir.notes.length > 0) {
    addSectionTitle('Case Notes');
    fir.notes.forEach(note => {
      checkPageBreak(20);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text(`${note.authorName} (${format(new Date(note.createdAt), 'dd MMM yyyy, HH:mm')}):`, leftMargin, yPos);
      yPos += 6;
      
      doc.setFont('helvetica', 'normal');
      const splitNote = doc.splitTextToSize(note.content, pageWidth - leftMargin * 2);
      splitNote.forEach((line: string) => {
        checkPageBreak(6);
        doc.text(line, leftMargin, yPos);
        yPos += 6;
      });
      yPos += 4;
    });
    yPos += 5;
  }

  // AI Intelligence
  if (fir.aiAnalysis) {
    addSectionTitle('AI Case Intelligence');
    addField('Risk Score', `${fir.aiAnalysis.riskScore}%`);
    if (fir.aiAnalysis.moPattern) {
      addField('MO Pattern', fir.aiAnalysis.moPattern);
    }
    
    yPos += 5;
    checkPageBreak(15);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('Summary:', leftMargin, yPos);
    yPos += 6;
    
    doc.setFont('helvetica', 'normal');
    const splitSummary = doc.splitTextToSize(fir.aiAnalysis.summary, pageWidth - leftMargin * 2);
    splitSummary.forEach((line: string) => {
      checkPageBreak(6);
      doc.text(line, leftMargin, yPos);
      yPos += 6;
    });
    
    yPos += 5;
    if (fir.aiAnalysis.recommendedActions && fir.aiAnalysis.recommendedActions.length > 0) {
      checkPageBreak(15);
      doc.setFont('helvetica', 'bold');
      doc.text('Recommended Actions:', leftMargin, yPos);
      yPos += 6;
      doc.setFont('helvetica', 'normal');
      fir.aiAnalysis.recommendedActions.forEach(action => {
        const splitAction = doc.splitTextToSize(`- ${action}`, pageWidth - leftMargin * 2);
        splitAction.forEach((line: string) => {
          checkPageBreak(6);
          doc.text(line, leftMargin, yPos);
          yPos += 6;
        });
      });
    }
    yPos += 5;
  }
  
  // 4. Evidence Details
  if (fir.evidence && fir.evidence.length > 0) {
    addSectionTitle('Evidence Attached');
    fir.evidence.forEach(ev => {
      addField('Title', ev.title);
      addField('Type', ev.type.toUpperCase());
      addField('Reference ID', ev.id);
      
      if (ev.type === 'image' && ev.url && ev.url.startsWith('data:image')) {
        checkPageBreak(90);
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

  // Footer
  const pageHeight = doc.internal.pageSize.getHeight();
  doc.setFontSize(10);
  doc.setTextColor(128, 128, 128);
  doc.text(`Generated on: ${format(new Date(), 'dd MMM yyyy, HH:mm')}`, leftMargin, pageHeight - 20);
  doc.text('This is an electronically generated report and does not require a physical signature.', pageWidth / 2, pageHeight - 15, { align: 'center' });

  // Save the PDF
  doc.save(`${fir.firNumber.replace(/\s+/g, '_')}_Report.pdf`);
};

export const generatePoliceReportPdf = (firs: FIR[], user: User | null) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Title / Header
  doc.setFillColor(26, 54, 93);
  doc.rect(0, 0, pageWidth, 40, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('Police Station FIR Report', pageWidth / 2, 20, { align: 'center' });
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(`Generated by: ${user?.name || 'Officer'} | Station: ${user?.station || 'Central Zone'}`, pageWidth / 2, 30, { align: 'center' });

  // Reset text color
  doc.setTextColor(0, 0, 0);
  
  let yPos = 50;
  const leftMargin = 15;

  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Summary', leftMargin, yPos);
  
  yPos += 10;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text(`Total FIRs: ${firs.length}`, leftMargin, yPos);
  doc.text(`Pending Verification: ${firs.filter(f => f.status === 'Pending Verification').length}`, leftMargin + 50, yPos);
  doc.text(`High Severity: ${firs.filter(f => f.severity === 'High').length}`, leftMargin + 120, yPos);

  yPos += 20;
  
  // Table Header
  doc.setFillColor(240, 240, 240);
  doc.rect(leftMargin, yPos - 5, pageWidth - leftMargin * 2, 10, 'F');
  
  doc.setFont('helvetica', 'bold');
  doc.text('FIR No.', leftMargin + 2, yPos + 1);
  doc.text('Date', leftMargin + 40, yPos + 1);
  doc.text('Type', leftMargin + 80, yPos + 1);
  doc.text('Severity', leftMargin + 120, yPos + 1);
  doc.text('Status', leftMargin + 150, yPos + 1);

  yPos += 10;
  doc.setFont('helvetica', 'normal');

  firs.forEach((fir, index) => {
    if (yPos > doc.internal.pageSize.getHeight() - 30) {
      doc.addPage();
      yPos = 20;
      
      // Table Header on new page
      doc.setFillColor(240, 240, 240);
      doc.rect(leftMargin, yPos - 5, pageWidth - leftMargin * 2, 10, 'F');
      
      doc.setFont('helvetica', 'bold');
      doc.text('FIR No.', leftMargin + 2, yPos + 1);
      doc.text('Date', leftMargin + 40, yPos + 1);
      doc.text('Type', leftMargin + 80, yPos + 1);
      doc.text('Severity', leftMargin + 120, yPos + 1);
      doc.text('Status', leftMargin + 150, yPos + 1);
      
      yPos += 10;
      doc.setFont('helvetica', 'normal');
    }

    doc.text(fir.firNumber.substring(0, 15), leftMargin + 2, yPos);
    doc.text(format(new Date(fir.dateFiled), 'MM/dd/yyyy'), leftMargin + 40, yPos);
    doc.text(fir.type.substring(0, 15), leftMargin + 80, yPos);
    doc.text(fir.severity, leftMargin + 120, yPos);
    doc.text(fir.status.substring(0, 15), leftMargin + 150, yPos);
    
    yPos += 8;
  });

  // Footer
  const pageHeight = doc.internal.pageSize.getHeight();
  doc.setFontSize(10);
  doc.setTextColor(128, 128, 128);
  doc.text(`Generated on: ${format(new Date(), 'dd MMM yyyy, HH:mm')}`, leftMargin, pageHeight - 10);
  doc.text('Official internal report.', pageWidth / 2, pageHeight - 10, { align: 'center' });

  doc.save(`Station_Report_${format(new Date(), 'yyyy-MM-dd')}.pdf`);
};
