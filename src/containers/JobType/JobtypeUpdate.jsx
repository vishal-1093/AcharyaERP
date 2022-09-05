import { useState, useEffect } from "react";
import { Box, Grid, Button, CircularProgress } from "@mui/material";
import FormWrapper from "../../components/FormWrapper";
import CustomTextField from "../../components/Inputs/CustomTextField";
import { useNavigate, useParams } from "react-router-dom";
import CustomAlert from "../../components/CustomAlert";
import axios from "axios";
import ApiUrl from "../../services/Api";

function JobtypeUpdate() {
  const { id } = useParams();
  const [data, setData] = useState({
    job_type: "",
    job_short_name: "",
  });
  const [formValid, setFormValid] = useState({
    job_type: true,
    job_short_name: true,
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [alertMessage, setAlertMessage] = useState({
    severity: "error",
    message: "",
  });
  const [alertOpen, setAlertOpen] = useState(false);
  useEffect(() => {
    getData();
  }, []);
  const getData = async () => {
    axios.get(`${ApiUrl}/employee/JobType/${id}`).then((response) => {
      setData(response.data.data);
    });
  };

  const handleChange = (e) => {
    if (e.target.name === "job_short_name") {
      setData((prev) => ({
        ...prev,
        [e.target.name]: e.target.value.toUpperCase(),
        active: true,
      }));
    } else {
      setData((prev) => ({
        ...prev,
        [e.target.name]: e.target.value,
        active: true,
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
      await axios
        .put(`${ApiUrl}/employee/JobType/${id}`, data)
        .then((response) => {
          setAlertMessage({
            severity: "error",
            message: response.data.data.message,
          });

          navigate("/InstituteMaster/JobtypeIndex", { replace: true });
        })
        .catch((error) => {
          console.log(error.response.data.message);
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
        <CustomAlert
          open={alertOpen}
          setOpen={setAlertOpen}
          severity={alertMessage.severity}
          message={alertMessage.message}
        />
        <FormWrapper>
          <Grid
            container
            alignItems="center"
            justifyContent="flex-start"
            rowSpacing={4}
            columnSpacing={{ xs: 2, md: 4 }}
          >
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
                    minLength: 3,
                    maxLength: 3,
                  }}
                  title="Please"
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
              <Grid item xs={12}>
                <Grid
                  container
                  alignItems="center"
                  justifyContent="flex-end"
                  textAlign="right"
                >
                  <Grid item xs={2}>
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
                        <>Update</>
                      )}
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </>
          </Grid>
        </FormWrapper>
      </Box>
    </>
  );
}
export default JobtypeUpdate;
