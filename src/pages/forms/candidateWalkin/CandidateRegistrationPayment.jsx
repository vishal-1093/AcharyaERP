import axiosNoToken from "../../../services/ApiWithoutToken";
import { Box, Button, Grid, Paper } from "@mui/material";
import logo from "../../../assets/acharyaLogo.png";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CustomTextField from "../../../components/Inputs/CustomTextField";

const initialValues = {
  candidateName: "Canddiate Registration",
  email: "candidate@gmail.com",
  program: "BE - MECHANICAL ENGG",
  mobileNo: "",
  amount: 10000,
};

function CandidateRegistrationPayment() {
  const [values, setValues] = useState(initialValues);

  const { id } = useParams();

  const checks = {
    mobileNo: [values.mobileNo !== "", /^[0-9]{10}$/.test(values.mobileNo)],
  };
  const errorMessages = {
    mobileNo: ["This field is required", "Invalid Mobile No."],
  };

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      const { data: response } = await axiosNoToken.get(
        `/api/student/Candidate_Walkin/${id}`
      );
      const candidateResponseData = response.data;
    } catch (err) {}
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Box
      sx={{ margin: { xs: "50px 20px 20px 20px", md: "150px 15px 0px 15px" } }}
    >
      <Grid container justifyContent="center">
        <Grid item xs={12} md={4} lg={2.8}>
          <Paper
            elevation={4}
            sx={{
              padding: "20px",
              background: "#F0F0F0",
              borderRadius: "15px",
            }}
          >
            <Grid container rowSpacing={3}>
              <Grid item xs={12} align="center">
                <img src={logo} style={{ width: "25%" }} />
              </Grid>
              <Grid item xs={12}>
                <CustomTextField value={values.candidateName} />
              </Grid>
              <Grid item xs={12}>
                <CustomTextField value={values.email} />
              </Grid>
              <Grid item xs={12}>
                <CustomTextField value={values.program} />
              </Grid>
              <Grid item xs={12}>
                <CustomTextField
                  name="mobileNo"
                  label="Mobile No."
                  value={values.mobileNo}
                  handleChange={handleChange}
                  checks={checks.mobileNo}
                  errors={errorMessages.mobileNo}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <CustomTextField value={10000} />
              </Grid>
              <Grid item xs={12}>
                <CustomTextField
                  name="amount"
                  label="Registration Fee"
                  value={values.amount}
                />
              </Grid>

              <Grid item xs={12} sx={{ marginBottom: 4 }}>
                <Button variant="contained" sx={{ width: "100%" }}>
                  Pay Now
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default CandidateRegistrationPayment;
