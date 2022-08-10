import { React, useState } from "react";
import { Box, Grid, Button, CircularProgress } from "@mui/material";
import FormLayout from "../../components/FormLayout";
import CustomTextField from "../../components/Inputs/CustomTextField";
import axios from "axios";
import ApiUrl from "../../services/Api";
import CustomSnackbar from "../../components/CustomSnackbar";
function AcademicYearCreation() {
  const [data, setData] = useState({ active: true });
  const [firstyear, setFirstyear] = useState([]);
  const [secondyear, setSecondyear] = useState([]);
  const [loading, setLoading] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState({
    severity: "error",
    message: "",
  });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const handleChange = (e) => {
    let Firstyearone = e.target.value;
    setFirstyear(e.target.value);
    let Secondyearone = parseInt(e.target.value) + 1;
    setSecondyear(Secondyearone);
    let concat = Firstyearone + "-" + Secondyearone;
    setData((prev) => ({
      ...prev,
      ac_year: concat,
      current_year: Firstyearone,
      ac_year_code: Secondyearone,
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios
      .post(`${ApiUrl}/academic/academic_year`, data)
      .then((response) => {
        console.log(response);
        setSnackbarMessage({
          severity: "success",
          message: response.data.data,
        });
        if (response.status === 200) {
          window.location.href = "/AcademicYearIndex";
        }
        if (response.status === 201) {
          window.location.href = "/AcademicYearIndex";
        }
      })
      .catch((error) => {
        setSnackbarMessage({
          severity: "error",
          message: error.response ? error.response.data.message : "Error",
        });
        setSnackbarOpen(true);
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
              severity={snackbarMessage.severity}
              message={snackbarMessage.message}
            />
            <>
              <Grid item xs={12} md={6}>
                <CustomTextField
                  type="number"
                  label="Academic Year"
                  handleChange={handleChange}
                />
                _
                <CustomTextField
                  value={secondyear}
                  handleChange={handleChange}
                  disabled
                />
              </Grid>

              <Grid item xs={2} md={2}>
                <CustomTextField
                  value={firstyear}
                  label="Current Year"
                  disabled
                />
              </Grid>
              <Grid item>
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
export default AcademicYearCreation;
