const ExcelJS = require('exceljs');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../uploads/reports');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

/**
 * Generate an Excel file with patient data for a specific doctor
 * @param {Array} patients - Array of patient objects
 * @param {Object} doctor - Doctor object
 * @returns {Promise<string>} - Path to the generated Excel file
 */
exports.generateDoctorPatientsExcel = async (patients, doctor) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Patient List');
  
  // Add title with doctor info
  worksheet.mergeCells('A1:E1');
  const titleCell = worksheet.getCell('A1');
  titleCell.value = `Patient List for Dr. ${doctor.name} (${doctor.specialty})`;
  titleCell.font = { size: 16, bold: true };
  titleCell.alignment = { horizontal: 'center' };
  
  // Add header row
  worksheet.addRow(['No.', 'Patient Name', 'Gender', 'Contact Number', 'Email']);
  
  // Style header row
  const headerRow = worksheet.getRow(2);
  headerRow.eachCell((cell) => {
    cell.font = { bold: true };
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFD3D3D3' }
    };
    cell.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
  });
  
  // Add patient data
  patients.forEach((patient, index) => {
    worksheet.addRow([
      index + 1,
      patient.name,
      patient.gender,
      patient.contactNumber,
      patient.email
    ]);
  });
  
  // Style all cells
  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber > 2) {
      row.eachCell((cell) => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
      });
    }
  });
  
  // Auto-fit columns
  worksheet.columns.forEach(column => {
    column.width = 20;
  });
  
  // Generate a unique filename
  const timestamp = new Date().getTime();
  const filename = `doctor_${doctor.id}_patients_${timestamp}.xlsx`;
  const filePath = path.join(uploadsDir, filename);
  
  // Write to file
  await workbook.xlsx.writeFile(filePath);
  
  return filePath;
};