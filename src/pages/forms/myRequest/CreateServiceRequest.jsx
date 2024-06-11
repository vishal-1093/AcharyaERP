import { useState, useEffect } from "react";
import { Box, Grid, Button, CircularProgress } from "@mui/material";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import axios from "../../../services/Api";
import { useNavigate, useParams } from "react-router-dom";
import useAlert from "../../../hooks/useAlert";
import FormWrapper from "../../../components/FormWrapper";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";

const initialValues = {
  serviceTypeId: "",
  complaintDetails: "",
  active: true,
  floorAndExtension: "",
  deptId: "",
};
const requiredFields = [
  "serviceTypeId",
  "complaintDetails",
  "floorAndExtension",
];

function CreateServiceReqForm() {
  const [showField, setShowField] = useState(false);
  const [values, setValues] = useState(initialValues);
  const [deptId, setDeptId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [serviceData, setServiceData] = useState([]);
  const [department, setDepartment] = useState([]);
  const userId = JSON.parse(sessionStorage.getItem("AcharyaErpUser"))?.userId;

  const { id } = useParams();
  const empId = sessionStorage.getItem("empId");

  const { setAlertMessage, setAlertOpen } = useAlert();
  const setCrumbs = useBreadcrumbs();
  const navigate = useNavigate();
  const checks = {
    serviceTypeId: [values.serviceTypeId !== ""],
    complaintDetails: [values.complaintDetails !== ""],
    floorAndExtension: [values.floorAndExtension !== ""],
  };

  const errorMessages = {
    serviceTypeId: ["This field required"],
    complaintDetails: ["This field required"],
    floorAndExtension: ["This field is required"],
  };

  useEffect(() => {
    getServiceType();
    setCrumbs([
      { name: "Service Request", link: "/ServiceRequest" },
      { name: "Create" },
    ]);
  }, []);

  useEffect(() => {
    if (values.serviceTypeId) {
      getDeptDataByService(values.serviceTypeId);
    }
  }, [values.serviceTypeId]);
  useEffect(() => {
    if (department) {
      setDeptId(department);
      setShowField(true);
    }
  }, [department]);

  const getDeptDataByService = async (id) => {
    await axios
      .get(`/api/ServiceType/getAllServiceTypeById/${id}`)
      .then((res) => {
        setDepartment({
          value: res?.data?.data[0]?.dept_id,
          label: res?.data?.data[0]?.dept_name,
        });
      })
      .catch((err) => console.error(err));
  };

  const handleChangeAdvance = async (name, newValue) => {
    setValues((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleChange = (e) => {
    setValues((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
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

  const getServiceType = async () => {
    await axios
      .get(`/api/ServiceType/getAllActiveServiceType`)
      .then((res) => {
        setServiceData(
          res.data.data?.map((obj) => ({
            value: obj.id,
            label: obj.serviceTypeName,
          }))
        );
      })
      .catch((error) => console.error(error));
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
      temp.floorAndExtension = values.floorAndExtension;
      temp.complaintDetails = values.complaintDetails;
      temp.attendedBy = null;
      temp.userId = userId;
      temp.serviceTypeId = values.serviceTypeId;
      temp.complaintStage = "";
      temp.complaintStatus = "PENDING";
      temp.remarks = values.remarks;
      temp.purchaseNeed = null;
      temp.dateOfAttended = null;
      temp.complaintAttendedBy = null;
      temp.dateOfClosed = null;
      temp.instituteId = 1;
      temp.branchId = null;
      await axios
        .post(`/api/Maintenance`, temp)
        .then(async (res) => {
          setLoading(false);
          if (res.status === 200 || res.status === 201) {
            navigate("/ServiceRequest", { replace: true });
            setAlertMessage({
              severity: "success",
              message: "Service Request Created",
            });
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
              name="serviceTypeId"
              label="Service Type"
              value={values.serviceTypeId}
              options={serviceData}
              handleChangeAdvance={handleChangeAdvance}
              required
            />
          </Grid>

          {deptId?.label && (
            <Grid item xs={12} md={3}>
              <CustomTextField
                name="deptId"
                label=""
                value={deptId?.label}
                disabled={true}
              />
            </Grid>
          )}

          <Grid item xs={12} md={3}>
            <CustomTextField
              name="complaintDetails"
              label="Request Details"
              value={values.complaintDetails}
              handleChange={handleChange}
              fullWidth
              errors={errorMessages.complaintDetails}
              checks={checks.complaintDetails}
              required
              inputProps={{
                minLength: 1,
                maxLength: 200,
              }}
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <CustomTextField
              name="floorAndExtension"
              label="Block/Extension No"
              value={values.floorAndExtension}
              handleChange={handleChange}
              fullWidth
              errors={errorMessages.floorAndExtension}
              checks={checks.floorAndExtension}
              required
              inputProps={{
                minLength: 1,
                maxLength: 50,
              }}
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
                "Create"
              )}
            </Button>
          </Grid>
        </Grid>
      </FormWrapper>
    </Box>
  );
}

export default CreateServiceReqForm;
