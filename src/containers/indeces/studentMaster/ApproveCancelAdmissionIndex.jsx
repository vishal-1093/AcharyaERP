import { useEffect, useState } from "react";
import axios from "../../../services/Api";
import useAlert from "../../../hooks/useAlert";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import { Box, IconButton } from "@mui/material";
import GridIndex from "../../../components/GridIndex";
import moment from "moment";
import AddBoxIcon from "@mui/icons-material/AddBox";
import { useNavigate } from "react-router-dom";

const breadCrumbsList = [
  { name: "Approve Cancel Admissions" },
  { name: "History", link: "/canceladmission-history" },
];

function ApproveCancelAdmissionIndex() {
  const [rows, setRows] = useState([]);

  const { setAlertMessage, setAlertOpen } = useAlert();
  const setCrumbs = useBreadcrumbs();
  const navigate = useNavigate();

  useEffect(() => {
    getData();
    setCrumbs(breadCrumbsList);
  }, []);

  const getData = async () => {
    try {
      const response = await axios.get(
        "/api/fetchAllCancelAdmissionsDetail?page=0&page_size=100&sort=created_date"
      );
      setRows(response.data.data.Paginated_data.content);
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "An unknown error occurred";
      setAlertMessage({
        severity: "error",
        message: errorMessage,
      });
      setAlertOpen(true);
    }
  };

  const columns = [
    { field: "auid", headerName: "AUID", flex: 1 },
    { field: "student_name", headerName: "Student Name", flex: 1 },
    { field: "school_name", headerName: "School", flex: 1 },
    { field: "remarks", headerName: "Remarks", flex: 1 },
    {
      field: "created_date",
      headerName: "Initiated Date",
      flex: 1,
      valueGetter: (params) => moment(params.value).format("DD-MM-YYYY LT"),
    },
    {
      field: "student_id",
      headerName: "Cancel",
      flex: 1,
      renderCell: (params) => (
        <IconButton
          onClick={() =>
            navigate(
              `/approve-canceladmission/${params.value}/${params.row.id}`
            )
          }
          title="Cancel Admission"
          sx={{ padding: 0 }}
        >
          <AddBoxIcon color="primary" sx={{ fontSize: 24 }} />
        </IconButton>
      ),
    },
  ];
  return (
    <Box
      sx={{
        margin: "20px 0px",
      }}
    >
      <GridIndex rows={rows} columns={columns} />
    </Box>
  );
}

export default ApproveCancelAdmissionIndex;
