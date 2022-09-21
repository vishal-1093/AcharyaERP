import { useState, useEffect } from "react";
import { Box, Grid, Button, CircularProgress } from "@mui/material";
import FormWrapper from "../../components/FormWrapper";
import CustomTextField from "../../components/Inputs/CustomTextField";
import axios from "axios";
import ApiUrl from "../../services/Api";
import useAlert from "../../hooks/useAlert";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import { useNavigate, useLocation, useParams } from "react-router-dom";

const initialValues = {
  moduleName: "",
  moduleShortName: "",
};

const requiredFields = ["moduleName", "moduleShortName"];

function ModuleForm() {
  const [isNew, setIsNew] = useState(true);
  const [values, setValues] = useState(initialValues);
  const [formValid, setFormValid] = useState({});
  const [moduleId, setModuleId] = useState(null);
  const [loading, setLoading] = useState(false);

  const { id } = useParams();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { setAlertMessage, setAlertOpen } = useAlert();
  const setCrumbs = useBreadcrumbs();

  useEffect(() => {
    if (pathname.toLowerCase() === "/navigationmaster/module/new") {
      setIsNew(true);
      requiredFields.forEach((keyName) =>
        setFormValid((prev) => ({ ...prev, [keyName]: false }))
      );
      setCrumbs([
        { name: "NavigationMaster", link: "/NavigationMaster" },
        { name: "Module" },
        { name: "Create" },
      ]);
    } else {
      setIsNew(false);
      getModuleData();
      requiredFields.forEach((keyName) =>
        setFormValid((prev) => ({ ...prev, [keyName]: true }))
      );
    }
  }, [pathname]);

  const getModuleData = async () => {
    axios
      .get(`${ApiUrl}/Module/${id}`)
      .then((res) => {
        setValues({
          moduleName: res.data.data.module_name,
          moduleShortName: res.data.data.module_short_name,
        });
        setModuleId(res.data.data.module_id);
        setCrumbs([
          { name: "NavigationMaster", link: "/NavigationMaster" },
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

  const handleCreate = async () => {
    if (Object.values(formValid).includes(false)) {
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
        .post(`${ApiUrl}/Module`, temp)
        .then((res) => {
          setLoading(false);
          if (res.data.status === 200 || res.data.status === 201) {
            setAlertMessage({
              severity: "success",
              message: "Module created",
            });
            setAlertOpen(true);
            navigate("/NavigationMaster", { replace: true });
          } else {
            setAlertMessage({
              severity: "error",
              message: res.data ? res.data.message : "Error",
            });
            setAlertOpen(true);
          }
        })
        .catch((err) => {
          setLoading(false);
          setAlertMessage({
            severity: "error",
            message: err.response ? err.response.data.message : "Error",
          });
          setAlertOpen(true);
        });
    }
  };

  const handleUpdate = async () => {
    if (Object.values(formValid).includes(false)) {
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
        .put(`${ApiUrl}/Module/${id}`, temp)
        .then((res) => {
          setLoading(false);
          if (res.status === 200 || res.status === 201) {
            setAlertMessage({
              severity: "success",
              message: "Module updated",
            });
            setAlertOpen(true);
            navigate("/NavigationMaster", { replace: true });
          } else {
            setAlertMessage({
              severity: "error",
              message: res.data ? res.data.message : "An error occured",
            });
            setAlertOpen(true);
          }
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
          justifyContent="flex-start"
          rowSpacing={2}
          columnSpacing={{ xs: 2, md: 4 }}
        >
          <Grid item xs={12} md={6}>
            <CustomTextField
              name="moduleName"
              label="Module"
              value={values.moduleName}
              handleChange={handleChange}
              fullWidth
              errors={["This field required", "Enter Only Characters"]}
              checks={[
                values.moduleName !== "",
                /^[A-Za-z ]+$/.test(values.moduleName),
              ]}
              setFormValid={setFormValid}
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <CustomTextField
              name="moduleShortName"
              label="Short Name"
              value={values.moduleShortName}
              handleChange={handleChange}
              inputProps={{
                minLength: 3,
                maxLength: 3,
              }}
              fullWidth
              errors={[
                "This field required",
                "Enter characters and its length should be three",
              ]}
              checks={[
                values.moduleShortName !== "",
                /^[A-Za-z ]{3,3}$/.test(values.moduleShortName),
              ]}
              setFormValid={setFormValid}
              required
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
