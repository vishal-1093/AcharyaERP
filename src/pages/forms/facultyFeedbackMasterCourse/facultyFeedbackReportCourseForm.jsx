import React, { useEffect, useState } from "react"
import axios from "../../../services/Api"
import { Box, Button, CircularProgress, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, styled, tableCellClasses, Paper, Checkbox, FormGroup, FormControlLabel, Typography, Tab, Tabs } from "@mui/material"
import FormWrapper from "../../../components/FormWrapper"
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete"
import useAlert from "../../../hooks/useAlert"
import useBreadcrumbs from "../../../hooks/useBreadcrumbs"
import { useLocation, useNavigate } from "react-router-dom"
import ProgramSpecializationIndex from "../../../containers/indeces/academicMaster/ProgramSpecializationIndex"

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
    acYearId: "",
    courseId: "",
    // programSpecializationId: "",
    yearSem: "",
    acYear: "",
    departmentId: "",
    schoolId: ""
}

const requiredFields = ["acYearId", "yearSem"]

const FacultyFeedbackReportCourseForm = () => {
    const [loading, setLoading] = useState(false);
    const [values, setValues] = useState(initValues);
    const [academicYearOptions, setAcademicYearOptions] = useState([]);
    const [yearSemOptions, setYearSemOptions] = useState([]);
    const [departmentOptions, setDepartmentOptions] = useState([])
    const [schoolOptions, setSchoolOptions] = useState([])
    const setCrumbs = useBreadcrumbs();
    const { setAlertMessage, setAlertOpen } = useAlert();
    const { pathname } = useLocation();
    const userID = JSON.parse(sessionStorage.getItem("AcharyaErpUser"))?.userId;
    const { school_id: schoolID, dept_id: departmentID } = JSON.parse(sessionStorage.getItem("userData"));
    const navigate = useNavigate()

    const checks = {
        acYearId: [values.acYearId !== ""],
        departmentId: [values.departmentId !== ""],
        // courseId: [values.courseId !== ""],
        yearSem: [values.yearSem !== ""]
    };

    const errorMessages = {
        acYearId: ["This field required"],
        departmentId: ["This field required"],
        // courseId: ["This field required"],
        yearSem: ["This field required"]
    };

    useEffect(() => {
        setCrumbs([
            { name: "Faculty Feedback Master-Course" }
        ])
        getAcademicYearData()
        getAllInstitute()
    }, [])

    useEffect(() => {
        getYearSemData()
    }, [userID])

    useEffect(() => {
            getAllDepartment();
        }, [schoolID, values?.schoolId]);


    const getAllDepartment = async() => {
        if (values.schoolId || schoolID) {
        const id = values.schoolId ? values.schoolId : schoolID;
       await axios.get(`/api/fetchdept1/${id}`)
            .then((res) => {
                const departmentData = res.data.data.map((obj) => ({
                    value: obj?.dept_id,
                    label: obj?.dept_name
                }))
                setDepartmentOptions(departmentData || []);
            })
            .catch((err) => {
                console.error(err)
                setAlertMessage({
                    severity: "error",
                    message: "Something went wrong, Please try again!!",
                });
                setAlertOpen(true);
            });
        }
    }

    const getAllInstitute = async () => {
        await axios
            .get(`/api/institute/school`)
            .then((res) => {
                const optionData = [];
                res.data.data.forEach((obj) => {
                    optionData.push({
                        value: obj?.school_id,
                        label: obj?.school_name,
                        school_name_short: obj?.school_name_short,
                    });
                });
                setSchoolOptions(optionData);
            })
            .catch((err) => {
                console.error(err);
                setAlertMessage({
                    severity: "error",
                    message: "Something went wrong, Please try again!!",
                });
                setAlertOpen(true);

            })
    };

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
            .catch((error) => {
                console.error(error)
                setAlertMessage({
                    severity: "error",
                    message: "Something went wrong, Please try again!!",
                });
                setAlertOpen(true);
            });
    };

    const getAllEmployee = async() =>{
    //   if( pathname === '/FacultyFeedbackMaster-course-dept'){
    //    await axios
    //         .get(`api/employee/getEmployeeIdBasedOnHod?employee_id=${userID}`)
    //         .then((res) => {
    //             const {data} = res?.data
    //             const empData = data?.length > 0 && data?.map((emp)=> emp.emp_id)

    //             return empData?.length > 0 ? empData : []
    //         })
    //         .catch((error) => {
    //             console.error(error)
    //             setAlertMessage({
    //                 severity: "error",
    //                 message: "Something went wrong, Please try again!!",
    //             });
    //             setAlertOpen(true);
    //         });
    //     }else{
    //         if(values?.departmentId){
    //          const school_id= values.schoolId ? values.schoolId : schoolID;
    //         await axios
    //         .get(`api/employee/getEmployeeIdBasedOnSclAndDept?dept_id=${values.departmentId}&school_id=${school_id}`)
    //         .then((res) => {
    //              const {data} = res?.data
    //             const empData = data?.length > 0 && data?.map((emp)=> emp?.emp_id)
    //             return empData?.length > 0 ? empData : []
    //         })
    //         .catch((error) => {
    //             console.error(error)
    //             setAlertMessage({
    //                 severity: "error",
    //                 message: "Something went wrong, Please try again!!",
    //             });
    //             setAlertOpen(true);
    //         });
    //     }
    //     }
    try {
    if (pathname === '/FacultyFeedbackMaster-course-dept') {
      const res = await axios.get(`api/employee/getEmployeeIdBasedOnHod?employee_id=${userID}`);
      const { data } = res?.data;
      const empData = data?.length > 0 ? data.map((emp) => emp.emp_id) : [];
      return empData;
    } else {
      if (values?.departmentId) {
        const school_id = values.schoolId ? values.schoolId : schoolID;
        const res = await axios.get(`api/employee/getEmployeeIdBasedOnSclAndDept?dept_id=${values.departmentId}&school_id=${school_id}`);
        const { data } = res?.data;
        const empData = data?.length > 0 ? data.map((emp) => emp.emp_id) : [];
        return empData;
      }
    }
  }catch (error) {
    console.error(error);
    setAlertMessage({
      severity: "error",
      message: "Something went wrong, Please try again!!",
    });
    setAlertOpen(true);
    return []; 
  }
    }

    const handleChangeAdvance = (name, newValue) => {
        if (name === 'acYearId') {
            const academicYearData = academicYearOptions?.length > 0 && academicYearOptions?.find((acOpt) => acOpt.value === newValue)
            setValues((prev) => ({
                ...prev,
                [name]: newValue,
                ['acYear']: academicYearData?.label
            }));
        } else if(name === 'schoolId'){
            setValues((prev) => ({
                ...prev,
                [name]: newValue,
                ['departmentId'] : ""
            }));
            setDepartmentOptions([])
        }
        else {
            setValues((prev) => ({
                ...prev,
                [name]: newValue,
            }));
        }
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

    const getYearSemData = async () => {
        await axios
            .get(`/api/student/getFeedbackYearSemDetailsData?employee_id=${userID}`)
            .then((res) => {
                setYearSemOptions(
                    res?.data?.data?.map((obj) => ({
                        value: `${obj?.year}/${obj?.sem}`,
                        label: `${obj?.year}/${obj?.sem}`,
                    }))
                )
            })
            .catch((err) => {
                console.error(err)
                setAlertMessage({
                    severity: "error",
                    message: "Something went wrong, Please try again!!",
                });
                setAlertOpen(true);
            })
    };

    const handleSubmit = async() => {
        if (!requiredFieldsValid()) {
            setAlertMessage({
                severity: "error",
                message: "please fill all fields",
            });
            setAlertOpen(true);
        } else {
            const employeeData = await getAllEmployee()
            const empIds = employeeData ?.length > 0  ? employeeData.join(',') : ""
            const yearAndSem = values?.yearSem && values?.yearSem?.split("/")
            const year = yearAndSem?.length > 0 ? yearAndSem[0] : ""
            const sem = yearAndSem?.length > 0 ? yearAndSem[1] : ""
            const year_sem = sem ? sem : year ? year : 0
            const params = {
                employee_id: userID,
                ac_year_id: values?.acYearId,
                dept_id: ((pathname === "/FacultyFeedbackMaster-course-inst") || (pathname === "/FacultyFeedbackMaster-course-dept")) ? departmentID : values?.dept_id,
                sem,
                year,
                year_sem,
                acYear: values?.acYear,
                employee_id: empIds
            }
            navigate(`/facultyFeedbackMasterCourseIndex`, { state: params });
        }
    }
               
    return (
        <>
            <Box component="form" overflow="hidden" p={1}>
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
                        <Grid item xs={12} md={6}>
                            <CustomAutocomplete
                                name="schoolId"
                                label="Institute"
                                value={((pathname === "/FacultyFeedbackMaster-course-inst") || (pathname === "/FacultyFeedbackMaster-course-dept")) ? schoolID : values.schoolId}
                                options={schoolOptions || []}
                                handleChangeAdvance={handleChangeAdvance}
                                disabled={((pathname === "/FacultyFeedbackMaster-course-inst") || (pathname === "/FacultyFeedbackMaster-course-dept")) ? true : false}
                            // checks={checks.courseId}
                            // errors={errorMessages.courseId}
                            // required
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <CustomAutocomplete
                                name="departmentId"
                                label="Department"
                                value={pathname === "/FacultyFeedbackMaster-course-dept" ? departmentID : values.departmentId}
                                options={departmentOptions || []}
                                handleChangeAdvance={handleChangeAdvance}
                                disabled={pathname === "/FacultyFeedbackMaster-course-dept" ? true : false}
                            // checks={checks.courseId}
                            // errors={errorMessages.courseId}
                            // required
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <CustomAutocomplete
                                name="yearSem"
                                label="Year/Sem"
                                value={values.yearSem}
                                options={yearSemOptions}
                                handleChangeAdvance={handleChangeAdvance}
                                checks={checks.yearSem}
                                errors={errorMessages.yearSem}
                                required
                            />
                        </Grid>

                        {/* <Grid item xs={12} md={6}>
                            <CustomAutocomplete
                                name="programSpecializationId"
                                label="Program Spelization"
                                value={values.programSpecializationId}
                                options={programSplList || []}
                                handleChangeAdvance={handleChangeAdvance}
                                checks={checks.programSpecializationId}
                                errors={errorMessages.programSpecializationId}
                                required
                            />
                        </Grid> */}
                        {/* <Grid item xs={12} md={6}>
                            <CustomAutocomplete
                                name="courseId"
                                label="Course"
                                value={values.courseId}
                                options={courseList || []}
                                handleChangeAdvance={handleChangeAdvance}
                                // checks={checks.courseId}
                                // errors={errorMessages.courseId}
                                // required
                            />
                        </Grid> */}
                    </Grid>
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
        </>
    )
}

export default FacultyFeedbackReportCourseForm