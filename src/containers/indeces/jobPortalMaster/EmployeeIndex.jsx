import { useState, useEffect } from "react";
import axios from "axios";
import ApiUrl from "../../../services/Api";
import GridIndex from "../../../components/GridIndex";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import { Box } from "@mui/material";

const EmployeeIndex = () => {
  const [rows, setRows] = useState([]);
  const setCrumbs = useBreadcrumbs();

  const getData = async () =>
    await axios
      .get(
        `${ApiUrl}/employee/fetchAllEmployeeDetails?page=${0}&page_size=${100}&sort=created_date`
      )
      .then((res) => {
        setRows(res.data.data.Paginated_data.content);
      })
      .catch((err) => {
        console.log(err);
      });

  useEffect(() => {
    setCrumbs([{ name: "" }]);
    getData();
  }, []);

  const columns = [
    { field: "employee_name", headerName: "Employee Name", flex: 1 },
    { field: "empcode", headerName: "Employee Code", flex: 1 },
    { field: "email", headerName: "Email", flex: 1 },
    { field: "school_name_short", headerName: "School", flex: 1 },
    { field: "dept_name_short", headerName: "Department", flex: 1 },
  ];
  return (
    <>
      <Box sx={{ position: "relative", mt: 2 }}>
        <GridIndex rows={rows} columns={columns} />
      </Box>
    </>
  );
};

export default EmployeeIndex;
