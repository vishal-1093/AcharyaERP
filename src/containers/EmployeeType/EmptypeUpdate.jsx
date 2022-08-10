import { React, useState, useEffect } from "react";
import { Box, Grid, Button, CircularProgress } from "@mui/material";
import CustomTextField from "../../components/Inputs/CustomTextField";
import axios from "axios";
import CustomSnackbar from "../../components/CustomSnackbar";
import ApiUrl from "../../services/Api";
import FormLayout from "../../components/FormLayout";
import { useParams } from "react-router-dom";
function EmptypeUpdate() {
  const { id } = useParams();
  const [data, setData] = useState({
    empType: "",
    empTypeShortName: "",
  });
  const [formValid, setFormValid] = useState({
    empType: true,
    empTypeShortName: true,
  });

  const [snackbarMessage, setSnackbarMessage] = useState({
    severity: "error",
    message: "",
  });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const handleChange = (e) => {
    setData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
      active: true,
    }));
  };

  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    axios.get(`${ApiUrl}/employee/EmployeeType/${id}`).then((Response) => {
      setData(Response.data.data);
    });
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
        .put(`${ApiUrl}/employee/EmployeeType/${id}`, data)
        .then((response) => {
          console.log(response);
          setSnackbarMessage({
            severity: "success",
            message: response.data.data,
          });
          if ((response.status = 200)) {
            window.location.href = "/EmptypeIndex";
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
                  name="empType"
                  label="Employee Name"
                  value={data.empType ?? ""}
                  handleChange={handleChange}
                  fullWidth
                  errors={["This field required", "Enter Only Characters"]}
                  checks={[
                    data.empType !== "",
                    /^[A-Za-z ]+$/.test(data.empType),
                  ]}
                  setFormValid={setFormValid}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <CustomTextField
                  name="empTypeShortName"
                  label=" Short Name"
                  value={data.empTypeShortName ?? ""}
                  handleChange={handleChange}
                  fullWidth
                  inputProps={{
                    style: { textTransform: "uppercase" },
                    minLength: 3,
                    maxLength: 3,
                  }}
                  errors={[
                    "This field required",
                    "Enter characters and its length should be three",
                  ]}
                  checks={[
                    data.empTypeShortName !== "",
                    /^[A-Za-z ]{3,3}$/.test(data.empTypeShortName),
                  ]}
                  setFormValid={setFormValid}
                  required
                />
              </Grid>
              <Grid item xs={12}>
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
export default EmptypeUpdate;
