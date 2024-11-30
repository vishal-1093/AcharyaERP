import { useState, useEffect } from "react";
import axios from "../../services/Api";
import { Box, Button } from "@mui/material";
import GridIndex from "../../components/GridIndex";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import { useNavigate } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import moment from "moment";

function InternalAssesmentIndex() {
  const [rows, setRows] = useState([]);

  const setCrumbs = useBreadcrumbs();
  const navigate = useNavigate();

  useEffect(() => {
    setCrumbs([{ name: "Internal Assesment" }]);
    getData();
  }, []);

  const getData = async () => {
    await axios
      .get(
        `/api/academic/fetchAllInternalSessionAssignment1?page=${0}&page_size=${10000}&sort=created_date`
      )
      .then((res) => {
        setRows(res.data.data);
      })
      .catch((err) => console.error(err));
  };

  const columns = [
    { field: "internal_name", headerName: "Internal Name", flex: 1 },
    { field: "ac_year", headerName: "Ac Year", flex: 1 },
    { field: "school_name_short", headerName: "School", flex: 1 },
    {
      field: "program_short_name",
      headerName: "Program",
      flex: 1,
      valueGetter: (params) =>
        params.row.program_short_name +
        " - " +
        params.row.program_specialization_short_name,
    },
    { field: "year_sem", headerName: "Year/Sem", flex: 1 },
    { field: "course_with_coursecode", headerName: "Course", flex: 1 },
    { field: "min_marks", headerName: "Min Marks", flex: 1 },
    { field: "max_marks", headerName: "Max Marks", flex: 1 },
    {
      field: "date_of_exam",
      headerName: "Exam Date",
      flex: 1,
      valueGetter: (params) =>
        moment(params.row.date_of_exam).format("DD-MM-YYYY"),
    },
    { field: "timeSlots", headerName: "Time Slot", flex: 1 },
    {
      field: "created_username",
      headerName: "Created By",
      flex: 1,
      hide: true,
    },
    {
      field: "created_date",
      headerName: "Created Date",
      flex: 1,
      hide: true,
      valueGetter: (params) =>
        moment(params.row.created_date).format("DD-MM-YYYY"),
    },
  ];

  return (
    <Box sx={{ position: "relative", mt: 3 }}>
      <Button
        onClick={() => navigate("/internals/assesment-creation")}
        variant="contained"
        disableElevation
        sx={{ position: "absolute", right: 0, top: -57, borderRadius: 2 }}
        startIcon={<AddIcon />}
      >
        Create
      </Button>
      <GridIndex rows={rows} columns={columns} />
    </Box>
  );
}

export default InternalAssesmentIndex;
