import { useState, useEffect } from "react";
import axios from "../../services/Api";
import GridIndex from "../../components/GridIndex";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import { Box } from "@mui/material";

function EmployeeIndex() {
  const [rows, setRows] = useState([]);

  const setCrumbs = useBreadcrumbs();

  useEffect(() => {
    setCrumbs([{ name: "Employee Index" }]);
    getData();
  }, []);

  const getData = async () =>
    await axios
      .get(
        `/api/employee/fetchAllEmployeeDetails?page=${0}&page_size=${100}&sort=created_date`
      )
      .then((res) => {
        console.log(res.data.data.Paginated_data.content);
        setRows(res.data.data.Paginated_data.content);
      })
      .catch((err) => console.error(err));

  const columns = [
    { field: "employee_name", headerName: "Employee Name", flex: 1 },
    { field: "empcode", headerName: "Employee Code", flex: 1 },
    { field: "email", headerName: "Email", flex: 1 },
    { field: "school_name_short", headerName: "School", flex: 1 },
    { field: "dept_name_short", headerName: "Department", flex: 1 },
    { field: "designation", headerName: "Designation", flex: 1 },
    { field: "mobile", headerName: "Mobile No", flex: 1 },
    { field: "dateofbirth", headerName: "DOB", flex: 1 },
    { field: "dateofjoining", headerName: "DOJ", flex: 1 },
  ];

  return (
    <Box sx={{ position: "relative", mt: 2 }}>
      <GridIndex rows={rows} columns={columns} />
    </Box>
  );
}

export default EmployeeIndex;
