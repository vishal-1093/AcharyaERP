import { useState, useEffect } from "react";
import { Box, Button, Grid, Typography } from "@mui/material";
import GridIndex from "../../../components/GridIndex";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "../../../services/Api";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";

const initialValues = {
    schoolId: "",
    programId: "",
    acYearId: "",
};

function StudentDueReportDetail() {
    const [rows, setRows] = useState([]);
    const [values, setValues] = useState();
    const [schoolOptions, setSchoolOptions] = useState([]);
    const [programOptions, setProgramOptions] = useState([]);
    const [acYearOptions, setAcYearOptions] = useState([]);
    const [loading, setLoading] = useState(false)
    const [columnVisibilityModel, setColumnVisibilityModel] = useState({
        usn: false,
        collageWaiver: false,
        hostelWaiver: false,
    })
    const navigate = useNavigate();
    const location = useLocation()
    const setCrumbs = useBreadcrumbs();
    const roleShortName = JSON.parse(
        sessionStorage.getItem("AcharyaErpUser")
    )?.roleShortName;

    const columns = [
        { field: "course", headerName: "Programme", flex: 1, headerClassName: "header-bg" },
        { field: "student_count", headerName: "Std Count", flex: 1, headerClassName: "header-bg", align: 'center', headerAlign: 'center' },
        { field: "total_fixed", headerName: "Fixed", flex: 1, headerClassName: "header-bg", align: 'right', headerAlign: 'center', },
        { field: "paid", headerName: "Paid", flex: 1, headerClassName: "header-bg", align: 'right', headerAlign: 'center', },
        { field: "scholarship", headerName: "Scholarship", flex: 1, headerClassName: "header-bg", align: 'right', headerAlign: 'center', },
        { field: "collageWaiver", headerName: "C-Waiver", flex: 1, headerClassName: "header-bg", align: 'right', headerAlign: 'center', },
        { field: "due", headerName: "Due", flex: 1, headerClassName: "header-bg", align: 'right', headerAlign: 'center', },
        { field: "add_on", headerName: "Add On Due", flex: 1, headerClassName: "header-bg", align: 'right', headerAlign: 'center', },
        { field: "hostelWaiver", headerName: "H-Waiver", flex: 1, headerClassName: "header-bg", align: 'right', headerAlign: 'center', },
        { field: "hostel_due", headerName: "Hostel Due", flex: 1, headerClassName: "header-bg", align: 'right', headerAlign: 'center', },
        {
            field: "totalDue", headerName: "Total Due", flex: 1, headerClassName: "header-bg", align: 'right', headerAlign: 'center',
            renderCell: (params) => {
                const total = Number(params?.row?.totalDue) || 0;
                return (
                    <Box display="flex" alignItems="center" height="100%" width="100%" justifyContent="flex-end">
                        <Typography fontWeight="bold">{total}</Typography>
                    </Box>
                );
            }
        },
    ];
    useEffect(() => {
        setCrumbs([
            { name: "Student Due Report" }
        ])
        getSchoolDetails();
        getAcademicYearDetails();
    }, []);

    useEffect(() => {
        // restore filters
        if (location?.state) {
            setValues(location.state);
            handleFilter(location.state)
            navigate(location.pathname, { replace: true, state: null });
        } else {
            setValues(initialValues)
        }
    }, []);


    useEffect(() => {
        if (values?.schoolId && values?.acYearId)
            getAllPrograms();
    }, [values?.schoolId, values?.acYearId]);

    const getData = async (filterValues) => {
        const { schoolId, programId, acYearId } = filterValues
        const baseUrl = "/api/student/acYearWiseDueSummary"
        const params = {
            ...(schoolId && { schoolId }),
            ...(programId && { programId }),
            ...(acYearId && { acYearId }),
        }
        setLoading(true)
        await axios
            .get(baseUrl, { params })
            .then((res) => {
                const { data } = res?.data
                const rowData = []
                data?.studentDetails?.length > 0 && data?.studentDetails?.map((obj) => {
                    const dueTotal = (obj?.due + obj?.add_on + obj?.hostel_due) || 0
                    rowData.push({
                        student_count: obj?.student_count,
                        course: obj?.course,
                        total_fixed: obj?.total_fixed,
                        paid: obj?.paid,
                        scholarship: obj?.scholarship,
                        add_on: obj?.add_on,
                        hostel_due: obj?.hostel_due,
                        due: obj?.due,
                        program_specialization_id: obj?.program_specialization_id,
                        totalDue: dueTotal,
                        hostelWaiver: obj?.hostel_waiver,
                        collageWaiver: obj?.waiver,
                        isLastRow: false
                    })
                })
                if (data?.studentDetails?.length > 0) {
                    rowData.push({
                        student_count: data?.totalStudent,
                        course: "",
                        total_fixed: data?.totalFixed,
                        paid: data?.totalPaid,
                        scholarship: data?.totalScholarShip,
                        add_on: data?.totalAddOn,
                        hostel_due: data?.totalHostelDue,
                        due: data?.totalDue,
                        totalDue: (data?.totalDue + data?.totalAddOn + data?.totalHostelDue) || 0,
                        hostelWaiver: data?.totalHostelWaiver,
                        collageWaiver: data?.totalWaiver,
                        student_count: data?.totalStudentCount,
                        isLastRow: true
                    })
                }
                setRows(rowData || []);
                setLoading(false)
            })
            .catch((err) => {
                setLoading(false)
                console.error(err)
            });
    };


    const getSchoolDetails = async () => {
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
            .catch((err) => console.error(err));
    };

    const getAcademicYearDetails = async () => {
        await axios
            .get(`/api/academic/academic_year`)
            .then((res) => {
                const { data } = res?.data
                const optionData = [];
                if (roleShortName === "SAA") {
                    data?.length > 0 && data?.forEach((obj) => {
                        optionData.push({
                            value: obj?.ac_year_id,
                            label: obj?.ac_year,
                            ac_year_code: obj?.ac_year_code,
                        });
                    });
                } else {
                    optionData.push({
                        value: data[0]?.ac_year_id,
                        label: data[0]?.ac_year,
                    })
                }
                setAcYearOptions(optionData);
            })
            .catch((err) => console.error(err));
    };

    const getAllPrograms = (schoolId) => {
        return new Promise(resolve => {
            axios
                .get(
                    `/api/academic/fetchProgram1/${values.acYearId}/${values.schoolId}`
                )
                .then((res) => {
                    const { data } = res?.data
                    const programOption = data?.map((obj) => {
                        return {
                            value: obj?.program_id,
                            label: obj?.program_name
                        }
                    })
                    setProgramOptions(programOption || []);
                })
                .catch((err) => {
                    console.error(err)
                    resolve([])
                });
        })
    }


    const handleChangeAdvance = (name, newValue) => {

        if (name === "schoolId" || name === "acYearId") {
            setValues((prev) => ({
                ...prev,
                [name]: newValue,
                ['programId']: ''
            }));
            setProgramOptions([]);

        } else {
            setValues((prev) => ({
                ...prev,
                [name]: newValue
            }));
        }
    };

    const handleFilter = (filterValues) => {
        getData(filterValues)
    }

    return (
        <Box sx={{ position: "relative", marginTop: 3 }}>
            <Box mb={3} mt={2}>
                <Grid container alignItems="center" gap={3} mt={2} mb={2}>
                    <Grid item xs={12} md={3}>
                        <CustomAutocomplete
                            name="acYearId"
                            label="Academic Year"
                            value={values?.acYearId}
                            options={acYearOptions}
                            handleChangeAdvance={handleChangeAdvance}
                        />
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <CustomAutocomplete
                            name="schoolId"
                            label="School"
                            value={values?.schoolId}
                            options={schoolOptions}
                            handleChangeAdvance={handleChangeAdvance}
                        />
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <CustomAutocomplete
                            name="programId"
                            label="Program"
                            value={values?.programId}
                            options={programOptions}
                            handleChangeAdvance={handleChangeAdvance}
                        />
                    </Grid>
                    <Grid item xs={12} md={1}>
                        <Button
                            style={{ borderRadius: 7 }}
                            variant="contained"
                            color="primary"
                            disabled={!(values?.acYearId && values?.schoolId)}
                            onClick={() => handleFilter(values)}
                        >
                            Submit
                        </Button>
                    </Grid>
                </Grid>
            </Box>
            <Box sx={{ position: "absolute", width: "100%" }}>
                <Grid container justifyContent="space-between" pt={1} rowGap={2} className="main-grid">
                    <Grid item xs={12} md={12} lg={12} sx={{
                        '& .last-row': { fontWeight: 700, backgroundColor: "#376a7d !important", color: "#fff", fontSize: "13px" },
                        '& .last-column': { fontWeight: "bold" },
                        '& .last-row:hover': { fontWeight: 700, backgroundColor: "#376a7d !important", color: "#fff", fontSize: "13px" },
                        '& .header-bg': { fontWeight: "bold", backgroundColor: "#376a7d !important", color: "#fff", fontSize: "15px" },
                        // '& .MuiDataGrid-cell:focus': { outline: 'none' },
                        // '& .MuiDataGrid-cell:focus-within': { outline: 'none' },
                        // '& .MuiDataGrid-row.Mui-selected': {
                        //     backgroundColor: 'inherit !important',
                        // },
                    }}
                        className="children-grid"
                    >

                        <GridIndex
                            rows={rows}
                            columns={columns}
                            getRowId={(row, index) => row?.course}
                            loading={loading}
                            getRowClassName={(params) => {
                                return params.row.isLastRow ? "last-row" : ""
                            }}
                            columnVisibilityModel={columnVisibilityModel}
                            setColumnVisibilityModel={setColumnVisibilityModel}
                            isRowSelectable={(params) => !params.row.isLastRow}
                            onRowClick={(params, index) => {
                                if (params?.row?.isLastRow) return;
                                const queryValues = {
                                    ...values,
                                    programSpecializationId: params?.row?.program_specialization_id,
                                    course: params?.row?.course
                                }
                                navigate('/student-due-report-detail/programme', { state: queryValues })
                            }}
                            sx={{
                                "& .MuiDataGrid-row:hover": {
                                    cursor: 'pointer',
                                    backgroundColor: '#f5f5f5',
                                },
                                '& .MuiDataGrid-cell:focus': { outline: 'none' },
                                '& .MuiDataGrid-cell:focus-within': { outline: 'none' },
                                '& .MuiDataGrid-row.Mui-selected': {
                                    backgroundColor: 'inherit !important',
                                },
                            }}
                        />

                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
}
export default StudentDueReportDetail;
