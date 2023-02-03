import { useState, useEffect } from "react";
import { Box, Button, Grid, IconButton, Typography } from "@mui/material";
import GridIndex from "../../components/GridIndex";
import { useNavigate } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import axios from "../../services/Api";
import { Link } from "react-router-dom";
import AddBoxIcon from "@mui/icons-material/AddBox";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import ModalWrapper from "../../components/ModalWrapper";
import VisibilityIcon from "@mui/icons-material/Visibility";
import FeeTemplateView from "../../components/FeeTemplateView";
import CustomRadioButtons from "../../components/Inputs/CustomRadioButtons";
import CustomTextField from "../../components/Inputs/CustomTextField";
import useAlert from "../../hooks/useAlert";
import CustomDatePicker from "../../components/Inputs/CustomDatePicker";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";

const initValues = {
  counselorStatus: "",
  counselorRemarks: "",
  linkExpiryDate: null,
};

function CandidateWalkinIndex() {
  const [values, setValues] = useState(initValues);
  const [rows, setRows] = useState([]);
  const [feeTemplateId, setFeeTemplateId] = useState();
  const [candidateId, setCandidateId] = useState();
  const [wrapperOpen, setWrapperOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [candidateName, setCandidateName] = useState();
  const [linkOpen, setLinkOpen] = useState(false);

  const setCrumbs = useBreadcrumbs();
  const navigate = useNavigate();
  const { setAlertMessage, setAlertOpen } = useAlert();

  const columns = [
    { field: "id", headerName: "Candidate Id", flex: 1 },
    { field: "candidate_name", headerName: "Name", width: 200 },
    { field: "application_no_npf", headerName: "Application No", width: 100 },
    { field: "mobile_number", headerName: " Mobile", flex: 1 },
    { field: "candidate_email", headerName: " Email", flex: 1 },

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

      renderCell: (params) => {
        return (
          <>
            {params.row.is_verified ? (
              <IconButton
                style={{ color: "#4A57A9", textAlign: "center" }}
                onClick={() => navigate(`/offerletterview/${params.row.id}`)}
              >
                <VisibilityIcon />
              </IconButton>
            ) : params.row.is_scholarship ? (
              <>
                <IconButton
                  style={{ color: "#4A57A9", textAlign: "center" }}
                  onClick={() => handleWrapper(params.row)}
                >
                  <DescriptionOutlinedIcon />
                </IconButton>
                <Typography variant="body2">Pending</Typography>
              </>
            ) : params.row.fee_template_id ? (
              <Link to={`/PreAdmissionProcessForm/${params.row.id}`}>
                <IconButton style={{ color: "#4A57A9", textAlign: "center" }}>
                  <DescriptionOutlinedIcon />
                </IconButton>
              </Link>
            ) : (
              <Link to={`/PreAdmissionProcessForm/${params.row.id}`}>
                <IconButton style={{ color: "#4A57A9", textAlign: "center" }}>
                  <AddBoxIcon />
                </IconButton>
              </Link>
            )}
          </>
        );
      },
    },
    {
      field: "username",
      headerName: "Offer Created By",
      flex: 1,
    },
    {
      field: "npf_status",
      headerName: "Counselor Status",
      flex: 1,

      renderCell: (params) => {
        return (
          <>
            {params.row.fee_template_id &&
            params.row.is_verified === null &&
            params.row.counselor_status === null ? (
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
            {params.row.counselor_status ? (
              <IconButton
                style={{ color: "#4A57A9", textAlign: "center" }}
                onClick={() => navigate(`/auidformstepper/${params.row.id}`)}
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
        `/api/student/EditCandidateDetails?page=${0}&page_size=${100}&sort=created_date`
      )
      .then((res) => {
        setRows(Response.data.data.Paginated_data.content);
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

  const handleCreate = async () => {
    await axios
      .get(`/api/student/Candidate_Walkin/${candidateId}`)
      .then((res) => {
        const data = res.data.data;
        data.counselor_status = values.counselorStatus;
        data.counselor_remarks = values.counselorRemarks;

        axios
          .put(`/api/student/Candidate_Walkin/${candidateId}`, data)
          .then((res) => {
            setAlertMessage({
              severity: "success",
              message: "Offer status updated sucessfully !!",
            });
            setAlertOpen(true);
          })
          .catch((err) => console.error(err));
      })
      .catch((err) => console.error(err));
    setWrapperOpen(false);
  };
  return (
    <>
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
            <Button variant="contained" size="small" onClick={handleCreate}>
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
            />
          </Grid>
          <Grid item xs={12} align="right">
            <Button variant="contained" size="small" onClick={handleCreate}>
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
