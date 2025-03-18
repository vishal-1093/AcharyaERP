import { useState, useEffect } from "react";
import GridIndex from "../../../components/GridIndex";
import { Box, IconButton } from "@mui/material";
import { Add, Visibility } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import axios from "../../../services/Api";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import HistoryIcon from "@mui/icons-material/History";

function ChangeOfCourseIndex() {
  const [rows, setRows] = useState([]);

  const navigate = useNavigate();
  const setCrumbs = useBreadcrumbs();

  useEffect(() => {
    getData();
    setCrumbs([{ name: "Change Of Course Index" }]);
  }, []);

  const getData = async () => {
    await axios
      .get(
        `/api/student/initiatedChangeOfCourseProgramStudentDetails?page=${0}&pageSize=${10000}&sort=created_date`
      )
      .then((res) => {
        setRows(res.data.data.Paginated_data.content);
      })
      .catch((err) => console.error(err));
  };

  const columns = [
    { field: "student_name", headerName: "Student", flex: 1 },
    { field: "old_auid", headerName: "Old auid", flex: 1 },
    {
      field: "mobile",
      headerName: "Mobile",
      flex: 1,
    },
    {
      field: "program_specialization_short_name",
      headerName: "Specilaization",
      hide: true,
      flex: 1,
      valueGetter: (params) =>
        params.row.program_short_name +
        "-" +
        params.row.program_specialization_short_name,
    },
    { field: "school_name_short", headerName: "Institute", flex: 1 },
    { field: "fee_template_name", headerName: "Fee Template", flex: 1 },
    { field: "username", headerName: "Initiated", flex: 1 },
    {
      field: "attachment",
      headerName: "Attachment",
      renderCell: (params) => {
        return (
          <IconButton
            onClick={() =>
              navigate(`/ChangeOfCourseAttachment/${params.row.id}`)
            }
            color="primary"
          >
            <Visibility fontSize="small" />
          </IconButton>
        );
      },
    },
    {
      field: "change_of_course",
      headerName: "COC",
      renderCell: (params) => {
        return (
          <IconButton
            onClick={() =>
              navigate(
                `/ApproverChangeofcourse/${params.row.id}/${params.row.old_student_id}/${params.row.old_program_specialization_id}`,
                { state: { row: params.row } }
              )
            }
            color="primary"
            disabled={!params.row?.old_auid}
          >
            <Add />
          </IconButton>
        );
      },
    },
    {
      field: "fee_Transfer",
      headerName: "Fee Transfer",
      renderCell: (params) => {
        return (
          <IconButton
            onClick={() =>
              navigate(`/FeeTransfer/${params.row?.old_student_id}`, {
                state: { row: params.row },
              })
            }
            color="primary"
            disabled={params.row?.old_auid}
          >
            <HistoryIcon />
          </IconButton>
        );
      },
    },
  ];

  return (
    <Box sx={{ position: "relative", mt: 4 }}>
      <GridIndex rows={rows} columns={columns} />
    </Box>
  );
}

export default ChangeOfCourseIndex;
