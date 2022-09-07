import { useState, useEffect } from "react";
import { Box, Grid, Button, CircularProgress } from "@mui/material";
import FormWrapper from "../../components/FormWrapper";
import CustomTextField from "../../components/Inputs/CustomTextField";
import { useNavigate, useParams } from "react-router-dom";
import CustomAlert from "../../components/CustomAlert";
import axios from "axios";
import ApiUrl from "../../services/Api";
import useAlert from "../../hooks/useAlert";
function JobtypeUpdate() {
  const { id } = useParams();
  const [data, setData] = useState({
    jobType: "",
    jobShortName: "",
  });
  const [jobTypeId, setJobTypeId] = useState(null);
  const [formValid, setFormValid] = useState({
    jobType: true,
    jobShortName: true,
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [setAlertMessage, setAlertOpen] = useAlert();
  useEffect(() => {
    getData();
  }, []);
  const getData = async () => {
    axios
      .get(`${ApiUrl}/employee/JobType/${id}`)
      .then((res) => {
        console.log(res.data.data);
        setData({
          jobType: res.data.data.job_type,
          jobShortName: res.data.data.job_short_name,
        });
        setJobTypeId(res.data.data.job_type_id);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleChange = (e) => {
    if (e.target.name === "jobShortName") {
      setData((prev) => ({
        ...prev,
        [e.target.name]: e.target.value.toUpperCase(),
      }));
    } else {
      setData((prev) => ({
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
      temp.job_type_id = jobTypeId;
      temp.job_type = data.jobType;
      temp.job_short_name = data.jobShortName;
      await axios
        .put(`${ApiUrl}/employee/JobType/${id}`, temp)
        .then((response) => {
          if (response.status === 200 || response.status === 201) {
            setAlertMessage({
              severity: "success",
              message: "Form Submitted Successfully",
            });
            navigate("/InstituteMaster/JobtypeIndex", { replace: true });
          } else {
            setAlertMessage({
              severity: "error",
              message: response.data.message,
            });
          }
          setAlertOpen(true);
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
                  name="jobType"
                  label="Job Type"
                  value={data.jobType ?? ""}
                  handleChange={handleChange}
                  fullWidth
                  errors={["This field required", "Enter Only Characters"]}
                  checks={[
                    data.jobType !== "",
                    /^[A-Za-z ]+$/.test(data.jobType),
                  ]}
                  setFormValid={setFormValid}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <CustomTextField
                  name="jobShortName"
                  label="Short Name"
                  value={data.jobShortName ?? ""}
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
                    data.jobShortName !== "",
                    /^[A-Za-z ]{3,3}$/.test(data.jobShortName),
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
