import React, { useEffect, useState } from "react";
import { Box, Grid, IconButton } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import GridIndex from "../../../components/GridIndex";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "../../../services/Api";
import useAlert from "../../../hooks/useAlert";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import FacultyCourseDetailModal from "../../../components/FacultyCourseDetailModal";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";
import moment from "moment";
const CourseModalContent = {
    title: "Select Course",
    message: ""
}

const initialValues = {
    schoolId: "",
    deptId: "",
    acYearId: "",
};


const FacultyFeedbackIndex = () => {

    const [rows, setRows] = useState([]);
    const { setAlertMessage, setAlertOpen } = useAlert();
    const [loading, setLoading] = useState(true);
    const [showCourseModel, setShowCourseModel] = useState(false)
    const [employeeId, setEmployeeId] = useState(null)
    const [values, setValues] = useState(initialValues);
    const [schoolOptions, setSchoolOptions] = useState([]);
    const [departmentOptions, setDepartmentOptions] = useState([]);
    const [acYearOptions, setAcYearOptions] = useState([]);
    const setCrumbs = useBreadcrumbs();
    const navigate = useNavigate();
    const { pathname } = useLocation();
      const userDetails = JSON.parse(sessionStorage.getItem("userData"))
      const userID = JSON.parse(sessionStorage.getItem("AcharyaErpUser"))?.userId;
      const schoolID = JSON.parse(sessionStorage.getItem("userData"))?.school_id;
      const deptID = JSON.parse(sessionStorage.getItem("userData"))?.dept_id;
      const roleShortName = JSON.parse(
        sessionStorage.getItem("AcharyaErpUser")
      )?.roleShortName;

    useEffect(() => {
        setCrumbs([
            { name: "Faculty Feedback" }
        ])
        getSchoolDetails();
        getAcademicYearDetails();
        getData();
    }, []);

    useEffect(() => {
        getData();
      }, [values?.schoolId, values?.deptId, values?.acYearId]);
    
      useEffect(() => {
            getDepartmentOptions();
      }, [schoolID, values?.schoolId]);

    const getData = async () => {
        setLoading(true);
        const { schoolId, deptId, acYearId } = values;
        let  baseURL = `/api/student/classFeedbackAnswersEmployeeDetails`;
        let params ={
            sort: "created_date",
            page: 0,
            page_size: 100000,
            ...(roleShortName !== "SAA" && { emp_id : userID}),
            ...(schoolId && { school_id: schoolId }),
            ...(deptId && { dept_id: deptId }),
            ...(acYearId && { ac_year_id: acYearId }),
        }
        switch (pathname) {
            case "/FacultyFeedbackMaster-inst":
              params = {
                ...params,
                ...(schoolID && { school_id: schoolID }),
              };
              break;
    
            case "/FacultyFeedbackMaster-dept":
              params = {
                ...params,
                ...(schoolID && { school_id: schoolId ? schoolId : schoolID }),
                ...(deptID && { dept_id: deptID })
              };
              break;
    
            default:
                baseURL = `/api/student/classFeedbackAnswersEmployeeDetails`;
          }
    
        await axios.get(baseURL, { params })
            .then((res) => {
                const { content } = res?.data?.data?.Paginated_data
                 setRows([...content] || []);
                 setLoading(false);
            })
            .catch((err) => {
                setLoading(false);
                setAlertMessage({
                    severity: "error",
                    message: err?.response?.data?.message,
                });
            });
    };

    const handleFeedbackReportClick = (empId) => {
        setShowCourseModel(true)
        setEmployeeId(empId)
    }

    const handleCourseSubmit = (value) => {
        navigate(`${pathname}/FacultyFeedbackReportBySection/${employeeId}?courseId=${value}`)
    }

    const handleCancel = () => {
        setShowCourseModel(false)
        setEmployeeId('')
    }

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

    const getDepartmentOptions = async () => {
        if (values.schoolId || schoolID) {
            const id = values.schoolId ? values.schoolId : schoolID;
            await axios
                .get(`/api/fetchdept1/${id}`)
                .then((res) => {
                    const data = [];
                    res.data.data.forEach((obj) => {
                        data.push({
                            value: obj.dept_id,
                            label: obj.dept_name,
                            dept_name_short: obj?.dept_name_short,
                        });
                    });
                    setDepartmentOptions(data);
                })
                .catch((err) => console.error(err));
        }
    };

    const getAcademicYearDetails = async () => {
        await axios
            .get(`/api/academic/academic_year`)
            .then((res) => {
                const optionData = [];
                res.data.data.forEach((obj) => {
                    optionData.push({
                        value: obj?.ac_year_id,
                        label: obj?.ac_year,
                        ac_year_code: obj?.ac_year_code,
                    });
                });
                setAcYearOptions(optionData);
            })
            .catch((err) => console.error(err));
    };

    const handleChangeAdvance = (name, newValue) => {

        if (name === "schoolId") {
            setValues((prev) => ({
                ...prev,
                schoolId: newValue,
                deptId: "",
                schoolShortName: schoolOptions?.find((el) => el?.value == newValue)
                    ?.school_name_short,
            }));
            setDepartmentOptions([]);
        } else {
            setValues((prev) => ({
                ...prev,
                [name]: newValue,
                deptShortName: departmentOptions?.find((el) => el?.value == newValue)
                    ?.dept_name_short,
            }));
        }
    };

    const columns = [
        { field: "empcode", headerName: "Employee Code", flex: 1 },
        { field: "employee_name", headerName: "Name", flex: 1 },
        { field: "date_of_joining", headerName: "Date of Joining", flex: 1 },
        { field: "ac_year", headerName: "Ac Year", flex: 1 },
        { field: "school_name_short", headerName: "Institute", flex: 1, hide: true },
        { field: "designation_name", headerName: "Designation", flex: 1 },
        { field: "dept_name_short", headerName: "Department", flex: 1, hide: true },
        {
              field: "feedback_window",
              headerName: "Window",
              flex: 1,
              renderCell: (params) =>{
               return `${moment(params.row.fromDate).format("DD-MM-YYYY")} - ${moment(params.row.toDate).format("DD-MM-YYYY")}`
              }
            },
        {
            field: "report1",
            headerName: "Report1",
            flex: 1,
            renderCell: (params) => (
                <IconButton onClick={() => handleFeedbackReportClick(params.row.emp_id)}>
                    <VisibilityIcon color="primary" />
                </IconButton>
            ),
        },
        {
            field: "report2",
            headerName: "Report2",
            flex: 1,
            renderCell: (params) => (
                <Link to={`${pathname}/FacultyFeedbackReport/${params.row.emp_id}`}>
                    <IconButton>
                        <VisibilityIcon color="primary" />
                    </IconButton>
                </Link>
            ),
        },
    ];

    return (
        <Box sx={{ width: "100%" }}>
            {roleShortName !== "SAA" ? (
             <></>
            ):(
                <Box>
                <Grid container alignItems="center" gap={3} mt={2} mb={2}>
                   {(pathname !== "/FacultyFeedbackMaster-inst") && (
                    <Grid item xs={12} md={3}>
                        <CustomAutocomplete
                            name="schoolId"
                            label="School"
                            value={values.schoolId}
                            options={schoolOptions}
                            handleChangeAdvance={handleChangeAdvance}
                        />
                    </Grid>
                   )}
                   {(pathname !== "/FacultyFeedbackMaster-dept") && (
                    <Grid item xs={12} md={3}>
                        <CustomAutocomplete
                            name="deptId"
                            label="Department"
                            value={values.deptId}
                            options={departmentOptions}
                            handleChangeAdvance={handleChangeAdvance}
                        />
                    </Grid>
                     )}
                    <Grid item xs={6} md={3}>
                        <CustomAutocomplete
                            name="acYearId"
                            label="Academic Year"
                            value={values.acYearId}
                            options={acYearOptions}
                            handleChangeAdvance={handleChangeAdvance}
                        />
                    </Grid>
                </Grid>
            </Box>
            )}
            <GridIndex rows={rows} columns={columns} getRowId={row => row.class_feedback_answers_id} />
            <FacultyCourseDetailModal
                open={showCourseModel}
                setOpen={setShowCourseModel}
                title={CourseModalContent.title}
                message={CourseModalContent.message}
                handleSubmit={handleCourseSubmit}
                handleCancel={handleCancel}
                employeeId={employeeId}
            />
        </Box>
    );
};

export default FacultyFeedbackIndex;
