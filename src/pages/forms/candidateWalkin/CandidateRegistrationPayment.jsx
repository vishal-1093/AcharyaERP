import axiosNoToken from "../../../services/ApiWithoutToken";
import { Box, Button, Grid, Paper } from "@mui/material";
import logo from "../../../assets/acharyaLogo.png";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import axios from "../../../services/Api";
import useAlert from "../../../hooks/useAlert";

const initialValues = {
  candidateName: "",
  email: "",
  program: "",
  mobile: "",
  amount: "",
  npfStatus: "",
  voucherHeadId: "",
};

function CandidateRegistrationPayment() {
  const [values, setValues] = useState(initialValues);

  const { id } = useParams();
  const navigate = useNavigate();
  const { setAlertMessage, setAlertOpen } = useAlert();

  const checks = {
    mobile: [values.mobile !== "", /^[0-9]{10}$/.test(values.mobile)],
  };
  const errorMessages = {
    mobile: ["This field is required", "Invalid Mobile No."],
  };

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      const { data: response } = await axiosNoToken.get(
        "/api/student/getRegistrationFeeDetails",
        { params: { candidateId: id } }
      );
      const {
        candidateName,
        email,
        program,
        amount,
        npfStatus,
        voucherHeadId,
        mobile,
      } = response.data;

      setValues((prev) => ({
        ...prev,
        candidateName,
        email,
        program,
        amount: 100,
        npfStatus,
        voucherHeadId,
        mobile,
      }));
    } catch (err) {}
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (!/^\d*$/.test(value)) return;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleAcceptOffer = () =>
    navigate(`/offer-acceptance/${id}`, { replace: true });

  const handleCreate = async () => {
    try {
      const { mobile, voucherHeadId, amount } = values;
      const postData = { studentId: id, mobile, voucherHeadId, amount };
      const { data: response } = await axios.post(
        "/api/student/registrationFee",
        postData
      );
      const { status } = response;
      if (status === 200 || status === 201) {
        navigate("/candidate-razor-pay", {
          state: {
            response: response.data,
            candidateId: id,
          },
        });
      }
    } catch (err) {
      setAlertMessage({
        severity: "error",
        message: err.response?.data?.message || "Failed to load data !!",
      });
      setAlertOpen(true);
    }
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
                <CustomTextField
                  name="candidateName"
                  value={values.candidateName}
                />
              </Grid>
              <Grid item xs={12}>
                <CustomTextField name="email" value={values.email} />
              </Grid>
              <Grid item xs={12}>
                <CustomTextField value={values.program} />
              </Grid>
              <Grid item xs={12}>
                <CustomTextField
                  name="mobile"
                  label="Mobile No."
                  value={values.mobile}
                  handleChange={handleChange}
                  checks={checks.mobile}
                  errors={errorMessages.mobile}
                  required
                />
              </Grid>

              <Grid item xs={12}>
                <CustomTextField
                  name="amount"
                  label="Registration Fee"
                  value={values.amount}
                />
              </Grid>

              <Grid item xs={12} sx={{ marginBottom: 4 }}>
                {values.npfStatus === 2 && (
                  <Button
                    variant="contained"
                    onClick={handleAcceptOffer}
                    sx={{ width: "100%" }}
                  >
                    Accept Offer
                  </Button>
                )}
                {values.npfStatus === 3 && (
                  <Button
                    variant="contained"
                    onClick={handleCreate}
                    sx={{ width: "100%" }}
                  >
                    Pay Now
                  </Button>
                )}
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default CandidateRegistrationPayment;
