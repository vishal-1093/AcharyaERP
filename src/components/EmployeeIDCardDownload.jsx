import React, { useState } from "react";
import { jsPDF } from "jspdf";
import {
  Button,
  CircularProgress,
  Grid,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Avatar,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import axios from "axios";
import PlaceholderImage from "../../src/assets/placeholderImage.jpg";
import LetterheadImage from "../../src/assets/auait.jpg";
import PdfIcon from "../../src/assets/pdfIcon.png";

const getImage = (employeeDocuments) => {
  try {
    if (!employeeDocuments || !employeeDocuments.schoolShortName) {
      throw new Error("schoolShortName is not defined");
    }
    const imageName = employeeDocuments?.schoolShortName?.toLowerCase();
    return require(`../../src/assets/${imageName}.jpg`);
  } catch (error) {
    console.error(
      "Image not found for schoolShortName:",
      employeeDocuments?.schoolShortName,
      "Error:",
      error.message
    );
    return LetterheadImage;
  }
};
const EmployeeDetails = ({ employeeDocuments }) => {
  const details = [
    `Employee Name: ${
      employeeDocuments?.employeeName?.toUpperCase() || "undefined"
    }`,
    `Employee Code: ${employeeDocuments?.empCode || "undefined"}`,
    `Employee Type: ${employeeDocuments?.employeeType || "undefined"}`,
    `Designation: ${employeeDocuments?.designationName || "undefined"}`,
    `Date Of Joining: ${employeeDocuments?.dateOfJoining || "undefined"}`,
    `Department: ${employeeDocuments?.department || "undefined"}`,
    `Job Type: ${employeeDocuments?.jobType || "undefined"}`,
    `Email: ${employeeDocuments?.email || "undefined"}`,
  ];

  const containerStyle = {
    padding: 20,
    textAlign: "center",
    position: "relative",
    backgroundImage: `url(${getImage(employeeDocuments)})`,
    backgroundSize: "cover",
    backgroundPosition: "top center",
    width: "100%",
    minHeight: "100vh", // Ensure the letterhead covers the entire viewport height
  };

  return (
    <div style={containerStyle}>
      <div style={{ position: "relative", zIndex: 1 }}>
        <Typography variant="h6" gutterBottom style={{ marginTop: 250 }}>
          ID Card Registration - New Recruit
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          (To Be Submitted to HR Office)
        </Typography>
        <Avatar
          alt="Profile Picture"
          src={employeeDocuments?.image || PlaceholderImage}
          style={{ width: 100, height: 100, margin: "20px auto" }}
        />
        
        <Grid
          container
          spacing={2}
          style={{ textAlign: "left", paddingLeft: "20px" }}
        >
          {details.map((detail, index) => (
            <Grid item xs={12} key={index}>
              <Typography>{detail}</Typography>
            </Grid>
          ))}
        </Grid>
        <Grid container spacing={2} style={{ marginTop: 30 }}>
          <Grid item xs={4}>
            <Typography>Staff Signature</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography>Principal/Head Of Institution</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography>Signature of the HR / Concerned office</Typography>
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

export const generatePdf = (employeeDocuments, setLoading) => {
  try {
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
    img.src = getImage(employeeDocuments);

    img.onload = () => {
      doc.addImage(img, "JPEG", 0, 0, pageWidth, pageHeight);

      centerText("ID Card Registration - New Recruit", 70, 14, true);
      centerText("(To Be Submitted to HR Office)", 80);

      const imgWidth = 50;
      const imgHeight = 50;
      const xOffset = (pageWidth - imgWidth) / 2;

      const profileImg = new Image();
      profileImg.src = employeeDocuments?.image || PlaceholderImage;

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
          `Employee Name : ${employeeDocuments?.employeeName?.toUpperCase()}`,
          `Employee Code : ${employeeDocuments?.empCode}`,
          `Employee Type : ${employeeDocuments?.employeeType}`,
          `Designation : ${employeeDocuments?.designationName}`,
          `Date Of Joining : ${employeeDocuments?.dateOfJoining}`,
          `Department : ${employeeDocuments?.department}`,
          `Job Type : ${employeeDocuments?.jobType}`,
          `Email : ${employeeDocuments?.email}`,
        ];
        details.forEach((detail, index) => {
          doc.text(detail, 20, 160 + index * 10);
        });

        doc.text("Staff Signature", 20, 250);
        doc.text("Principal/Head Of Institution", 140, 250);
        doc.text("Signature of the HR / Concerned office", 20, 275);
        doc.save("ID_Card");
        setLoading(false);
      };
    };

    img.onerror = () => {
      alert("Failed to load letterhead image");
      setLoading(false);
    };
  } catch (error) {
    console.log(error);
    setLoading(false);
  }
};

const EmployeeIDCardDownload = ({
  employeeDocuments,
  setOpen = () => null,
  open = false,
  isDownload = false,
}) => {
  const [loading, setLoading] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const handleDownload = () => {
    setTimeout(() => {
      setOpen(false);
    }, 0);
    generatePdf(employeeDocuments, setLoading);
  };

  return (
    <>
      {loading ? (
        <CircularProgress size={25} color="primary" />
      ) : (
        <div
          onClick={
            isDownload
              ? () => generatePdf(employeeDocuments, setLoading)
              : () => handleClose()
          }
          style={{
            display: "flex",
            alignItems: "center",
            cursor: "pointer",
          }}
        >
          <img
            src={PdfIcon}
            alt="Download PDF"
            style={{ width: "50px", height: "50px" }}
          />
          <Typography
            variant="body2"
            style={{
              color: "blue",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            ID_Card.pdf
          </Typography>
        </div>
      )}

      <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
        <DialogTitle>Employee Details</DialogTitle>
        <DialogContent>
          <EmployeeDetails employeeDocuments={employeeDocuments} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
          Close
          </Button>
          <Button onClick={handleDownload} color="primary" autoFocus>
            Download PDF
          </Button>
        </DialogActions>
      </Dialog>
      {loading && !isDownload && <CircularProgress size={25} color="primary" />}
    </>
  );
};

export default EmployeeIDCardDownload;
