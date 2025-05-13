import React, { useEffect, useState } from "react"
import axios from "../../../services/Api"
import { Box, Button, CircularProgress, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, styled, tableCellClasses, Paper, Checkbox, FormGroup, FormControlLabel } from "@mui/material"
import FormWrapper from "../../../components/FormWrapper"
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete"
import useAlert from "../../../hooks/useAlert"
import GridIndex from "../../../components/GridIndex"
import useBreadcrumbs from "../../../hooks/useBreadcrumbs"
import { useNavigate } from "react-router-dom"
import moment from "moment"

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.auzColor,
        color: theme.palette.headerWhite.main,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    "&:nth-of-type(odd)": {
        backgroundColor: theme.palette.action.hover,
    },
}));

const initValues = {
    acYearId: null,
    schoolId: null,
    courseId: null,
    programSpeId: null,
    yearSem: null,
    sectionId: null,
    subjectId: null,
    feedback_window_id: null
}

const requiredFields = ["acYearId", "schoolId", "courseId", "programSpeId", "yearSem", "sectionId", "subjectId", "feedback_window_id"]

const FacultyFeedbackMasterCourse = () => {
    const [loading, setLoading] = useState(false);
    const [values, setValues] = useState(initValues);
    const [academicYearOptions, setAcademicYearOptions] = useState([]);
    const [programSpeOptions, setProgramSpeOptions] = useState([]);
    const [yearSemOptions, setYearSemOptions] = useState([]);
    const [courseList, setCourseList] = useState([])
    const [data, setData] = useState([])
    const [studentDetailsOptions, setStudentDetailsOptions] = useState([]);
    const setCrumbs = useBreadcrumbs();
    const navigate = useNavigate()
    const { setAlertMessage, setAlertOpen } = useAlert();

    const checks = {
        acYearId: [values.acYearId !== ""],
        courseId: [values.courseId !== ""],
        yearSem: [values.yearSem !== ""],
     //   subjectId: [values.subjectId !== ""]
    };

    const errorMessages = {
        acYearId: ["This field required"],
        courseId: ["This field required"],
        yearSem: ["This field required"],
      //  subjectId: ["This field is required"]
    };

      const columns = [
        {
          field: "studentName",
          headerName: "Student Name",
          flex: 1,
        },
        {
          field: "auid",
          headerName: "AUID",
          flex: 1,
        },
        {
          field: "usn",
          headerName: "USN",
          flex: 1,
        },
        {
          field: "actualPercentage",
          headerName: "Percentage",
          flex: 1,
        },
      ];

    useEffect(() => {
        // setCrumbs([
        //     {
        //         name: "AllowStudentFeedback Master",
        //         link: "/AllowStudentFeedbackMaster/students",
        //     },
        //     { name: "Feedback" },
        //     { name: "Create" },
        // ])
        getAcademicYearData()
    }, [])

    // useEffect(() => {
    //         if( values.acYearId && values.yearSem){
    //          getSectionData()
    //          getCourse()
    //     }
    // }, [ values?.acYearId, values?.yearSem])


    const getCourse = () => {
        axios
            .get(`api/academic/getCourseDetailData?ac_year_id=${values?.acYearId}&year_sem=${values?.yearSem}`)
            .then((res) => {
                setCourseList(
                    res.data.data.map((obj) => ({
                        value: obj.course_id,
                        // label: obj.course_short_name
                        label: obj.concateCourse
                    }))
                );
            })
            .catch((err) => console.error(err));
    }

    // const getProgramSpeData = async () => {
    //     const getAllSchoolsProgramspec = async (schoolId) => {
    //         const res = await fetchAllProgramsWithSpecialization(schoolId)

    //         return res.map((obj) => ({
    //             value: obj.program_specialization_id,
    //             label: obj.specialization_with_program,
    //             program_id: obj.program_id,
    //             program_short_name: obj.program_short_name,
    //             program_specialization_id: obj.program_specialization_id,
    //             program_specialization_short_name: obj.program_specialization_short_name
    //         }))
    //     }
    //     setProgramSpeOptions([...await getAllSchoolsProgramspec(values.schoolId)])
    // }

    // const fetchAllProgramsWithSpecialization = (schoolId) => {
    //     return new Promise(resolve => {
    //         axios
    //             .get(
    //                 `/api/academic/fetchAllProgramsWithSpecialization/${schoolId}`
    //             )
    //             .then((res) => {
    //                 resolve(res.data.data)
    //             })
    //             .catch((err) => {
    //                 console.error(err)
    //                 resolve([])
    //             });
    //     })
    // }

    const getAcademicYearData = async () => {
        await axios
            .get(`/api/academic/academic_year`)
            .then((res) => {
                setAcademicYearOptions(
                    res.data.data.map((obj) => ({
                        value: obj.ac_year_id,
                        label: obj.ac_year,
                    }))
                );
            })
            .catch((error) => console.error(error));
    };

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

    const handleSubmit = () => {
        if (!requiredFieldsValid()) {
            setAlertMessage({
                severity: "error",
                message: "please fill all fields",
            });
            setAlertOpen(true);
        } else {
            setLoading(true);
            const yearSemObj = yearSemOptions.filter((obj) => obj.value === values.yearSem)
            const payload = {
                "ac_year_id":  values?.acYearId,
                "sem":  yearSemObj[0]?.value,
                "year":  Math.ceil(yearSemObj[0]?.value / 2),
                "course_id": values?.subjectId,
            }

            axios.post("api/student/getFeedbackRatingReportCourseWise?employee_id=18", payload)
                .then(res => {
                    setLoading(false)
                    setData(res.data.data.map(obj => {
                        return {...obj, id:obj.studentAttendenceId, checked: false}
                    }))
                })
                .catch(err => {
                    setLoading(false);
                    setAlertMessage({
                        severity: "error",
                        message: "Failed to create, Please try after sometime",
                    });
                    setAlertOpen(true);
                })
        }
    }

    return (<>
        <Box component="form" overflow="hidden" p={1}>
            <FormWrapper>
                <Grid
                    container
                    alignItems="center"
                    rowSpacing={4}
                    columnSpacing={{ xs: 2, md: 4 }}
                    sx={{ marginBottom: "20px" }}
                >
                    <Grid item xs={12} md={4}>
                        <CustomAutocomplete
                            name="acYearId"
                            label="Academic Year"
                            value={values.acYearId}
                            options={academicYearOptions}
                            handleChangeAdvance={handleChangeAdvance}
                            checks={checks.acYearId}
                            errors={errorMessages.acYearId}
                            required
                        />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        {/* <CustomAutocomplete
                            name="programSpeId"
                            label="Program Major"
                            value={values.programSpeId}
                            options={programSpeOptions}
                            handleChangeAdvance={handleChangeAdvance}
                            required
                        /> */}
                        <CustomAutocomplete
                            name="yearSem"
                            label="Year/Sem"
                            value={values.yearSem}
                            options={yearSemOptions}
                            handleChangeAdvance={handleChangeAdvance}
                            required
                        />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <CustomAutocomplete
                            name="subjectId"
                            label="Course"
                            value={values.subjectId}
                            options={courseList}
                            handleChangeAdvance={handleChangeAdvance}
                            required
                        />
                    </Grid>
                </Grid>
                {/* <Grid
                    container
                    alignItems="center"
                    rowSpacing={4}
                    columnSpacing={{ xs: 2, md: 4 }}
                    sx={{ marginBottom: "20px" }}
                >
                    <Grid item xs={12} md={4}>
                        <CustomAutocomplete
                            name="yearSem"
                            label="Year/Sem"
                            value={values.yearSem}
                            options={yearSemOptions}
                            handleChangeAdvance={handleChangeAdvance}
                            required
                        />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <CustomAutocomplete
                            name="subjectId"
                            label="Course"
                            value={values.subjectId}
                            options={courseList}
                            handleChangeAdvance={handleChangeAdvance}
                            required
                        />
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <CustomAutocomplete
                            name="feedback_window_id"
                            label="Feedback Window"
                            value={values.feedback_window_id}
                            options={feedbackWindowOptions}
                            handleChangeAdvance={handleChangeAdvance}
                            required
                        />
                    </Grid>
                </Grid> */}

                <Grid
                    container
                    alignItems="flex-end"
                    justifyContent="flex-end" 
                    rowSpacing={4}
                    columnSpacing={{ xs: 2, md: 4 }}
                >
                    <Grid item xs={12} md="auto">
                        <Button
                            style={{ borderRadius: 7 }}
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
        </Box>
        {/* {data?.length > 0 ?(
        <Grid
         container
         justifyContent="center"
         alignItems="center"
         rowSpacing={4}
         columnSpacing={2}
        >
          <Grid item xs={12} md={8}>

              <GridIndex rows={data} columns={columns} />
          </Grid>
          <Grid item xs={12} align="right">
            <Button
              style={{ borderRadius: 7 }}
              variant="contained"
              color="primary"
              disabled={data?.filter((obj) => obj?.checked === true)?.length === 0}
              onClick={handleFeedbackForAllowStudent}
            >
              {loading ? (
                <CircularProgress
                  size={25}
                  color="blue"
                  style={{ margin: "2px 13px" }}
                />
              ) : (
                <strong>Allow Feedback</strong>
              )}
            </Button>
          </Grid>
          </Grid>
        ):null} */}
    </>)
}

export default FacultyFeedbackMasterCourse