import React, { useEffect, useState } from "react"
import axios from "../../../services/Api"
import { Box, Button, CircularProgress, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, styled, tableCellClasses, Paper, Checkbox, FormGroup, FormControlLabel, Typography, Tab, Tabs } from "@mui/material"
import FormWrapper from "../../../components/FormWrapper"
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete"
import useAlert from "../../../hooks/useAlert"
import GridIndex from "../../../components/GridIndex"
import useBreadcrumbs from "../../../hooks/useBreadcrumbs"
import FacultyFeedbackReportByCourseAndSection from "./facultyFeedbackReportCourseBySection"
import FacultyFeedbackReportByCourse from "./facultyFeedbackReportByCourse"
import { useNavigate } from "react-router-dom"
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
    programSpecializationId: "",
    yearSem: "",
}

const tabsData = [
  { label: "Course", value: "course", component: FacultyFeedbackReportByCourse },
  { label: "Section", value: "course-and-section", component: FacultyFeedbackReportByCourseAndSection },
];

const requiredFields = ["acYearId", "courseId", "yearSem"]

const FacultyFeedbackReportCourseForm = () => {
    const [loading, setLoading] = useState(false);
    const [values, setValues] = useState(initValues);
    const [academicYearOptions, setAcademicYearOptions] = useState([]);
    const [yearSemOptions, setYearSemOptions] = useState([]);
    const [courseList, setCourseList] = useState([])
     const [programSplList, setProgramSplList] = useState([])
    const [data, setData] = useState([])
    const [tab, setTab] = useState("course");
    const [queryParam, setQueryParam] = useState({})
    const setCrumbs = useBreadcrumbs();
    const { setAlertMessage, setAlertOpen } = useAlert();

    const userID = JSON.parse(sessionStorage.getItem("AcharyaErpUser"))?.userId;
    const schoolID = JSON.parse(sessionStorage.getItem("userData"))?.school_id;
    const roleShortName = JSON.parse(
        sessionStorage.getItem("AcharyaErpUser")
    )?.roleShortName;

    const navigate = useNavigate()

    const checks = {
        acYearId: [values.acYearId !== ""],
        courseId: [values.courseId !== ""],
        yearSem: [values.yearSem !== ""]
    };

    const errorMessages = {
        acYearId: ["This field required"],
        courseId: ["This field required"],
        yearSem: ["This field required"]
    };

    const columns = [
        {
            field: "employee_name",
            headerName: "Employee Name",
            flex: 1,
        },
        {
            field: "course_name",
            headerName: "Course Name",
            flex: 1,
        },
        {
            field: "overall_section_average",
            headerName: "Average Percentage",
            flex: 1,
        },
        {
            field: "concateFeedbackWindow",
            headerName: "feedback Window",
            flex: 1,
            renderCell: (params) => {
                const feedbackWindow = params?.row?.concateFeedbackWindow?.split("/")?.join("-")
                return (
                    <Typography>{feedbackWindow}</Typography>
                )
            }
        },
    ];


    useEffect(() => {

        setCrumbs([
            { name: "Faculty Feedback Master-Course" }
        ])

        getAcademicYearData()
      //  getCourse()
        getYearSemData()
    }, [userID])

    useEffect(()=>{
        if(values?.acYearId && values?.yearSem)
     getAllProgramSpecialization()
    },[values?.acYearId, values?.yearSem])

    useEffect(()=>{
      if(values?.acYearId && values?.yearSem){
        getAllProgramSpecialization()
      }
      if(values?.acYearId && values?.yearSem && values?.programSpecializationId){
         getAllCourse()
      }
    },[values?.programSpecializationId, values?.acYearId, values?.yearSem])

    const getAllProgramSpecialization = () =>{
        const year_sem = getYearAndSem()
         axios.get(`/api/academic/FetchAllProgramSpecializationDropDown/${schoolID}/${values?.acYearId}/${year_sem}`)
            .then((res) => {
                const programSplData =  res.data.data.map((obj) => ({
                        value: obj?.program_specialization_id,
                        label: `${obj?.program_specialization_name}-${obj?.program_specialization_short_name}`
                    }))
                setProgramSplList(programSplData || []);
            })
            .catch((err) => console.error(err));
    }

    const getAllCourse = () => {
         const yearSem = getYearAndSem()
         const {programSpecializationId, acYearId} = values
        const params = {
             ...(acYearId && { ac_year_id: acYearId }),
            ...(yearSem && { year_sem: yearSem }),
            ...(programSpecializationId && { program_specialization_id: programSpecializationId }),
        }
        axios.get(`api/academic/getCourseAssignmentBasedOnProgramSpecialization`,{params})
            .then((res) => {
                setCourseList(
                    res.data.data.map((obj) => ({
                        value: obj?.course_id,
                        label: `${obj?.course_name}-${obj?.course_code}`
                    }))
                );
            })
            .catch((err) => console.error(err));
    }

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
            .catch((err) => console.error(err));
    };

    const getYearAndSem = () =>{
            const yearAndSem = values?.yearSem && values?.yearSem?.split("/")
            const year = yearAndSem?.length > 0 ? yearAndSem[0] : ""
            const sem = yearAndSem?.length > 0 ? yearAndSem[1] : ""
            const year_sem = sem ? sem : year ? year : 0
            return year_sem
    }

    const handleSubmit = () => {
        if (!requiredFieldsValid()) {
            setAlertMessage({
                severity: "error",
                message: "please fill all fields",
            });
            setAlertOpen(true);
        } else {
            setLoading(true);
            const yearAndSem = values?.yearSem && values?.yearSem?.split("/")
            const year = yearAndSem?.length > 0 ? yearAndSem[0] : ""
            const sem = yearAndSem?.length > 0 ? yearAndSem[1] : ""
            const year_sem = sem ? sem : year ? year : 0
            const params = {
                employee_id: userID,
                ac_year_id: values?.acYearId,
                course_id: values?.courseId,
                program_specialization_id: values?.programSpecializationId,
                sem,
                year,
                year_sem
            }

          //setQueryParam(params)
            ///api/student/getFeedbackRatingReportSectionWiseReport?employee_id=18&year=2&sem=4&ac_year_id=6&course_id=725
            // const baseUrl = tab === 'course' ? "/api/student/getFeedbackRatingReportCourseWise" : "api/student/getFeedbackRatingReportSectionWiseReport"
            // axios.get(baseUrl, { params })
            //     .then(res => {
            //         setLoading(false)
            //         const { data } = res.data
            //         setData(data || [])
            //     })
            //     .catch(err => {
            //         setLoading(false);
            //         setAlertMessage({
            //             severity: "error",
            //             message: "Failed to create, Please try after sometime",
            //         });
            //         setAlertOpen(true);
            //     })
            navigate(`/facultyFeedbackMasterCourseIndex`,{state: params});
        }
    }


   const handleChange = (event, newValue) => {
    setTab(newValue);
  };

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
                                // checks={checks.acYearId}
                                // errors={errorMessages.acYearId}
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
                                //  required
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <CustomAutocomplete
                                    name="programSpecializationId"
                                    label="Program Spelization"
                                    value={values.programSpecializationId}
                                    options={programSplList || []}
                                    handleChangeAdvance={handleChangeAdvance}
                                //  required
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <CustomAutocomplete
                                    name="courseId"
                                    label="Course"
                                    value={values.courseId}
                                    options={courseList || []}
                                    handleChangeAdvance={handleChangeAdvance}
                                //  required
                                />
                            </Grid>
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
                {/* <Tabs value={tab} onChange={handleChangeTab}>
                    <Tab value="course" label="Course" />
                    <Tab value="course-and-section" label="Course And Section" />
                </Tabs> */}

                {/* <Grid
                    container
                    justifyContent="center"
                    alignItems="center"
                    rowSpacing={4}
                    columnSpacing={2}
                >
                    <Grid item xs={12} md={12}>
                        <GridIndex rows={data} columns={columns} getRowId={(rows) => rows?.course_id} />
                    </Grid>
                </Grid> */}

                {/* <Tabs value={tab} onChange={handleChange}>
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
                          {tab === tabItem.value && <tabItem.component queryParams={queryParam}/>}
                        </div>
                      ))} */}
            </>
    )
}

export default FacultyFeedbackReportCourseForm




{/* {data?.length > 0 && (
     <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell><strong>Employee Name</strong></TableCell>
            <TableCell><strong>Course Name</strong></TableCell>
            <TableCell><strong>Section Average (%)</strong></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((item, index) => (
            <TableRow key={index}>
              <TableCell>{item.employee_name}</TableCell>
              <TableCell>{item.course_name}</TableCell>
              <TableCell>{item.overall_section_average}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
          )} */}