import { lazy, useEffect, useState } from "react";
import axios from "../../../services/Api";
import { Box, Button, CircularProgress, Grid, Stack } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import FormPaperWrapper from "../../../components/FormPaperWrapper";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import StudentFeeDetails from "../../../components/StudentFeeDetails";
import useAlert from "../../../hooks/useAlert";
import moment from "moment";

const StudentDetails = lazy(() => import("../../../components/StudentDetails"));
const StudentTranscriptDetails = lazy(() =>
  import("../../../components/StudentTranscriptDetails")
);

const breadCrumbs = [
  { name: "Cancel Admissions", link: "/approve-canceladmission" },
  { name: "Approve" },
];

const initialValues = { remarks: "" };

const requiredFields = ["remarks"];

const userId = JSON.parse(sessionStorage.getItem("AcharyaErpUser"))?.userId;

function ApproveCancelAdmission() {
  const [values, setValues] = useState(initialValues);
  const [cancelAdmissionData, setCancelAdmissionData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);

  const { studentId, cancelId } = useParams();
  const setCrumbs = useBreadcrumbs();
  const { setAlertMessage, setAlertOpen } = useAlert();
  const navigate = useNavigate();

  const maxLength = 100;

  const checks = {
    remarks: [values.remarks !== ""],
  };

  const errorMessages = {
    remarks: ["This field is required"],
  };

  useEffect(() => {
    setCrumbs(breadCrumbs);
    getCancelAdmissionData();
  }, []);

  const getCancelAdmissionData = async () => {
    try {
      const response = await axios.get(`/api/getCancelAdmission/${cancelId}`);
      setCancelAdmissionData(response.data.data);
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "An unknown error occurred";
      setAlertMessage({
        severity: "error",
        message: errorMessage,
      });
      setAlertOpen(true);
    }
  };

  const handleChange = (e) => {
    if (e.target.value.length > maxLength) {
      return;
    }
    setValues((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const getRemainingCharacters = (field) => maxLength - values[field].length;

  const requiredFieldsValid = () => {
    for (let i = 0; i < requiredFields.length; i++) {
      const field = requiredFields[i];
      if (Object.keys(checks).includes(field)) {
        const ch = checks[field];
        for (let j = 0; j < ch.length; j++) if (!ch[j]) return false;
      } else if (!values[field]) return false;
    }
    return true;
  };

  const handleApprove = async () => {
    try {
      setIsLoading(true);
      const data = { ...cancelAdmissionData };
      data.approved_by = userId;
      data.approved_date = moment();
      data.approved_remarks = values.remarks;
      const response = await axios.put(
        `/api/updateCancelAdmissions/${cancelId}`,
        data
      );
      if (response.status === 200 || response.status === 201) {
        setAlertMessage({
          severity: "success",
          message: "Admission cancellation has been successfully approved !!",
        });
        navigate("/approve-canceladmission");
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "An unknown error occurred";
      setAlertMessage({
        severity: "error",
        message: errorMessage,
      });
    } finally {
      setAlertOpen(true);
      setIsLoading(false);
    }
  };

  const handleReject = async () => {
    try {
      setCancelLoading(true);
      const data = { ...cancelAdmissionData };
      data.rejected_by = userId;
      data.rejected_date = moment();
      data.rejected_remarks = values.remarks;
      const response = await axios.put(
        `/api/updateCancelAdmissions/${cancelId}`,
        data
      );
      if (response.status === 200 || response.status === 201) {
        setAlertMessage({
          severity: "success",
          message:
            "Admission cancellation request has been successfully rejected !!",
        });
        navigate("/approve-canceladmission");
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "An unknown error occurred";
      setAlertMessage({
        severity: "error",
        message: errorMessage,
      });
    } finally {
      setAlertOpen(true);
      setCancelLoading(false);
    }
  };

  return (
    <Box
      sx={{
        margin: {
          xs: "20px 0px 0px 0px",
          md: "15px 15px 0px 15px",
          lg: "20px 80px 0px 80px",
        },
      }}
    >
      <FormPaperWrapper>
        <Grid container rowSpacing={4} columnSpacing={2}>
          <Grid item xs={12}>
            <StudentDetails id={studentId} />
          </Grid>

          <Grid item xs={12}>
            <StudentTranscriptDetails id={studentId} />
          </Grid>

          <Grid item xs={12}>
            <StudentFeeDetails id={studentId} />
          </Grid>

          <Grid item xs={12} md={6}>
            <CustomTextField
              name="remarks"
              label="Remarks"
              value={values.remarks}
              handleChange={handleChange}
              checks={checks.remarks}
              errors={errorMessages.remarks}
              helperText={`Remaining characters : ${getRemainingCharacters(
                "remarks"
              )}`}
              multiline
            />
          </Grid>

          <Grid item xs={12} align="right">
            <Stack justifyContent="right" direction="row" spacing={2}>
              <Button
                variant="contained"
                onClick={handleApprove}
                color="success"
                disabled={isLoading || !requiredFieldsValid()}
              >
                {isLoading ? (
                  <CircularProgress
                    size={25}
                    color="blue"
                    style={{ margin: "2px 13px" }}
                  />
                ) : (
                  "Approve"
                )}
              </Button>

              <Button
                variant="contained"
                onClick={handleReject}
                color="error"
                disabled={cancelLoading || !requiredFieldsValid()}
              >
                {cancelLoading ? (
                  <CircularProgress
                    size={25}
                    color="blue"
                    style={{ margin: "2px 13px" }}
                  />
                ) : (
                  "Reject"
                )}
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </FormPaperWrapper>
    </Box>
  );
}

export default ApproveCancelAdmission;
