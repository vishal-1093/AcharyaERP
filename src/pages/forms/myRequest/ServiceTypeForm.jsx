import { useState, useEffect } from "react";
import { Box, Grid, Button, CircularProgress } from "@mui/material";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import axios from "../../../services/Api";
import CustomRadioButtons from "../../../components/Inputs/CustomRadioButtons";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import useAlert from "../../../hooks/useAlert";
import FormWrapper from "../../../components/FormWrapper";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";

const initialValues = {
  serviceTypeName: "",
  serviceTypeShortName: "",
  active: true,
  showInEvent: "no",
  hostelStatus: "no",
  isAttachment: "no",
};
const requiredFields = [
  "serviceTypeName",
  "serviceTypeShortName",
  "active",
  "showInEvent",
  "hostelStatus",
];

function ServiceTypeForm() {
  const [isNew, setIsNew] = useState(true);
  const [values, setValues] = useState(initialValues);
  const [sericeTypes, setSericeTypes] = useState(null);
  const [serviceTypeId, setServiceTypeId] = useState(null);
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const { pathname } = useLocation();
  const { setAlertMessage, setAlertOpen } = useAlert();
  const setCrumbs = useBreadcrumbs();
  const navigate = useNavigate();
  const checks = {
    serviceTypeName: [values.serviceTypeName !== ""],
    serviceTypeShortName: [values.serviceTypeShortName !== ""],
    active: [values.active !== ""],
    showInEvent: [values.showInEvent !== ""],
    hostelStatus: [values.hostelStatus !== ""],
  };

  const errorMessages = {
    serviceTypeName: ["This field required"],
    serviceTypeShortName: ["This field required"],
    active: ["This field is required"],
    showInEvent: ["This field is required"],
    hostelStatus: ["This field is required"],
  };

  useEffect(() => {
    if (pathname.toLowerCase() === "/servicemaster/servicetypes/new") {
      setIsNew(true);

      setCrumbs([
        { name: "Service Type Index", link: "/ServiceMaster/ServiceTypes" },
        { name: "ServiceTypes" },
        { name: "Create" },
      ]);
    } else {
      setIsNew(false);
      getServiceTypeData();
    }
  }, [pathname]);

  const getServiceTypeData = async () => {
    await axios
      .get(`/api/ServiceType/getServiceTypeById/${id}`)
      .then((res) => {
        setValues({
          serviceTypeName: res.data.data.serviceTypeName,
          serviceTypeShortName: res.data.data.serviceTypeShortName,
          active:
            res.data.data.active === true
              ? "Yes"
              : res.data.data.active === false
              ? "No"
              : "",
          showInEvent:
            res.data.data.showInEvent === true
              ? "yes"
              : res.data.data.showInEvent === false
              ? "no"
              : "",
          hostelStatus:
            res.data.data.hostelStatus === true
              ? "yes"
              : res.data.data.hostelStatus === false
              ? "no"
              : "",
          isAttachment:
            res.data.data.is_attachment === true
              ? "yes"
              : res.data.data.is_attachment === false
              ? "no"
              : "",
        });
        setSericeTypes(res.data.data);
        setServiceTypeId(res.data.data.id);
        setCrumbs([
          { name: "Service Types", link: "/ServiceMaster/ServiceTypes" },
          { name: "ServiceTypes" },
          { name: "Update" },
        ]);
      })
      .catch((err) => console.error(err));
  };

  const handleChange = (e) => {
    if (e.target.name === "serviceTypeShortName") {
      setValues((prev) => ({
        ...prev,
        [e.target.name]: e.target.value.toUpperCase(),
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
      temp.dept_id = null;
      temp.serviceTypeName = values.serviceTypeName;
      temp.serviceTypeShortName = values.serviceTypeShortName;
      temp.showInEvent =
        values.showInEvent === "yes"
          ? true
          : values.showInEvent === "no"
          ? false
          : "";
      temp.hostelStatus =
        values.hostelStatus === "yes"
          ? true
          : values.hostelStatus === "no"
          ? false
          : "";

      temp.is_attachment =
        values.isAttachment === "yes"
          ? true
          : values.isAttachment === "no"
          ? false
          : "";

      await axios
        .post(`/api/ServiceType`, temp)
        .then((res) => {
          setLoading(false);
          if (res.status === 200 || res.status === 201) {
            navigate("/ServiceMaster/ServiceTypes", { replace: true });
            setAlertMessage({
              severity: "success",
              message: "Service Type Created",
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

  const handleUpdate = async (e) => {
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
      temp.dept_id = sericeTypes?.dept_id;
      temp.created_by = sericeTypes?.created_by;
      temp.created_date = sericeTypes.created_date;
      temp.created_username = sericeTypes.created_username;
      temp.serviceTypeName = values.serviceTypeName;
      temp.serviceTypeShortName = values.serviceTypeShortName;
      temp.id = serviceTypeId;
      temp.showInEvent =
        values.showInEvent === "yes"
          ? true
          : values.showInEvent === "no"
          ? false
          : "";
      temp.hostelStatus =
        values.hostelStatus === "yes"
          ? true
          : values.hostelStatus === "no"
          ? false
          : "";

      temp.is_attachment =
        values.isAttachment === "yes"
          ? true
          : values.isAttachment === "no"
          ? false
          : "";

      await axios
        .put(`/api/ServiceType/updateServiceType/${id}`, temp)
        .then((res) => {
          setLoading(false);
          if (res.status === 200 || res.status === 201) {
            setAlertMessage({
              severity: "success",
              message: "Service Type Updated",
            });
            navigate("/ServiceMaster/ServiceTypes", { replace: true });
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
            <CustomTextField
              name="serviceTypeName"
              label="Service Type Name"
              value={values.serviceTypeName}
              handleChange={handleChange}
              fullWidth
              errors={errorMessages.serviceTypeName}
              checks={checks.serviceTypeName}
              required
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <CustomTextField
              name="serviceTypeShortName"
              label="Service Type Short Name"
              value={values.serviceTypeShortName}
              handleChange={handleChange}
              fullWidth
              errors={errorMessages.serviceTypeShortName}
              checks={checks.serviceTypeShortName}
              required
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <CustomRadioButtons
              name="showInEvent"
              label="Show In Event"
              value={values.showInEvent}
              items={[
                {
                  value: "yes",
                  label: "Yes",
                },
                {
                  value: "no",
                  label: "No",
                },
              ]}
              handleChange={handleChange}
              errors={errorMessages.showInEvent}
              checks={checks.showInEvent}
              required
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <CustomRadioButtons
              name="hostelStatus"
              label="Hostel Status"
              value={values.hostelStatus}
              items={[
                {
                  value: "yes",
                  label: "Yes",
                },
                {
                  value: "no",
                  label: "No",
                },
              ]}
              handleChange={handleChange}
              errors={errorMessages.hostelStatus}
              checks={checks.hostelStatus}
              required
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <CustomRadioButtons
              name="isAttachment"
              label="Is Attachment"
              value={values.isAttachment}
              items={[
                {
                  value: "yes",
                  label: "Yes",
                },
                {
                  value: "no",
                  label: "No",
                },
              ]}
              handleChange={handleChange}
              errors={errorMessages.hostelStatus}
              checks={checks.hostelStatus}
              required
            />
          </Grid>

          <Grid item xs={12} align="right">
            <Button
              style={{ borderRadius: 7 }}
              variant="contained"
              color="primary"
              disabled={loading}
              onClick={isNew ? handleCreate : handleUpdate}
            >
              {loading ? (
                <CircularProgress
                  size={25}
                  color="blue"
                  style={{ margin: "2px 13px" }}
                />
              ) : (
                <strong>{isNew ? "Create" : "Update"}</strong>
              )}
            </Button>
          </Grid>
        </Grid>
      </FormWrapper>
    </Box>
  );
}

export default ServiceTypeForm;
