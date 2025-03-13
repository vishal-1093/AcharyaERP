import { useState, useEffect } from "react";
import axios from "../../services/Api";
import { IconButton } from "@mui/material";
import GridIndex from "../../components/GridIndex";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import useAlert from "../../hooks/useAlert";
import AddBoxIcon from "@mui/icons-material/AddBox";

const userId = JSON.parse(sessionStorage.getItem("AcharyaErpUser"))?.userId;

function InternalMarksUserIndex() {
  const [rows, setRows] = useState([]);

  const setCrumbs = useBreadcrumbs();
  const navigate = useNavigate();
  const { setAlertMessage, setAlertOpen } = useAlert();

  useEffect(() => {
    setCrumbs([{ name: "Internal Marks" }]);
    getData();
  }, []);

  const getData = async () => {
    try {
      const response = await axios.get(
        `/api/academic/internalTimeTableAssignmentDetailsByLecturerEmployeeId?page=${0}&page_size=${10000}&sort=created_date&user_id=${userId}`
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

  const handleAddMarks = (id) => {
    navigate(`/internal-marks/${id}`);
  };

  const columns = [
    { field: "internal_short_name", headerName: "Internal Name", flex: 1 },
    { field: "course_with_coursecode", headerName: "Course", flex: 1 },
    { field: "ac_year", headerName: "Ac Year", flex: 1 },
    { field: "school_name_short", headerName: "School", flex: 1 },
    {
      field: "program_short_name",
      headerName: "Program",
      flex: 1,
      valueGetter: (value, row) =>
        row?.program_short_name +
        " - " +
        row?.program_specialization_short_name,
    },
    {
      field: "year_sem",
      headerName: "Year/Sem",
      flex: 1,
      hide: true,
      valueGetter: (value, row) =>
        `${row?.current_year} / ${row?.current_sem}`,
    },
    { field: "min_marks", headerName: "Min Marks", flex: 1, hide: true },
    { field: "max_marks", headerName: "Max Marks", flex: 1, hide: true },
    {
      field: "date_of_exam",
      headerName: "Exam Date",
      flex: 1,
      valueGetter: (value, row) => row?.date_of_exam,
    },
    { field: "timeSlot", headerName: "Time Slot", flex: 1 },
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
      valueGetter: (value, row) =>
        moment(row?.created_date).format("DD-MM-YYYY"),
    },
    {
      field: "studentId",
      headerName: "Add Marks",
      flex: 1,
      renderCell: (params) => (
        <IconButton onClick={() => handleAddMarks(params.row.id)}>
          <AddBoxIcon color="primary" sx={{ fontSize: 22 }} />
        </IconButton>
      ),
    },
  ];

  return <GridIndex rows={rows} columns={columns} />;
}

export default InternalMarksUserIndex;
