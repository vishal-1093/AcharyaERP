import { useState, useEffect } from "react";
import axios from "../../services/Api";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import GridIndex from "../../components/GridIndex";
import ModalWrapper from "../../components/ModalWrapper";
import FeeTemplateView from "../../components/FeeTemplateView";
import CustomModal from "../../components/CustomModal";
import CustomRadioButtons from "../../components/Inputs/CustomRadioButtons";
import CustomTextField from "../../components/Inputs/CustomTextField";
import CustomDatePicker from "../../components/Inputs/CustomDatePicker";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import useAlert from "../../hooks/useAlert";
import {
  Avatar,
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
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import DeleteIcon from "@mui/icons-material/Delete";

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
  const [values, setValues] = useState(initValues);
  const [rows, setRows] = useState([]);
  const [feeTemplateId, setFeeTemplateId] = useState();
  const [candidateId, setCandidateId] = useState();
  const [wrapperOpen, setWrapperOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [candidateName, setCandidateName] = useState();
  const [linkOpen, setLinkOpen] = useState(false);
  const [confirmContent, setConfirmContent] = useState({
    title: "",
    message: "",
    buttons: [],
  });
  const [confirmOpen, setConfirmOpen] = useState(false);

  const setCrumbs = useBreadcrumbs();
  const navigate = useNavigate();
  const { setAlertMessage, setAlertOpen } = useAlert();

  const columns = [
    { field: "candidate_name", headerName: "Name", flex: 1 },
    { field: "application_no_npf", headerName: "Application No", flex: 1 },
    // {
    //   field: "mobile_number",
    //   headerName: "Mobile",
    //   flex: 1,
    //   valueFormatter: (params) => maskMobile(params.value),
    // },
    // {
    //   field: "candidate_email",
    //   headerName: "Email",
    //   flex: 1,
    //   valueFormatter: (params) => maskEmail(params.value),
    // },
    { field: "school_name_short", headerName: "School ", flex: 1 },
    { field: "program_short_name", headerName: "Program", flex: 1 },
    {
      field: "program_specialization_short_name",
      headerName: "Specialization",
      flex: 1,
    },
    {
      field: "is_approved",
      headerName: "Offer Letter",
      flex: 1,
      renderCell: (params) =>
        params.row.npf_status === null ? (
          <Link to={`/PreAdmissionProcessForm/${params.row.id}`}>
            <IconButton style={{ color: "#4A57A9", textAlign: "center" }}>
              <AddBoxIcon />
            </IconButton>
          </Link>
        ) : params.row.is_scholarship === null ||
          params.row.is_verified === "yes" ? (
          <IconButton
            style={{ color: "#4A57A9", textAlign: "center" }}
            onClick={() => navigate(`/offerletterview/${params.row.id}`)}
          >
            <VisibilityIcon />
          </IconButton>
        ) : params.row.npf_status === 1 &&
          params.row.is_scholarship === true ? (
          <HtmlTooltip
            title={
              params.row.pre_approval_status === true
                ? "Approved"
                : params.row.pre_approval_status === false
                ? "Rejected"
                : "Pending"
            }
          >
            <IconButton
              style={{ color: "#4A57A9", textAlign: "center" }}
              onClick={() => handleWrapper(params.row)}
            >
              <DescriptionOutlinedIcon />
              <Avatar
                sx={{
                  width: 20,
                  height: 20,
                  bgcolor:
                    params.row.pre_approval_status === true
                      ? "success.main"
                      : "orange.light",
                }}
              >
                <Typography variant="subtitle2">
                  {params.row.pre_approval_status === true
                    ? "A"
                    : params.row.pre_approval_status === false
                    ? "R"
                    : "P"}
                </Typography>
              </Avatar>
            </IconButton>
          </HtmlTooltip>
        ) : (
          <></>
        ),
    },
    {
      field: "username",
      headerName: "Offer Created By",
      flex: 1,
    },
    {
      field: "mail_sent_date",
      headerName: "Delete Offer",
      flex: 1,
      renderCell: (params) => {
        return (
          <>
            {params.row.npf_status === 1 &&
            params.row.pre_approval_status === null ? (
              <IconButton onClick={() => handleDelete(params.row)}>
                <DeleteIcon color="error" />
              </IconButton>
            ) : (
              ""
            )}
          </>
        );
      },
    },
    {
      field: "npf_status",
      headerName: "Counselor Status",
      flex: 1,

      renderCell: (params) => {
        return (
          <>
            {params.row.npf_status >= 1 ? (
              <IconButton
                style={{ color: "#4A57A9", textAlign: "center" }}
                onClick={() => handleCounselorStatus(params)}
              >
                <AddBoxIcon />
              </IconButton>
            ) : params.row.counselor_status === 1 ? (
              <IconButton>
                <CheckCircleOutlineRoundedIcon color="success" />
              </IconButton>
            ) : (
              <></>
            )}
          </>
        );
      },
    },
    {
      field: "is_scholarship",
      headerName: "Offer Extension",
      flex: 1,

      renderCell: (params) => {
        return (
          <>
            {params.row.counselor_status ? (
              <IconButton
                style={{ color: "#4A57A9", textAlign: "center" }}
                onClick={() => handleOfferExtension(params)}
              >
                <AddBoxIcon />
              </IconButton>
            ) : (
              <></>
            )}
          </>
        );
      },
    },
    {
      field: "auid",
      headerName: "AUID",
      flex: 1,

      renderCell: (params) => {
        return (
          <>
            {params.row.npf_status >= 3 ? (
              <IconButton
                style={{ color: "#4A57A9", textAlign: "center" }}
                onClick={() => navigate(`/auidform/${params.row.id}`)}
              >
                <AddBoxIcon />
              </IconButton>
            ) : (
              <></>
            )}
          </>
        );
      },
    },
  ];

  useEffect(() => {
    getData();
    setCrumbs([{ name: "Candidate Walkin" }]);
  }, []);

  const getData = async () => {
    await axios
      .get(
        `/api/student/EditCandidateDetails?page=${0}&page_size=${10000}&sort=created_date`
      )
      .then((res) => {
        console.log(res.data.data);
        setRows(res.data.data.Paginated_data.content);
      })
      .catch((err) => console.error(err));
  };

  const handleWrapper = (data) => {
    setFeeTemplateId(data.fee_template_id);
    setCandidateId(data.id);
    setWrapperOpen(true);
  };

  const handleCounselorStatus = (params) => {
    setCandidateName(params.row.candidate_name);
    setCandidateId(params.row.id);
    setModalOpen(true);
  };

  const handleOfferExtension = (params) => {
    setCandidateName(params.row.candidate_name);
    setCandidateId(params.row.id);
    setLinkOpen(true);
  };

  const handleChange = (e) => {
    setValues((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  const handleChangeAdvance = (name, newValue) => {
    setValues((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleCreate = async (value) => {
    await axios
      .get(`/api/student/Candidate_Walkin/${candidateId}`)
      .then((res) => {
        const data = res.data.data;
        if (value === "status") {
          data.counselor_status = values.counselorStatus;
          data.counselor_remarks = values.counselorRemarks;
          data.npf_status = 3;
        }

        if (value === "extend") {
          data.link_exp = values.linkExpiryDate;
        }

        axios
          .put(`/api/student/Candidate_Walkin/${candidateId}`, data)
          .then((res) => {
            setAlertMessage({
              severity: "success",
              message:
                value === "status"
                  ? "Offer status updated sucessfully !!"
                  : "Offer extension updated sucessfully !!",
            });
            setAlertOpen(true);
            getData();
          })
          .catch((err) => console.error(err));
      })
      .catch((err) => console.error(err));

    value === "status" ? setModalOpen(false) : setLinkOpen(false);
  };

  const handleDelete = async (data) => {
    // Fetch candidate data
    const getCandidateData = await axios
      .get(`/api/student/Candidate_Walkin/${data.id}`)
      .then((res) => {
        return res.data.data;
      })
      .catch((err) => console.error(err));
    //Update npf status null when offer deleted
    getCandidateData.npf_status = null;

    // Delete Offer
    const deleteOffer = async () => {
      await axios
        .delete(`/api/student/deactivatePreAdmissionProcess/${data.id}`)
        .then((res) => {})
        .catch((err) => console.error(err));

      if (data.is_scholarship === true) {
        await axios
          .delete(`/api/student/deactivateScholarship/${data.id}`)
          .then((res) => {})
          .catch((err) => console.error(err));

        await axios
          .delete(`/api/student/deactivateScholarshipapprovalstatus/${data.id}`)
          .then((res) => {})
          .catch((err) => console.error(err));

        await axios
          .delete(`/api/student/deactivateScholarshipAttachment/${data.id}`)
          .then((res) => {})
          .catch((err) => console.error(err));
      }

      // Update Candidate Walkin
      await axios
        .put(`/api/student/Candidate_Walkin/${data.id}`, getCandidateData)
        .then((res) => {})
        .catch((err) => console.error(err));
      setAlertMessage({
        severity: "success",
        message: "offer deleted successfully",
      });
      setAlertOpen(true);
      setConfirmOpen(false);
      getData();
    };
    setConfirmContent({
      title: "",
      message: "Are sure you want to delete ?",
      buttons: [
        { name: "Yes", color: "primary", func: deleteOffer },
        { name: "No", color: "primary", func: () => {} },
      ],
    });
    setConfirmOpen(true);
  };
  return (
    <>
      <CustomModal
        open={confirmOpen}
        setOpen={setConfirmOpen}
        title={confirmContent.title}
        message={confirmContent.message}
        buttons={confirmContent.buttons}
      />

      <ModalWrapper
        open={wrapperOpen}
        setOpen={setWrapperOpen}
        maxWidth={1200}
        title=""
      >
        <Grid container>
          <Grid item xs={12} mt={3}>
            <FeeTemplateView
              feeTemplateId={feeTemplateId}
              candidateId={candidateId}
              type={3}
            />
          </Grid>
        </Grid>
      </ModalWrapper>
      <ModalWrapper
        open={modalOpen}
        setOpen={setModalOpen}
        maxWidth={700}
        title={candidateName}
      >
        <Grid container rowSpacing={2} mt={1}>
          <Grid item xs={12} md={4}>
            <CustomRadioButtons
              name="counselorStatus"
              label="Offer Status"
              value={values.counselorStatus}
              items={[
                {
                  value: 1,
                  label: "Yes",
                },
                {
                  value: 0,
                  label: "No",
                },
              ]}
              handleChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <CustomTextField
              name="counselorRemarks"
              label="Remarks"
              value={values.counselorRemarks}
              handleChange={handleChange}
              multiline
              rows={3}
            />
          </Grid>
          <Grid item xs={12} align="right">
            <Button
              variant="contained"
              size="small"
              onClick={() => handleCreate("status")}
            >
              Submit
            </Button>
          </Grid>
        </Grid>
      </ModalWrapper>

      <ModalWrapper
        open={linkOpen}
        setOpen={setLinkOpen}
        maxWidth={700}
        title={candidateName}
      >
        <Grid container rowSpacing={2} mt={1}>
          <Grid item xs={12}>
            <Typography>Link Expiry Date : </Typography>
          </Grid>
          <Grid item xs={12}>
            <CustomDatePicker
              name="linkExpiryDate"
              label="Valid Till"
              value={values.linkExpiryDate}
              handleChangeAdvance={handleChangeAdvance}
              disablePast
            />
          </Grid>
          <Grid item xs={12} align="right">
            <Button
              variant="contained"
              size="small"
              onClick={() => handleCreate("extend")}
            >
              Submit
            </Button>
          </Grid>
        </Grid>
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
