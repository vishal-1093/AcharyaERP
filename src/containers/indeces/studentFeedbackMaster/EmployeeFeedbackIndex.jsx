import { useState, useEffect } from "react";
import { Box, IconButton } from "@mui/material";
import GridIndex from "../../../components/GridIndex";
import { useNavigate } from "react-router-dom";
import VisibilityIcon from '@mui/icons-material/Visibility';
import axios from "../../../services/Api";
import moment from "moment";

function EmployeeFeedbackIndex() {
    const [rows, setRows] = useState([]);
    const navigate = useNavigate();

    const columns = [
        {
            field: "academicYear",
            headerName: "Academic Year",
            flex: 1,
            valueGetter: (value, row) => row.academicYear
        },
        {
            field: "empCode",
            headerName: "Emp Code",
            flex: 1,
            valueGetter: (value, row) => row.empCode
        },
        {
            field: "employeeName",
            headerName: "Employee",
            flex: 1,
            valueGetter: (value, row) => row.employeeName
        },
        {
            field: "dateOfJoining",
            headerName: "Date Of Joining",
            flex: 1,
            type: "date",
            valueGetter: (value, row) => moment(row.dateOfJoining).format("DD-MM-YYYY"),
        },
        {
            field: "schoolName",
            headerName: "Institute",
            flex: 1,
            valueGetter: (value, row) => row.schoolName
        },
        {
            field: "designationName",
            headerName: "Designation",
            flex: 1,
            valueGetter: (value, row) => row.designationName
        },
        {
            field: "department",
            headerName: "Department",
            flex: 1,
            valueGetter: (value, row) => row.department
        },
        {
            field: "empId",
            type: "actions",
            flex: 1,
            headerName: "Report",
            getActions: (params) => [
                <IconButton
                    onClick={() =>
                        navigate(`/employee-feedback/report/${params.row.empId}/${params.row.academicYearId}`)
                    }
                >
                    <VisibilityIcon />
                </IconButton>,
            ],
        }
    ]
    
    useEffect(() => {
        getData();
    }, []);

    const getData = async () => {
        await axios
            .get(
                `/api/employee/getEmployeeDetailsForFeedbackReporting`
            )
            .then((res) => {
                setRows(res.data.data);
            })
            .catch((err) => console.error(err));
    };

    return (
        <Box sx={{ position: "relative" }}>
            <GridIndex rows={rows} columns={columns} getRowId={row => row.empId}  />
        </Box>
    )
}
export default EmployeeFeedbackIndex;
