import React, { useEffect, useState } from "react"
import { useLocation, useParams } from "react-router-dom"
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import axios from "../../../services/Api";
import { Box, Button, Grid, Paper, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Avatar } from "@mui/material";
import styled from "@emotion/styled"
import { useNavigate } from "react-router-dom";
import useAlert from "../../../hooks/useAlert";
import acharyaLogo from "../../../assets/acharyaLogo.png";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";


const FacultyFeedbackReportBySection = () => {
      const [loading, setLoading] = useState(true);
      const [data, setData] = useState({})
      const [feedbackReportdetails, setFeedbackReportDetails] = useState({})
      const [employeeImage, setEmployeeImage] = useState('')
      const [sectionDetail, setSectionDetail] = useState([])
       const [hideButtons, setHideButtons] = useState(false);
    const setCrumbs = useBreadcrumbs();
    const { setAlertMessage, setAlertOpen } = useAlert();
     const { empId } = useParams()
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const courseId = Number(queryParams.get("courseId"));

    const facultyInfo = {
        name: "JOTHI LAKSHMI VIJAYAN NAIR",
        empCode: "AI003061",
        designation: "Assistant Professor",
        department: "Electronics & Communication",
        doj: "2024-10-28",
        experience: "0Y 4M 9D",
        profilePic: "https://via.placeholder.com/100", // Replace with actual profile URL
    };

    // Header Data (Academic Year, Semester, Subject Code)
    const headerDetails = {
        acYear: "2024-2025",
        semester: "Year/Sem: 2/3",
        subjectCode: "ECL305 ADE L44849",
    };

    // Feedback Data
    const feedbackData = [
        { id: 1, question: "Does the faculty cover the syllabus in depth?", sectionA: "85.71%", sectionB: "91.35%", sectionC: "86.34%" },
        { id: 2, question: "Is the faculty audible?", sectionA: "92.64%", sectionB: "92.64%", sectionC: "85.00%" },
        { id: 3, question: "Does the faculty make you think creatively?", sectionA: "86.29%", sectionB: "88.73%", sectionC: "85.85%" },
        { id: 4, question: "Does the faculty encourage you to ask questions?", sectionA: "90.28%", sectionB: "91.35%", sectionC: "86.00%" },
        { id: 5, question: "Is the blackboard writing clear and organized?", sectionA: "91.35%", sectionB: "91.35%", sectionC: "85.85%" },
    ];

    useEffect(() => {
        setCrumbs([
            { name: "Faculty Feedback", link: "/FacultyFeedbackMaster" },
            { name: "Faculty Feedback Report By Section" }
        ])
        getData()
    }, [])

    const getData = async () => {
        setLoading(true)
        await axios
          .get(
            `/api/student/getFeedbackRatingReportSectionWise/${empId}/${courseId}`
          )
          .then((res) => {
            const {data} = res?.data
            if (data) {
            //    setData(data);
            const groupedResponse = Object.values(
                data?.questionWithRatingSection?.length > 0 && data?.questionWithRatingSection?.reduce((acc, item) => {
                  const { class_feedback_questions_id } = item;
              
                  if (!acc[class_feedback_questions_id]) {
                    acc[class_feedback_questions_id] = {
                      class_feedback_questions_id: item.class_feedback_questions_id,
                      avg_window_count: item.avg_window_count,
                      concateFeedbackWindow: item.concateFeedbackWindow,
                      course_code: item.course_code,
                      course_name: item.course_name,
                      course_short_name: item.course_short_name,
                      feedback_questions: item.feedback_questions,
                      sectionDetails: [],
                    };
                  }
              
                  // Push section-specific details into the sectionDetails array
                  acc[class_feedback_questions_id].sectionDetails.push({
                    feedback_window_id: item.feedback_window_id,
                    ratings_percentage: item.ratings_percentage,
                    section_id: item.section_id,
                    section_name: item.section_name,
                    total_ratings: item.total_ratings,
                    total_students: item.total_students,
                  });
              
                  return acc;
                }, {})
              );
              setFeedbackReportDetails({employeeDetails: data?.employeeDetails, questionWithRatingSection : groupedResponse|| []})
              const sectionName = data?.questionWithRatingSection?.map((quest)=> {
                const windowStartDate = quest?.concateFeedbackWindow.split("/")[0]
                const windowEndDate = quest?.concateFeedbackWindow.split("/")[1]
                return {sectionId : quest?.section_id, sectionName: quest?.section_name, totalStudent : quest?.total_students, feedbackWindow: `${windowStartDate} to ${windowEndDate}`}
              })
              if(sectionName?.length > 0){
                const uniqueArr = sectionName?.filter((obj, index, self) =>
                    index === self.findIndex(o => o.sectionId === obj.sectionId && o.sectionName === obj.sectionName)
                  );
              setSectionDetail(uniqueArr || [])  
              }
               // get the employee image
              if ( data?.employeeDetails?.emp_image_attachment_path) {
                const imagePath = data?.employeeDetails?.emp_image_attachment_path;
                 axios.get(
                  `/api/employee/employeeDetailsFileDownload?fileName=${imagePath}`,
                  { responseType: "blob" }
                ).then((res)=>{
                    setEmployeeImage(URL.createObjectURL(res.data) || "");
                })
              }
            }
            setLoading(false)
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
        const pdf = new jsPDF("p", "mm", "a4");

        const imgWidth = 190;
        const pageHeight = 297;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        let yPosition = 10;

        pdf.addImage(imgData, "PNG", 10, yPosition, imgWidth, imgHeight);

        pdf.save("Faculty_Feedback_Report.pdf"); 
        setHideButtons(false);
      });
    }
  };

    return (<>
        <Grid container sx={{ width: "100%", justifyContent: "center" }}>
            <Grid item sm={0} md={1} lg={2}></Grid>
            <Grid item sm={12} md={10} lg={8}>
            <Box sx={{ margin: "20px 0", display: "flex", justifyContent: "flex-end" }}>
             <Button variant="contained" onClick={handleDownloadPdf}>Print</Button>
             </Box>
             <Box id="faculty-feedback-report" >
             <EmployeeDetails feedbackReportDetails={feedbackReportdetails} employeeImage={employeeImage} />
             <QuestionList sectionList={sectionDetail} feedbackReportDetails = {feedbackReportdetails}/>
             </Box>
            </Grid>
            <Grid item sm={0} md={1} lg={2}></Grid>
        </Grid>
    </>)
}

