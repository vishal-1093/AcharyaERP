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
import { useNavigate } from "react-router-dom"

const initValues = {
    acYearId: null,
    schoolId: null,
    programSpeId: [],
    fromDate: null,
    toDate: null,
};

const requiredFields = ["schoolId", "programSpeId", "fromDate", "toDate"];

const StudentFedbackWindow = () => {
    const setCrumbs = useBreadcrumbs();
    const [loading, setLoading] = useState(false);
    const [values, setValues] = useState(initValues);
    const [SchoolNameOptions, setSchoolNameOptions] = useState([]);
    const [academicYearOptions, setAcademicYearOptions] = useState([]);
    const [programSpeOptions, setProgramSpeOptions] = useState([]);
    const [yearSemOptions, setYearSemOptions] = useState([]);

    const { setAlertMessage, setAlertOpen } = useAlert();
    const navigate = useNavigate();

    const checks = {
        acYearId: [values.acYearId !== ""],
        programSpeId: [values.schoolId !== ""],
        fromDate: [values.fromDate !== ""],
        toDate: [values.toDate !== ""]
    };

    const errorMessages = {
        acYearId: ["This field required"],
        programSpeId: ["This field is required"],
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
            { name: "Create" },
        ])
        getSchoolNameOptions()
        getAcademicYearData()
    }, [])

    useEffect(() => {
        getProgramSpeData()
    }, [values.schoolId])

    const getProgramSpeData = async () => {
        if (values.schoolId !== null || values.schoolId !== "") {
            const getAllSchoolsProgramspec = async (schoolIds) => {
                let allData = []
                // for (const schoolId of schoolIds) {
                    const res = await fetchAllProgramsWithSpecialization(values.schoolId)
                    // allData = [...allData, ...res]
                // }

                return res.map((obj) => ({
                    value: obj.program_specialization_id,
                    label: obj.specialization_with_program,
                }))
            }
            setProgramSpeOptions([...(await getAllSchoolsProgramspec(values.schoolId))])
        }
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
                        // if (val.program_specialization_id === newValue) {
                        //     yearsem.push(val);
                        // }
                        if (newValue?.includes(val.program_specialization_id)) {
                            yearsem.push(val);
                        }
                    });
                    const newyearsem = [];
                    // yearsem.forEach((obj) => {
                    //     for (let i = 1; i <= obj.number_of_semester; i++) {
                    //         newyearsem.push({ label: `Sem-${i}`, value: i });
                    //     }
                    // });
                   const maxYearSem = yearsem?.sort((a,b)=> b?.number_of_semester - a?.number_of_semester)[0]
                        for (let i = 1; i <= maxYearSem?.number_of_semester; i++) {
                            newyearsem.push({ label: `Sem-${i}`, value: i });
                        }
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
            console.log(name, newValue);           
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

    const handleCreate = () => {
        if (!requiredFieldsValid()) {
            setAlertMessage({
                severity: "error",
                message: "please fill all fields",
            });
            setAlertOpen(true);
        } else {
            setLoading(true);
            // const selectedCourseObj = programSpeOptions.filter((obj) => obj.value === values.programSpeId)
            // const selectedCourseObj = programSpeOptions?.filter((obj) => values?.programSpeId?.includes(obj?.value))
            // const selectedCourselabel = selectedCourseObj?.length > 0 && selectedCourseObj?.map((course)=> course.label)
            const payload = {
                "academicYear": values?.acYearId,
                // "instituteIds": values.schoolId,
                // "courseAndBranch": selectedCourseObj[0].label,
                "instituteId": values?.schoolId,
                // "courseAndBranch": selectedCourselabel || [],
                "semester": values?.yearsemId,
                "fromDate": moment(values?.fromDate).format("YYYY-MM-DD"),
                "toDate": moment(values?.toDate).format("YYYY-MM-DD"),
                "program_specialization_id": values?.programSpeId
            }

            axios.post("/api/feedback/createFeedbackWindow", payload)
            .then(res => {
                if (res.status === 200 || res.status === 201) {
                    setAlertMessage({
                      severity: "success",
                      message: "Feedback Window has been created successfully",
                    });
                    setAlertOpen(true);
                }
               else if (res.data.message !== "SUCCESS") {
                    setLoading(false)
                    setAlertMessage({
                        severity: "error",
                        message: res.data.message,
                    });
                    setAlertOpen(true);
                    return
                }
                navigate("/StudentFeedbackMaster/feedbackwindow")
            })
            .catch(err => {
                setLoading(false);
                setAlertMessage({
                    severity: "error",
                    message: err?.response?.data ?  err?.response?.data?.message : "Failed to create, Please try after sometime",
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
                    />
                </Grid>

                <Grid item xs={12} md={6}>
                    <CustomAutocomplete
                        name="schoolId"
                        label="School"
                        options={SchoolNameOptions}
                        value={values.schoolId}
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
                <Grid item xs={12} md={6}>
                    <CheckboxAutocomplete
                        name="programSpeId"
                        label="Program Major"
                        value={values.programSpeId}
                        options={programSpeOptions}
                        handleChangeAdvance={handleChangeAdvance}
                        handleSelectAll={handleSelectAll}
                        handleSelectNone={handleSelectNone}
                        checks={checks.programSpeId}
                        errors={errorMessages.programSpeId}
                        required
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
                        onClick={handleCreate}
                    >
                        {loading ? (
                            <CircularProgress
                                size={25}
                                color="blue"
                                style={{ margin: "2px 13px" }}
                            />
                        ) : (
                            <strong>Create</strong>
                        )}
                    </Button>
                </Grid>
            </Grid>
        </FormWrapper>
    </Box>)
}

export default StudentFedbackWindow