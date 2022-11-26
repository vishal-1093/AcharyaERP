import { useState, useEffect } from "react";
import { Box, Grid, Button, CircularProgress } from "@mui/material";
import FormWrapper from "../../../components/FormWrapper";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import axios from "../../../services/Api";
import useAlert from "../../../hooks/useAlert";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import { useNavigate, useLocation, useParams } from "react-router-dom";

const initialValues = {
  moduleName: "",
  moduleShortName: "",
};

const requiredFields = ["moduleName", "moduleShortName"];

function ModuleForm() {
  const [isNew, setIsNew] = useState(true);
  const [values, setValues] = useState(initialValues);
  const [moduleId, setModuleId] = useState(null);
  const [loading, setLoading] = useState(false);

  const { id } = useParams();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { setAlertMessage, setAlertOpen } = useAlert();
  const setCrumbs = useBreadcrumbs();

  const checks = {
    moduleName: [
      values.moduleName !== "",
      /^[A-Za-z ]+$/.test(values.moduleName),
    ],
    moduleShortName: [
      values.moduleShortName !== "",
      /^[A-Za-z ]{3,3}$/.test(values.moduleShortName),
    ],
  };

  const errorMessages = {
    moduleName: ["This field required", "Enter Only Characters"],
    moduleShortName: [
      "This field required",
      "Enter characters and its length should be three",
    ],
  };

  useEffect(() => {
    if (pathname.toLowerCase() === "/navigationmaster/module/new") {
      setIsNew(true);
      setCrumbs([
        { name: "Navigation Master", link: "/NavigationMaster" },
        { name: "Module" },
        { name: "Create" },
      ]);
    } else {
      setIsNew(false);
      getModuleData();
    }
  }, [pathname]);

  const getModuleData = async () => {
    axios
      .get(`/api/Module/${id}`)
      .then((res) => {
        setValues({
          moduleName: res.data.data.module_name,
          moduleShortName: res.data.data.module_short_name,
        });
        setModuleId(res.data.data.module_id);
        setCrumbs([
          { name: "Navigation Master", link: "/NavigationMaster" },
          { name: "Module" },
          { name: "Update" },
          { name: res.data.data.module_name },
        ]);
      })
      .catch((err) => console.error(err));
  };

  const handleChange = (e) => {
    if (e.target.name === "moduleShortName") {
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
        message: "Please fill all required fields",
      });
      setAlertOpen(true);
    } else {
      setLoading(true);
      const temp = {};
      temp.active = true;
      temp.module_name = values.moduleName;
      temp.module_short_name = values.moduleShortName;
      await axios
        .post(`/api/Module`, temp)
        .then((res) => {
          setLoading(false);
          if (res.status === 200 || res.status === 201) {
            navigate("/NavigationMaster", { replace: true });
            setAlertMessage({
              severity: "success",
              message: "Module created",
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
        message: "Please fill all required fields",
      });
      setAlertOpen(true);
    } else {
      setLoading(true);
      const temp = {};
      temp.active = true;
      temp.module_id = moduleId;
      temp.module_name = values.moduleName;
      temp.module_short_name = values.moduleShortName;
      await axios
        .put(`/api/Module/${id}`, temp)
        .then((res) => {
          setLoading(false);
          if (res.status === 200 || res.status === 201) {
            navigate("/NavigationMaster", { replace: true });
            setAlertMessage({
              severity: "success",
              message: "Module updated",
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
          justifyContent="center"
          rowSpacing={2}
          columnSpacing={{ xs: 2, md: 4 }}
        >
          <Grid item xs={12} md={6}>
            <CustomTextField
              name="moduleName"
              label="Module"
              value={values.moduleName}
              handleChange={handleChange}
              errors={errorMessages.moduleName}
              checks={checks.moduleName}
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <CustomTextField
              name="moduleShortName"
              label="Short Name"
              value={values.moduleShortName}
              handleChange={handleChange}
              errors={errorMessages.moduleShortName}
              checks={checks.moduleShortName}
              required
              inputProps={{
                minLength: 3,
                maxLength: 3,
              }}
            />
          </Grid>
          <Grid item xs={12} textAlign="right">
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

export default ModuleForm;
