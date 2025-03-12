import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import axios from "../../../services/Api";
import { Box, Button, Grid, Paper, Radio, Typography } from "@mui/material";
import styled from "@emotion/styled"
import { useNavigate } from "react-router-dom";
import useAlert from "../../../hooks/useAlert";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import { AddBoxTwoTone } from "@mui/icons-material";
import acharyaLogo from "../../../assets/acharyaLogo.png";

const SubmitFeedback = () => {
    const navigate = useNavigate()
    const setCrumbs = useBreadcrumbs();
    const params = useParams()
    const { setAlertMessage, setAlertOpen } = useAlert();
    const { studentId, empId, subjectId } = params
    const [data, setData] = useState({})
    const [questionList, setQuestionList] = useState([])
    const [isAllAnswered, setIsAllAnswered] = useState(true)
    const [studentRemark, setStudentRemark] = useState('')
    const [employeeImage, setEmployeeImage] = useState('')
    useEffect(() => {
        setCrumbs([
            { name: "Student Feedback", link: "/submit-student-feedback" },
            { name: "Submit Form" }
        ])
        getStudentDetails()
    }, [])

    useEffect(() => {
        if(questionList.length > 0){
            const allAnswered = questionList.every(obj => obj.selectedValue !== "")
            if(allAnswered) setIsAllAnswered(false)
        }
    }, [questionList])

    const getStudentDetails = async () => {
        try {
          // First API Call - Get Student Details & Feedback Questions
          const res = await axios.get(`/api/feedback/getStudentForFeedbackEmpId?studentId=${studentId}&courseId=${subjectId}&empId=${empId}`);
          const { studentDetails } = res?.data?.data || {};
      
          if (studentDetails) {
            setData(studentDetails);
            setQuestionList(
              studentDetails?.studentFeedbackQuestions.map(obj => ({
                ...obj,
                selectedValue: "",
              }))
            );
          }
      
          // If employee image path exists, fetch the image
          if (studentDetails?.emp_image_attachment_path) {
            const imagePath = studentDetails.emp_image_attachment_path;
            const photoRes = await axios.get(
              `/api/employee/employeeDetailsFileDownload?fileName=${imagePath}`,
              { responseType: "blob" }
            );
            setEmployeeImage(URL.createObjectURL(photoRes.data));
          }
        } catch (error) {
          console.error(error);
         // navigate("/submit-student-feedback");
         setAlertMessage({
            severity: "error",
            message: error.response ? error.response.data.message : "Failed to Submit the feedback",
        });
        setAlertOpen(true);
        }
      };

    const handleRadioCheck = (selectedId, value) => {
        setQuestionList(questionList.map(obj => {
            if(obj.feedback_id === selectedId){
                obj.selectedValue = value
            }

            return obj
        }))
    }

    const handleSubmit = () => {
        const answersList = questionList.map(obj => {
            return {"questionId": obj.feedback_id, "rating": parseInt(obj.selectedValue)}
        })

        const payload = {
            student_id: studentId,
            user_id: empId,
            course_id: parseInt(subjectId),
            program_specialization_id: parseInt(data?.program_specialization_id),
            remarks: studentRemark?.length > 0 ? studentRemark : "",
            active: true,
            answers: answersList,
            sectionId: data?.sectionId,
            acYearId: data?.acYear,
            year: data.year,
            sem: data.sem,
            courseAndBranch: data.courseName,
            feedback_window_id: data?.feedback_window_id,
            window_count:data?.feedback_window_count
        }
        axios.post("/api/feedback/classFeedbackAnswersWeb", payload)
        .then(res => {
            setAlertMessage({
                severity: "success",
                message: "Feedback submiited successfully!!!",
            });
            setAlertOpen(true);
            navigate("/submit-student-feedback")
        })
        .catch(error => {
            setAlertMessage({
                severity: "error",
                message: error.response ? error.response.data.message : "Failed to Submit the feedback",
            });
            setAlertOpen(true);
        })
    }
    const handleChange = (e) => {
        const value = e.target.value
        setStudentRemark(value);
      };

    return (<>
        <Grid container>
            <Grid item sm={0} md={1} lg={2}></Grid>
            <Grid item sm={12} md={10} lg={8}>
                <StudentDetails data={data} employeeImage={employeeImage} />
                <QuestionList questionList={questionList} handleRadioCheck={handleRadioCheck} />
                <Box sx={{marginTop: "20px", display: "flex", justifyContent: "flex-end"}}>
                <Button variant="contained" disabled={isAllAnswered} onClick={handleSubmit}>Submit</Button>
                </Box>
            </Grid>
            <Grid item sm={0} md={1} lg={2}></Grid>
        </Grid>
    </>)
}

