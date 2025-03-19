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

const tableColumn = ["Section", "Subject Code", "Subject Name", "Academic Year", "Year/Sem", "Feedback Window", "Student Count", "Average(%)"]

const FacultyFeedbackReport = () => {
  const [rows, setRows] = useState({});
  const { setAlertMessage, setAlertOpen } = useAlert();
  const [loading, setLoading] = useState(true);
   const [employeeImage, setEmployeeImage] = useState('')
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
        const {data} = res?.data
        if (data) {
          setRows(data)
          if (data?.employeeDetails?.emp_image_attachment_path) {
            const imagePath = data?.employeeDetails?.emp_image_attachment_path;
            axios.get(
                `/api/employee/employeeDetailsFileDownload?fileName=${imagePath}`,
                { responseType: "blob" }
            ).then((res) => {
              setLoading(false);
                setEmployeeImage(URL.createObjectURL(res.data) || "");
            }).catch((err) => {
              setLoading(false)
              setAlertMessage({
                  severity: "error",
                  message: err?.response?.data?.message,
              });
          });
        }
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
      });
    }
  };


  const styles = {
    cell: {
      border: "1px solid black",
      padding: "8px",
      textAlign: "left",
      fontSize: "15px",
      fontWeight: 500
    },
    sectionTableCell: {
      border: "1px solid black",
      height: "16px",
      padding: "10px",
      textAlign: "center",
      lineHeight: "1"
    },
  };

  return (
    <Container>
      {/* Report Paper */}
      <Paper elevation={3} sx={{ maxWidth: 900, margin: "0 auto", boxShadow: 'none' }}>
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
          <Box id="faculty-feedback-report">
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
            src={employeeImage}
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
              <TableCell sx={styles.cell}> Faculty Name: {rows?.employeeDetails?.employee_name || ""}</TableCell>
              <TableCell sx={styles.cell}>Emp Code: {rows?.employeeDetails?.empcode || ""}</TableCell>
              <TableCell sx={styles.cell}>Designation:  {rows?.employeeDetails?.designation_name || ""}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={styles.cell}>Experience at Acharya: {rows?.employeeDetails?.experience || ""}</TableCell>
              <TableCell sx={styles.cell}>Department: {rows?.employeeDetails?.dept_name || ""}</TableCell>
              <TableCell sx={styles.cell}>DOJ: {rows?.employeeDetails?.date_of_joining || ""}</TableCell>
            </TableRow>
          </TableBody>
        </Table>

        {/* Feedback Table */}
        <Table sx={{ border: "1px solid black", borderCollapse: "collapse", mt: 3 }}>
          <TableHead sx={{ backgroundColor: "#182778" }}>
            <TableRow sx={{ height: "16px" }}>
              {tableColumn?.map((col)=>(
                 <TableCell sx={{color: "white", ...styles?.sectionTableCell}}>
                  {col}
               </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows?.courseWithRatingSection?.map((sec, index) => (
              <TableRow key={sec?.class_feedback_questions_id}>
                <TableCell sx={styles?.sectionTableCell}>{sec?.section_name}</TableCell>
                <TableCell sx={styles?.sectionTableCell}>{sec?.course_code}</TableCell>
                <TableCell sx={styles?.sectionTableCell}>{sec?.course_name}</TableCell>
                <TableCell sx={styles?.sectionTableCell}>{sec?.ac_year}</TableCell>
                <TableCell sx={styles?.sectionTableCell}>{`${rows?.employeeDetails?.current_year}/${rows?.employeeDetails?.current_sem}`}</TableCell>
                <TableCell sx={styles?.sectionTableCell}>{sec?.concateFeedbackWindow}</TableCell> 
                <TableCell sx={styles?.sectionTableCell}>{sec?.total_students}</TableCell>
                <TableCell sx={styles?.sectionTableCell}>{sec?.avg_ratings_percentage}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        </Box>
      </Paper>
    </Container>
  );
};

export default FacultyFeedbackReport;