const EmployeeDetails = ({ feedbackReportDetails, employeeImage }) => {
    const Table = styled.table`
        width: 100%;
        border: 2px solid #000;
        border-collapse: collapse;
    `

    const TabelCell = styled.td`
        padding: 15px 10px;
        border: 2px solid #000;
        border-collapse: collapse;
        font-size: 15px;
        font-weight: 500;
        width: 33%;
    `

    const TableTitle = styled.td`
        width: 100%;
        text-align: center;
        padding: 10px 8px;
        // background-color: #623f8f;
        color: #fff;
        font-size: 17px;
        font-weight: 500;
    `

    const RatingRow = styled.div`
        display: flex;
        justify-content: space-between;
    `

    return <Paper elevation={3} sx={{ margin: "0 auto" }}>
        {/* Header */}
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
                { feedbackReportDetails?.employeeDetails?.school_name|| ""}
                </Typography>
                <Typography variant="body1" align="center">
                    FACULTY FEEDBACK REPORT - {feedbackReportDetails.employeeDetails?.ac_year}
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
        <Table>
            <tbody>
                <tr>
                    <TabelCell>Faculty Name : {feedbackReportDetails?.employeeDetails?.employee_name}</TabelCell>
                    <TabelCell>EMP Code : {feedbackReportDetails?.employeeDetails?.empcode}</TabelCell>
                    <TabelCell>Designation : {feedbackReportDetails?.employeeDetails?.designation_name}</TabelCell>
                </tr>
                <tr>
                    <TabelCell>Department : {feedbackReportDetails?.employeeDetails?.dept_name}</TabelCell>
                    <TabelCell>DOJ : {feedbackReportDetails?.employeeDetails?.date_of_joining}</TabelCell>
                    <TabelCell>Exp at Acharya : {feedbackReportDetails?.employeeDetails?.experience}</TabelCell>
                </tr>
            </tbody>
        </Table>
    </Paper>
}

