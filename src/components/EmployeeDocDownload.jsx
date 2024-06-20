import React, { useState } from "react";
import { jsPDF } from "jspdf";
import { Button, CircularProgress, Grid } from "@mui/material";
import PlaceholderImage from '../../src/assets/placeholderImage.jpg'
const EmployeeDocDownload = ({ employeeDocuments }) => {
  console.log(employeeDocuments, "employeeDocuments");
  const [loading, setLoading] = useState(false);

  const generatePdf = () => {
    setLoading(true);
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // Centering function
    const centerText = (text, y, fontSize = 12, bold = false) => {
      if (bold) {
        doc.setFont("helvetica", "bold");
      } else {
        doc.setFont("helvetica", "normal");
      }
      doc.setFontSize(fontSize);
      const textWidth = doc.getTextWidth(text);
      const x = (pageWidth - textWidth) / 2;
      doc.text(text, x, y);
    };

    // Add centered title and headers
    centerText(employeeDocuments?.schoolName, 30, 16, true);
    centerText(
      "Acharya Dr.Sarvepalli Radhakrishna Road, Soladevanahalli",
      40,
      12
    );
    centerText("Bangalore-560107", 45, 12);
    doc.setLineWidth(0.5);
    doc.line(20, 55, pageWidth - 20, 55); // Horizontal line
    centerText("ID Card Registration - New Recruit", 70, 14, true);
    centerText("(To Be Submitted to HR Office)", 80, 12);

    // Add image placeholder or image
    const imgWidth = 50; // Adjust the width of the image
    const imgHeight = 50; // Adjust the height of the image
    const xOffset = (pageWidth - imgWidth) / 2; // Calculate x offset for centering

    const img = new Image();
    img.src = employeeDocuments?.photo || PlaceholderImage; // Replace with the actual image URL if available

    img.onload = () => {
      doc.addImage(img, "PNG", xOffset, 90, imgWidth, imgHeight); // Adjust the position and size as needed

      // Add dynamic content
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text(`Employee Name : ${employeeDocuments.employeeName}`, 20, 160);
      doc.text(`Employee Code : ${employeeDocuments.empCode}`, 20, 170);
      doc.text(`Designation : ${employeeDocuments.designationName}`, 20, 180);
      doc.text(`Date Of Joining : ${employeeDocuments.dateOfJoining}`, 20, 190);
      doc.text(`Department : ${employeeDocuments.department}`, 20, 200);
      doc.text(`Job Type : ${employeeDocuments.jobType}`, 20, 210);
      doc.text(`Email : ${employeeDocuments.email}`, 20, 220);

      // Add signature lines
      doc.setFont("helvetica", "bold");
      doc.text("Staff Signature", 20, 260);
      doc.text("Principal/Head Of Institution", 140, 260);
      doc.text("Signature of the HR/Concerned office", 20, 280);
      // Save the PDF
      doc.save("ID_Card.pdf");
    };

    img.onerror = () => {
      doc.rect(xOffset, 90, imgWidth, imgHeight); // Add a rectangle as a placeholder

      // Add dynamic content
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text(`Employee Name : ${employeeDocuments.employeeName}`, 20, 160);
      doc.text(`Employee Code : ${employeeDocuments.empCode}`, 20, 170);
      doc.text(`Designation : ${employeeDocuments.designationName}`, 20, 180);
      doc.text(`Date Of Joining : ${employeeDocuments.dateOfJoining}`, 20, 190);
      doc.text(`Department : ${employeeDocuments.department}`, 20, 200);
      doc.text(`Job Type : ${employeeDocuments.jobType}`, 20, 210);
      doc.text(`Email : ${employeeDocuments.email}`, 20, 220);

      // Add signature lines
      doc.setFont("helvetica", "bold");
      doc.text("Staff Signature", 20, 260);
      doc.text("Principal/Head Of Institution", 140, 260);
      doc.text("Signature of the HR/Concerned office", 20, 280);
      doc.save("ID_Card.pdf");
    };
    setLoading(false);

  };

  return (
    <>
      <Grid item xs={12} md={2} mt={1}>
        <Button
          variant="contained"
          sx={{ borderRadius: 2, marginLeft: 60 }}
          onClick={() => generatePdf()}
          disabled={loading}
        >
          {loading ? (
            <CircularProgress
              size={25}
              color="blue"
              style={{ margin: "2px 13px" }}
            />
          ) : (
            "Print"
          )}
        </Button>
      </Grid>
    </>
  );
};

export default EmployeeDocDownload;
