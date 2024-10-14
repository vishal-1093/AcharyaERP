import { useEffect } from "react";
import axios from "../../../services/Api";
import { Box, Button, Grid, Paper, Typography } from "@mui/material";
import logo from "../../../assets/acharyaLogo.png";
import { useLocation, useNavigate } from "react-router-dom";
import useAlert from "../../../hooks/useAlert";

function CandidateRazorPay() {
  const navigate = useNavigate();
  const location = useLocation();
  const response = location?.state?.response;
  const candidateId = location?.state?.candidateId;
  const candidateName = location?.state?.candidateName;
  const email = location?.state?.email;
  const mobile = location?.state?.mobile;

  const { setAlertMessage, setAlertOpen } = useAlert();

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => {
      console.log("Razorpay script loaded");
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    handlePayment();
  }, [window.Razorpay]);

  const handlePayment = () => {
    if (window.Razorpay) {
      const options = {
        key: "rzp_test_2bIwIuMsEEIGAw", // Enter the Key ID generated from the Dashboard
        amount: response.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
        currency: "INR",
        name: "Acme Corp",
        description: "Test Transaction",
        image: "https://example.com/your_logo",
        order_id: response.id, // This is a sample Order ID
        handler: function (response) {
          const data = {
            status: "success",
            razorpayPaymentId: response.razorpay_payment_id,
            razorpayOrderId: response.razorpay_order_id,
            razorpaySignature: response.razorpay_signature,
          };

          axios
            .post(`/api/student/registrationFeePaymentStatus`, data)
            .then((res) => {
              if (res.status === 200 || res.status === 201) {
                setAlertMessage({
                  severity: "success",
                  message: "Payment completed successfully",
                });
                setAlertOpen(true);
                navigate(`/registration-payment/${candidateId}`);
              }
            })
            .catch((err) => {
              setAlertMessage({
                severity: "error",
                message: err.response.data
                  ? err.response.data.message
                  : "Error Occured",
              });
              setAlertOpen(true);
              navigate(`/registration-payment/${candidateId}`);
            });
        },
        prefill: {
          name: candidateName,
          email: email,
          contact: mobile,
        },
        notes: {
          address: "Razorpay Corporate Office",
        },
        theme: {
          color: "#3399cc",
        },
      };

      const rzp1 = new window.Razorpay(options);

      rzp1.open();

      rzp1.on("payment.failed", function (response) {
        const data = {
          status: "failure",
          code: response.error.code,
          description: response.error.description,
          source: response.error.source,
          step: response.error.step,
          reason: response.error.reason,
          metadata: response.error.metadata,
        };

        axios
          .post(`/api/student/registrationFeePaymentStatus`, data)
          .then((res) => {
            if (res.status === 200 || res.status === 201) {
              setAlertMessage({
                severity: "error",
                message: "Payment Failed !!",
              });
              setAlertOpen(true);
              navigate(`/registration-payment/${candidateId}`);
            }
          })
          .catch((err) => {
            setAlertMessage({
              severity: "error",
              message: err.response.data
                ? err.response.data.message
                : "Error Occured",
            });
            setAlertOpen(true);
            navigate(`/registration-payment/${candidateId}`);
          });
      });
    }
  };

  const DisplayContent = ({ label, value }) => (
    <>
      <Grid item xs={12} md={4}>
        <Typography variant="subtitle2" sx={{ fontSize: 14 }}>
          {label}
        </Typography>
      </Grid>
      <Grid item xs={12} md={8}>
        <Typography
          variant="subtitle2"
          color="textSecondary"
          sx={{ fontSize: 14 }}
        >
          {value}
        </Typography>
      </Grid>
    </>
  );
  return (
    <Box sx={{ margin: { xs: "60px 20px 20px 20px", md: "100px" } }}>
      <Grid container justifyContent="center">
        <Grid item xs={12} md={4}>
          <Paper sx={{ background: "#edeff7", padding: 5 }}>
            <Grid
              container
              justifyContent="center"
              rowSpacing={{ xs: 1, md: 2 }}
            >
              <Grid item xs={12} align="center">
                <img src={logo} style={{ width: "20%" }} />
              </Grid>

              <DisplayContent
                label="Your Transaction ID"
                value={response?.id}
              />
              <DisplayContent label="Amount" value={response?.amount} />

              <Grid item xs={12}>
                <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
                  <Button
                    variant="contained"
                    color="success"
                    onClick={handlePayment}
                  >
                    Pay Now
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() =>
                      navigate(`/registration-payment/${candidateId}`)
                    }
                  >
                    Cancel
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default CandidateRazorPay;
