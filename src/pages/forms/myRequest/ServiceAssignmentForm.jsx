import { useState, useEffect } from "react";
import { Box, Grid, Button, CircularProgress } from "@mui/material";
import axios from "../../../services/Api";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";
import { useLocation, useNavigate } from "react-router-dom";
import useAlert from "../../../hooks/useAlert";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import FormWrapper from "../../../components/FormWrapper";

const initialValues = {
  dept_id: "",
};

const requiredFields = ["dept_id"];

function ServiceAssignmentForm() {
  const [values, setValues] = useState(initialValues);
  const [loading, setLoading] = useState(false);
  const [departmentOptions, setDepartmentOptions] = useState([]);
  const { pathname } = useLocation();
  const location = useLocation();
  const setCrumbs = useBreadcrumbs();
  const { setAlertMessage, setAlertOpen } = useAlert();
  const navigate = useNavigate();
  const checks = {

    dept_id: [values.dept_id !== ""],
  };
  const rowData = location?.state?.row
  const errorMessages = {

    dept_id: ["This field is required"],
  };

  useEffect(() => {
    getDepartmentOptions();
    setCrumbs([
      { name: "ServiceMaster", link: "/ServiceMaster/ServiceTypes" },
      { name: "Service Assigment" },
      { name: "Create" },
    ]);
  }, [pathname]);

  const getDepartmentOptions = async () => {

    await axios.get(`/api/getActiveDepartmentAssignmentBasedOnTag`)
      .then((res) => {
        setDepartmentOptions(
          res.data.data.map((obj) => ({
            value: obj.id,
            label: obj.dept_name,
          }))
        );
      })
      .catch((err) => console.error(err));
  };

  const handleChangeAdvance = async (name, newValue) => {
    setValues((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const requiredFieldsValid = () => {
    console.log('requiredFields', requiredFields)
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
      temp.dept_id = values.dept_id;

      await axios
        .put(`/api/ServiceType/${rowData?.id}`, temp)
        .then((res) => {
          setLoading(false);
          if (res.status === 200 || res.status === 201) {
            navigate("/ServiceMaster/ServiceTypes", { replace: true });
            setAlertMessage({
              severity: "success",
              message: "Service Assignment Created",
            });
          } else {
            setAlertMessage({
              severity: "error",
              message: res.data.message,
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
          justifyContent="flex-start"
          rowSpacing={{ xs: 2, md: 4 }}
          columnSpacing={{ xs: 2, md: 4 }}
        >
        
          <Grid item xs={12} md={4}>
            <CustomAutocomplete
              name="dept_id"
              label="Department"
              options={departmentOptions}
              value={values.dept_id}
              handleChangeAdvance={handleChangeAdvance}
              checks={checks.dept_id}
              errors={errorMessages.dept_id}
              required
            />

          </Grid>

          <Grid item xs={12} md={3}>
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
                <strong>Create</strong>
              )}
            </Button>
          </Grid>
        </Grid>
      </FormWrapper>
    </Box>
  );
}

export default ServiceAssignmentForm;
