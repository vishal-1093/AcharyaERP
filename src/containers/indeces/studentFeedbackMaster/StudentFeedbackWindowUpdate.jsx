import React, { useEffect, useState } from "react"
import axios from "../../../services/Api"
import { Box, Button, CircularProgress, Grid } from "@mui/material"
import FormWrapper from "../../../components/FormWrapper"
import CheckboxAutocomplete from "../../../components/Inputs/CheckboxAutocomplete"
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete"
import useBreadcrumbs from "../../../hooks/useBreadcrumbs"
import CustomDatePicker from "../../../components/Inputs/CustomDatePicker"
import useAlert from "../../../hooks/useAlert"
import moment from "moment"
import { useNavigate, useParams } from "react-router-dom"

const initValues = {
    acYearId: null,
    schoolId: [],
    fromDate: null,
    toDate: null,
    feedbackWindowId: null
};

const requiredFields = ["schoolId", "programSpeId", "fromDate", "toDate"];

const StudentFeedbackWindowUpdate = () => {
    const setCrumbs = useBreadcrumbs();
    const [loading, setLoading] = useState(false);
    const [values, setValues] = useState(initValues);
    const [SchoolNameOptions, setSchoolNameOptions] = useState([]);
    const [academicYearOptions, setAcademicYearOptions] = useState([]);
    const [programSpeOptions, setProgramSpeOptions] = useState([]);
    const [yearSemOptions, setYearSemOptions] = useState([]);

    const { setAlertMessage, setAlertOpen } = useAlert();
    const navigate = useNavigate();
    const params = useParams()

    const checks = {
        acYearId: [values.acYearId !== ""],
        schoolId: [values.schoolId.length > 0],
        fromDate: [values.fromDate !== ""],
        toDate: [values.toDate !== ""]
    };

    const errorMessages = {
        acYearId: ["This field required"],
        schoolId: ["This field is required"],
        fromDate: ["This field required"],
        toDate: ["This field is required"],
    };

    useEffect(() => {
        setCrumbs([
            {
                name: "StudentFeedback Master",
                link: "/StudentFeedbackMaster/feedbackwindow",
            },
            { name: "Feedback" },
            { name: "Update" },
        ])
        getSchoolNameOptions()
        getAcademicYearData()
    }, [])

    useEffect(() => {
        if(academicYearOptions.length > 0 && SchoolNameOptions.length > 0){
            getSelectedFeedbackDetails()
        }
    }, [academicYearOptions, SchoolNameOptions])

    const getSelectedFeedbackDetails = () => {
        axios
        .get(`/api/feedback/feedbackWindowById?feedbackWindowId=${params.id}`)
        .then(async (res) => {
            const resObj = res.data.data
            const acYearObj = academicYearOptions.filter(obj => obj.value == resObj.academicYear)
            const schoolObj = SchoolNameOptions.filter(obj => obj.value === resObj.instituteId)
            const programSpeOptions_ = await getProgramSpeData([parseInt(schoolObj[0].value)])
            // const pgmSpecObj = programSpeOptions_.filter(obj => obj.value === resObj.instituteId)
            const pgmSpecObj = programSpeOptions_.filter(obj => obj.label === resObj.courseAndBranch)
            const yearSemOptions_ = await getSemesterList(parseInt(pgmSpecObj[0].value), parseInt(schoolObj[0].value))
            const semObj = yearSemOptions_.filter(obj => obj.value === parseInt(resObj.semester))
            setValues((prev) => ({
                ...prev,
                "acYearId": acYearObj.length > 0 ? parseInt(acYearObj[0].value) : "",
                "schoolId": schoolObj.length > 0 ? [parseInt(schoolObj[0].value)] : "",
                "programSpeId": pgmSpecObj.length > 0 ? parseInt(pgmSpecObj[0].value) : "",
                "yearsemId": semObj.length > 0 ? parseInt(semObj[0].value) : "",
                "fromDate": new Date(resObj.fromDate),
                "toDate": new Date(resObj.toDate),
                "feedbackWindowId": resObj.feedbackWindowId
            }));
        })
        .catch((err) => {
            console.error(err)
            setAlertMessage({
                severity: "error",
                message: "Failed to Get details, Please try after sometime",
            });
            setAlertOpen(true);
        });
    }

    // const getProgramSpeData = async (selectedSchoolIds) => {
    //     return new Promise(async resolve => {
    //         const getAllSchoolsProgramspec = async (schoolIds) => {
    //             let allData = []
    //             for (const schoolId of schoolIds) {
    //                 const res = await fetchAllProgramsWithSpecialization(schoolId)
    //                 allData = [...allData, ...res]
    //             }

    //             return allData.map((obj) => ({
    //                 value: obj.program_specialization_id,
    //                 label: obj.specialization_with_program,
    //             }))
    //         }
    //         const data = await getAllSchoolsProgramspec(selectedSchoolIds)
    //         setProgramSpeOptions([...data])
    //         resolve(data)
    //     })
    // }

    const getProgramSpeData = async (selectedSchoolId) => {
        return new Promise(async resolve => {
            const getAllSchoolsProgramspec = async (schoolId) => {
                const res = await fetchAllProgramsWithSpecialization(schoolId)
                return res.map((obj) => ({
                    value: obj.program_specialization_id,
                    label: obj.specialization_with_program,
                }))
            }
            const data = await getAllSchoolsProgramspec(selectedSchoolId)
            setProgramSpeOptions([...data])
            resolve(data)
        })
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

    const getSemesterList = async (selectedProgram, schoolId) => {
        return new Promise(resolve => {
            axios
            .get(`/api/academic/fetchAllProgramsWithSpecialization/${schoolId}`)
            .then((res) => {
                const yearsem = [];
                res.data.data.filter((val) => {
                    if (val.program_specialization_id === selectedProgram) {
                        yearsem.push(val);
                    }
                });
                const newyearsem = [];
                yearsem.forEach((obj) => {
                    for (let i = 1; i <= obj.number_of_semester; i++) {
                        newyearsem.push({ label: `Sem-${i}`, value: i });
                    }
                });
    
                setYearSemOptions(newyearsem.map((obj) => ({
                    value: obj.value,
                    label: obj.label,
                })));
                resolve(newyearsem)
            })
            .catch((err) => console.error(err));
        })
    }

    const handleChangeAdvance = (name, newValue) => {
        if (name === "programSpeId") {
            getSemesterList(newValue, values.schoolId)
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

    const handleSelectAll = (name, options) => {
        setValues((prev) => ({
            ...prev,
            [name]: options.map((obj) => obj.value),
        }));
    };

    const handleSelectNone = (name) => {
        setValues((prev) => ({ ...prev, [name]: [] }));
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

    const handleUpdate = () => {
        if (!requiredFieldsValid()) {
            setAlertMessage({
                severity: "error",
                message: "please fill all fields",
            });
            setAlertOpen(true);
        } else {
            setLoading(true);

            const selectedCourseObj = programSpeOptions.filter((obj) => obj.value === values.programSpeId)
            const payload = {
                "feedbackWindowId": values.feedbackWindowId,
                "academicYear": values.acYearId,
                "instituteIds": values.schoolId,
                "courseAndBranch": selectedCourseObj[0].label,
                "semester": values.yearsemId,
                "fromDate": moment(values.fromDate).format("YYYY-MM-DD"),
                "toDate": moment(values.toDate).format("YYYY-MM-DD")
            }

            axios.post("/api/feedback/updateFeedbackWindow", payload)
            .then(res => {
                navigate("/StudentFeedbackMaster/feedbackwindow")
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
                        name="acYearId"
                        label="Academic Year"
                        value={values.acYearId}
                        options={academicYearOptions}
                        handleChangeAdvance={handleChangeAdvance}
                        checks={checks.acYearId}
                        errors={errorMessages.acYearId}
                        required
                        disabled
                    />
                </Grid>

                <Grid item xs={12} md={6}>
                    <CheckboxAutocomplete
                        name="schoolId"
                        label="School"
                        options={SchoolNameOptions}
                        value={values.schoolId}
                        handleChangeAdvance={handleChangeAdvance}
                        handleSelectAll={handleSelectAll}
                        handleSelectNone={handleSelectNone}
                        checks={checks.schoolId}
                        errors={errorMessages.schoolId}
                        required
                        disabled
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
                <Grid item xs={12} md={6}>
                    <CustomAutocomplete
                        name="programSpeId"
                        label="Program Major"
                        value={values.programSpeId}
                        options={programSpeOptions}
                        handleChangeAdvance={handleChangeAdvance}
                        required
                        disabled
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <CustomAutocomplete
                        name="yearsemId"
                        label="Year/Sem"
                        value={values.yearsemId}
                        options={yearSemOptions}
                        handleChangeAdvance={handleChangeAdvance}
                        required
                        disabled
                    />
                </Grid>
            </Grid>
            <Grid
                container
                alignItems="center"
                rowSpacing={4}
                columnSpacing={{ xs: 2, md: 4 }}
                sx={{ marginBottom: "20px" }}>
                <Grid item xs={12} md={6}>
                    <CustomDatePicker
                        name="fromDate"
                        label="From Date"
                        value={values.fromDate}
                        handleChangeAdvance={handleChangeAdvance}
                        checks={checks.fromDate}
                        errors={errorMessages.fromDate}
                        minDate={new Date(new Date().setDate(new Date().getDate()))}
                        required
                        disablePast
                        helperText=""
                        disabled
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <CustomDatePicker
                        name="toDate"
                        label="To Date"
                        value={values.toDate}
                        handleChangeAdvance={handleChangeAdvance}
                        checks={checks.toDate}
                        errors={errorMessages.toDate}
                        required
                        minDate={values.fromDate}
                        disablePast
                        helperText=""
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
                        onClick={handleUpdate}
                    >
                        {loading ? (
                            <CircularProgress
                                size={25}
                                color="blue"
                                style={{ margin: "2px 13px" }}
                            />
                        ) : (
                            <strong>Update</strong>
                        )}
                    </Button>
                </Grid>
            </Grid>
        </FormWrapper>
    </Box>)
}

export default StudentFeedbackWindowUpdate