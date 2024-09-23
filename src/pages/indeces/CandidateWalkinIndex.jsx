import { Box, Button, Grid, IconButton } from "@mui/material";
import axios from "../../services/Api";
import { useEffect, useState } from "react";
import GridIndex from "../../components/GridIndex";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import useAlert from "../../hooks/useAlert";
import AddBoxIcon from "@mui/icons-material/AddBox";
import { Visibility } from "@mui/icons-material";
import PendingIcon from "@mui/icons-material/Pending";
import PendingActionsIcon from "@mui/icons-material/PendingActions";

function CandidateWalkinIndex() {
  const [rows, setRows] = useState([]);

  const navigate = useNavigate();
  const setCrumbs = useBreadcrumbs();
  const { setAlertMessage, setAlertOpen } = useAlert();

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      const response = await axios.get("/api/student/EditCandidateDetails", {
        params: { page: 0, page_size: 10000, sort: "created_date" },
      });
      setRows(response.data.data.Paginated_data.content);
      setCrumbs([{ name: "Candidate Walkin" }]);
    } catch (err) {
      setAlertMessage({
        severity: "error",
        message: "Failed to fetch the data !!",
      });
      setAlertOpen(true);
    }
  };

  const handleOffer = (params) => {
    const { npf_status, is_verified, is_scholarship, id } = params;

    if (npf_status === 1 && (is_verified === "yes" || !is_scholarship)) {
      return (
        <IconButton
          title="View Offer"
          onClick={() => navigate(`/OfferLetterView/${id}`)}
        >
          <Visibility color="primary" sx={{ fontSize: 22 }} />
        </IconButton>
      );
    } else if (npf_status === 1 && is_scholarship) {
      return (
        <IconButton
          title="Verification Pending"
          onClick={() => navigate(`/PreAdmissionProcessForm/${id}`)}
        >
          <PendingActionsIcon color="primary" sx={{ fontSize: 22 }} />
        </IconButton>
      );
    }

    return (
      <IconButton
        title="Create Offer"
        onClick={() => navigate(`/PreAdmissionProcessForm/${id}`)}
      >
        <AddBoxIcon color="primary" sx={{ fontSize: 22 }} />
      </IconButton>
    );
  };

  const columns = [
    { field: "candidate_name", headerName: "Name", flex: 1 },
    { field: "application_no_npf", headerName: "Application No", flex: 1 },
    { field: "school_name_short", headerName: "School ", flex: 1 },
    {
      field: "program_short_name",
      headerName: "Program",
      flex: 1,
      valueGetter: (params) =>
        `${params.row.program_short_name} - ${params.row.program_specialization_short_name}`,
    },
    {
      field: "is_approved",
      headerName: "Offer Letter",
      flex: 1,
      renderCell: (params) => handleOffer(params.row),
    },
    {
      field: "username",
      headerName: "Offer Created By",
      flex: 1,
    },
    {
      field: "lead_status",
      headerName: "Status",
      flex: 1,
      valueGetter: (params) =>
        params.row.npf_status === 1
          ? "Offer Created Not Sent"
          : params.row.npf_status === 2
          ? "Offer Sent, Acceptance Pending"
          : params.row.npf_status === 3
          ? "Offer Accepted Payment Pending"
          : params.row.npf_status === 4
          ? "Paid AUID Not Created"
          : "",
    },
  ];

  return (
    <>
      <Box sx={{ position: "relative", mt: 3 }}>
        <Button
          onClick={() => navigate("/CandidateWalkinForm")}
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

export default CandidateWalkinIndex;
