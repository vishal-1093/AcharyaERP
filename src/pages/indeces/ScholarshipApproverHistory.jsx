import { useState, useEffect, lazy } from "react";
import axios from "../../services/Api";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import {
  Avatar,
  Box,
  Grid,
  IconButton,
  Stack,
  Typography,
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
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate } from "react-router-dom";

const CancelScholarship = lazy(() =>
  import("../forms/candidateWalkin/CancelScholarship")
);

const useStyle = makeStyles((theme) => ({
  approved: {
    background: "#dcf7dd !important",
  },
  cancelled: {
    background: "#ebb5b5 !important",
  },
}));

const roleShortName = JSON.parse(
  sessionStorage.getItem("AcharyaErpUser")
)?.roleShortName;

const initialValues = { acyearId: null, cancelRemarks: "" };

function ScholarshipApproverHistory() {
  const [values, setValues] = useState(initialValues);
  const [rows, setRows] = useState([]);
  const [academicYearOptions, setAcademicYearOptions] = useState([]);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [rowData, setRowData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const setCrumbs = useBreadcrumbs();
  const { setAlertMessage, setAlertOpen } = useAlert();
  const navigate = useNavigate();

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

  const getRowClassName = (params) => {
    if (params.row.is_approved === "yes" && !params.row.cancel_date) {
      return classes.approved;
    } else if (params.row.is_approved === "no" || params.row.cancel_date) {
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

  const handleChangeAdvance = async (name, newValue) => {
    setValues((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const openCancelModal = async (data) => {
    setRowData(data);
    setCancelModalOpen(true);
  };

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
      field: "requested_by",
      headerName: "Requested By",
      flex: 1,
      hide: true,
    },
    {
      field: "requested_date",
      headerName: "Requested Date",
      hide: true,
      flex: 1,
      valueGetter: (value, row) => moment(value).format("DD-MM-YYYY LT"),
    },
    {
      field: "requested_scholarship",
      headerName: "Requested Amount",
      flex: 1,
    },
    {
      field: "requestedByRemarks",
      headerName: "Requested Remarks",
      flex: 1,
      hide: true,
    },
    {
      field: "verified_name",
      headerName: "Verified By",
      hide: true,
      flex: 1,
    },
    {
      field: "verified_date",
      headerName: "Verified Date",
      hide: true,
      flex: 1,
      valueGetter: (value, row) => moment(value).format("DD-MM-YYYY LT"),
    },
    {
      field: "verified_amount",
      headerName: "Verified Amount",
      flex: 1,
    },
    {
      field: "verifier_remarks",
      headerName: "Verifier Remarks",
      flex: 1,
      hide: true,
    },
    {
      field: "approved_by_name",
      headerName: "Approved By",
      flex: 1,
    },
    {
      field: "approved_date",
      headerName: "Approved Date",
      flex: 1,
      valueGetter: (value, row) => moment(value).format("DD-MM-YYYY LT"),
    },
    {
      field: "approved_amount",
      headerName: "Approved Amount",
      flex: 1,
    },
    {
      field: "comments",
      headerName: "Approver Remarks",
      flex: 1,
      hide: true,
    },
    {
      field: "cancelByUsername",
      headerName: "Cancelled By",
      hide: true,
      flex: 1,
    },
    {
      field: "cancel_date",
      headerName: "Cancelled Date",
      hide: true,
      flex: 1,
      valueGetter: (value, row) =>
        value ? moment(value).format("DD-MM-YYYY LT") : "",
    },
    {
      field: "cancel_remarks",
      headerName: "Cancelled Remarks",
      flex: 1,
      hide: true,
    },
    {
      field: "scholarship_attachment_path",
      headerName: "Attachment",
      hide: true,
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
      field: "is_approved",
      headerName: "Print",
      hide: true,
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
    {
      field: "userId",
      headerName: "Cancel",
      flex: 1,
      renderCell: (params) =>
        params.row.cancel_date ? (
          "Cancelled"
        ) : (
          <IconButton
            onClick={() => openCancelModal(params.row)}
            sx={{ padding: 0 }}
          >
            <CancelIcon sx={{ color: "red" }} />
          </IconButton>
        ),
    },
  ];

  if (roleShortName === "SAA") {
    columns.push({
      field: "approved_by",
      headerName: "Update",
      flex: 1,
      renderCell: (params) => (
        <IconButton
          onClick={() =>
            navigate(
              `/update-scholarship/${params.row.auid}/${params.row.scholarship_id}`
            )
          }
          sx={{ padding: 0 }}
        >
          <EditIcon color="primary" sx={{ fontSize: 20 }} />
        </IconButton>
      ),
    });
  }

  return (
    <>
      <ModalWrapper
        maxWidth={800}
        open={cancelModalOpen}
        setOpen={setCancelModalOpen}
        title={`${rowData.student_name} - Cancel Scholarship`}
      >
        <CancelScholarship
          rowData={rowData}
          setAlertMessage={setAlertMessage}
          setAlertOpen={setAlertOpen}
          getData={getData}
          setCancelModalOpen={setCancelModalOpen}
        />
      </ModalWrapper>

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
      )}
    </>
  );
}

export default ScholarshipApproverHistory;
