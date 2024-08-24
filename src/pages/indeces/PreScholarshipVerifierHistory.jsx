import { useState, useEffect } from "react";
import axios from "../../services/Api";
import {
  Box,
  IconButton,
  Tooltip,
  Typography,
  styled,
  tooltipClasses,
} from "@mui/material";
import GridIndex from "../../components/GridIndex";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import moment from "moment";
import DownloadIcon from "@mui/icons-material/Download";
import useAlert from "../../hooks/useAlert";

const HtmlTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "white",
    color: "rgba(0, 0, 0, 0.6)",
    maxWidth: 300,
    fontSize: 12,
    boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px;",
    padding: "10px",
    textAlign: "justify",
  },
}));

const breadCrumbsList = [
  { name: "Verify Scholarship", link: "/verify-scholarship" },
  { name: "History" },
];

function PreScholarshipVerifierHistory() {
  const [rows, setRows] = useState([]);

  const setCrumbs = useBreadcrumbs();
  const { setAlertMessage, setAlertOpen } = useAlert();

  useEffect(() => {
    getData();
    setCrumbs(breadCrumbsList);
  }, []);

  const getData = async () => {
    try {
      const response = await axios.get(
        "/api/student/fetchScholarshipDetailsForVerified",
        {
          params: { page: 0, page_size: 10000, sort: "created_date" },
        }
      );
      setRows(response.data.data.Paginated_data.content);
    } catch (err) {
      setAlertMessage({
        severity: "error",
        message: "Failed to fetch the data !!",
      });
      setAlertOpen(true);
    }
  };

  const handleDownload = async (obj) => {
    try {
      const response = await axios.get(
        `/api/ScholarshipAttachmentFileviews?fileName=${obj}`,
        {
          responseType: "blob",
        }
      );
      const url = URL.createObjectURL(response.data);
      window.open(url);
    } catch (err) {
      setAlertMessage({
        severity: "error",
        message:
          err.response?.data?.message || "Failed to download the document !!",
      });
      setAlertOpen(true);
    }
  };

  const columns = [
    {
      field: "application_no_npf",
      headerName: "Application No",
      flex: 1,
      hideable: false,
    },
    {
      field: "student_name",
      headerName: "Applicant Name",
      flex: 1,
      hideable: false,
    },
    {
      field: "program_short_name",
      headerName: "Program",
      flex: 1,
      hideable: false,
    },
    {
      field: "program_specialization_short_name",
      headerName: "Specialization",
      flex: 1,
      hideable: false,
    },
    {
      field: "created_username",
      headerName: "Counselor Name",
      flex: 1,
      hideable: false,
    },
    {
      field: "requested_scholarship",
      headerName: "Requested Scholarship",
      flex: 1,
      hideable: false,
    },
    {
      field: "verified_amount",
      headerName: "Verified Scholarship",
      flex: 1,
      hideable: false,
    },
    {
      field: "scholarship_attachment_path",
      headerName: "Document",
      flex: 1,
      hideable: false,
      renderCell: (params) => (
        <IconButton
          title="Download the document"
          onClick={() => handleDownload(params.row.scholarship_attachment_path)}
          sx={{ padding: 0 }}
        >
          <DownloadIcon color="primary" sx={{ fontSize: 20 }} />
        </IconButton>
      ),
    },
    {
      field: "is_verified",
      headerName: "Verified By",
      flex: 1,

      renderCell: (params) => (
        <HtmlTooltip
          title={
            <Box>
              <Typography variant="body2">{params.row.verifiedName}</Typography>
              <Typography variant="body2">
                {moment(params.row.verified_date).format("DD-MM-YYYY")}
              </Typography>
            </Box>
          }
        >
          <span>{params.row.verifiedName}</span>
        </HtmlTooltip>
      ),
    },
  ];

  return <GridIndex rows={rows} columns={columns} />;
}

export default PreScholarshipVerifierHistory;
