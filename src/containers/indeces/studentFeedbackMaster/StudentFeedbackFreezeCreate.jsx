import React, { useEffect, useState } from "react"
import axios from "../../../services/Api"
import { Box, Button, CircularProgress, Grid } from "@mui/material"
import FormWrapper from "../../../components/FormWrapper"
import CheckboxAutocomplete from "../../../components/Inputs/CheckboxAutocomplete"
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete"
import useBreadcrumbs from "../../../hooks/useBreadcrumbs"
import useAlert from "../../../hooks/useAlert"
import CustomTextField from "../../../components/Inputs/CustomTextField"
import { useNavigate } from "react-router-dom";

const initValues = {
    acYearId: null,
    schoolId: [],
    percentage: ""
};

const requiredFields = ["acYearId", "schoolId", "percentage"];

const StudentFeedbackFreezeCreate = () => {
    const setCrumbs = useBreadcrumbs();
    const [loading, setLoading] = useState(false);
    const [values, setValues] = useState(initValues);
    const [SchoolNameOptions, setSchoolNameOptions] = useState([]);
    const [academicYearOptions, setAcademicYearOptions] = useState([]);

    const { setAlertMessage, setAlertOpen } = useAlert();
    const navigate = useNavigate();

    const checks = {
        acYearId: [values.acYearId !== ""],
        schoolId: [values.schoolId.length > 0],
        percentage: [values.percentage !== "", !isNaN(values.percentage), parseInt(values.percentage) > 0 && parseInt(values.percentage) < 100]
    };

    const errorMessages = {
        acYearId: ["This field required"],
        schoolId: ["This field is required"],
        percentage: ["Must be 1 to 99"]
    };

    useEffect(() => {
        setCrumbs([
            {
                name: "StudentFeedback Master",
                link: "/StudentFeedbackMaster/freezepercentage",
            },
            { name: "Freeze Percentage" },
            { name: "Create" },
        ])
        getSchoolNameOptions()
        getAcademicYearData()
    }, [])

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
        setValues((prev) => ({
            ...prev,
            [name]: newValue,
        }));
    };

    const handleChange = (e) => {
        setValues((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
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

            const selectedYearObj = academicYearOptions.filter((obj) => obj.value === values.acYearId)
            const payload = {
                "academicYear": selectedYearObj[0].label,
                "instituteIds": values.schoolId,
                "percentage": parseInt(values.percentage)
            }

            axios.post("/api/feedback/freezeStudentAttendence", payload)
                .then(res => {
                    if (res.status === 200 || res.status === 201) {
                        setAlertMessage({
                          severity: "success",
                          message: "Institute freeze percentage has been added successfully",
                        });
                        setAlertOpen(true);
                    }
                    if (res.data.message !== "SUCCESS") {
                        setLoading(false)
                        setAlertMessage({
                            severity: "error",
                            message: res.data.message,
                        });
                        setAlertOpen(true);
                        return
                    }
                    navigate("/StudentFeedbackMaster/freezepercentage")
                })
                .catch(err => {
                    console.log(err);
                    setLoading(false)
                    // setAlertMessage({
                    //     severity: "error",
                    //     message: "Failed to create, Please try after sometime",
                    // });
                    setAlertMessage({
                        severity: "error",
                        message: err.response ? err.response.data.message : "Failed to create, Please try after sometime",
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
                    <CustomTextField
                        name="percentage"
                        label="Percentage"
                        value={values.percentage}
                        handleChange={handleChange}
                        checks={checks.percentage}
                        errors={errorMessages.percentage}
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

export default StudentFeedbackFreezeCreate