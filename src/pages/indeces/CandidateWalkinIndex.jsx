import { lazy, useEffect, useState } from "react";
import axios from "../../services/Api";
import domainUrl from "../../services/Constants";
import {
  Alert,
  Backdrop,
  Box,
  Button,
  CircularProgress,
  IconButton,
  Snackbar,
  styled,
  Tooltip,
  tooltipClasses,
  Typography,
} from "@mui/material";
import GridIndex from "../../components/GridIndex";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import useAlert from "../../hooks/useAlert";
import AddBoxIcon from "@mui/icons-material/AddBox";
import { Visibility } from "@mui/icons-material";
import moment from "moment";
import CustomModal from "../../components/CustomModal";
import MarkEmailReadIcon from "@mui/icons-material/MarkEmailRead";
import PauseCircleFilledIcon from "@mui/icons-material/PauseCircleFilled";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import VerifiedIcon from "@mui/icons-material/Verified";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import AddLinkIcon from "@mui/icons-material/AddLink";

const ModalWrapper = lazy(() => import("../../components/ModalWrapper"));
const CounselorStatusForm = lazy(() =>
  import("../forms/candidateWalkin/CounselorStatusForm")
);

const StyledTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "white",
    color: "rgba(0, 0, 0, 0.6)",
    maxWidth: 300,
    fontSize: 9,
    boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px;",
    padding: "6px",
    textAlign: "center",
  },
}));

