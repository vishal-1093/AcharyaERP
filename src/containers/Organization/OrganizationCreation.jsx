import { React, useState } from "react";
import { Box, Grid, Button, CircularProgress } from "@mui/material";
import FormLayout from "../../components/FormLayout";
import CustomTextField from "../../components/Inputs/CustomTextField";
import axios from "axios";
import CustomSnackbar from "../../components/CustomSnackbar";
import ApiUrl from "../../services/Api";
function OrganizationCreation() {
  const [data, setData] = useState({
    org_name: "",
    org_type: "",
  });
  const [formValid, setFormValid] = useState({
    org_name: false,
    org_type: false,
  });

  const [snackbarMessage, setSnackbarMessage] = useState({
    severity: "error",
    message: "",
  });
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleChange = (e) => {
    if (e.target.name == "org_type") {
      setData({
        ...data,
        [e.target.name]: e.target.value.toUpperCase(),
        active: true,
      });
    } else {
      setData({ ...data, [e.target.name]: e.target.value, active: true });
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Object.values(formValid).includes(false)) {
      setSnackbarMessage({
        severity: "error",
        message: "Please fill all fields",
      });
      console.log("failed");
      setSnackbarOpen(true);
    } else {
      await axios
        .post(`${ApiUrl}/institute/org`, data)
        .then((response) => {
          console.log(response);
          setSnackbarMessage({
            severity: "success",
            message: response.data.data,
          });
          if ((response.status = 200)) {
            window.location.href = "/OrganizationIndex";
          }
        })
        .catch((error) => {
          setSnackbarMessage({
            severity: "error",
            message: error.response ? error.response.data.message : "Error",
          });
          setSnackbarOpen(true);
        });
    }
  };

  return (
    <>
      <Box component="form" style={{ padding: "40px" }}>
        <FormLayout>
          <Grid
            container
            alignItems="center"
            justifyContent="flex-start"
            rowSpacing={2}
            columnSpacing={{ xs: 2, md: 4 }}
          >
            <CustomSnackbar
              open={snackbarOpen}
              setOpen={setSnackbarOpen}
              severity={snackbarMessage.severity}
              message={snackbarMessage.message}
            />
            <>
              <Grid item xs={12} md={6}>
                <CustomTextField
                  name="org_name"
                  label="Organization Name"
                  value={data.org_name}
                  handleChange={handleChange}
                  fullWidth
                  errors={["This field required", "Enter Only Characters"]}
                  checks={[
                    data.org_name !== "",
                    /^[A-Za-z ]+$/.test(data.org_name),
                  ]}
                  setFormValid={setFormValid}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <CustomTextField
                  name="org_type"
                  label="Short Name"
                  value={data.org_type}
                  handleChange={handleChange}
                  inputProps={{
                    style: { textTransform: "uppercase" },
                    minLength: 3,
                    maxLength: 3,
                  }}
                  fullWidth
                  errors={[
                    "This field required",
                    "Enter characters and its length should be three",
                  ]}
                  checks={[
                    data.org_type !== "",
                    /^[A-Za-z ]{3,3}$/.test(data.org_type),
                  ]}
                  setFormValid={setFormValid}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSubmit}
                >
                  Submit
                </Button>
              </Grid>
            </>
          </Grid>
        </FormLayout>
      </Box>
    </>
  );
}
export default OrganizationCreation;
