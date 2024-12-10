import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import axios from "../../../services/Api";
import { Box, Button, Grid, Radio } from "@mui/material";
import styled from "@emotion/styled"
import { useNavigate } from "react-router-dom";
import useAlert from "../../../hooks/useAlert";

const SubmitFeedback = () => {
    const navigate = useNavigate()
    const setCrumbs = useBreadcrumbs();
    const params = useParams()
    const { setAlertMessage, setAlertOpen } = useAlert();
    const { studentId, empId, subjectId } = params
    const [data, setData] = useState({})
    const [questionList, setQuestionList] = useState([])
    const [isAllAnswered, setIsAllAnswered] = useState(true)

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

    const getStudentDetails = () => {
        axios
            .get(`/api/feedback/getStudentForFeedback?studentId=${studentId}&courseId=${subjectId}&empId=${empId}`)
            .then((res) => {
                setData(res.data.data)
                setQuestionList(
                    res.data.data.studentFeedbackQuestions.map(obj => {
                        return { ...obj, selectedValue: "" }
                    })
                )
            })
            .catch((err) => {
                console.error(err)
                navigate("/submit-student-feedback")
            });
    }

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
            course_id: subjectId,
            remarks: "",
            active: true,
            answers: answersList,
            sectionId: data.sectionId,
            acYearId: data.acYearId,
            year: data.year,
            sem: data.sem,
            courseAndBranch: data.courseAndBranch
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
            console.log(error)
            setAlertMessage({
                severity: "error",
                message: error.response ? error.response.data.message : "Failed to Submit the feedback",
            });
            setAlertOpen(true);
        })
    }

    return (<>
        <Grid container>
            <Grid item sm={0} md={1} lg={2}></Grid>
            <Grid item sm={12} md={10} lg={8}>
                <StudentDetails data={data} />
                <QuestionList questionList={questionList} handleRadioCheck={handleRadioCheck} />
                <Box sx={{marginTop: "20px", display: "flex", justifyContent: "flex-end"}}>
                <Button variant="contained" disabled={isAllAnswered} onClick={handleSubmit}>Submit</Button>
                </Box>
            </Grid>
            <Grid item sm={0} md={1} lg={2}></Grid>
        </Grid>
    </>)
}

const StudentDetails = ({ data }) => {
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
        text-align: center;
        padding: 10px 8px;
        background-color: #623f8f;
        color: #fff;
        font-size: 17px;
        font-weight: 500;
    `

    const RatingRow = styled.div`
        display: flex;
        justify-content: space-between;
    `

    const { courseName, employeeName } = data
    return <Table>
        <tbody>
            <tr>
                <TableTitle colSpan={3}>Student Feedback Form</TableTitle>
            </tr>
            <tr>
                <TabelCell>Faculty Name : {employeeName}</TabelCell>
                <TabelCell>Subject : {courseName}</TabelCell>
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
}

const QuestionList = ({ questionList, handleRadioCheck }) => {
    const Table = styled.table`
        width: 100%;
        border: 2px solid #000;
        border-collapse: collapse;
        margin-top: 15px;
        width: 100%;
        table-layout: fixed;
    `

    const TableTitle = styled.th`
        text-align: center;
        padding: 10px 8px;
        background-color: #623f8f;
        color: #fff;
        font-size: 17px;
        font-weight: 500;
    `

    const TabelCell = styled.td`
        padding: 12px 10px;
        border: 2px solid #000;
        border-collapse: collapse;
        font-size: 15px;
        font-weight: 500;
        width: 33%;
    `

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