// import React from "react";
// import {
//   Box,
//   Typography,
//   Paper,
//   Table,
//   TableHead,
//   TableBody,
//   TableRow,
//   TableCell,
//   Button,
//   Container,
// } from "@mui/material";
// import html2canvas from "html2canvas";
// import jsPDF from "jspdf";

// const feedbackData = [
//   "Does the faculty cover the syllabus in depth?",
//   "Is the faculty audible?",
//   "Does the faculty make you think creatively?",
//   "Does the faculty encourage you to ask questions?",
//   "Is the blackboard writing clear and organised?",
//   "Is the faculty punctual to the classes?",
//   "Do you understand the subject clearly?",
//   "Does the faculty give you assignments?",
//   "Does the faculty utilise the allotted time effectively?",
//   "Does the faculty give challenging test questions and assignments?",
//   "Does the faculty evaluate the test and assignments in time?",
//   "Is the faculty good at communication?",
//   "Does the faculty evaluate fairly?",
//   "Does the faculty motivate you to learn?",
//   "Are your expectations met by the faculty?",
//   "Does the faculty cover the course as per the lesson plan?",
//   "Does the faculty help in solving your academic difficulties?",
//   "Are you satisfied in general about teaching?",
//   "Is the classroom discipline maintained by the faculty?",
//   "Does the faculty upgrade you with new knowledge/ recent developments?",
// ];

// const StudentFeedbackReport = () => {
//   const handleDownloadPdf = () => {
//     const receiptElement = document.getElementById("feedback-report");

//     if (receiptElement) {
//       html2canvas(receiptElement, { scale: 2 }).then((canvas) => {
//         const imgData = canvas.toDataURL("image/png");
//         const pdf = new jsPDF("p", "mm", "a4"); // Portrait mode, millimeters, A4 size

//         const imgWidth = 190; // PDF width in mm
//         const imgHeight = (canvas.height * imgWidth) / canvas.width; // Maintain aspect ratio

//         let yPosition = 10; // Start position for the image in PDF

//         pdf.addImage(imgData, "PNG", 10, yPosition, imgWidth, imgHeight);
//         pdf.save("Student_Feedback_Report.pdf"); // Download PDF file
//       });
//     }
//   };

//   const styles = {
//     cell: {
//       border: "1px solid black",
//       padding: "8px",
//       textAlign: "left",
//       fontSize: '12px !important',
//     },
//   };

//   return (
//     <Container>
//       {/* Report Paper */}
//       <Paper id="feedback-report" elevation={3} sx={{ p: 4, maxWidth: 900, margin: "0 auto" }}>
//         {/* Header */}
//         <Box sx={{backgroundColor: "#0074d9", color: "#fff", padding: "15px"}}>
//         <Typography variant="body1" align="center" sx={{ mb: 1 }}>
//           JMJ EDUCATION SOCIETY
//         </Typography>
//         <Typography variant="body1" align="center" sx={{ mb: 1 }}>
//           ACHARYA INSTITUTE OF TECHNOLOGY
//         </Typography>
//         <Typography variant="body1" align="center" sx={{ mb: 2 }}>
//           STUDENT FEEDBACK REPORT
//         </Typography>
//         </Box>
//         {/* Faculty Details */}
//         <Table sx={{ width: "100%", border: "1px solid black", borderCollapse: "collapse" }}>
//   <TableBody>
//     <TableRow>
//       <TableCell sx={styles.cell}> <Typography variant="subtitle2" align="left" sx={{ fontSize:"12px" }}>Faculty Name: Sudharman R</Typography></TableCell>
//       <TableCell sx={styles.cell}><Typography variant="subtitle2" align="left" sx={{ fontSize:"12px" }}>Emp Code: AI003070</Typography></TableCell>
//       <TableCell sx={styles.cell}><Typography variant="subtitle2" align="left" sx={{ fontSize:"12px" }}>Designation:  Assistant Professor</Typography></TableCell>
//     </TableRow>
//     <TableRow>
//       <TableCell sx={styles.cell}><Typography variant="subtitle2" align="left" sx={{ fontSize:"12px" }}>Experience at Acharya: 0Y 3M 14D</Typography></TableCell>
//       <TableCell sx={styles.cell}><Typography variant="subtitle2" align="left" sx={{ fontSize:"12px" }}>Department:  MASTER OF BUSINESS ADMINISTRATION</Typography></TableCell>
//       <TableCell sx={styles.cell}><Typography variant="subtitle2" align="left" sx={{ fontSize:"12px" }}>DOJ: 2024-11-06</Typography></TableCell>
//     </TableRow>
//     <TableRow>
//       <TableCell sx={styles.cell}><Typography variant="subtitle2" align="left" sx={{ fontSize:"12px" }}>Year: 1</Typography></TableCell>
//       <TableCell sx={styles.cell}><Typography variant="subtitle2" align="left" sx={{ fontSize:"12px" }}>Sem: 1</Typography></TableCell>
//       <TableCell sx={styles.cell}><Typography variant="subtitle2" align="left" sx={{ fontSize:"12px" }}>Subject Name: Personality Development (PD001)</Typography></TableCell>
//     </TableRow>
//   </TableBody>
//    </Table>

