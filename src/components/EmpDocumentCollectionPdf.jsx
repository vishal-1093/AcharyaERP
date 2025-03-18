import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "../services/Api";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, Avatar, Grid, Checkbox, FormControlLabel, IconButton, Button
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline"; 
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf"; 
import acharyaLogo from "../assets/acharyaLogo.png";
import studentLogo from "../assets/studentLogo.png";

const empID = JSON.parse(sessionStorage.getItem("userData"))?.emp_id


function EmpDocumentCollectionPdf() {
  const [facultyDetails, setFacultyDetails] = useState({});
  const { id } = useParams();
  const pdfRef = useRef(null); 

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      const response = await axios.get(`/api/employee/getEmployeeDetailsDetailsDataBasedOnEmpId/${empID}`);
      console.log(response, "response");

      setFacultyDetails(response?.data?.data[0]);
    } catch (err) {
      console.error("Error fetching faculty details:", err);
    }
  };


  const downloadPDF = async () => {
    if (!pdfRef.current) {
      console.error("PDF reference is not set.");
      return;
    }

    const input = pdfRef.current;
    try {
      const canvas = await html2canvas(input, { scale: 2 });
      const imgData = canvas.toDataURL("image/jpeg", 0.6);
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 210; 
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 10, imgWidth, imgHeight);
      pdf.save("Proctor_Details.pdf");
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  return (
    <Box sx={{ width: "90%", margin: "auto", fontFamily: "Arial, sans-serif", padding: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "flex-end", marginBottom: 1 }}>
        <Button
          variant="contained"
          color="error"
          startIcon={<PictureAsPdfIcon />}
          onClick={downloadPDF}
        >
          Download PDF
        </Button>
      </Box>
   
      <div ref={pdfRef} style={{ background: "white", padding: "20px" }}>
        {/* Header */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "#003366", color: "white", padding: 2, textAlign: "center", borderRadius: 2 }}>
          <Avatar src={acharyaLogo} sx={{ width: 80, height: 80 }} />
          <Box>
            <Typography variant="h5" fontWeight="bold">JMJ EDUCATION SOCIETY</Typography>
            <Typography variant="h6">PERFORMANCE ASSESSMENT REPORT</Typography>
            <Typography variant="body1">December - 2024</Typography>
          </Box>
          <Avatar src={studentLogo} sx={{ width: 80, height: 80 }} />
        </Box>

        <TableContainer component={Paper} sx={{ marginTop: 2, borderRadius: 2 }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f2f2f2" }}>
                <TableCell
                  colSpan={6}
                  sx={{
                    textAlign: "center",
                    fontWeight: "bold",
                    fontSize: "1.1rem",
                  }}
                >
                  FACULTY DETAILS
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell><strong>Employee Name</strong></TableCell>
                <TableCell>{facultyDetails.employee_name || "-"}</TableCell>
                <TableCell><strong>Emp ID</strong></TableCell>
                <TableCell>{facultyDetails.emp_id || "-"}</TableCell>
                <TableCell><strong>DOJ</strong></TableCell>
                <TableCell>{facultyDetails.date_of_joining || "-"}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell><strong>Designation</strong></TableCell>
                <TableCell>{facultyDetails.designation_name || "-"}</TableCell>
                <TableCell><strong>Institute</strong></TableCell>
                <TableCell>{facultyDetails.school_name || "-"}</TableCell>
                <TableCell><strong>Branch</strong></TableCell>
                <TableCell>{facultyDetails.dept_name_short || "-"}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell><strong>DOB</strong></TableCell>
                <TableCell>{facultyDetails.dateofbirth || "-"}</TableCell>
                <TableCell><strong>Age</strong></TableCell>
                <TableCell>{facultyDetails.age || "-"}</TableCell>
                <TableCell><strong>Experience</strong></TableCell>
                <TableCell>{facultyDetails.experience || "-"}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>

        {/* Proctor Details */}
        <Box sx={{ marginTop: 3 }}>
          <TableContainer component={Paper} sx={{ marginTop: 2, borderRadius: 2 }}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#f2f2f2" }}>
                  <TableCell align="center"><strong>PHD Status</strong></TableCell>
                  <TableCell align="center"><strong>UNIVERSITY THESIS</strong></TableCell>
                  <TableCell align="center"><strong>REGISTER DATE</strong></TableCell>
                  <TableCell align="center"><strong>COMPLETED DATE</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell align="center">{facultyDetails.phd_holder_pursuing || "-"}</TableCell> {/* Fixed */}
                  <TableCell align="center">{facultyDetails.university_name || "-"}</TableCell> {/* Fixed */}
                  <TableCell align="center">{facultyDetails.phd_register_date || "-"}</TableCell> {/* Fixed */}
                  <TableCell align="center">{facultyDetails.phd_completed_date || "-"}</TableCell> {/* Fixed */}
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
        {/* Proctor Details */}
        <Box sx={{ marginTop: 3 }}>
          <Typography variant="h6" fontWeight="bold" align="center">PROCTOR DETAILS</Typography>
          <TableContainer component={Paper} sx={{ marginTop: 2, borderRadius: 2 }}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#f2f2f2" }}>
                  <TableCell align="center"><strong>Proctees</strong></TableCell>
                  <TableCell align="center"><strong>Meetings held with students</strong></TableCell>
                  <TableCell align="center"><strong>Meeting held with parent</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell align="center">{facultyDetails.studentCount || "0"}</TableCell> {/* Fixed */}
                  <TableCell align="center">{facultyDetails.studentCallCount || "0"}</TableCell> {/* Fixed */}
                  <TableCell align="center">{facultyDetails.chief_proctor_id || "-"}</TableCell> {/* Fixed */}
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        {/* Self Assessment Table */}
        <Box sx={{ marginTop: 3 }}>
          <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#f2f2f2" }}>
                  <TableCell><strong>SI.NO</strong></TableCell>
                  <TableCell><strong>Category</strong></TableCell>
                  <TableCell align="center"><strong>Max Marks</strong></TableCell>
                  <TableCell align="center"><strong>Self Assessment Marks</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {[
                  { id: 1, category: "TEACHING", maxMarks: 0 },
                  { id: 2, category: "PROFESSIONAL ACTIVITY AND/OR AWARDS", maxMarks: 0 },
                  { id: 3, category: "FACULTY SERVICE", maxMarks: 0 },
                  // { id: 4, category: "OTHER PERTINENT ACTIVITIES/BEST PRACTICES", maxMarks: 0 },
                  // { id: 5, category: "PROJECTED ACTIVITIES / INITIATIVES", maxMarks: "-" },
                  // { id: 6, category: "CHALLENGES FACED AND ACTIONS RECOMMENDED", maxMarks: "-" },
                  // { id: 7, category: "RESEARCH PROGRESS REPORT", maxMarks: "-" },
                ].map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>{row.id}</TableCell>
                    <TableCell>{row.category}</TableCell>
                    <TableCell align="center">{row.maxMarks}</TableCell>
                    <TableCell align="center">
                      <IconButton color="primary">
                        <AddCircleOutlineIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        {/* Declaration Checkbox */}
        <Box sx={{ marginTop: 3, display: "flex", alignItems: "center" }}>
          <FormControlLabel
            control={<Checkbox />}
            label={
              <Typography variant="body2">
                I hereby declare that all the data in the FARM is correct and agree that all my proctor personal details are up to date.
              </Typography>
            }
          />
        </Box>
      </div>
    </Box>
  );
}

export default EmpDocumentCollectionPdf;

