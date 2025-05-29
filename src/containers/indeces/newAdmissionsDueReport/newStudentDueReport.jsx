import { useState, useEffect } from "react";
import { Box, Grid } from "@mui/material";
import GridIndex from "../../../components/GridIndex";
import { useNavigate } from "react-router-dom";
import axios from "../../../services/Api";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";

const initialValues = {
    schoolId: "",
    programSpelizationId: "",
    acYearId: "",
};

function NewStudentDueReport() {
  const [rows, setRows] = useState([]);
  const setCrumbs = useBreadcrumbs();

  const columns = [
    { field: "student_name", headerName: "Name", flex: 1 },
    { field: "student_id", headerName: "StudentId", flex: 1 },
    { field: "inst", headerName: "School", flex: 1 },
     { field: "year/sem", headerName: "Year/Sem", align:"center", flex: 1 },
    { field: "fixedAmount", headerName: "Fixed Amount", align:"right", flex: 1 },
     { field: "paidAmount", headerName: "Paid Amount", align:"right", flex: 1 },
     { field: "scholarship", headerName: "Scholarship", align:"right", flex: 1 },
     { field: "addOn", headerName: "Add On Due", align:"right", flex: 1 },
     { field: "hostelDue", headerName: "Hostel Due", align:"right", flex: 1 },
      { field: "due", headerName: "Total Due", align:"right", flex: 1 }
      
  ];
 useEffect(() => {
 
         setCrumbs([
             { name: "Student Due Report" }
         ])
         getData
     }, []);
 
const getData = async () => {
    const baseUrl = "/api/student/acYearWiseStudentDueDetails"
    await axios
    .get("/api/student/acYearWiseStudentDueDetails")
      .then((res) => {
        const {data} = res?.data
        setRows(data);
      })
      .catch((err) => console.error(err));
  };

  return (
      <Box sx={{ position: "relative", marginTop: 3 }}>
        <GridIndex rows={rows} columns={columns} getRowId={(row, index) => row?.student_id} />
      </Box>
  );
}
export default NewStudentDueReport;
