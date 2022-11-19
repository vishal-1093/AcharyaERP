import { useState, useEffect } from "react";
import { Box, Grid, Button, CircularProgress } from "@mui/material";
import FormWrapper from "../../../components/FormWrapper";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import useAlert from "../../../hooks/useAlert";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import ApiUrl from "../../../services/Api";
import axios from "axios";
import { useNavigate, useLocation, useParams } from "react-router-dom";

const initialValues = {
  designation: "",
  shortName: "",
  priority: "",
};
const requiredFields = ["designation", "shortName", "priority"];

function DesignationForm() {
  const [isNew, setIsNew] = useState(true);
  const [values, setValues] = useState(initialValues);
  const [DesignationId, setDesignationId] = useState(null);
  const [loading, setLoading] = useState(false);

  const { setAlertMessage, setAlertOpen } = useAlert();
  const setCrumbs = useBreadcrumbs();
  const { id } = useParams();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const checks = {
    designation: [values.designation !== ""],
    shortName: [values.shortName !== ""],
    priority: [values.priority !== "", /^[0-9]*$/.test(values.priority)],
  };

  const errorMessages = {
    designation: ["This field required"],
    shortName: ["This field required"],
    priority: ["This field is required", "Allow only Number"],
  };

  useEffect(() => {
    if (pathname.toLowerCase() === "/designationmaster/designation/new") {
      setIsNew(true);
      setCrumbs([
        { name: "DesignationMaster", link: "/DesignationMaster" },
        { name: "Designation" },
        { name: "Create" },
      ]);
    } else {
      setIsNew(false);
      getDesignationData();
    }
  }, [pathname]);

  const getDesignationData = async () => {
    await axios
      .get(`${ApiUrl}/employee/Designation/${id}`)
      .then((res) => {
        setValues({
          designation: res.data.data.designation_name,
          shortName: res.data.data.designation_short_name,
          priority: res.data.data.priority,
        });
        setDesignationId(res.data.data.designation_id);
        setCrumbs([
          { name: "DesignationMaster", link: "/DesignationMaster" },
          { name: "Designation" },
          { name: "Update" },
          { name: res.data.data.designation_name },
        ]);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleChange = (e) => {
    if (e.target.name === "shortName") {
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

  const handleCreate = async () => {
    if (!requiredFieldsValid()) {
      setAlertMessage({
        severity: "error",
        message: "please fill all fields",
      });
      setAlertOpen(true);
    } else {
      setLoading(true);
      const temp = {};
      temp.active = true;
      temp.designation_name = values.designation;
      temp.designation_short_name = values.shortName;
      temp.priority = values.priority;
      await axios
        .post(`${ApiUrl}/employee/Designation`, temp)
        .then((res) => {
          setLoading(false);
          if (res.status === 200 || res.status === 201) {
            navigate("/DesignationMaster", { replace: true });
            setAlertMessage({
              severity: "success",
              message: "Form Submitted Successfully",
            });
          } else {
            setAlertMessage({
              severity: "error",
              message: res.data ? res.data.message : "An error occured",
            });
          }
          setAlertOpen(true);
        })
        .catch((err) => {
          setLoading(false);
          setAlertMessage({
            severity: "error",
            message: err.response
              ? err.response.data.message
              : "An error occured",
          });
          setAlertOpen(true);
        });
    }
  };

  const handleUpdate = async () => {
    if (!requiredFieldsValid()) {
      setAlertMessage({
        severity: "error",
        message: "please fill all fields",
      });
      setAlertOpen(true);
    } else {
      setLoading(true);
      const temp = {};
      temp.active = true;
      temp.designation_id = DesignationId;
      temp.designation_name = values.designation;
      temp.designation_short_name = values.shortName;
      temp.priority = values.priority;
      await axios
        .put(`${ApiUrl}/employee/Designation/${id}`, temp)
        .then((res) => {
          setLoading(false);
          if (res.status === 200 || res.status === 201) {
            navigate("/DesignationMaster", { replace: true });
            setAlertMessage({
              severity: "success",
              message: "Form Updated Successfully",
            });
          } else {
            setAlertMessage({
              severity: "error",
              message: res.data ? res.data.message : "An error occured",
            });
          }
          setAlertOpen(true);
        })
        .catch((err) => {
          setLoading(false);
          setAlertMessage({
            severity: "error",
            message: err.response
              ? err.response.data.message
              : "An error occured",
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
          alignItems="center"
          justifyContent="flex-end"
          rowSpacing={4}
          columnSpacing={{ xs: 2, md: 4 }}
        >
          <Grid item xs={12} md={6}>
            <CustomTextField
              name="designation"
              label="Designation"
              value={values.designation}
              handleChange={handleChange}
              checks={checks.designation}
              errors={errorMessages.designation}
              required
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <CustomTextField
              name="shortName"
              label="Short Name"
              value={values.shortName}
              handleChange={handleChange}
              checks={checks.shortName}
              errors={errorMessages.shortName}
              required
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <CustomTextField
              name="priority"
              label="Priority"
              value={values.priority}
              handleChange={handleChange}
              checks={checks.priority}
              errors={errorMessages.priority}
              required
            />
          </Grid>

          <Grid item xs={12} md={6} textAlign="right">
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

export default DesignationForm;
