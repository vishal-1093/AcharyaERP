import { Button, Grid, Paper, Typography } from "@mui/material";
import acharyaLogo from "../../../assets/acharyaLogo.png";
import axios from "../../../services/Api";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useAlert from "../../../hooks/useAlert";

function StudentRazorPayWindow() {
  const location = useLocation();
  const response = location?.state?.response;
  const studentData = location?.state?.student_data;
  const mobile = location?.state?.mobile;
  const navigate = useNavigate();

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
  }, []);

  const handlePayment = () => {
    if (window.Razorpay) {
      const options = {
        key: "rzp_test_2bIwIuMsEEIGAw", // Enter the Key ID generated from the Dashboard
        amount: response.data.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
        currency: "INR",
        name: "Acme Corp",
        description: "Test Transaction",
        image: "https://example.com/your_logo",
        order_id: response.data.id, // This is a sample Order ID
        handler: function (response) {
          const data = {
            status: "success",
            razorpayPaymentId: response.razorpay_payment_id,
            razorpayOrderId: response.razorpay_order_id,
            razorpaySignature: response.razorpay_signature,
          };

          axios
            .post(`/api/student/paymentStatus`, data)
            .then((res) => {
              if (res.status === 200 || res.status === 201) {
                setAlertMessage({
                  severity: "success",
                  message: "Payment completed successfully",
                });
                setAlertOpen(true);
                navigate("/StudentPaymentMaster");
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
              navigate("/StudentPaymentMaster");
            });
        },
        prefill: {
          name: studentData.studentName,
          email: studentData.email,
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
          .post(`/api/student/paymentStatus`, data)
          .then((res) => {
            if (res.status === 200 || res.status === 201) {
              setAlertMessage({
                severity: "success",
                message: "Payment completed successfully",
              });
              setAlertOpen(true);
              navigate("/StudentPaymentMaster");
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
            navigate("/StudentPaymentMaster");
          });

        // alert(`Error Code: ${response.error.code}`);
        // alert(`Error Description: ${response.error.description}`);
        // alert(`Error Source: ${response.error.source}`);
        // alert(`Error Step: ${response.error.step}`);
        // alert(`Error Reason: ${response.error.reason}`);
        // alert(`Order ID: ${response.error.metadata.order_id}`);
        // alert(`Payment ID: ${response.error.metadata.payment_id}`);
      });

      rzp1.open();
    }
  };

  return (
    <>
      <Grid container justifyContent="center" alignItems="center">
        <Grid item xs={12} align="center">
          <Paper
            elevation={4}
            sx={{
              width: "50%",
              height: "400px",
              textAlign: "center",
              margin: 20,
              background: "#edeff7",
              borderRadius: 4,
            }}
          >
            <Grid
              container
              justifyContent="center"
              rowSpacing={2}
              alignItems="center"
            >
              <Grid item xs={12}>
                <img
                  src={acharyaLogo}
                  style={{ width: "20%", borderRadius: "8px" }}
                />
              </Grid>

              <Grid item xs={12}>
                <Typography
                  variant="subtitle2"
                  sx={{ fontSize: 25, fontFamily: "Serif" }}
                >
                  Your Transaction ID : {response.data.id}
                </Typography>
                <Typography
                  variant="subtitle2"
                  sx={{ fontSize: 25, fontFamily: "Serif" }}
                >
                  Amount : {response.data.amount / 100}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Button
                  sx={{ borderRadius: 2 }}
                  variant="contained"
                  color="success"
                  onClick={handlePayment}
                >
                  Pay Now
                </Button>
                <Button
                  sx={{ borderRadius: 2, ml: 2 }}
                  variant="contained"
                  color="error"
                  onClick={() => navigate("/StudentPaymentMaster/College")}
                >
                  Cancel
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </>
  );
}
export default StudentRazorPayWindow;
