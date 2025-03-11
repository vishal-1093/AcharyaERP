import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Container,
} from "@mui/material";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import useAlert from "../../../hooks/useAlert";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import axios from "../../../services/Api";
import acharyaLogo from "../../../assets/acharyaLogo.png";
import { useSearchParams } from "react-router-dom";
import { useParams } from "react-router-dom";

const tableColumn = ["Section", "Subject Code", "Subject Name", "Academic Year", "Year/Sem", "Feedback Window", "Student Count", "Average%"]

const FacultyFeedbackReport = () => {
  const [rows, setRows] = useState({});
  const { setAlertMessage, setAlertOpen } = useAlert();
  const [loading, setLoading] = useState(true);
  const [hideButtons, setHideButtons] = useState(false);
  const setCrumbs = useBreadcrumbs();
  const { empId } = useParams()

  useEffect(() => {
    setCrumbs([
      { name: "Faculty Feedback", link: "/FacultyFeedbackMaster" },
      { name: "Faculty Feedback Report" }
    ])
    getData();
  }, []);

  const getData = async () => {
    await axios
      .get(
        `/api/student/getFeedbackRatingReportForEmployee?employee_id=${empId}`
      )
      .then((res) => {
        if (res?.data?.data) {
          setRows(res?.data?.data);
        }
      })
      .catch((err) => {
        setLoading(false);
        setAlertMessage({
          severity: "error",
          message: err?.response?.data?.message,
        });
      });
  };

  const handleDownloadPdf = () => {
    setHideButtons(true);
    setTimeout(() => {
      const receiptElement = document.getElementById("faculty-feedback-report");
      if (receiptElement) {
        html2canvas(receiptElement, { scale: 2 }).then((canvas) => {
          const imgData = canvas.toDataURL("image/png");
          const pdf = new jsPDF("p", "mm", "a4"); // Portrait mode, millimeters, A4 size

          const imgWidth = 190; // PDF width in mm
          const pageHeight = 297; // A4 height in mm
          const imgHeight = (canvas.height * imgWidth) / canvas.width; // Maintain aspect ratio

          let yPosition = 10; // Start position for the image in PDF

          pdf.addImage(imgData, "PNG", 10, yPosition, imgWidth, imgHeight);

          pdf.save("Faculty_All_Section_Feedback_Report.pdf"); // Download PDF file
          setHideButtons(false);
        });
      }
    }, 100);
  };


  const styles = {
    cell: {
      border: "1px solid black",
      padding: "8px",
      textAlign: "left",
      fontSize: '12px !important',
    },
  };

  return (
    <Container>
      {/* Report Paper */}
      <Paper id="faculty-feedback-report" elevation={3} sx={{ maxWidth: 900, margin: "0 auto", boxShadow: 'none' }}>
        <Box sx={{ marginBottom: "20px", display: "flex", justifyContent: "flex-end" }}>
          {!hideButtons && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 2,
                mb: 2,
              }}
            >
              <Button
                variant="contained"
                color="primary"
                onClick={handleDownloadPdf}
              >
                Print
              </Button>
            </Box>
          )}
        </Box>
        <Box
          style={{
            display: 'flex',
            backgroundColor: "#182778",
            color: "white",
            //   padding: "5px",
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
          <img
            src={acharyaLogo}
            style={{
              width: "100px",
              marginVertical: 0,
              marginHorizontal: 0,
            }}
            alt="acharya logo"
          />
          <Box sx={{ color: "#fff" }}>
            <Typography variant="body1" align="center" sx={{ mb: 1 }}>
              JMJ EDUCATION SOCIETY
            </Typography>
            <Typography variant="body1" align="center" sx={{ mb: 1 }}>
              {rows?.employeeDetails?.school_name || ""}
            </Typography>
            <Typography variant="body1" align="center">
              FACULTY FEEDBACK REPORT
            </Typography>
          </Box>
          <img
            src={acharyaLogo}
            style={{
              width: "100px",
              marginVertical: 0,
              marginHorizontal: 0
            }}
            alt="employee-image"
          />
        </Box>
        <Table sx={{ width: "100%", border: "1px solid black", borderCollapse: "collapse" }}>
          <TableBody>
            <TableRow>
              <TableCell sx={styles.cell}> <Typography variant="subtitle2" align="left" sx={{ fontSize: "12px" }}>Faculty Name: {rows?.employeeDetails?.employee_name || ""}</Typography></TableCell>
              <TableCell sx={styles.cell}><Typography variant="subtitle2" align="left" sx={{ fontSize: "12px" }}>Emp Code: {rows?.employeeDetails?.empcode || ""}</Typography></TableCell>
              <TableCell sx={styles.cell}><Typography variant="subtitle2" align="left" sx={{ fontSize: "12px" }}>Designation:  {rows?.employeeDetails?.designation_name || ""}</Typography></TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={styles.cell}><Typography variant="subtitle2" align="left" sx={{ fontSize: "12px" }}>Experience at Acharya: {rows?.employeeDetails?.experience || ""}</Typography></TableCell>
              <TableCell sx={styles.cell}><Typography variant="subtitle2" align="left" sx={{ fontSize: "12px" }}>Department: {rows?.employeeDetails?.dept_name || ""}</Typography></TableCell>
              <TableCell sx={styles.cell}><Typography variant="subtitle2" align="left" sx={{ fontSize: "12px" }}>DOJ: {rows?.employeeDetails?.date_of_joining || ""}</Typography></TableCell>
            </TableRow>
          </TableBody>
        </Table>

        {/* Feedback Table */}
        <Table sx={{ border: "1px solid black", borderCollapse: "collapse", mt: 3 }}>
          <TableHead sx={{ backgroundColor: "#182778" }}>
            <TableRow sx={{ height: "16px" }}>
              {tableColumn?.map((col)=>(
                 <TableCell align="center" sx={{ fontWeight: "bold", border: "1px solid black", height: "16px", lineHeight: "1", padding: "10px 5px", color: "#fff" }}>
                  {col}
               </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows?.courseWithRatingSection?.map((sec, index) => (
              <TableRow key={sec?.class_feedback_questions_id} sx={{ height: "16px" }}>
                <TableCell align="center" sx={{ border: "1px solid black", height: "16px", lineHeight: "1", padding: "10px 5px", }}>{sec?.section_name}</TableCell>
                <TableCell sx={{ border: "1px solid black", height: "16px", lineHeight: "1", padding: "10px 16px", }}>{sec?.course_code}</TableCell>
                <TableCell align="center" sx={{ border: "1px solid black", height: "16px", lineHeight: "1", padding: "10px", }}>{sec?.course_name}</TableCell>
                <TableCell align="center" sx={{ border: "1px solid black", height: "16px", lineHeight: "1", padding: "10px", }}>{sec?.ac_year}</TableCell>
                <TableCell align="center" sx={{ border: "1px solid black", height: "16px", lineHeight: "1", padding: "10px", }}>{`${rows?.employeeDetails?.current_year}/${rows?.employeeDetails?.current_sem}`}</TableCell>
                <TableCell align="center" sx={{ border: "1px solid black", height: "16px", lineHeight: "1", padding: "10px", }}>{`${sec?.concateFeedbackWindow.split("/")[0]} - ${sec?.concateFeedbackWindow.split("/")[1]}`}</TableCell> 
                <TableCell align="center" sx={{ border: "1px solid black", height: "16px", lineHeight: "1", padding: "10px", }}>{sec?.total_students}</TableCell>
                <TableCell align="center" sx={{ border: "1px solid black", height: "16px", lineHeight: "1", padding: "10px", }}>{sec?.avg_ratings_percentage}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Container>
  );
};

export default FacultyFeedbackReport;