function CandidateWalkinIndex() {
  const [rows, setRows] = useState([]);
  const [confirmContent, setConfirmContent] = useState({
    title: "",
    message: "",
    buttons: [],
  });
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [backDropOpen, setBackDropOpen] = useState(false);
  const [rowData, setRowData] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

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

    if (npf_status === null) {
      return (
        <IconButton
          title="Create Offer"
          onClick={() => navigate(`/PreAdmissionProcessForm/${id}`)}
        >
          <AddBoxIcon color="primary" sx={{ fontSize: 22 }} />
        </IconButton>
      );
    } else if (npf_status === 1 && (is_verified === "yes" || !is_scholarship)) {
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
          title="Sch Pending"
          onClick={() => navigate(`/PreAdmissionProcessForm/${id}`)}
        >
          <PauseCircleFilledIcon color="primary" sx={{ fontSize: 22 }} />
        </IconButton>
      );
    } else if (npf_status === 2) {
      return (
        <IconButton
          title="Offer Sent"
          onClick={() => navigate(`/OfferLetterView/${id}`)}
        >
          <MarkEmailReadIcon color="primary" sx={{ fontSize: 22 }} />
        </IconButton>
      );
    } else if (npf_status === 3) {
      return (
        <IconButton
          title="Offer Accepted"
          onClick={() => navigate(`/OfferLetterView/${id}`)}
        >
          <VerifiedIcon color="success" sx={{ fontSize: 22 }} />
        </IconButton>
      );
    }
  };

  const handleDelete = async (rowData) => {
    const { id, is_scholarship: scholarship } = rowData;

    setConfirmContent({
      title: "",
      message: "Are you sure you want to delete the offer?",
      buttons: [
        {
          name: "Yes",
          color: "primary",
          func: () => handleDeleteOffer(id, scholarship),
        },
        { name: "No", color: "primary", func: () => {} },
      ],
    });
    setConfirmOpen(true);
  };

  const handleDeleteOffer = async (id, scholarship) => {
    try {
      setBackDropOpen(true);
      const { data: response } = await axios.get(
        `/api/student/Candidate_Walkin/${id}`
      );
      const candidateData = response.data;
      candidateData.npf_status = null;
      await axios.delete(`/api/student/deactivatePreAdmissionProcess/${id}`);
      if (scholarship) {
        await Promise.all([
          axios.delete(`/api/student/deactivateScholarship/${id}`),
          axios.delete(
            `/api/student/deactivateScholarshipapprovalstatus/${id}`
          ),
          axios.delete(`/api/student/deactivateScholarshipAttachment/${id}`),
        ]);
      }
      const { data: updateStatus } = await axios.put(
        `/api/student/Candidate_Walkin/${id}`,
        candidateData
      );
      if (updateStatus.success) {
        setAlertMessage({
          severity: "success",
          message: "Offer has been deleted successfully",
        });
        setAlertOpen(true);
        setConfirmOpen(false);
        getData();
      }
    } catch (err) {
      setAlertMessage({
        severity: "error",
        message:
          err.response?.data?.message || "Failed to load fee template details!",
      });
      setAlertOpen(true);
    } finally {
      setBackDropOpen(false);
    }
  };

  const handleCounselorStatus = (data) => {
    setRowData(data);
    setModalOpen(true);
  };

  const handleCopyToClipboard = (id) => {
    setCopied(true);
    navigator.clipboard.writeText(`${domainUrl}registration-payment/${id}`);
  };

  const columns = [
    { field: "id", headerName: "Candidate ID", flex: 1 },
    { field: "application_no_npf", headerName: "Application No", flex: 1 },
    { field: "candidate_name", headerName: "Name", flex: 1 },
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
      renderCell: (params) => (
        <StyledTooltip
          title={
            <>
              <Typography variant="body2">{params.value}</Typography>
              <Typography variant="body2">
                {moment(params.row.created_date).format("DD-MM-YYYY LT")}
              </Typography>
            </>
          }
        >
          <span>{params.value}</span>
        </StyledTooltip>
      ),
    },
    {
      field: "created_date",
      headerName: "Offer Created Date",
      flex: 1,
      hide: true,
      valueGetter: (params) => moment(params.value).format("DD-MM-YYYY LT"),
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
    {
      field: "mail_sent_date",
      headerName: "Delete Offer",
      flex: 1,
      renderCell: (params) =>
        params.row.npf_status !== null &&
        (params.row.npf_status === 1 || params.row.is_verified !== "yes") && (
          <IconButton
            title="Delete Offer"
            onClick={() => handleDelete(params.row)}
          >
            <HighlightOffIcon color="error" sx={{ fontSize: 22 }} />
          </IconButton>
        ),
    },
    {
      field: "npf_status",
      headerName: "Counselor Status",
      flex: 1,
      renderCell: (params) =>
        params.row.npf_status >= 1 ? (
          <IconButton
            title="Update Status"
            onClick={() => handleCounselorStatus(params.row)}
          >
            <AddBoxIcon color="primary" sx={{ fontSize: 22 }} />
          </IconButton>
        ) : params.row.counselor_status === 1 ? (
          <IconButton title="Offer Accepted">
            <CheckCircleOutlineRoundedIcon color="success" />
          </IconButton>
        ) : (
          <></>
        ),
    },
    {
      field: "link_exp",
      headerName: "Payment Link",
      renderCell: (params) =>
        params.row.npf_status >= 1 && (
          <IconButton
            title="Copy Link"
            onClick={() => handleCopyToClipboard(params.row.id)}
          >
            <AddLinkIcon color="primary" sx={{ fontSize: 24 }} />
          </IconButton>
        ),
    },
    {
      field: "auid",
      headerName: "AUID",
      flex: 1,
      renderCell: (params) =>
        params.row.npf_status >= 3 && (
          <IconButton
            title="Create AUID"
            onClick={() => navigate(`/admission/${params.row.id}`)}
          >
            <AddBoxIcon color="primary" sx={{ fontSize: 22 }} />
          </IconButton>
        ),
    },
  ];

  return (
    <>
      <CustomModal
        open={confirmOpen}
        setOpen={setConfirmOpen}
        title={confirmContent.title}
        message={confirmContent.message}
        buttons={confirmContent.buttons}
      />
      <Snackbar
        open={copied}
        autoHideDuration={6000}
        onClose={() => setCopied(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Box sx={{ top: 40 }}>
          <Alert
            severity="success"
            variant="filled"
            sx={{
              position: "fixed",
              top: 61,
              left: "50%",
              transform: "translate(-50%, 0)",
              width: "90%",
              maxWidth: 500,
              zIndex: 9999,
            }}
          >
            Payment link has been copied succesfully
          </Alert>
        </Box>
      </Snackbar>

      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={backDropOpen}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      <ModalWrapper
        open={modalOpen}
        setOpen={setModalOpen}
        maxWidth={700}
        title={rowData.candidate_name}
      >
        <CounselorStatusForm
          rowData={rowData}
          setModalOpen={setModalOpen}
          getData={getData}
          setAlertMessage={setAlertMessage}
          setAlertOpen={setAlertOpen}
        />
      </ModalWrapper>

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
