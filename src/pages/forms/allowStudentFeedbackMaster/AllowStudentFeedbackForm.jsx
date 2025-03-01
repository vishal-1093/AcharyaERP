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

const AllowStudentFeedbackCreate = () => {
    const [loading, setLoading] = useState(false);
    const [values, setValues] = useState(initValues);
    const [SchoolNameOptions, setSchoolNameOptions] = useState([]);
    const [academicYearOptions, setAcademicYearOptions] = useState([]);
    const [feedbackWindowOptions, setFeedbackWindowOptions] = useState([]);
    const [programSpeOptions, setProgramSpeOptions] = useState([]);
    const [yearSemOptions, setYearSemOptions] = useState([]);
    const [sectionOptions, setSectionOptions] = useState([]);
    const [courseList, setCourseList] = useState([])
    const [data, setData] = useState([])
    const [selectAll, setSelectAll] = useState(false);
    const [studentDetailsOptions, setStudentDetailsOptions] = useState([]);
    const [uncheckedStudentIds, setUncheckedStudentIds] = useState([]);
    const setCrumbs = useBreadcrumbs();
    const navigate = useNavigate()
    const { setAlertMessage, setAlertOpen } = useAlert();

    const checks = {
        acYearId: [values.acYearId !== ""],
        schoolId: [values.schoolId !== ""],
        courseId: [values.courseId !== ""],
        programSpeId: [values.programSpeId !== ""],
        yearSem: [values.yearSem !== ""],
        sectionId: [values.sectionId !== ""],
        subjectId: [values.subjectId !== ""]
    };

    const errorMessages = {
        acYearId: ["This field required"],
        schoolId: ["This field is required"],
        courseId: ["This field required"],
        programSpeId: ["This field is required"],
        yearSem: ["This field required"],
        sectionId: ["This field is required"],
        subjectId: ["This field is required"]
    };

      const columns = [
        {
          field: "isSelected",
          headerName: "Checkbox Selection",
          flex: 1,
          sortable: false,
          renderHeader: () => (
            <FormGroup>
              {" "}
              <FormControlLabel control={headerCheckbox} />
            </FormGroup>
          ),
          renderCell: (params) => (
            <Checkbox
              sx={{ padding: 0 }}
              checked={params.row.checked}
              onChange={handleCheckboxChange(params.row.studentAttendenceId)}
            />
          ),
        },
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
    
      const headerCheckbox = (
        <Checkbox
          checked={selectAll}
          onClick={(e) => handleHeaderCheckboxChange(e)}
        />
      );

      useEffect(() => {
        setSelectAll(data.every((obj) => obj.checked));
      }, [data]);

    useEffect(() => {
        setCrumbs([
            {
                name: "AllowStudentFeedback Master",
                link: "/AllowStudentFeedbackMaster/students",
            },
            { name: "Feedback" },
            { name: "Create" },
        ])
        getSchoolNameOptions()
        getAcademicYearData()
      //  getFeedbackWindowData()
    }, [])

    useEffect(() => {
        if (values.schoolId) {
            getProgramSpeData()
        }
    }, [values.schoolId])

    useEffect(() => {
            if(values.schoolId && values.programSpeId && values.acYearId && values.yearSem){
             getSectionData()
             getCourse()
        }
    }, [values?.schoolId, values?.programSpeId, values?.acYearId, values?.yearSem])

    useEffect(() => {
        if(values.schoolId && values.programSpeId && values.acYearId && values.yearSem && values?.subjectId){
         getFeedbackWindowData()
    }
}, [values?.schoolId, values?.programSpeId, values?.acYearId, values?.yearSem, values?.subjectId])

    const getCourse = () => {
        axios
            .get(`api/academic/getCourseDetailData?school_id=${values?.schoolId}&ac_year_id=${values?.acYearId}&program_specialization_id=${values?.programSpeId}&year_sem=${values?.yearSem}&section_id=${values?.sectionId}`)
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

    const getProgramSpeData = async () => {
        const getAllSchoolsProgramspec = async (schoolId) => {
            const res = await fetchAllProgramsWithSpecialization(schoolId)

            return res.map((obj) => ({
                value: obj.program_specialization_id,
                label: obj.specialization_with_program,
                program_id: obj.program_id,
                program_short_name: obj.program_short_name,
                program_specialization_id: obj.program_specialization_id,
                program_specialization_short_name: obj.program_specialization_short_name
            }))
        }
        setProgramSpeOptions([...await getAllSchoolsProgramspec(values.schoolId)])
    }

    const fetchAllProgramsWithSpecialization = (schoolId) => {
        return new Promise(resolve => {
            axios
                .get(
                    `/api/academic/fetchAllProgramsWithSpecialization/${schoolId}`
                )
                .then((res) => {
                    resolve(res.data.data)
                })
                .catch((err) => {
                    console.error(err)
                    resolve([])
                });
        })
    }

    const getSchoolNameOptions = async () => {
        await axios
            .get(`/api/institute/school`)
            .then((res) => {
                setSchoolNameOptions(
                    res.data.data.map((obj) => ({
                        value: obj.school_id,
                        label: obj.school_name_short,
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
        if (name === "programSpeId") {
            axios
                .get(`/api/academic/fetchAllProgramsWithSpecialization/${values.schoolId}`)
                .then((res) => {
                    const yearsem = [];

                    res.data.data.filter((val) => {
                        if (val.program_specialization_id === newValue) {
                            yearsem.push(val);
                        }
                    });
                    const newyearsem = [];
                    yearsem.forEach((obj) => {
                        for (let i = 1; i <= obj.number_of_semester; i++) {
                            newyearsem.push({ label: `Sem-${i}`, value: i });
                        }
                    });

                    setYearSemOptions(
                        newyearsem.map((obj) => ({
                            value: obj.value,
                            label: obj.label,
                        }))
                    );
                })
                .catch((err) => console.error(err));
            setValues((prev) => ({
                ...prev,
                [name]: newValue,
            }));
        } else {
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

    const handleCheckboxChange = (id) => (event) => {
        const isChecked = event.target.checked;
        const studentUpdatedList = data?.length > 0 && data?.map((obj) =>
          obj?.studentAttendenceId === id ? { ...obj, checked: isChecked } : obj
        );
        setData(studentUpdatedList);
        if (!isChecked) {
          setUncheckedStudentIds((prevIds) => [...prevIds, id]); 
        } else {
          setUncheckedStudentIds((prevIds) =>
            prevIds.filter((studentAttendenceId) => studentAttendenceId !== id)
          ); 
        }
      };
 
    const handleHeaderCheckboxChange = (e) => {
        const isChecked = e.target.checked; 
        setData((prev) =>
            prev.map((item) => ({
                ...item,
                checked: isChecked
            }))
        )   
        if (isChecked) {
          setUncheckedStudentIds([]); 
        } else {
          setUncheckedStudentIds(
            data.map((student) => student.studentAttendenceId)
          );
        }
      };

      const getSectionData = async () => {
        await axios
               .get(`api/academic/getSectionDetailData?school_id=${values.schoolId}&ac_year_id=${values.acYearId}&program_specialization_id=${values.programSpeId}&current_year_sem=${values.yearSem}`)
            .then((res) => {
                setSectionOptions(
                    res?.data?.data?.map((obj) => ({
                            value: obj?.section_id,
                            label: obj?.section_name,
                        }))
                )
            })
            .catch((err) => console.error(err));
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
                "academicYearId":  values?.acYearId,
                "instituteId":  values?.schoolId,
                "sem":  yearSemObj[0]?.value,
                "program_specialization_id":  values?.programSpeId,
                "year":  Math.ceil(yearSemObj[0]?.value / 2),
                "courseId": values?.subjectId,
            }

            axios.post("/api/feedback/getStudentHaveLessAttendence", payload)
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

    const getFeedbackWindowData = async () => {
        const courseName = courseList?.length > 0 && courseList?.find((course)=> course?.value == values?.subjectId)
        const subjectName = programSpeOptions?.length > 0 && programSpeOptions?.find((course)=> course?.value === values.programSpeId)
        await axios
            .get(`/api/feedback/feedbackWindowListForDropDown?academicYear=${values?.acYearId}&program_specialization_id=${values.programSpeId}&semester=${values?.yearSem}&instituteId=${values?.schoolId}`)
            .then((res) => {
                const {data} = res
               const feedbackWindow = data?.length > 0 && data?.map((obj) => ({
                    value: obj.feedbackWindowId,
                    label: `${moment(obj?.from_date).format('DD-MM-YY')} to ${moment(obj?.to_date).format('DD-MM-YY')}`,
                }))
                if(feedbackWindow?.length > 0)
                setFeedbackWindowOptions([...feedbackWindow])
            })
            .catch((error) => console.error(error));
    };

    const handleFeedbackForAllowStudent = async() =>{
        const payload = []
        const studentsIds = data?.map((obj) =>{
            if (obj.checked === true) {
                payload.push({
                    "student_id":  obj?.studentId,
                    "course_id":  values?.subjectId,
                    "feedback_window_id":  values?.feedback_window_id,
                    "ac_year_id":  values?.acYearId,
                    "school_id":  values?.schoolId,
                    "active": true 
                });
              }
        }) 
        await axios
            .post(`/api/createFeedbackAllowForStudent`, payload)
            .then((res) => {
              navigate("/AllowStudentFeedbackMaster/students", { replace: true });
            })
            .catch((error) => console.error(error));
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
                        <CustomAutocomplete
                            name="schoolId"
                            label="School"
                            value={values.schoolId}
                            options={SchoolNameOptions}
                            handleChangeAdvance={handleChangeAdvance}
                            checks={checks.schoolId}
                            errors={errorMessages.schoolId}
                            required
                        />
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <CustomAutocomplete
                            name="programSpeId"
                            label="Program Major"
                            value={values.programSpeId}
                            options={programSpeOptions}
                            handleChangeAdvance={handleChangeAdvance}
                            required
                        />
                    </Grid>
                </Grid>

                <Grid
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
                            name="sectionId"
                            label="Section"
                            value={values.sectionId}
                            options={sectionOptions}
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
        </Box>
        {data?.length > 0 ?(
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
        ):null}
    </>)
}

export default AllowStudentFeedbackCreate