//         {/* Feedback Table */}
//         <Table sx={{ border: "1px solid black", borderCollapse: "collapse", mt: 3 }}>
//           <TableHead sx={{backgroundColor: "#0074d9"}}>
//             <TableRow sx={{ height: "16px"}}>
//               <TableCell align="center" sx={{ fontWeight: "bold", border: "1px solid black", height: "16px", lineHeight: "1", padding: "10px 5px", color: "#fff"  }}>
//                 SL No.
//               </TableCell>
//               <TableCell align="center" sx={{ fontWeight: "bold", border: "1px solid black", height: "16px", lineHeight: "1", padding: "10px 16px", color: "#fff"   }}>
//                 Feedback Questions
//               </TableCell>
//               <TableCell align="center" sx={{ fontWeight: "bold", border: "1px solid black", height: "16px", lineHeight: "1", padding: "10px", color: "#fff"   }}>
//                 Feedback (S1)
//               </TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {feedbackData.map((question, index) => (
//               <TableRow key={index} sx={{height: "16px"}}>
//                 <TableCell align="center" sx={{ border: "1px solid black", height: "16px", lineHeight: "1", padding: "10px 5px", }}>{index + 1}</TableCell>
//                 <TableCell sx={{ border: "1px solid black", height: "16px", lineHeight: "1", padding: "10px 16px", }}>{question}</TableCell>
//                 <TableCell align="center" sx={{ border: "1px solid black", height: "16px", lineHeight: "1", padding: "10px", }}>100%</TableCell>
//               </TableRow>
//             ))}
//             <TableRow>
//            <TableCell colSpan={2} sx={{ ...styles.cell, fontWeight: "bold", textAlign: "center" }}>
//            Average Appraisal
//            </TableCell>
//            <TableCell align="center" sx={{ ...styles.cell, fontWeight: "bold", textAlign: "center" }}>100%</TableCell>
//            </TableRow>
//           </TableBody>
//         </Table>
//       </Paper>
//     </Container>
//   );
// };

// export default StudentFeedbackReport;


import { useState, useEffect } from "react";
import { Tabs, Tab } from "@mui/material";
import StudentFeedbackReportIndex from "../../containers/indeces/studentFeedbackReportMaster/StudentFeedbackReportIndex";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import { useNavigate, useLocation } from "react-router-dom";

const tabsData = [
  { label: "Feedback Reports", value: "feedback_reports", component:StudentFeedbackReportIndex},
];

function StudentFeedbackReport() {
  const [tab, setTab] = useState("feedback_reports");
  const setCrumbs = useBreadcrumbs();
  const navigate = useNavigate();
  const { pathname } = useLocation();


  useEffect(() => {
   const selectedTab = tabsData.find((tabItem) =>
    pathname.toLowerCase().includes(tabItem.value.toLowerCase())
  );
  if (selectedTab) {
    setTab(selectedTab.value);
  }
  }, [pathname]);

  const handleChange = (e, newValue) => {
    setTab(newValue);
    navigate("/StudentFeedbackReport/" + newValue);
  };

  return (
    <>
         <Tabs value={tab} onChange={handleChange}>
        {tabsData.map((tabItem) => (
          <Tab
            key={tabItem.value}
            value={tabItem.value}
            label={tabItem.label}
          />
        ))}
      </Tabs>
      {tabsData.map((tabItem) => (
        <div key={tabItem.value}>
          {tab === tabItem.value && <tabItem.component />}
        </div>
      ))}
    </>
  );
}

export default StudentFeedbackReport;


