import { useState, useEffect, lazy } from "react";
import { Box, Grid, Button, CircularProgress } from "@mui/material";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import axios from "../../../services/Api";
import { useNavigate, useLocation } from "react-router-dom";
import useAlert from "../../../hooks/useAlert";
import FormWrapper from "../../../components/FormWrapper";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";
const ServiceTransportView = lazy(() => import("../../forms/myRequest/ServiceTransportView"));

const initialValues = {
  requestStatus: "",
  attendRemarks: "",
  allottedPersonName: "",
  allottedPersonNumber: "",
  active: true,
};

const requiredFields = ["requestStatus", "attendRemarks", "allottedPersonName", "allottedPersonNumber"];

function AttendServiceRequest() {
  const [values, setValues] = useState(initialValues);
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const rowData = location?.state?.row;
  const { setAlertMessage, setAlertOpen } = useAlert();
  const setCrumbs = useBreadcrumbs();
  const navigate = useNavigate();

  const checks = {
    allottedPersonName: [values.allottedPersonName !== ""],
    allottedPersonNumber: [values.allottedPersonNumber !== ""],
    requestStatus: [values.requestStatus !== ""],
    attendRemarks: [values.attendRemarks !== ""],
  };

  const errorMessages = {
    allottedPersonName: ["This field required"],
    allottedPersonNumber: ["This field required"],
    requestStatus: ["This field required"],
    attendRemarks: ["This field is required"],
  };

  useEffect(() => {
    setCrumbs([
      { name: "Service Render Transport", link: "/ServiceRenderTransport/AttendRequest" },
      { name: "Status Submission" }
    ]);
  }, []);

  const handleChangeAdvance = async (name, newValue) => {
    setValues((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const statusData = [
    { label: "Trip Cancelled By Transport Dept", value: "Trip Cancelled By Transport Dept" },
    { label: "Trip Cancelled By End User", value: "Trip Cancelled By End User" },
    { label: "Under Process", value: "UNDERPROCESS"},
    { label: "Trip Completed", value: "Trip Completed" }
  ];

  const handleChange = (e) => {
    if (e.target.name === "complaintStatus") {
      setValues((prev) => ({
        ...prev,
        [e.target.name]: e.target.value,
      }));
    } else {
      setValues((prev) => ({
        ...prev,
        [e.target.name]: e.target.value,
      }));
    }
  };

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

  const handleCreate = async (e) => {
    setLoading(true);
    const temp = {};
    temp.active = true;
    temp.request_status = values.requestStatus;
    temp.attending_remarks = values.attendRemarks;
    temp.transport_maintenance_id = rowData?.id;
    temp.alloted_person_name = values.allottedPersonName;
    temp.alloted_person_number = values.allottedPersonNumber;

    await axios
      .put(`/api/updateTransportMaintenance/${rowData?.id}`, temp)
      .then(async (res) => {
        setLoading(false);
        if (res.status === 200 || res.status === 201) {
          setAlertMessage({
            severity: "success",
            message: "Service request updated successfully",
          });
          navigate("/ServiceRenderTransport/AttendRequest", { replace: true });
        } else {
          setAlertMessage({
            severity: "error",
            message: res.data ? res.data.message : "Error Occured",
          });
        }
        setAlertOpen(true);
      })
      .catch((error) => {
        setLoading(false);
        setAlertMessage({
          severity: "error",
          message: error.response ? error.response.data.message : "Error",
        });
        setAlertOpen(true);
      });
  };

  return (
    <>
      <ServiceTransportView id={rowData?.id} />
      <Box component="form" overflow="hidden" p={1}>
        <FormWrapper>
          <Grid
            container
            rowSpacing={{ xs: 2, md: 4 }}
            columnSpacing={{ xs: 2, md: 4 }}
          >
            <Grid item xs={12} md={3}>
              <CustomAutocomplete
                name="requestStatus"
                label="Request Status"
                value={values.requestStatus}
                options={statusData}
                handleChangeAdvance={handleChangeAdvance}
                errors={errorMessages.requestStatus}
                checks={checks.requestStatus}
                required
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <CustomTextField
                name="allottedPersonName"
                label="Driver Name"
                value={values.allottedPersonName}
                handleChange={handleChange}
                fullWidth
                errors={errorMessages.allottedPersonName}
                checks={checks.allottedPersonName}
                required
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <CustomTextField
                name="allottedPersonNumber"
                label="Driver Number"
                value={values.allottedPersonNumber}
                handleChange={handleChange}
                fullWidth
                errors={errorMessages.allottedPersonNumber}
                checks={checks.allottedPersonNumber}
                required
                type="number"
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <CustomTextField
                name="attendRemarks"
                label="Remarks"
                value={values.attendRemarks}
                handleChange={handleChange}
                fullWidth
                errors={errorMessages.attendRemarks}
                checks={checks.attendRemarks}
                required
              />
            </Grid>

            <Grid item xs={12} align="right">
              <Button
                style={{ borderRadius: 7 }}
                variant="contained"
                color="primary"
                disabled={loading || !requiredFieldsValid()}
                onClick={handleCreate}
              >
                {loading ? (
                  <CircularProgress
                    size={25}
                    color="blue"
                    style={{ margin: "2px 13px" }}
                  />
                ) : (
                  "Submit"
                )}
              </Button>
            </Grid>
          </Grid>
        </FormWrapper>
      </Box>
    </>
  );
}

export default AttendServiceRequest;
