import React, { useEffect, useState } from "react";
import { IconButton } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import GridIndex from "../../../components/GridIndex";
import { Link, useNavigate } from "react-router-dom";
import axios from "../../../services/Api";
import useAlert from "../../../hooks/useAlert";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import FacultyCourseDetailModal from "../../../components/FacultyCourseDetailModal";
const CourseModalContent = {
    title: "Select Course",
    message: ""
  }

const FacultyFeedbackIndex = () => {

    const [rows, setRows] = useState([]);
    const { setAlertMessage, setAlertOpen } = useAlert();
    const [loading, setLoading] = useState(true);
    const [showCourseModel, setShowCourseModel] = useState(false)
    const [employeeId, setEmployeeId] = useState(null)
    const setCrumbs = useBreadcrumbs();
    const navigate = useNavigate();

    useEffect(() => {
        setCrumbs([
            { name: "Faculty Feedback" }
        ])
        getData();
    }, []);


    const getData = async () => {
        await axios
            .get(
                `/api/student/classFeedbackAnswersEmployeeDetails?page=${0}&page_size=${100000}&sort=created_date`
            )
            .then((res) => {
                const { content } = res?.data?.data?.Paginated_data
                if (content?.length > 0) setRows([...content]);
            })
            .catch((err) => {
                setLoading(false);
                setAlertMessage({
                    severity: "error",
                    message: err.response.data.message,
                });
            });
    };

    const handleFeedbackReportClick = (empId) =>{
        setShowCourseModel(true)
        setEmployeeId(empId)
    }

   const handleCourseSubmit = (value) =>{
     navigate(`FacultyFeedbackReportBySection/${employeeId}?courseId=${value}`)
   } 

   const handleCancel = () =>{
    setShowCourseModel(false)
    setEmployeeId('')
   }

    const columns = [
        { field: "empcode", headerName: "Employee Code", flex: 1 },
        { field: "employee_name", headerName: "Name", flex: 1 },
        { field: "date_of_joining", headerName: "Date of Joining", flex: 1 },
        { field: "ac_year", headerName: "Ac Year", flex: 1 },
        { field: "school_name_short", headerName: "Institute", flex: 1 },
        { field: "designation_name", headerName: "Designation", flex: 1 },
        { field: "dept_name_short", headerName: "Department", flex: 1 },
        {
            field: "report1",
            headerName: "Report1",
            flex: 1,
            renderCell: (params) => (
                 <IconButton onClick={()=>handleFeedbackReportClick(params.row.emp_id)}>
                    <VisibilityIcon color="primary" />
                </IconButton>
            ),
        },
        {
            field: "report2",
            headerName: "Report2",
            flex: 1,
            renderCell: (params) => (
                <Link to={`FacultyFeedbackReport/${params.row.emp_id}`}> {/* Replace with your desired route */}
                <IconButton>
                  <VisibilityIcon color="primary" />
                </IconButton>
              </Link>
            ),
        },
    ];

    return (
        <div style={{ height: 400, width: "100%" }}>
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
        </div>
    );
};

export default FacultyFeedbackIndex;
