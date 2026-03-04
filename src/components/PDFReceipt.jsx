'use client';

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const generateReceipt = (bookingDetails) => {
  const {
    bookingNumber,
    businessName,
    serviceName,
    clientName,
    clientPhone,
    amount,
    date,
    time,
    transactionCode,
    paymentDate,
  } = bookingDetails;

  // Create new PDF document
  const doc = new jsPDF();
  
  // Set colors
  const primaryColor = [16, 185, 129]; // Emerald green
  const secondaryColor = [31, 41, 55]; // Gray-800
  
  // Header
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(0, 0, 210, 40, 'F');
  
  // Logo/Title
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('LunaPay', 105, 25, { align: 'center' });
  doc.setFontSize(12);
  doc.text('Payment Receipt', 105, 35, { align: 'center' });
  
  // Receipt Info
  doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
  doc.setFontSize(10);
  doc.text(`Receipt #: ${bookingNumber || 'N/A'}`, 20, 55);
  doc.text(`Date: ${new Date().toLocaleDateString('en-KE')}`, 20, 62);
  doc.text(`Time: ${new Date().toLocaleTimeString('en-KE')}`, 20, 69);
  
  // Business Details
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Business Details', 20, 85);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.text(`Business: ${businessName || 'N/A'}`, 20, 95);
  doc.text(`Service: ${serviceName || 'N/A'}`, 20, 102);
  
  // Customer Details
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Customer Details', 20, 119);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.text(`Name: ${clientName || 'N/A'}`, 20, 129);
  doc.text(`Phone: ${clientPhone || 'N/A'}`, 20, 136);
  
  // Appointment Details
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Appointment Details', 20, 153);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.text(`Date: ${date || 'N/A'}`, 20, 163);
  doc.text(`Time: ${time || 'N/A'}`, 20, 170);
  
  // Payment Table - using autoTable properly
  autoTable(doc, {
    startY: 185,
    head: [['Description', 'Amount (KES)']],
    body: [
      [serviceName || 'Service Fee', `KES ${amount || 0}`],
    ],
    foot: [['Total', `KES ${amount || 0}`]],
    theme: 'striped',
    headStyles: { fillColor: primaryColor },
    footStyles: { fillColor: [243, 244, 246], textColor: secondaryColor, fontStyle: 'bold' },
    margin: { left: 20, right: 20 },
  });
  
  // Transaction Details
  const finalY = doc.lastAutoTable.finalY + 10;
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Transaction Details', 20, finalY);
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(`Transaction Code: ${transactionCode || 'N/A'}`, 20, finalY + 7);
  doc.text(`Payment Method: M-Pesa`, 20, finalY + 14);
  doc.text(`Payment Date: ${paymentDate || new Date().toLocaleDateString('en-KE')}`, 20, finalY + 21);
  doc.text(`Payment Status: Paid`, 20, finalY + 28);
  
  // Footer
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(
      'This is a computer-generated receipt. Valid without signature.',
      105,
      285,
      { align: 'center' }
    );
    doc.text(`Page ${i} of ${pageCount}`, 195, 290, { align: 'right' });
  }
  
  return doc;
};

export const downloadReceipt = (bookingDetails) => {
  try {
    const doc = generateReceipt(bookingDetails);
    doc.save(`receipt-${bookingDetails.bookingNumber || 'booking'}.pdf`);
  } catch (error) {
    console.error('Error generating receipt:', error);
    alert('Failed to generate receipt. Please try again.');
  }
};

export const viewReceipt = (bookingDetails) => {
  try {
    const doc = generateReceipt(bookingDetails);
    const pdfBlob = doc.output('blob');
    const pdfUrl = URL.createObjectURL(pdfBlob);
    window.open(pdfUrl, '_blank');
  } catch (error) {
    console.error('Error viewing receipt:', error);
    alert('Failed to view receipt. Please try again.');
  }
};