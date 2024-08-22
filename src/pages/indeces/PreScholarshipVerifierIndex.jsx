import { useState, useEffect } from "react";
import axios from "../../services/Api";
import { Box, Button, Grid, IconButton, Typography } from "@mui/material";
import GridIndex from "../../components/GridIndex";
import AddBoxIcon from "@mui/icons-material/AddBox";
import { useNavigate } from "react-router-dom";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import DownloadIcon from "@mui/icons-material/Download";
import useAlert from "../../hooks/useAlert";

const breadCrumbsList = [{ name: "Verify Scholarship" }, { name: "History" }];

function PreScholarshipVerifierIndex() {
  const [rows, setRows] = useState([]);

  const navigate = useNavigate();
  const setCrumbs = useBreadcrumbs();
  const { setAlertMessage, setAlertOpen } = useAlert();

  useEffect(() => {
    getData();
    setCrumbs(breadCrumbsList);
  }, []);

  const getData = async () => {
    try {
      const response = await axios.get("/api/student/fetchScholarship3", {
        params: { page: 0, page_size: 10000, sort: "created_date" },
      });
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

  const handleInitiate = () => {
    navigate("/direct-scholarship");
  };

  const columns = [
    {
      field: "application_no_npf",
      headerName: "Application No",
      flex: 1,
      hideable: false,
    },
    {
      field: "candidate_name",
      headerName: "Applicant Name",
      flex: 1,
      hideable: false,
    },
    {
      field: "auid",
      headerName: "AUID",
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
      headerName: "Verify",
      flex: 1,
      renderCell: (params) => (
        <IconButton
          title="Verify"
          onClick={() =>
            navigate(`/PreScholarshipVerifierForm/${params.row.auid}`)
          }
          sx={{ padding: 0 }}
        >
          <AddBoxIcon color="primary" sx={{ fontSize: 20 }} />
        </IconButton>
      ),
    },
  ];

  return (
    <Box sx={{ marginTop: { md: -6 } }}>
      <Grid container rowSpacing={2}>
        <Grid item xs={12} align="right">
          <Button variant="outlined" onClick={handleInitiate}>
            Initiate Scholarship
          </Button>
        </Grid>

        <Grid item xs={12}>
          <GridIndex rows={rows} columns={columns} />
        </Grid>
      </Grid>
    </Box>
  );
}

export default PreScholarshipVerifierIndex;
