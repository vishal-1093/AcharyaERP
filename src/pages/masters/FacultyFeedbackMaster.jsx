import React from "react";
import { IconButton } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import FacultyFeedbackIndex from "../../containers/indeces/facultyFeedbackMaster/FacultyFeedbackIndex";

const columns = [
    { field: "id", headerName: "#", width: 50 },
    { field: "empCode", headerName: "EmpCode", width: 120 },
    { field: "empName", headerName: "Emp Name", width: 180 },
    { field: "joiningDate", headerName: "Date of Joining", width: 150 },
    { field: "academicYear", headerName: "Ac Year", width: 120 },
    { field: "institute", headerName: "Institute", width: 150 },
    { field: "designation", headerName: "Designation", width: 200 },
    { field: "department", headerName: "Department", width: 250 },
    {
        field: "report",
        headerName: "Report",
        width: 120,
        renderCell: (params) => (
            <IconButton>
                <VisibilityIcon color="primary" />
            </IconButton>
        ),
    },
    {
        field: "consoReport1",
        headerName: "Conso Report1",
        width: 150,
        renderCell: (params) => (
            <IconButton>
                <VisibilityIcon color="primary" />
            </IconButton>
        ),
    },
    {
        field: "consoReport2",
        headerName: "Conso Report2",
        width: 150,
        renderCell: (params) => (
            <IconButton>
                <VisibilityIcon color="primary" />
            </IconButton>
        ),
    },
];

const rows = [
    {
        id: 1,
        empCode: "AI003089",
        empName: "KH JINNATUL ISLAM",
        joiningDate: "12-05-2024",
        academicYear: "2024-2025",
        institute: "AIT",
        designation: "ASSISTANT PROFESSOR - GRADE II",
        department: "INFORMATION SCIENCE & ENGINEERING",
    },
    {
        id: 2,
        empCode: "AI003070",
        empName: "Sudharman R",
        joiningDate: "11-06-2024",
        academicYear: "2024-2025",
        institute: "AIT",
        designation: "ASSISTANT PROFESSOR",
        department: "MASTER OF BUSINESS ADMINISTRATION",
    },
    {
        id: 3,
        empCode: "AI003062",
        empName: "SADULA RAM KUMAR",
        joiningDate: "10-28-2024",
        academicYear: "2024-2025",
        institute: "AGS",
        designation: "ASSOCIATE PROFESSOR",
        department: "PHYSICS",
    },
];

const FacultyFeedbackMaster = () => {
    return (
        <FacultyFeedbackIndex />
    );
};

export default FacultyFeedbackMaster;
