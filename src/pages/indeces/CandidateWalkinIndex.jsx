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
import {
  Box,
  Button,
  Grid,
  IconButton,
  Tooltip,
  Typography,
  styled,
  tooltipClasses,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import AddBoxIcon from "@mui/icons-material/AddBox";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import DeleteIcon from "@mui/icons-material/Delete";
import { OfferLetterPDFGenerator } from "../forms/candidateWalkin/OfferLetterPDF";

const initValues = {
  counselorStatus: "",
  counselorRemarks: "",
  linkExpiryDate: null,
};

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

  const handlePrintNodue = async (data) => {
    try {
      // Fetch student details
      const noDuesData = await axios
        .get(`/api/student/findAllDetailsPreAdmission/${data.id}`)
        .then((res) => res.data.data)
        .catch((err) => {
          console.error("Error fetching student details:", err);
          throw err;
        });

      // Fetch fee template data
      const feeTemplateData = await axios
        .get(`/api/finance/FetchAllFeeTemplateDetail/1`)
        .then((res) => res.data.data[0])
        .catch((err) => {
          console.error("Error fetching fee template:", err);
          throw err;
        });

      // Fetch academic program details
      const academicProgramData = await axios
        .get(
          `/api/academic/FetchAcademicProgram/${feeTemplateData.ac_year_id}/${feeTemplateData.program_id}/${feeTemplateData.school_id}`
        )
        .then((res) => res.data.data[0])
        .catch((err) => {
          console.error("Error fetching academic program:", err);
          throw err;
        });

      // Generate year or semester list based on program type
      const yearSem = [];
      const isYearly =
        feeTemplateData.program_type_name.toLowerCase() === "yearly";
      const isSemester =
        feeTemplateData.program_type_name.toLowerCase() === "semester";

      if (isYearly || isSemester) {
        for (let i = 1; i <= academicProgramData.number_of_semester; i++) {
          yearSem.push({ key: i, value: isYearly ? `Year ${i}` : `Sem ${i}` });
        }
      }
      // Fetch fee template sub amount data
      const feeTemplateSubAmountData = await axios
        .get(`/api/finance/FetchFeeTemplateSubAmountDetail/1`)
        .then((res) => res.data.data)
        .catch((err) => {
          console.error("Error fetching fee template sub amount:", err);
          throw err;
        });

      // Fetch scholarship data if applicable
      if (data.scholarship_id) {
        const scholarshipData = await axios
          .get(`/api/student/fetchscholarship/${data.scholarship_id}`)
          .then((res) => res.data.data[0])
          .catch((err) => {
            console.error("Error fetching scholarship:", err);
            throw err;
          });

        const additionalScholarshipData = await axios
          .get(
            `/api/student/fetchScholarship2/${scholarshipData.scholarship_id}`
          )
          .then((res) => res.data.data[0])
          .catch((err) => {
            console.error(
              "Error fetching additional scholarship details:",
              err
            );
            throw err;
          });
      }

      // Generate No Due PDF
      const blobFile = await OfferLetterPDFGenerator(
        noDuesData[0],
        feeTemplateSubAmountData
      );
      console.log(blobFile, "blobFile");

      // Open the generated PDF in a new tab
      window.open(URL.createObjectURL(blobFile));
    } catch (error) {
      console.error("Error in handlePrintNodue:", error);
    }
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
      renderCell: (params) =>
        params.row.npf_status === null ? (
          <Link to={`/PreAdmissionProcessForm/${params.row.id}`}>
            <IconButton style={{ color: "#4A57A9", textAlign: "center" }}>
              <AddBoxIcon />
            </IconButton>
          </Link>
        ) : (
          <IconButton
            style={{ color: "#4A57A9", textAlign: "center" }}
            // onClick={() => navigate(`/offerletterview/${params.row.id}`)}
            onClick={() => handlePrintNodue(params.row)}
          >
            <VisibilityIcon />
          </IconButton>
        ),

      // params.row.npf_status === null ? (
      //   <Link to={`/PreAdmissionProcessForm/${params.row.id}`}>
      //     <IconButton style={{ color: "#4A57A9", textAlign: "center" }}>
      //       <AddBoxIcon />
      //     </IconButton>
      //   </Link>
      // ) : params.row.is_scholarship === null ||
      //   params.row.is_verified === "yes" ? (
      //   <IconButton
      //     style={{ color: "#4A57A9", textAlign: "center" }}
      //     onClick={() => navigate(`/offerletterview/${params.row.id}`)}
      //   >
      //     <VisibilityIcon />
      //   </IconButton>
      // ) : params.row.npf_status === 1 &&
      //   params.row.is_scholarship === true ? (
      //   <HtmlTooltip
      //     title={
      //       params.row.pre_approval_status === true
      //         ? "Approved"
      //         : params.row.pre_approval_status === false
      //         ? "Rejected"
      //         : "Pending"
      //     }
      //   >
      //     <IconButton
      //       style={{ color: "#4A57A9", textAlign: "center" }}
      //       onClick={() => handleWrapper(params.row)}
      //     >
      //       <DescriptionOutlinedIcon />
      //       <Avatar
      //         sx={{
      //           width: 20,
      //           height: 20,
      //           bgcolor:
      //             params.row.pre_approval_status === true
      //               ? "success.main"
      //               : "orange.light",
      //         }}
      //       >
      //         <Typography variant="subtitle2">
      //           {params.row.pre_approval_status === true
      //             ? "A"
      //             : params.row.pre_approval_status === false
      //             ? "R"
      //             : "P"}
      //         </Typography>
      //       </Avatar>
      //     </IconButton>
      //   </HtmlTooltip>
      // ) : (
      //   <></>
      // ),
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
