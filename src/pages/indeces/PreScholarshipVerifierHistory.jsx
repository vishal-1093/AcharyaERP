import { useState, useEffect, lazy } from "react";
import axios from "../../services/Api";
import {
  Avatar,
  Box,
  Grid,
  IconButton,
  Stack,
  Tooltip,
  Typography,
  styled,
  tooltipClasses,
} from "@mui/material";
import GridIndex from "../../components/GridIndex";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import moment from "moment";
import { Visibility } from "@mui/icons-material";
import useAlert from "../../hooks/useAlert";
import { GenerateScholarshipApplication } from "../forms/candidateWalkin/GenerateScholarshipApplication";
import { Print } from "@mui/icons-material";
import CustomAutocomplete from "../../components/Inputs/CustomAutocomplete";
import { makeStyles } from "@mui/styles";

const OverlayLoader = lazy(() => import("../../components/OverlayLoader"));

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
  { name: "Verify Scholarship", link: "/scholarship" },
  { name: "History" },
];

const initialValues = { acyearId: null };

const useStyle = makeStyles((theme) => ({
  approved: {
    background: "#dcf7dd !important",
  },
  cancelled: {
    background: "#ebb5b5 !important",
  },
}));

function PreScholarshipVerifierHistory() {
  const [values, setValues] = useState(initialValues);
  const [academicYearOptions, setAcademicYearOptions] = useState([]);
  const [rows, setRows] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const setCrumbs = useBreadcrumbs();
  const { setAlertMessage, setAlertOpen } = useAlert();
  const classes = useStyle();

  useEffect(() => {
    getAcademicYears();
    setCrumbs(breadCrumbsList);
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
        "/api/student/fetchScholarshipDetailsForVerified",
        {
          params: {
            ac_year_id: acyearId,
            page: 0,
            page_size: 10000,
            sort: "created_date",
          },
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
      setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  };

  const handleGeneratePrint = async (data) => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        "/api/student/getStudentDetailsBasedOnAuidAndStrudentId",
        { params: { auid: data.auid } }
      );
      const studentData = response.data.data[0];

      const schResponse = await axios.get(
        `/api/student/fetchScholarship2/${data.scholarship_id}`
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
      setIsLoading(false);
    }
  };

  const handleChangeAdvance = async (name, newValue) => {
    setValues((prev) => ({
      ...prev,
      [name]: newValue,
    }));
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

  const getRowClassName = (params) => {
    if (params.row.is_verified === "yes") {
      return classes.approved;
    } else if (params.row.is_verified === "no") {
      return classes.cancelled;
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
      field: "candidate_name",
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
      field: "program_short_name",
      headerName: "Program",
      flex: 1,
      hideable: false,
      renderCell: (params) =>
        `${params.row.program_short_name} - ${params.row.program_specialization_short_name}`,
    },
    {
      field: "requested_scholarship",
      headerName: "Requested Amount",
      flex: 1,
    },
    {
      field: "created_username",
      headerName: "Requested By",
      flex: 1,
      hide: true,
    },
    {
      field: "created_date",
      headerName: "Requested Date",
      flex: 1,
      hide: true,
      valueGetter: (params) => moment(params?.value).format("DD-MM-YYYY LT"),
    },
    {
      field: "requestedByRemarks",
      headerName: "Requested Remarks",
      flex: 1,
      hide: true,
    },
    {
      field: "verified_amount",
      headerName: "Verified Amount",
      flex: 1,
    },
    {
      field: "verifiedName",
      headerName: "Verified By",
      flex: 1,
      hide: true,
    },
    {
      field: "verified_date",
      headerName: "Verified Date",
      flex: 1,
      hide: true,
      valueGetter: (params) => moment(params?.value).format("DD-MM-YYYY LT"),
    },
    {
      field: "verifier_remarks",
      headerName: "Verifier Remarks",
      flex: 1,
      hide: true,
    },
    {
      field: "scholarship_attachment_path",
      headerName: "Document",
      flex: 1,
      renderCell: (params) => (
        <IconButton
          title="Download the document"
          onClick={() => handleDownload(params.row.scholarship_attachment_path)}
          sx={{ padding: 0 }}
        >
          <Visibility color="primary" sx={{ fontSize: 20 }} />
        </IconButton>
      ),
    },
    {
      field: "id",
      headerName: "Application Print",
      flex: 1,
      renderCell: (params) => (
        <IconButton
          onClick={() => handleGeneratePrint(params.row)}
          sx={{ padding: 0 }}
        >
          <Print color="primary" />
        </IconButton>
      ),
    },
  ];

  return (
    <>
      {isLoading ? (
        <OverlayLoader />
      ) : (
        <>
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
                  <AvatarLabelCells label="Verified" />
                  <AvatarCells color="#ef9a9a" />
                  <AvatarLabelCells label="Cancelled" />
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
      )}
    </>
  );
}

export default PreScholarshipVerifierHistory;
