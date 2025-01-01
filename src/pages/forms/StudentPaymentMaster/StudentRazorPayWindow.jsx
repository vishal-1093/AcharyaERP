import { Button, Grid, Paper, Typography } from "@mui/material";
import acharyaLogo from "../../../assets/acharyaLogo.png";
import axios from "../../../services/Api";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useAlert from "../../../hooks/useAlert";
import logo from "../../../assets/logo4.png";

function StudentRazorPayWindow() {
  const location = useLocation();
  const response = location?.state?.response;
  const studentData = location?.state?.student_data;
  const mobile = location?.state?.mobile;
  const schoolId = location?.state?.schoolId;
  const feeName = location?.state?.feeName;

  const navigate = useNavigate();

  const { setAlertMessage, setAlertOpen } = useAlert();

  const credentials = [
    {
      id: 1,
      active: 1,
      api_key: "rzp_live_vw8L6lV4d4KDW7",
      merchant_id: "JCnyPTW66LKxXZ",
      razor_pay_key: "rzp_live_vw8L6lV4d4KDW7",
      secret_key: "9OZPRV6t2vTLjSILvqtzutD7",
      status: "LIVE",
      school_id: 9,
    },
    {
      id: 2,
      active: 1,
      api_key: "rzp_live_OoIhuQOKSbWKo8",
      merchant_id: "JCo7qyUfbjCToq",
      razor_pay_key: "rzp_live_OoIhuQOKSbWKo8",
      secret_key: "SduL8xjja2TIBVFaKxV5eojJ",
      status: "LIVE",
      school_id: 2,
    },
    {
      id: 3,
      active: 1,
      api_key: "rzp_live_6E0DZsoI2tQVOK",
      merchant_id: "JCnPZwWbMcWEDE",
      razor_pay_key: "rzp_live_6E0DZsoI2tQVOK",
      secret_key: "MIudHe4DSzdl7J6pTh4S8z2e",
      status: "LIVE",
      school_id: 8,
    },
    {
      id: 4,
      active: 1,
      api_key: "rzp_live_Mc9QR55m4ubG54",
      merchant_id: "JCnGrJkuzkEzCy",
      razor_pay_key: "rzp_live_Mc9QR55m4ubG54",
      secret_key: "jlglTwx739XxVtya2sfXGyEl",
      status: "LIVE",
      school_id: 5,
    },
    {
      id: 5,
      active: 1,
      api_key: "rzp_live_QHDVmcBtnRjysG",
      merchant_id: "JBh34Nm4eDMgzr",
      razor_pay_key: "rzp_live_QHDVmcBtnRjysG",
      secret_key: "pQmFx0mO42G25NyUtcgDtwU1",
      status: "LIVE",
      school_id: 7,
    },
    {
      id: 6,
      active: 1,
      api_key: "rzp_live_QJnGNE6nqwt3Gr",
      merchant_id: "JBglPUhO5FVULx",
      razor_pay_key: "rzp_live_QJnGNE6nqwt3Gr",
      secret_key: "oSlHzMwPgg5T5fkrCY2mz1GQ",
      status: "LIVE",
      school_id: 4,
    },
    {
      id: 7,
      active: 1,
      api_key: "rzp_live_XiUSgyXNtjOxue",
      merchant_id: "J2X2SbPeLlMNxd",
      razor_pay_key: "rzp_live_XiUSgyXNtjOxue",
      secret_key: "IXa4wSnzKDKCvpTRvPdi3HYL",
      status: "LIVE",
      school_id: 6,
    },
    {
      id: 8,
      active: 1,
      api_key: "rzp_live_qAqDDWIaYn8nfB",
      merchant_id: "J2WWeEsSWfYDAT",
      razor_pay_key: "rzp_live_qAqDDWIaYn8nfB",
      secret_key: "vPZ4FlfLPqKzkDX6R008n3xL",
      status: "LIVE",
      school_id: 1,
    },
    {
      id: 9,
      active: 1,
      api_key: "rzp_live_NVZ5zCNi7ORYE2",
      merchant_id: "J1Lf8rGgNIWcct",
      razor_pay_key: "rzp_live_NVZ5zCNi7ORYE2",
      secret_key: "j8deLOjlbrahhQCj21LjNXHR",
      status: "LIVE",
      school_id: 3,
    },
    {
      id: 10,
      active: 1,
      api_key: "rzp_live_Mc9QR55m4ubG54",
      merchant_id: "JCnGrJkuzkEzCy",
      razor_pay_key: "rzp_live_Mc9QR55m4ubG54",
      secret_key: "jlglTwx739XxVtya2sfXGyEl",
      status: "LIVE",
      school_id: 10,
    },
    {
      id: 11,
      active: 1,
      api_key: "rzp_live_Ci2TrgkYM4FB7N",
      merchant_id: "JCoxBzEB1glfx2",
      razor_pay_key: "rzp_live_Ci2TrgkYM4FB7N",
      secret_key: "soK6eNaOY45y1LCJjrYO14sG",
      status: "LIVE",
      school_id: 13,
    },
  ];

  const razor_key = credentials.filter((key) => key.school_id === schoolId);

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

  let API;
  if (feeName === "Miscellanous") {
    API = "bulkPaymentStatus";
  } else {
    API = "paymentStatus";
  }
  useEffect(() => {
    handlePayment();
  }, [window.Razorpay]);

  const handlePayment = () => {
    if (window.Razorpay) {
      const options = {
        key: razor_key?.api_key, // Enter the Key ID generated from the Dashboard
        amount: response.data.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
        currency: "INR",
        name: `Acharya Institutes`,
        description: "",
        image: `${logo}`,
        order_id: response.data.id, // This is a sample Order ID
        handler: function (response) {
          const data = {
            status: "success",
            razorpayPaymentId: response.razorpay_payment_id,
            razorpayOrderId: response.razorpay_order_id,
            razorpaySignature: response.razorpay_signature,
          };

          axios
            .post(`/api/student/${API}`, data)
            .then((res) => {
              if (res.status === 200 || res.status === 201) {
                setAlertMessage({
                  severity: "success",
                  message: "Payment completed successfully",
                });
                setAlertOpen(true);
                handlenavigate();
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
              handlenavigate();
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
          .post(`/api/student/${API}`, data)
          .then((res) => {
            if (res.status === 200 || res.status === 201) {
              setAlertMessage({
                severity: "error",
                message: "Payment Failed",
              });
              setAlertOpen(true);
              handlenavigate();
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
            handlenavigate();
          });
      });
    }
  };

  const handlenavigate = () => {
    if (feeName.toLowerCase() === "miscellanous") {
      navigate(`/Feepayment/${feeName}`);
    } else if (feeName.toLowerCase() === "exam") {
      navigate(`/Feepayment/${feeName}`);
    } else if (feeName.toLowerCase() === "college") {
      navigate(`/StudentPaymentMaster/${feeName}`);
    } else if (feeName.toLowerCase() === "hostel") {
      navigate(`/StudentPaymentMaster/${feeName}`);
    }
  };

  return (
    <>
      <Grid container justifyContent="center" alignItems="center">
        <Grid item xs={12} md={8} align="center">
          <Paper
            elevation={4}
            sx={{
              // width: "50%",
              height: "400px",
              textAlign: "center",
              marginTop: "40px",
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
                  style={{ width: "12%", borderRadius: "8px" }}
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
                  onClick={handlenavigate}
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