const QuestionList = ({ sectionList, feedbackReportDetails }) => {
    const Table = styled.table`
        width: 100%;
        border: 2px solid #000;
        border-collapse: collapse;
        // margin-top: 15px;
        table-layout: fixed;
           
           @media (max-width: 768px) {
           display: block;
           overflow-x: auto;
          }`

    const StyledTableCell = styled(TableCell)(({ theme }) => ({
        backgroundColor: "#182778", // Dark Blue Header
        color: "white",
        fontWeight: "bold",
        textAlign: "center",
        border: "1px solid #000",
        borderRight: 'none !important',
        borderCollapse: "collapse",
        verticalAlign: "top",
        fontSize: '12px',
        fontWeight: 500
    }));

    const TableColumnCell = styled.td`
        padding: 15px 10px;
        border: 2px solid #000;
        border-collapse: collapse;
        font-size: 12px;
        font-weight: 500;
        width: 33%;
        text-align: center;
    `
    const QuestionColumnCell = styled(TableColumnCell)`
  text-align: left; 
`;
    return (
        <Paper sx={{ margin: 0, borderRadius: 2, boxShadow: "none" }}>
            <TableContainer component={Paper} sx={{ marginTop: 2, border: "1px solid #ddd", boxShadow: "none" }}>
                <Table>
                    {/* Table Header */}
                    <TableHead>
                        <TableRow>
                            <StyledTableCell sx={{width: "80px", padding: '5px' }}>SL. No.</StyledTableCell>
                            <StyledTableCell style={{ maxWidth: "40%", flexGrow: 1, width: "auto", padding: '5px' }}>Feedback Questions</StyledTableCell>
                            {sectionList?.length >0 && sectionList?.map((section, index)=>(
                                <StyledTableCell sx={{ width: '180px', padding: 0 }} key={index}>
                                <TableRow>
                                    <StyledTableCell sx={{ padding: '5px 10px', }}>Total Students: {section?.totalStudent}</StyledTableCell>
                                </TableRow>
                                <TableRow>
                                    <StyledTableCell sx={{ padding: '5px 10px' }}>Year/Sem: {`${feedbackReportDetails?.employeeDetails?.current_year}/${feedbackReportDetails?.employeeDetails?.current_sem}`}</StyledTableCell>
                                </TableRow>
                                <TableRow>
                                    <StyledTableCell sx={{ padding: '5px 10px' }}>Subject Code: {feedbackReportDetails?.employeeDetails?.course_code}</StyledTableCell>
                                </TableRow>
                                <TableRow>
                                    <StyledTableCell sx={{ padding: '5px 10px' }}>Section: {section?.sectionName}</StyledTableCell>
                                </TableRow>
                                <TableRow>
                                    <StyledTableCell sx={{width: '180px', padding: '5px 10px' }}>Feedback Window: <br />{section?.feedbackWindow}</StyledTableCell>
                                </TableRow>
                            </StyledTableCell>
                            ))}
                        </TableRow>
                    </TableHead>

                    {/* Table Body sectionDetails*/}
                    <TableBody>
                        {feedbackReportDetails?.questionWithRatingSection?.map((data, index) => (
                            <TableRow key={data?.class_feedback_questions_id}>
                                <TableColumnCell>{index+1}</TableColumnCell>
                                <QuestionColumnCell>{data.feedback_questions}</QuestionColumnCell>
                                {data?.sectionDetails?.map((sec)=>(
                                  <TableColumnCell>{sec.ratings_percentage}%</TableColumnCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    );
}

export default FacultyFeedbackReportBySection