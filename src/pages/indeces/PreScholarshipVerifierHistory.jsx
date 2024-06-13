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
import { Visibility } from "@mui/icons-material";

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

function PreScholarshipVerifierHistory() {
  const [rows, setRows] = useState([]);

  const setCrumbs = useBreadcrumbs();

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
      headerName: "Request Grant",
      flex: 1,
      hideable: false,
    },
    {
      field: "prev_approved_amount",
      headerName: "Pre Approved Grant",
      flex: 1,
      hideable: false,
    },
    {
      field: "verified_amount",
      headerName: "Verified Grant",
      flex: 1,
      hideable: false,
    },
    {
      field: "scholarship_attachment_path",
      headerName: "Attachment",
      flex: 1,
      hideable: false,
      renderCell: (params) => (
        <IconButton
          onClick={() => handleDownload(params.row.scholarship_attachment_path)}
          sx={{ padding: 0 }}
        >
          <Visibility sx={{ color: "auzColor.main" }} />
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

  useEffect(() => {
    getData();
    setCrumbs([{ name: "Verify Grant" }]);
  }, []);

  const getData = async () => {
    await axios
      .get(
        `/api/student/fetchScholarshipDetailsForVerified?page=${0}&page_size=${10000}&sort=created_date`
      )
      .then((res) => {
        setRows(res.data.data.Paginated_data.content);
      })
      .catch((err) => console.error(err));
  };

  const handleDownload = async (obj) => {
    await axios
      .get(`/api/ScholarshipAttachmentFileviews?fileName=${obj}`, {
        responseType: "blob",
      })
      .then((res) => {
        const url = URL.createObjectURL(res.data);
        window.open(url);
      })
      .catch((err) => console.error(err));
  };

  return (
    <>
      <Box sx={{ position: "relative", mt: 3 }}>
        <GridIndex rows={rows} columns={columns} />
      </Box>
    </>
  );
}

export default PreScholarshipVerifierHistory;
