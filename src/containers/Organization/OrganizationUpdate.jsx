import { React, useState, useEffect } from "react";
import { Box, Grid, Button, CircularProgress } from "@mui/material";
import FormLayout from "../../components/FormLayout";
import CustomTextField from "../../components/Inputs/CustomTextField";
import { useParams } from "react-router-dom";
import CustomSnackbar from "../../components/CustomSnackbar";
import ApiUrl from "../../services/Api";
import axios from "axios";
function OrganizationUpdate() {
  const { id } = useParams();
  const [data, setData] = useState({
    org_name: "",
    org_type: "",
  });
  const [formValid, setFormValid] = useState({
    org_name: true,
    org_type: true,
  });

  const [submitError, setSubmitError] = useState(true);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const getData = async () => {
    axios.get(`${ApiUrl}/institute/org/${id}`).then((response) => {
      setData(response.data.data);
    });
  };
  useEffect(() => {
    getData();
  }, []);
  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Object.values(formValid).includes(false)) {
      setSubmitError(true);
      console.log("failed");
      setSnackbarOpen(true);
    } else {
      setSubmitError(false);
      console.log("submitted");
    }
    console.log(data);
    await axios.put(`${ApiUrl}/institute/org/${id}`, data).then((response) => {
      if (response.status == 200) {
        window.location.href = "/OrganizationIndex";
      }
      if (response.status == 208) {
        alert(response.data.message);
      }
    });
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
              severity={submitError ? "error" : "success"}
              message={
                submitError
                  ? "Please fill all required fields"
                  : "Form submitted"
              }
            />
            <>
              <Grid item xs={12} md={6}>
                <CustomTextField
                  name="org_name"
                  label="Organization Name"
                  handleChange={handleChange}
                  value={data.org_name ?? ""}
                  fullWidth
                  errors={["This field required", "Enter Only Characters"]}
                  checks={[
                    data.org_name !== "",
                    /^[A-Za-z]+$/.test(data.org_name),
                  ]}
                  setFormValid={setFormValid}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <CustomTextField
                  name="org_type"
                  label="Short Name"
                  value={data.org_type ?? ""}
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
export default OrganizationUpdate;
