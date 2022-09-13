import { React, useState } from "react";
import { Box, Grid, Button, CircularProgress } from "@mui/material";
import FormWrapper from "../../components/FormWrapper";
import CustomTextField from "../../components/Inputs/CustomTextField";
import axios from "axios";
import ApiUrl from "../../services/Api";
import useAlert from "../../hooks/useAlert";
import { useNavigate } from "react-router-dom";
const initialValues = {
  moduleName: "",
  moduleShortName: "",
};

function ModuleCreation() {
  const [values, setValues] = useState(initialValues);
  const [formValid, setFormValid] = useState({
    moduleName: false,
    moduleShortName: false,
  });

  const navigate = useNavigate();

  const { setAlertMessage, setAlertOpen } = useAlert();
  const [loading, setLoading] = useState(false);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Object.values(formValid).includes(false)) {
      setAlertMessage({
        severity: "error",
        message: "Please fill all fields",
      });
      setAlertOpen(true);
      console.log("failed");
    } else {
      const temp = {};
      temp.active = true;
      temp.module_name = values.moduleName;
      temp.module_short_name = values.moduleShortName;
      await axios
        .post(`${ApiUrl}/Module`, temp)
        .then((response) => {
          console.log(response);
          setAlertMessage({
            severity: "success",
            message: response.data.data,
          });
          navigate("/ModuleIndex", { replace: true });
        })
        .catch((error) => {
          setAlertMessage({
            severity: "error",
            message: error.response ? error.response.data.message : "Error",
          });
          setAlertOpen(true);
        });
    }
  };

  return (
    <>
      <Box component="form" overflow="hidden" p={1}>
        <FormWrapper>
          <Grid
            container
            alignItems="center"
            justifyContent="flex-start"
            rowSpacing={2}
            columnSpacing={{ xs: 2, md: 4 }}
          >
            <>
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
            </>
            <Grid item xs={12}>
              <Grid
                container
                alignItems="center"
                justifyContent="flex-end"
                textAlign="right"
              >
                <Grid item xs={2}>
                  <Button
                    style={{ borderRadius: 7 }}
                    variant="contained"
                    color="primary"
                    disabled={loading}
                    onClick={handleSubmit}
                  >
                    {loading ? (
                      <CircularProgress
                        size={25}
                        color="blue"
                        style={{ margin: "2px 13px" }}
                      />
                    ) : (
                      <strong>Submit</strong>
                    )}
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </FormWrapper>
      </Box>
    </>
  );
}
export default ModuleCreation;
