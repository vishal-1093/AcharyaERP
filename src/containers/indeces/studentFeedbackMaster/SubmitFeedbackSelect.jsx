import React, { useEffect, useState } from "react"
import axios from "../../../services/Api"
import { Box, Button, CircularProgress, Grid } from "@mui/material"
import FormWrapper from "../../../components/FormWrapper"
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete"
import useBreadcrumbs from "../../../hooks/useBreadcrumbs"
import useAlert from "../../../hooks/useAlert"
import { useNavigate } from "react-router-dom";

const initValues = {
    employeeName: "",
    subjectName: ""
};

const requiredFields = ["employeeName", "subjectName"];

const SubmitFeedbackSelect = () => {
    const setCrumbs = useBreadcrumbs();
    const [loading, setLoading] = useState(false);
    const [values, setValues] = useState(initValues);
    const [subjectNameOptions, setSubjectNameOptions] = useState([])
    const [employeeNameOptions, setEmployeeNameOptions] = useState([])
    const [studentId, setStudentId] = useState(null)
    const { setAlertMessage, setAlertOpen } = useAlert();
    const navigate = useNavigate();

    const checks = {
        employeeName: [values.employeeName !== ""],
        subjectName: [values.subjectName !== ""]
    };

    const errorMessages = {
        employeeName: ["This field required"],
        subjectName: ["This field is required"]
    };

    useEffect(() => {
        setCrumbs([{ name: "Student Feedback"}])
        // getEmployeelNameOptions()
          getStudentData()
    }, [])

    useEffect(()=>{
     if(studentId){
        getEmployeelNameOptions()
     }
    }, [studentId])

    useEffect(() => {
        if(values.employeeName !== null)
            getSubjectlNameOptions()
    }, [values.employeeName])

    const getEmployeelNameOptions = async () => {
        // const studentId = JSON.parse(localStorage.getItem("AcharyaErpUser"))?.userId;
        await axios
             .get(`/api/feedback/getEmployeeList?studentId=${studentId}`)
            .then((res) => {
                setEmployeeNameOptions(
                    res.data.data.map((obj) => ({
                        value: obj.empId,
                        label: `${obj.employeeName} - ${obj.empCode}`,
                    }))
                );
            })
            .catch((err) => console.error(err));
    }

    const getSubjectlNameOptions = async () => {
        // const studentId = JSON.parse(localStorage.getItem("AcharyaErpUser"))?.userId;11014
        await axios
            .get(`/api/feedback/getCourseList?studentId=${studentId}&empId=${values.employeeName}`)
            .then((res) => {
                setSubjectNameOptions(
                    res.data.data.map((obj) => ({
                        value: obj.courseId,
                        label: `${obj.courseName} - ${obj.courseCode}`,
                    }))
                );
            })
            .catch((error) => console.error(error));
    };
    
    const getStudentData = async()=>{
        const userId = JSON.parse(sessionStorage.getItem("AcharyaErpUser"))?.userId;
        await axios
             .get(`/api/student/getStudentDetailsBasedOnUserId?userId=2302`)
            .then((res) => {
                const {student_id} = res?.data
               setStudentId(student_id)
            })
            .catch((err) => console.error(err));
      }

    const handleChangeAdvance = (name, newValue) => {
        setValues((prev) => ({
            ...prev,
            [name]: newValue,
        }));
    };

    const requiredFieldsValid = () => {
        for (let i = 0; i < requiredFields.length; i++) {
            const field = requiredFields[i];
            if (Object.keys(checks).includes(field)) {
                const ch = checks[field];
                for (let j = 0; j < ch.length; j++) if (!ch[j]) return false;
            } else if (!values[field]) return false;
        }
        return true;
    };

    const handleSubmit = async() => {
        if (!requiredFieldsValid()) {
            setAlertMessage({
                severity: "error",
                message: "please fill all fields",
            });
            setAlertOpen(true);
        } else {
            setLoading(true);
            // const studentId = JSON.parse(localStorage.getItem("AcharyaErpUser"))?.userId;  api/feedback/getStudentForFeedback?studentId=1444&courseId=815
            await axios
            .get(`/api/feedback/getStudentForFeedback?studentId=${studentId}&courseId=${values.subjectName}`)
            .then((res) => {
                navigate(`/submit-student-feedback/${studentId}/${values.employeeName}/${values.subjectName}`)
            })
            .catch((error) => {
                setLoading(false);
                setAlertMessage({
                    severity: "error",
                    message: error.response ? error.response.data.message : "Failed to Submit the feedback",
                });
                setAlertOpen(true);
        });
            // navigate(`/submit-student-feedback/${studentId}/${values.employeeName}/${values.subjectName}`)
        }
    }

    return (<Box component="form" overflow="hidden" p={1}>
        <FormWrapper>
            <Grid
                container
                alignItems="center"
                rowSpacing={4}
                columnSpacing={{ xs: 2, md: 4 }}
                sx={{ marginBottom: "20px" }}
            >
                <Grid item xs={12} md={6}>
                    <CustomAutocomplete
                        name="employeeName"
                        label="Employee Name"
                        value={values.employeeName}
                        options={employeeNameOptions}
                        handleChangeAdvance={handleChangeAdvance}
                        checks={checks.employeeName}
                        errors={errorMessages.employeeName}
                        required
                    />
                </Grid>

                <Grid item xs={12} md={6}>
                    <CustomAutocomplete
                        name="subjectName"
                        label="Subject Name"
                        value={values.subjectName}
                        options={subjectNameOptions}
                        handleChangeAdvance={handleChangeAdvance}
                        checks={checks.subjectName}
                        errors={errorMessages.subjectName}
                        required
                    />
                </Grid>
            </Grid>

            <Grid
                container
                alignItems="flex-end"
                rowSpacing={4}
                columnSpacing={{ xs: 2, md: 4 }}
            >
                <Grid item xs={12}>
                    <Button
                        style={{ borderRadius: 7, display: "flex", alignItems: "flex-end" }}
                        variant="contained"
                        color="primary"
                        disabled={loading}
                        onClick={handleSubmit}
                    >
                        {loading ? (
                            <CircularProgress
                                size={25}
                                color="blue"
                                style={{ margin: "2px 13px" }}
                            />
                        ) : (
                            <strong>Submit</strong>
                        )}
                    </Button>
                </Grid>
            </Grid>
        </FormWrapper>
    </Box>)
}

export default SubmitFeedbackSelect