const StudentDetails = ({ data, employeeImage }) => {
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

    const { courseName, course_code, year, sem, facultyName, org_name, school_name, designation_name, empcode, ac_year, feedback_window_count, concateFeedbackWindow } = data
    const feedbackWindow = concateFeedbackWindow?.length > 0 && concateFeedbackWindow.trim().slice(ac_year?.length)
    const feedbackWindowStartTime = feedbackWindow?.length > 0 && feedbackWindow?.trim()?.split("/")[0]
    const feedbackWindowEndTime = feedbackWindow?.length > 0 && feedbackWindow?.trim()?.split("/")[1]
    return <Paper id="feedback-report" elevation={3} sx={{ margin: "0 auto" }}>
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
      marginHorizontal: 0,}} 
      alt="acharya logo"
      />
    <Box sx={{color: "#fff"}}>
    <Typography variant="body1" align="center" sx={{ mb: 1 }}>
      JMJ EDUCATION SOCIETY
    </Typography>
    <Typography variant="body1" align="center" sx={{ mb: 1 }}>
     {school_name||''}
    </Typography>
    <Typography variant="body1" align="center">
      STUDENT FEEDBACK FORM
    </Typography>
    </Box>
    <img 
      src={employeeImage} 
      style={{
      width: "100px",
      marginVertical: 0,
      marginHorizontal: 0,}}
      alt="employee-image"
      />
    </Box>
     <Table>
        <tbody>
        <tr>
                <TabelCell>Faculty : {facultyName}</TabelCell>
                <TabelCell>EMP Code : {empcode}</TabelCell>
                <TabelCell>Designation : {designation_name}</TabelCell>
            </tr>
            <tr>
                <TabelCell>Year/Sem : {year}/{sem}</TabelCell>
                <TabelCell>Subject Code : {course_code}</TabelCell>
                <TabelCell>Subject : {courseName}</TabelCell>
            </tr>
            <tr>
                <TabelCell>Academic Year : {ac_year}</TabelCell>
                <TabelCell>Feedback : {feedback_window_count}</TabelCell>
                <TabelCell>Window : {feedbackWindowStartTime} to {feedbackWindowEndTime}</TabelCell>
            </tr>
            <tr>
                <TabelCell colSpan={3}>
                    <RatingRow>
                        <span>5 - Excellent</span>
                        <span>4 - Very Good</span>
                        <span>3 - Good</span>
                        <span>2 - Satisfactory</span>
                        <span>1 - Not Satisfactory</span>
                    </RatingRow>
                </TabelCell>
            </tr>
        </tbody>
    </Table>
    </Paper>
}

const QuestionList = ({ questionList, handleRadioCheck }) => {
    const Table = styled.table`
        width: 100%;
        border: 2px solid #000;
        border-collapse: collapse;
        margin-top: 15px;
        table-layout: fixed;
           
           @media (max-width: 768px) {
           display: block;
           overflow-x: auto;
          }`

    const TableTitle = styled.th`
        text-align: center;
        padding: 10px 8px;
        background-color: #182778;
        color: #fff;
        font-size: 17px;
        font-weight: 500;

           @media (max-width: 768px) {
           font-size: 14px;
           padding: 8px 6px;
           }`

    const TabelCell = styled.td`
        padding: 12px 10px;
        border: 2px solid #000;
        border-collapse: collapse;
        font-size: 15px;
        font-weight: 500;
        width: 33%;
          @media (max-width: 768px) {
          font-size: 14px;
          padding: 8px 6px;
          }`

    return (<Table>
        <thead>
            <tr>
                <TableTitle>SL.No</TableTitle>
                <TableTitle style={{width: "65%"}}>Feedback Question</TableTitle>
                <TableTitle>5</TableTitle>
                <TableTitle>4</TableTitle>
                <TableTitle>3</TableTitle>
                <TableTitle>2</TableTitle>
                <TableTitle>1</TableTitle>
            </tr>
        </thead>
        <tbody>
            {questionList.map((obj, i) => {
                const { feedback_questions, feedback_id, selectedValue } = obj
                return (<tr key={feedback_id}>
                    <TabelCell style={{textAlign: "center"}}>{i + 1}</TabelCell>
                    <TabelCell>{feedback_questions}</TabelCell>
                    <TabelCell><Radio
                        checked={selectedValue === "5"}
                        onChange={e => handleRadioCheck(feedback_id, e.target.value)}
                        value="5"
                        name={`question__${feedback_id}`}
                    /></TabelCell>
                    <TabelCell><Radio
                        checked={selectedValue === "4"}
                        onChange={e => handleRadioCheck(feedback_id, e.target.value)}
                        value="4"
                        name={`question__${feedback_id}`}
                    /></TabelCell>
                    <TabelCell><Radio
                        checked={selectedValue === "3"}
                        onChange={e => handleRadioCheck(feedback_id, e.target.value)}
                        value="3"
                        name={`question__${feedback_id}`}
                    /></TabelCell>
                    <TabelCell><Radio
                        checked={selectedValue === "2"}
                        onChange={e => handleRadioCheck(feedback_id, e.target.value)}
                        value="2"
                        name={`question__${feedback_id}`}
                    /></TabelCell>
                    <TabelCell><Radio
                        checked={selectedValue === "1"}
                        onChange={e => handleRadioCheck(feedback_id, e.target.value)}
                        value="1"
                        name={`question__${feedback_id}`}
                    /></TabelCell>
                </tr>)
            })}
        </tbody>
    </Table>)
}

export default SubmitFeedback