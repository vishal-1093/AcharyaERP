import { useState, useEffect } from "react";
import { Box, Grid, Button, CircularProgress } from "@mui/material";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import axios from "../../../services/Api";
import { useNavigate, useLocation } from "react-router-dom";
import useAlert from "../../../hooks/useAlert";
import FormWrapper from "../../../components/FormWrapper";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";

const initialValues = {
  complaintStage: "NONCRITICAL",
  complaintStatus: "",
  active: true,
  remarks: "",
};
const requiredFields = ["complaintStage", "complaintStatus", "remarks"];

function AttendServiceRequest() {
  const [values, setValues] = useState(initialValues);
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const userId = JSON.parse(sessionStorage.getItem("AcharyaErpUser"))?.userId;
  const rowData = location?.state?.row;
  const { setAlertMessage, setAlertOpen } = useAlert();
  const setCrumbs = useBreadcrumbs();
  const navigate = useNavigate();
  const checks = {
    complaintStage: [values.complaintStage !== ""],
    complaintStatus: [values.complaintStatus !== ""],
    remarks: [values.remarks !== ""],
  };

  const errorMessages = {
    complaintStage: ["This field required"],
    complaintStatus: ["This field required"],
    remarks: ["This field is required"],
  };

  useEffect(() => {
    getServiceRequest();

    setCrumbs([
      { name: "Service Render", link: "/ServiceRender/AttendRequest" },
      { name: `${rowData?.serviceTypeName}` },
    ]);
  }, []);

  const getServiceRequest = async () => {
    await axios
      .get(`/api/Maintenance/getServiceTypeDetailsById/${rowData.id}`)
      .then((res) => {
        setValues((prev) => ({
          ...prev,
          complaintStage: res.data.data.complaintStage,
          complaintStatus: res.data.data.complaintStatus,
          remarks: res.data.data.remarks,
        }));
      })
      .catch((err) => console.error(err));
  };

  const handleChangeAdvance = async (name, newValue) => {
    setValues((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const statusData = [
    { label: "Pending", value: "PENDING" },
    { label: "Under Process", value: "UNDERPROCESS" },
    { label: "Completed", value: "COMPLETED" },
  ];
  const stageData = [
    { label: "Critical", value: "CRITICAL" },
    { label: "Non-Critical", value: "NONCRITICAL" },
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
    if (!requiredFieldsValid()) {
      setAlertMessage({
        severity: "error",
        message: "Please fill all fields",
      });
      setAlertOpen(true);
    } else {
      setLoading(true);
      const temp = {};
      temp.active = true;
      temp.id = rowData?.id;
      temp.complaintStage = values.complaintStage;
      temp.complaintStatus = values.complaintStatus;
      temp.remarks = values.remarks;
      temp.complaintAttendedBy = userId;
      temp.dateOfClosed =
        values.complaintStatus === "COMPLETED" ? new Date() : null;

      await axios
        .put(`/api/Maintenance/${rowData?.id}`, temp)
        .then(async (res) => {
          setLoading(false);
          if (res.status === 200 || res.status === 201) {
            setAlertMessage({
              severity: "success",
              message: "Service Request Updated",
            });
            navigate("/ServiceRender", { replace: true });
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
    }
  };

  return (
    <Box component="form" overflow="hidden" p={1}>
      <FormWrapper>
        <Grid
          container
          rowSpacing={{ xs: 2, md: 4 }}
          columnSpacing={{ xs: 2, md: 4 }}
        >
          <Grid item xs={12} md={3}>
            <CustomAutocomplete
              name="complaintStage"
              label="Request Stage"
              value={values.complaintStage}
              options={stageData}
              handleChangeAdvance={handleChangeAdvance}
              errors={errorMessages.complaintStage}
              checks={checks.complaintStage}
              required
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <CustomAutocomplete
              name="complaintStatus"
              label="Request Status"
              value={values.complaintStatus}
              options={statusData}
              handleChangeAdvance={handleChangeAdvance}
              errors={errorMessages.complaintStatus}
              checks={checks.complaintStatus}
              required
            />
          </Grid>
          {/* <Grid item xs={12} md={3}>
            <CustomTextField
              name="complaintStatus"
              label="Complaint Status"
              value={values.complaintStatus}
              handleChange={handleChange}
              inputProps={{
                style: { textTransform: "uppercase" },
              
              }}
              fullWidth 
              errors={errorMessages.complaintStatus}
              checks={checks.complaintStatus}
              required
            />
          </Grid> */}

          <Grid item xs={12} md={3}>
            <CustomTextField
              name="remarks"
              label="Remarks"
              value={values.remarks}
              handleChange={handleChange}
              fullWidth
              errors={errorMessages.remarks}
              checks={checks.remarks}
              required
            />
          </Grid>

          <Grid item xs={12} align="right">
            <Button
              style={{ borderRadius: 7 }}
              variant="contained"
              color="primary"
              disabled={loading}
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
  );
}

export default AttendServiceRequest;
