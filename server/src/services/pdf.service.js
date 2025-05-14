const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../uploads/invoices');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

/**
 * Generate a PDF invoice for a doctor with their patient list
 * @param {Array} patients - Array of patient objects
 * @param {Object} doctor - Doctor object
 * @returns {Promise<string>} - Path to the generated PDF file
 */
exports.generateDoctorInvoicePdf = async (patients, doctor) => {
  return new Promise((resolve, reject) => {
    try {
      // Generate a unique filename
      const timestamp = new Date().getTime();
      const filename = `invoice_${doctor.id}_${timestamp}.pdf`;
      const filePath = path.join(uploadsDir, filename);
      
      // Create a PDF document
      const doc = new PDFDocument({ margin: 50 });
      const stream = fs.createWriteStream(filePath);
      
      // Pipe the PDF to the file
      doc.pipe(stream);
      
      // Add header
      doc.fontSize(20).text('INVOICE', { align: 'center' });
      doc.moveDown();
      
      // Add doctor info
      doc.fontSize(16).text(`Doctor: ${doctor.name}`);
      doc.fontSize(12).text(`Specialty: ${doctor.specialty}`);
      doc.fontSize(12).text(`Email: ${doctor.email}`);
      doc.moveDown();
      
      // Add invoice details
      const invoiceDate = new Date().toLocaleDateString();
      const invoiceNumber = `INV-${timestamp.toString().substring(0, 10)}`;
      
      doc.fontSize(12).text(`Invoice Number: ${invoiceNumber}`);
      doc.fontSize(12).text(`Date: ${invoiceDate}`);
      doc.moveDown();
      
      // Add patient table header
      doc.fontSize(14).text('Patient List', { underline: true });
      doc.moveDown(0.5);
      
      // Define table layout
      const tableTop = doc.y;
      const tableLeft = 50;
      const colWidths = [40, 150, 80, 120, 120];
      
      // Draw table header
      doc.fontSize(10).font('Helvetica-Bold');
      doc.text('No.', tableLeft, tableTop);
      doc.text('Patient Name', tableLeft + colWidths[0], tableTop);
      doc.text('Gender', tableLeft + colWidths[0] + colWidths[1], tableTop);
      doc.text('Contact Number', tableLeft + colWidths[0] + colWidths[1] + colWidths[2], tableTop);
      doc.text('Email', tableLeft + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3], tableTop);
      
      // Draw horizontal line
      doc.moveTo(tableLeft, tableTop + 15)
         .lineTo(tableLeft + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3] + colWidths[4], tableTop + 15)
         .stroke();
      
      // Draw patient rows
      doc.font('Helvetica');
      let rowTop = tableTop + 25;
      
      patients.forEach((patient, index) => {
        // Check if we need a new page
        if (rowTop > doc.page.height - 100) {
          doc.addPage();
          rowTop = 50;
          
          // Redraw header on new page
          doc.fontSize(10).font('Helvetica-Bold');
          doc.text('No.', tableLeft, rowTop);
          doc.text('Patient Name', tableLeft + colWidths[0], rowTop);
          doc.text('Gender', tableLeft + colWidths[0] + colWidths[1], rowTop);
          doc.text('Contact Number', tableLeft + colWidths[0] + colWidths[1] + colWidths[2], rowTop);
          doc.text('Email', tableLeft + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3], rowTop);
          
          // Draw horizontal line
          doc.moveTo(tableLeft, rowTop + 15)
             .lineTo(tableLeft + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3] + colWidths[4], rowTop + 15)
             .stroke();
          
          rowTop += 25;
          doc.font('Helvetica');
        }
        
        doc.text((index + 1).toString(), tableLeft, rowTop);
        doc.text(patient.name, tableLeft + colWidths[0], rowTop);
        doc.text(patient.gender, tableLeft + colWidths[0] + colWidths[1], rowTop);
        doc.text(patient.contactNumber, tableLeft + colWidths[0] + colWidths[1] + colWidths[2], rowTop);
        doc.text(patient.email, tableLeft + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3], rowTop);
        
        rowTop += 20;
      });
      
      // Add footer
      doc.fontSize(10).text('This is an automatically generated invoice.', { align: 'center' });
      
      // Finalize the PDF
      doc.end();
      
      // When the stream is finished, resolve with the file path
      stream.on('finish', () => {
        resolve(filePath);
      });
      
      stream.on('error', (err) => {
        reject(err);
      });
      
    } catch (error) {
      reject(error);
    }
  });
};