import { useState, useEffect } from "react";
import axios from "../../services/Api";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import {
  Avatar,
  Box,
  Button,
  Grid,
  IconButton,
  Stack,
  Tooltip,
  Typography,
  styled,
  tooltipClasses,
} from "@mui/material";
import GridIndex from "../../components/GridIndex";
import { Print } from "@mui/icons-material";
import { Visibility } from "@mui/icons-material";
import moment from "moment";
import { makeStyles } from "@mui/styles";
import useAlert from "../../hooks/useAlert";
import { GenerateScholarshipApplication } from "../forms/candidateWalkin/GenerateScholarshipApplication";
import OverlayLoader from "../../components/OverlayLoader";
import CustomAutocomplete from "../../components/Inputs/CustomAutocomplete";
import CancelIcon from "@mui/icons-material/Cancel";
import ModalWrapper from "../../components/ModalWrapper";
import CustomTextField from "../../components/Inputs/CustomTextField";

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

const useStyle = makeStyles((theme) => ({
  approved: {
    background: "#dcf7dd !important",
  },
  cancelled: {
    background: "#ebb5b5 !important",
  },
}));

const initialValues = { acyearId: null, cancelRemarks: "" };

function ScholarshipApproverHistory() {
  const [values, setValues] = useState(initialValues);
  const [rows, setRows] = useState([]);
  const [printLoading, setPrintLoading] = useState(false);
  const [academicYearOptions, setAcademicYearOptions] = useState([]);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [rowData, setrowData] = useState([]);

  const setCrumbs = useBreadcrumbs();
  const { setAlertMessage, setAlertOpen } = useAlert();

  const maxLength = 150;

  const classes = useStyle();

  useEffect(() => {
    getAcademicYears();
    setCrumbs([{ name: "Scholarship Report" }]);
  }, []);

  useEffect(() => {
    getData();
  }, [values.acyearId]);

  const getAcademicYears = async () => {
    try {
      const response = await axios.get("/api/academic/academic_year");
      const optionData = [];
      const ids = [];
      response.data.data.forEach((obj) => {
        optionData.push({ value: obj.ac_year_id, label: obj.ac_year });
        ids.push(obj.current_year);
      });
      const latestYear = Math.max(...ids);
      const latestYearId = response.data.data.filter(
        (obj) => obj.current_year === latestYear
      );
      setAcademicYearOptions(optionData);
      setValues((prev) => ({
        ...prev,
        acyearId: latestYearId[0].ac_year_id,
      }));
    } catch (err) {
      setAlertMessage({
        severity: "error",
        message: "Failed to fetch the academic years !!",
      });
      setAlertOpen(true);
    }
  };

  const getData = async () => {
    const { acyearId } = values;
    if (!acyearId) return;

    try {
      const response = await axios.get(
        `/api/student/getIsApprovedDataForIndex/${acyearId}`,
        {
          params: { page: 0, page_size: 10000, sort: "created_date" },
        }
      );

      setRows(response.data.data);
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

  const handleGeneratePrint = async (data) => {
    try {
      setPrintLoading(true);
      const response = await axios.get(
        "/api/student/getStudentDetailsBasedOnAuidAndStrudentId",
        { params: { auid: data.auid } }
      );
      const studentData = response.data.data[0];

      const schResponse = await axios.get(
        `/api/student/fetchScholarship2/${data.id}`
      );
      const schData = schResponse.data.data[0];

      const blobFile = await GenerateScholarshipApplication(
        studentData,
        schData
      );

      if (blobFile) {
        window.open(URL.createObjectURL(blobFile));
      } else {
        setAlertMessage({
          severity: "error",
          message: "Failed to generate scholarship application print !!",
        });
        setAlertOpen(true);
      }
    } catch (err) {
      setAlertMessage({
        severity: "error",
        message:
          err.response?.data?.message ||
          "Failed to generate scholarship application print !!",
      });
      setAlertOpen(true);
    } finally {
      setPrintLoading(false);
    }
  };

  const getRowClassName = (params) => {
    if (params.row.is_approved === "yes") {
      return classes.approved;
    } else if (params.row.is_approved === "no") {
      return classes.cancelled;
    }
  };

  const AvatarCells = ({ color }) => (
    <Avatar variant="square" sx={{ width: 20, height: 20, bgcolor: color }}>
      <Typography variant="subtitle2"></Typography>
    </Avatar>
  );

  const AvatarLabelCells = ({ label }) => (
    <Typography variant="body2" color="textSecondary">
      {label}
    </Typography>
  );

  const handleChange = (e) => {
    setValues((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleChangeAdvance = async (name, newValue) => {
    setValues((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const getRemainingCharacters = (field) => maxLength - values[field].length;

  const openCancelModal = async (data) => {
    setrowData(data);
    setCancelModalOpen(true);
  };

  const handleCreate = async () => {};

  const columns = [
    {
      field: "student_name",
      headerName: "Student Name",
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
      field: "requested_scholarship",
      headerName: "Requested",
      flex: 1,
    },
    {
      field: "username",
      headerName: "Requested By",
      flex: 1,
      renderCell: (params) => (
        <HtmlTooltip
          title={
            <Box>
              <Typography variant="body2">{params.row.requested_by}</Typography>
              <Typography variant="body2">
                {moment(params.row.requested_date).format("DD-MM-YYYY")}
              </Typography>
            </Box>
          }
        >
          <span>{params.row.requested_by}</span>
        </HtmlTooltip>
      ),
    },
    {
      field: "verified_amount",
      headerName: "Verified",
      flex: 1,
    },
    {
      field: "verified_name",
      headerName: "Verified By",
      flex: 1,
      renderCell: (params) => (
        <HtmlTooltip
          title={
            <Box>
              <Typography variant="body2">
                {params.row.verified_name}
              </Typography>
              <Typography variant="body2">
                {moment(params.row.verified_date).format("DD-MM-YYYY")}
              </Typography>
            </Box>
          }
        >
          <span>{params.row.verified_name}</span>
        </HtmlTooltip>
      ),
    },
    {
      field: "approved_amount",
      headerName: "Approved",
      flex: 1,
    },
    {
      field: "approved_by_name",
      headerName: "Approved By",
      flex: 1,
      renderCell: (params) => (
        <HtmlTooltip
          title={
            <Box>
              <Typography variant="body2">
                {params.row.approved_by_name}
              </Typography>
              <Typography variant="body2">
                {moment(params.row.approved_date).format("DD-MM-YYYY")}
              </Typography>
            </Box>
          }
        >
          <span>{params.row.approved_by_name}</span>
        </HtmlTooltip>
      ),
    },
    {
      field: "scholarship_attachment_path",
      headerName: "Attachment",
      flex: 1,
      renderCell: (params) => (
        <IconButton
          onClick={() => handleDownload(params.row.scholarship_attachment_path)}
          sx={{ padding: 0 }}
        >
          <Visibility color="primary" />
        </IconButton>
      ),
    },
    {
      field: "comments",
      headerName: "Remarks",
      flex: 1,
      renderCell: (params) =>
        params?.row?.comments?.length > 10 ? (
          <HtmlTooltip title={params.row.comments}>
            <span>{params.row.comments.substr(0, 10) + " ...."}</span>
          </HtmlTooltip>
        ) : (
          params.row.comments
        ),
    },
    {
      field: "is_approved",
      headerName: "Print",
      flex: 1,
      renderCell: (params) =>
        params.row.is_approved === "yes" ? (
          <IconButton
            onClick={() => handleGeneratePrint(params.row)}
            sx={{ padding: 0 }}
          >
            <Print color="primary" />
          </IconButton>
        ) : params.row.is_approved === "no" ? (
          <HtmlTooltip
            title={
              <Box>
                <Typography variant="body2">
                  {params.row.approved_by_name}
                </Typography>
                <Typography variant="body2">
                  {moment(params.row.approved_date).format("DD-MM-YYYY")}
                </Typography>
              </Box>
            }
          >
            <span>{params.row.approved_by_name}</span>
          </HtmlTooltip>
        ) : (
          ""
        ),
    },
    {
      field: "userId",
      headerName: "Cancel",
      flex: 1,
      renderCell: (params) => (
        <IconButton
          onClick={() => openCancelModal(params.row)}
          sx={{ padding: 0 }}
        >
          <CancelIcon sx={{ color: "red" }} />
        </IconButton>
      ),
    },
  ];

  return (
    <>
      {printLoading && <OverlayLoader />}

      <ModalWrapper
        maxWidth={800}
        open={cancelModalOpen}
        setOpen={setCancelModalOpen}
        title={`${rowData.student_name} - Cancel Scholarship`}
      >
        <Box sx={{ padding: 2 }}>
          <Grid container rowSpacing={4}>
            <Grid item xs={12}>
              <CustomTextField
                name="cancelRemarks"
                label="Remarks"
                value={values.cancelRemarks}
                handleChange={handleChange}
                helperText={`Remaining characters : ${getRemainingCharacters(
                  "cancelRemarks"
                )}`}
                multiline
              />
            </Grid>

            <Grid item xs={12} align="right">
              <Button
                variant="contained"
                color="error"
                disabled={values.cancelRemarks === ""}
                onClick={handleCreate}
              >
                Cancel
              </Button>
            </Grid>
          </Grid>
        </Box>
      </ModalWrapper>

      <Box sx={{ marginTop: { md: -5 } }}>
        <Grid container justifyContent="flex-end">
          <Grid item xs={12} md={3}>
            <Stack
              direction="row"
              spacing={1}
              justifyContent={{ md: "right" }}
              sx={{ marginRight: 2, marginBottom: 2 }}
              alignItems="center"
            >
              <AvatarCells color="#dcf7dd" />
              <AvatarLabelCells label="Approved" />
              <AvatarCells color="#ef9a9a" />
              <AvatarLabelCells label="Rejected" />
            </Stack>
          </Grid>

          <Grid item xs={12} md={2}>
            <CustomAutocomplete
              name="acyearId"
              options={academicYearOptions}
              value={values.acyearId}
              handleChangeAdvance={handleChangeAdvance}
              required
            />
          </Grid>
        </Grid>
      </Box>

      <Box sx={{ marginTop: { xs: 10, md: 3 } }}>
        <GridIndex
          rows={rows}
          columns={columns}
          getRowClassName={getRowClassName}
        />
      </Box>
    </>
  );
}

export default ScholarshipApproverHistory;
