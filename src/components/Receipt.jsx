'use client';

export const showReceipt = (bookingDetails) => {
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
  } = bookingDetails;

  const receiptWindow = window.open('', '_blank', 'width=800,height=600');
  
  receiptWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Payment Receipt - LunaPay</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 20px;
          background: #f3f4f6;
        }
        .receipt {
          max-width: 600px;
          margin: 0 auto;
          background: white;
          border-radius: 16px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.1);
          overflow: hidden;
        }
        .header {
          background: linear-gradient(135deg, #10b981, #059669);
          color: white;
          padding: 30px;
          text-align: center;
        }
        .header h1 {
          margin: 0;
          font-size: 32px;
          font-weight: bold;
        }
        .header p {
          margin: 10px 0 0;
          opacity: 0.9;
          font-size: 14px;
        }
        .content {
          padding: 30px;
        }
        .section {
          margin-bottom: 25px;
          padding-bottom: 20px;
          border-bottom: 1px solid #e5e7eb;
        }
        .section h2 {
          color: #111827;
          font-size: 18px;
          font-weight: 600;
          margin: 0 0 15px;
        }
        .row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 10px;
          font-size: 14px;
        }
        .label {
          color: #6b7280;
          font-weight: 500;
        }
        .value {
          color: #111827;
          font-weight: 600;
        }
        .total {
          background: #f3f4f6;
          padding: 15px;
          border-radius: 8px;
          margin-top: 20px;
        }
        .total .row {
          margin-bottom: 0;
          font-size: 16px;
        }
        .total .value {
          color: #059669;
          font-size: 20px;
        }
        .footer {
          background: #f9fafb;
          padding: 20px;
          text-align: center;
          color: #6b7280;
          font-size: 12px;
          border-top: 1px solid #e5e7eb;
        }
        .actions {
          padding: 20px;
          text-align: center;
          background: white;
          border-top: 1px solid #e5e7eb;
        }
        .btn {
          background: #059669;
          color: white;
          border: none;
          padding: 12px 30px;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          margin: 0 10px;
          transition: background 0.3s;
        }
        .btn:hover {
          background: #047857;
        }
        .btn-secondary {
          background: #6b7280;
        }
        .btn-secondary:hover {
          background: #4b5563;
        }
        @media print {
          .actions { display: none; }
        }
      </style>
    </head>
    <body>
      <div class="receipt">
        <div class="header">
          <h1>LunaPay</h1>
          <p>Payment Receipt</p>
        </div>
        
        <div class="content">
          <div class="section">
            <h2>Receipt Information</h2>
            <div class="row">
              <span class="label">Receipt Number:</span>
              <span class="value">${bookingNumber || 'N/A'}</span>
            </div>
            <div class="row">
              <span class="label">Date:</span>
              <span class="value">${new Date().toLocaleDateString('en-KE')}</span>
            </div>
            <div class="row">
              <span class="label">Time:</span>
              <span class="value">${new Date().toLocaleTimeString('en-KE')}</span>
            </div>
          </div>
          
          <div class="section">
            <h2>Business Details</h2>
            <div class="row">
              <span class="label">Business:</span>
              <span class="value">${businessName || 'N/A'}</span>
            </div>
            <div class="row">
              <span class="label">Service:</span>
              <span class="value">${serviceName || 'N/A'}</span>
            </div>
          </div>
          
          <div class="section">
            <h2>Customer Details</h2>
            <div class="row">
              <span class="label">Name:</span>
              <span class="value">${clientName || 'N/A'}</span>
            </div>
            <div class="row">
              <span class="label">Phone:</span>
              <span class="value">${clientPhone || 'N/A'}</span>
            </div>
          </div>
          
          <div class="section">
            <h2>Appointment Details</h2>
            <div class="row">
              <span class="label">Date:</span>
              <span class="value">${date || 'N/A'}</span>
            </div>
            <div class="row">
              <span class="label">Time:</span>
              <span class="value">${time || 'N/A'}</span>
            </div>
          </div>
          
          <div class="total">
            <div class="row">
              <span class="label">Total Amount:</span>
              <span class="value">KES ${amount || 0}</span>
            </div>
          </div>
          
          <div class="section" style="border-bottom: none;">
            <h2>Transaction Details</h2>
            <div class="row">
              <span class="label">Transaction Code:</span>
              <span class="value">${transactionCode || 'N/A'}</span>
            </div>
            <div class="row">
              <span class="label">Payment Method:</span>
              <span class="value">M-Pesa</span>
            </div>
            <div class="row">
              <span class="label">Payment Status:</span>
              <span class="value" style="color: #059669;">Paid</span>
            </div>
          </div>
        </div>
        
        <div class="actions">
          <button class="btn" onclick="window.print()">🖨️ Print Receipt</button>
          <button class="btn btn-secondary" onclick="window.close()">✖️ Close</button>
        </div>
        
        <div class="footer">
          <p>This is a computer-generated receipt. Valid without signature.</p>
          <p>Powered by LunaPay • Made for Kenya 🇰🇪</p>
        </div>
      </div>
    </body>
    </html>
  `);
  
  receiptWindow.document.close();
};