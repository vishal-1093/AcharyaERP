import { useEffect, useState } from "react";
import axios from "../../../services/Api";
import useAlert from "../../../hooks/useAlert";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import { Box, IconButton } from "@mui/material";
import GridIndex from "../../../components/GridIndex";
import moment from "moment";
import DownloadIcon from "@mui/icons-material/Download";

const breadCrumbsList = [
  { name: "Approve Cancel Admissions", link: "/approve-canceladmission" },
  { name: "History" },
];

function CancelAdmissionHistoryIndex() {
  const [rows, setRows] = useState([]);

  const { setAlertMessage, setAlertOpen } = useAlert();
  const setCrumbs = useBreadcrumbs();

  useEffect(() => {
    getData();
    setCrumbs(breadCrumbsList);
  }, []);

  const getData = async () => {
    try {
      const response = await axios.get(
        "/api/fetchAllCancelAdmissionsReport?page=0&page_size=100&sort=created_date"
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

  const handleDownloadDocument = async (attachmentPath) => {
    try {
      const documentResponse = await axios.get(
        `/api/cancelAdmissionsFileviews?fileName=${attachmentPath}`,
        { responseType: "blob" }
      );
      const url = URL.createObjectURL(documentResponse.data);
      window.open(url);
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
    { field: "auid", headerName: "AUID", flex: 1, hideable: false },
    {
      field: "student_name",
      headerName: "Student Name",
      flex: 1,
      hideable: false,
    },
    { field: "school_name", headerName: "School", flex: 1, hideable: false },
    { field: "remarks", headerName: "Remarks", flex: 1, hideable: false },
    {
      field: "created_date",
      headerName: "Initiated Date",
      flex: 1,
      hideable: false,
      valueGetter: (params) => moment(params.value).format("DD-MM-YYYY LT"),
    },
    {
      field: "attachment_path",
      headerName: "Download",
      flex: 1,
      hideable: false,
      renderCell: (params) => (
        <IconButton
          onClick={() => handleDownloadDocument(params.value)}
          title="Download Document"
          sx={{ padding: 0 }}
        >
          <DownloadIcon color="primary" sx={{ fontSize: 24 }} />
        </IconButton>
      ),
    },
    {
      field: "approved_by",
      headerName: "Approved By",
      flex: 1,
      hideable: false,
    },
    {
      field: "approved_date",
      headerName: "Approved Date",
      flex: 1,
      hideable: false,
      valueGetter: (params) =>
        params.value ? moment(params.value).format("DD-MM-YYYY LT") : "",
    },
    {
      field: "approved_remarks",
      headerName: "Approved Remarks",
      flex: 1,
      hide: true,
    },
    { field: "rejected_by", headerName: "Rejected By", flex: 1, hide: true },
    {
      field: "rejected_date",
      headerName: "Rejected Date",
      flex: 1,
      hide: true,
      valueGetter: (params) =>
        params.value ? moment(params.value).format("DD-MM-YYYY LT") : "",
    },
    {
      field: "rejected_remarks",
      headerName: "Rejected Remarks",
      flex: 1,
      hide: true,
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

export default CancelAdmissionHistoryIndex;
