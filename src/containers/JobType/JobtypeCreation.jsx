import { React, useState } from "react";
import { Box, Grid, Button, CircularProgress } from "@mui/material";
import FormLayout from "../../components/FormLayout";
import CustomTextField from "../../components/Inputs/CustomTextField";
import axios from "axios";
import ApiUrl from "../../services/Api";
import CustomSnackbar from "../../components/CustomSnackbar";
function JobtypeCreation() {
  const [data, setData] = useState({
    job_type: "",
    job_short_name: "",
  });
  const [formValid, setFormValid] = useState({
    job_type: false,
    job_short_name: false,
  });

  const [snackbarMessage, setSnackbarMessage] = useState({
    severity: "error",
    message: "",
  });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value, active: true });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Object.values(formValid).includes(false)) {
      setSnackbarMessage({
        severity: "error",
        message: "Please fill all fields",
      });
      setSnackbarOpen(true);
      console.log("failed");
    } else {
      await axios
        .post(`${ApiUrl}/employee/JobType`, data)
        .then((response) => {
          console.log(response);
          setSnackbarMessage({
            severity: "success",
            message: response.data.data,
          });
          if ((response.status = 200)) {
            window.location.href = "/JobtypeIndex";
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
                  name="job_type"
                  label="Job Type"
                  value={data.job_type ?? ""}
                  handleChange={handleChange}
                  fullWidth
                  errors={["This field required", "Enter Only Characters"]}
                  checks={[
                    data.job_type !== "",
                    /^[A-Za-z ]+$/.test(data.job_type),
                  ]}
                  setFormValid={setFormValid}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <CustomTextField
                  name="job_short_name"
                  label="Short Name"
                  value={data.job_short_name ?? ""}
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
                    data.job_short_name !== "",
                    /^[A-Za-z ]{3,3}$/.test(data.job_short_name),
                  ]}
                  setFormValid={setFormValid}
                  required
                />
              </Grid>
              <Grid item xs={12} md={1}>
                <Button
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
                    <>Submit</>
                  )}
                </Button>
              </Grid>
            </>
          </Grid>
        </FormLayout>
      </Box>
    </>
  );
}
export default JobtypeCreation;
