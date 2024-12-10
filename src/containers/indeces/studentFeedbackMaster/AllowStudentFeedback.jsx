import React, { useEffect, useState } from "react"
import axios from "../../../services/Api"
import { Box, Button, CircularProgress, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, styled, tableCellClasses, Paper, Checkbox } from "@mui/material"
import FormWrapper from "../../../components/FormWrapper"
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete"
import useAlert from "../../../hooks/useAlert"

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.auzColor.main,
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
    subjectId: null
}

const requiredFields = ["acYearId", "schoolId", "courseId", "programSpeId", "yearSem", "sectionId", "subjectId"]

const AllowStudentFeedback = () => {
    const [loading, setLoading] = useState(false);
    const [values, setValues] = useState(initValues);
    const [SchoolNameOptions, setSchoolNameOptions] = useState([]);
    const [academicYearOptions, setAcademicYearOptions] = useState([]);
    const [programSpeOptions, setProgramSpeOptions] = useState([]);
    const [yearSemOptions, setYearSemOptions] = useState([]);
    const [sectionOptions, setSectionOptions] = useState([]);
    const [courseList, setCourseList] = useState([])
    const [data, setData] = useState([])
    const [studentDetailsOptions, setStudentDetailsOptions] = useState([]);

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

    useEffect(() => {
        getSchoolNameOptions()
        getAcademicYearData()
        getCourse()
    }, [])

    useEffect(() => {
        if (values.schoolId) {
            getProgramSpeData()
            getSectionData()
        }
    }, [values.schoolId])

    const getCourse = () => {
        axios
            .get(`/api/academic/Course`)
            .then((res) => {
                setCourseList(
                    res.data.data.map((obj) => ({
                        value: obj.course_id,
                        label: obj.course_short_name,
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

    const handleSubmit = () => {
        if (!requiredFieldsValid()) {
            setAlertMessage({
                severity: "error",
                message: "please fill all fields",
            });
            setAlertOpen(true);
        } else {
            setLoading(true);

            const academicYearObj = academicYearOptions.filter((obj) => obj.value === values.acYearId)
            const schoolObj = SchoolNameOptions.filter((obj) => obj.value === values.schoolId)
            const selectedCourseObj = programSpeOptions.filter((obj) => obj.value === values.programSpeId)
            const yearSemObj = yearSemOptions.filter((obj) => obj.value === values.yearSem)
            const sectionObj = sectionOptions.filter((obj) => obj.value === values.sectionId)
            const payload = {
                "academicYearId": values.acYearId,
                "academicYear": academicYearObj[0].label,
                "instituteId": values.schoolId,
                "institute": schoolObj[0].label,
                "courseId": selectedCourseObj[0].program_id,
                "course": selectedCourseObj[0].program_short_name,
                "branchId": selectedCourseObj[0].program_specialization_id,
                "branch": selectedCourseObj[0].program_specialization_short_name,
                "year": Math.ceil(yearSemObj[0].value / 2),
                "sem": yearSemObj[0].value,
                "sectionId": sectionObj[0].value,
                "section": sectionObj[0].label,
                "subjectId": values.subjectId
            }

            axios.post("/api/feedback/getStudentHaveLessAttendence", payload)
                .then(res => {
                    setData(res.data.data.map(obj => {
                        return {...obj, isChecked: false}
                    }))
                    setLoading(false)
                })
                .catch(err => {
                    setLoading(false);
                    console.log(err);
                    setAlertMessage({
                        severity: "error",
                        message: "Failed to create, Please try after sometime",
                    });
                    setAlertOpen(true);
                })
        }
    }

    const getSectionData = async () => {
        await axios
            .get(`/api/academic/Section`)
            .then((res) => {
                setSectionOptions(
                    res.data.data.filter(obj => obj.school_id === values.schoolId)
                        .map((obj) => ({
                            value: obj.section_id,
                            label: obj.section_name,
                        }))
                )
            })
            .catch((err) => console.error(err));
    };

    const handleCheckbox = (e) => {
        const { name, checked } = e.target;
    
        
    };

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

        <Grid item xs={12}>
            <TableContainer component={Paper}>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <StyledTableCell
                                sx={{ color: "white", textAlign: "center" }}
                            >
                                <Checkbox
                                    sx={{ "& .MuiSvgIcon-root": { fontSize: 12 } }}
                                    style={{ color: "white" }}
                                    name="selectAll"
                                    checked={
                                        !data.some(
                                            (user) => user?.isChecked !== true
                                        )
                                    }
                                    onChange={handleCheckbox}
                                />
                                Select All
                            </StyledTableCell>
                            <StyledTableCell>AUID</StyledTableCell>
                            <StyledTableCell>Student Name</StyledTableCell>
                            <StyledTableCell>Percentage</StyledTableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {data.map((val, i) => {
                            return (
                                <StyledTableRow key={i}>
                                    <StyledTableCell sx={{ textAlign: "center" }}>
                                        <Checkbox
                                            sx={{
                                                "& .MuiSvgIcon-root": { fontSize: 12 },
                                            }}
                                            name={val.studentAttendenceId}
                                            value={val.studentAttendenceId}
                                            onChange={handleCheckbox}
                                            checked={val?.isChecked || false}
                                        />
                                    </StyledTableCell>
                                    <TableCell>{val.auid}</TableCell>
                                    <TableCell>{val.studentName}</TableCell>
                                    <TableCell>{val.percentage}</TableCell>
                                </StyledTableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>

            {data.length <= 0 && <h2 style={{textAlign: "center", padding: "20px 0px"}}>No data found!!</h2>}
        </Grid>
    </>)
}

export default AllowStudentFeedback