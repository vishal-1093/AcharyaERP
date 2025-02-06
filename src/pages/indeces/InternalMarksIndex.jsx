import { useState, useEffect, lazy } from "react";
import axios from "../../services/Api";
import { Box, Button, IconButton } from "@mui/material";
import GridIndex from "../../components/GridIndex";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import { useNavigate } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import moment from "moment";
import useAlert from "../../hooks/useAlert";
import EditIcon from "@mui/icons-material/Edit";
import ModalWrapper from "../../components/ModalWrapper";

const UpdateInternalMarks = lazy(() =>
  import("../forms/academicMaster/UpdateInternalMarks")
);

function InternalMarksIndex() {
  const [rows, setRows] = useState([]);
  const [ModalWrapperOpen, setModalWrapperOpen] = useState(false);
  const [rowData, setRowData] = useState([]);

  const setCrumbs = useBreadcrumbs();
  const navigate = useNavigate();
  const { setAlertMessage, setAlertOpen } = useAlert();

  useEffect(() => {
    setCrumbs([{ name: "Internal Assesment Marks" }]);
    getData();
  }, []);

  const getData = async () => {
    try {
      const response = await axios.get(
        `/api/student/fetchAllStudentMarksDetail?page=${0}&page_size=${10000}&sort=created_date`
      );
      setRows(response.data.data.Paginated_data.content);
    } catch (err) {
      setAlertMessage({
        severity: "error",
        message: err.response?.data?.message || "Failed to load data !!",
      });
      setAlertOpen(true);
    }
  };
  console.log("rows :>> ", rows);

  const handleUpdate = (data) => {
    setRowData(data);
    setModalWrapperOpen(true);
  };

  const columns = [
    { field: "student_name", headerName: "Student Name", flex: 1 },
    { field: "studentAuid", headerName: "AUID", flex: 1 },
    { field: "internal_name", headerName: "Internal Name", flex: 1 },
    {
      field: "course_name",
      headerName: "Course",
      flex: 1,
      valueGetter: (params) =>
        `${params.row.course_name} - ${params.row.course_code}`,
    },
    { field: "ac_year", headerName: "Ac Year", flex: 1, hide: true },
    { field: "school_name_short", headerName: "School", flex: 1, hide: true },
    {
      field: "program_short_name",
      headerName: "Program",
      flex: 1,
      hide: true,
      valueGetter: (params) =>
        `${params.row.program_short_name}-${params.row.program_specialization_short_name}`,
    },
    {
      field: "year_sem",
      headerName: "Year/Sem",
      flex: 1,
      hide: true,
      valueGetter: (params) =>
        `${params.row.current_year} / ${params.row.current_sem}`,
    },
    {
      field: "date_of_exam",
      headerName: "Exam Date",
      flex: 1,
      valueGetter: (params) => params.row.date_of_exam,
    },
    {
      field: "time_slots_id",
      headerName: "Time Slot",
      flex: 1,
      valueGetter: (params) =>
        `${params.row.starting_time} - ${params.row.ending_time}`,
    },
    { field: "max_marks", headerName: "Max Marks", flex: 1, hide: true },
    { field: "min_marks", headerName: "Min Marks", flex: 1, hide: true },
    { field: "marks_obtained_internal", headerName: "Scored Marks", flex: 1 },
    {
      field: "percentage",
      headerName: "Percentage",
      flex: 1,
      valueGetter: (params) => `${params.value}%`,
    },
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
    {
      field: "id",
      headerName: "Update",
      flex: 1,
      renderCell: (params) => (
        <IconButton onClick={() => handleUpdate(params.row)}>
          <EditIcon color="primary" sx={{ fontSize: 22 }} />
        </IconButton>
      ),
    },
  ];

  return (
    <>
      <ModalWrapper
        open={ModalWrapperOpen}
        setOpen={setModalWrapperOpen}
        maxWidth={600}
        title={rowData.internal_name}
      >
        <UpdateInternalMarks
          rowData={rowData}
          getData={getData}
          setAlertMessage={setAlertMessage}
          setAlertOpen={setAlertOpen}
          setModalWrapperOpen={setModalWrapperOpen}
        />
      </ModalWrapper>

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
    </>
  );
}

export default InternalMarksIndex;
