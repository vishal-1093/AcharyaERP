import React, { useState } from "react";
import { jsPDF } from "jspdf";
import { Button, CircularProgress, Grid } from "@mui/material";
import PlaceholderImage from '../../src/assets/placeholderImage.jpg';
import LetterheadImage from '../../src/assets/auait.jpg'; 

const EmployeeDocDownload = ({ employeeDocuments }) => {
  const [loading, setLoading] = useState(false);

  const generatePdf = () => {
    setLoading(true);
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    const centerText = (text, y, fontSize = 12, bold = false) => {
      doc.setFont("helvetica", bold ? "bold" : "normal");
      doc.setFontSize(fontSize);
      const textWidth = doc.getTextWidth(text);
      const x = (pageWidth - textWidth) / 2;
      doc.text(text, x, y);
    };

    const img = new Image();
    img.src = LetterheadImage;

    img.onload = () => {
      // Add the letterhead image
      doc.addImage(img, 'JPEG', 0, 0, pageWidth, pageHeight);
      
      // Add centered title and headers
      centerText(employeeDocuments?.schoolName, 50, 16, true);
      centerText("Acharya Dr.Sarvepalli Radhakrishna Road, Soladevanahalli", 55);
      centerText("Bangalore-560107", 60);
      // doc.setLineWidth(0.5);
      // doc.line(20, 55, pageWidth - 20, 55);
      centerText("ID Card Registration - New Recruit", 70, 14, true);
      centerText("(To Be Submitted to HR Office)", 80);

      // Add image placeholder or image
      const imgWidth = 50;
      const imgHeight = 50;
      const xOffset = (pageWidth - imgWidth) / 2;

      const profileImg = new Image();
      profileImg.src = employeeDocuments?.photo || PlaceholderImage;

      profileImg.onload = () => {
        doc.addImage(profileImg, "PNG", xOffset, 90, imgWidth, imgHeight);
        addEmployeeDetails();
      };

      profileImg.onerror = () => {
        doc.rect(xOffset, 90, imgWidth, imgHeight);
        addEmployeeDetails();
      };

      const addEmployeeDetails = () => {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        const details = [
          `Employee Name : ${employeeDocuments.employeeName.toUpperCase()}`,
          `Employee Code : ${employeeDocuments.empCode}`,
          `Designation : ${employeeDocuments.designationName}`,
          `Date Of Joining : ${employeeDocuments.dateOfJoining}`,
          `Department : ${employeeDocuments.department}`,
          `Job Type : ${employeeDocuments.jobType}`,
          `Email : ${employeeDocuments.email}`
        ];
        details.forEach((detail, index) => {
          doc.text(detail, 20, 160 + index * 10);
        });

        doc.text("Staff Signature", 20, 260);
        doc.text("Principal/Head Of Institution", 140, 260);
        doc.text("Signature of the HR/Concerned office", 20, 280);
        doc.save("ID_Card.pdf");
        setLoading(false);
      };
    };

    img.onerror = () => {
      alert('Failed to load letterhead image');
      setLoading(false);
    };
  };

  return (
    <Grid item xs={12} md={2} mt={1}>
      <Button
        variant="contained"
        sx={{ borderRadius: 2, marginLeft: 60 }}
        onClick={generatePdf}
        disabled={loading}
      >
        {loading ? (
          <CircularProgress size={25} color="blue" style={{ margin: "2px 13px" }} />
        ) : (
          "Print"
        )}
      </Button>
    </Grid>
  );
};

export default EmployeeDocDownload;
