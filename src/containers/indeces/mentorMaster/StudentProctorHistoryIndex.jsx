import { React, useState, useEffect } from "react";
import GridIndex from "../../../components/GridIndex";
import { Box } from "@mui/material";
import axios from "../../../services/Api";
import moment from "moment/moment";

const userId = JSON.parse(sessionStorage.getItem("AcharyaErpUser"))?.userId;

function StudentProctorHistoryIndex() {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    await axios
      .get(
        `/api/proctor/proctorStudentAssignmentHistoryDetailByUserId/${userId}`
      )
      .then((res) => {
        setRows(res.data.data);
      })
      .catch((err) => console.error(err));
  };

  const columns = [
    { field: "employee_name", headerName: "Mentor", flex: 1 },
    { field: "empcode", headerName: "Mentor Empcode", flex: 1 },
    { field: "student_name", headerName: "Student", flex: 1 },
    { field: "auid", headerName: "AUID", flex: 1 },
    { field: "created_username", headerName: "De-Assigned By", flex: 1 },
    {
      field: "created_date",
      headerName: "De-Assigned Date",
      flex: 1,
   //   type: "date",
      valueGetter: (value, row) =>
        moment(row?.created_date).format("DD-MM-YYYY"),
    },
  ];
  return (
    <>
      <Box sx={{ position: "relative", mt: 2 }}>
        <GridIndex rows={rows} columns={columns} />
      </Box>
    </>
  );
}
export default StudentProctorHistoryIndex;
