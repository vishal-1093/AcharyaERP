import { lazy, useEffect, useState } from "react";
import axiosNoToken from "../../../services/ApiWithoutToken";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Grid,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import acharyaLogo from "../../../assets/acharyaLogo.png";
import { Link, useParams } from "react-router-dom";
import payMe from "../../../assets/payme.png";
import click from "../../../assets/click.jpg";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import PrintIcon from "@mui/icons-material/Print";
const CustomTextField = lazy(() =>
  import("../../../components/Inputs/CustomTextField")
);

const initialValues = {
  name: "",
  email: "",
  mobileNo: "+998",
  auid: "",
  amount: "",
};

const requiredFields = ["name", "email", "mobileNo", "auid", "amount"];

function ExternalPaymentForm() {
  const [values, setValues] = useState(initialValues);
  const [data, setData] = useState([]);
  const [isFixed, setIsFixed] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [printPath, setPrintPath] = useState();

  const { id, orderId, type } = useParams();

  const checks = {
    name: [values.name !== ""],
    email: [
      values.email !== "",
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        values.email
      ),
    ],
    mobileNo: [
      values.mobileNo !== "",
      /^([+])+998+([0-9]){9}$/.test(values.mobileNo),
    ],
    amount: [values.amount !== "", /^[0-9]*$/.test(values.amount)],
  };

  const errorMessages = {
    name: ["This field is required"],
    email: ["This field is required", "Invalid email"],
    mobileNo: ["This field is required", "Invalid Mobile No."],
    amount: ["This field is required", "Invalid Input"],
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    if (orderId && type === "click") {
      setPrintPath(`/ExternalPaymentSuccessPrint/${orderId}/${type}`);
      getClickPaymentStatus().then((res) => {
        if (res) {
          setPaymentSuccess(true);
        }
      });
    } else if (orderId) {
      setPrintPath(`/ExternalPaymentSuccessPrint/${orderId}`);
      getPaymentStatus().then((res) => {
        if (res) {
          setPaymentSuccess(true);
        }
      });
    }
  }, [orderId]);

  const getData = async () => {
    await axiosNoToken
      .get(`api/student/feeHeadAmountRestrictionDetailsForPayment/${id}`)
      .then((res) => {
        if (res.data.data[0]["amount"] !== null) {
          setIsFixed(true);
        }

        setValues((prev) => ({
          ...prev,
          ["amount"]:
            res.data.data[0]["amount"] === null
              ? ""
              : res.data.data[0]["amount"],
        }));
        setData(res.data.data[0]);
      })
      .catch((err) => console.error(err));
  };

  const getPaymentStatus = async () => {
    return await axiosNoToken
      .get(`/api/student/getPaymentStatus?order_id=${orderId}`)
      .then((res) => res.data.status)
      .catch((err) => console.error(err));
  };

  const getClickPaymentStatus = async () => {
    return await axiosNoToken
      .get(`/api/student/getClickPaymentStatus?merchant_trans_id=${orderId}`)
      .then((res) => res.data.status)
      .catch((err) => console.error(err));
  };

  const handleChange = (e) => {
    setValues((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const requiredFieldsValid = () => {
    for (let i = 0; i < requiredFields.length; i++) {
      const field = requiredFields[i];
      if (Object.keys(checks).includes(field)) {
        const ch = checks[field];
        for (let j = 0; j < ch.length; j++) if (!ch[j]) return false;
      } else if (!values[field]) return false;
    }
    return true;
  };

  const handlePaymePayment = async () => {
    const temp = {};
    temp.amount = values.amount * 100;
    temp.candidate_id = 0;
    temp.candidate_name = values.name;
    temp.payment_for = "External Payment";
    temp.payer_email = values.email;
    temp.mobile = values.mobileNo;
    temp.auid_or_other_info = values.auid;
    temp.fee_head_amount_restriction_id = parseInt(id);

    await axiosNoToken
      .post(`/api/student/startingOfPayment`, temp)
      .then((res) => {
        const form = document.createElement("form");
        form.method = "post";
        form.action = res.data["Url-Post"];

        Object.keys(res.data).forEach((obj) => {
          if (obj !== "Url-Post") {
            const hiddenField = document.createElement("input");
            hiddenField.type = "hidden";
            hiddenField.name = obj;
            hiddenField.value = res.data[obj];

            if (obj === "callback") {
              const callBackUrl = window.location.port
                ? window.location.protocol +
                  "//" +
                  window.location.hostname +
                  ":" +
                  window.location.port
                : window.location.protocol + "//" + window.location.hostname;

              hiddenField.value =
                callBackUrl +
                "/ExternalPayment/" +
                id +
                "/" +
                res.data["account[order_id]"];
            }

            if (obj === "merchant") {
              hiddenField.value = "6482ba4433013ca481ded2dc";
            }

            form.appendChild(hiddenField);
          }
        });

        document.body.appendChild(form);
        form.submit();
      })
      .catch((err) => console.error(err));
  };

  const handleClickPayment = async () => {
    const temp = {};
    temp.amount = parseInt(values.amount);
    temp.candidate_id = 0;
    temp.candidate_name = values.name;
    temp.payment_for = "External Payment";
    temp.payer_email = values.email;
    temp.mobile = values.mobileNo;
    temp.auid_or_other_info = values.auid;
    temp.fee_head_amount_restriction_id = parseInt(id);

    await axiosNoToken
      .post(`/api/student/startingOfClickPayment`, temp)
      .then((res) => {
        const form = document.createElement("form");
        form.method = "GET";
        form.action = res.data["Url-Get"];

        Object.keys(res.data).forEach((obj) => {
          if (obj !== "Url-Get") {
            const hiddenField = document.createElement("input");
            hiddenField.type = "hidden";
            hiddenField.name = obj;
            hiddenField.value = res.data[obj];

            if (obj === "return_url") {
              const callBackUrl = window.location.port
                ? window.location.protocol +
                  "//" +
                  window.location.hostname +
                  ":" +
                  window.location.port
                : window.location.protocol + "//" + window.location.hostname;

              hiddenField.value =
                callBackUrl +
                "/ExternalPayment/" +
                id +
                "/" +
                res.data["transaction_param"] +
                "click";
            }

            form.appendChild(hiddenField);
          }
        });

        document.body.appendChild(form);
        form.submit();
      })
      .catch((err) => console.error(err));
  };

  return (
    <Box m={4}>
      <Grid container justifyContent="center">
        <Grid item xs={12} md={4}>
          {paymentSuccess ? (
            <Grid container>
              <Grid
                item
                xs={12}
                sx={{
                  backgroundColor: "success.main",
                  color: "headerWhite.main",
                  padding: 4,
                  marginTop: 12,
                }}
                align="center"
              >
                <CheckCircleOutlineRoundedIcon sx={{ fontSize: "6rem" }} />
                <Typography variant="h6">Congratulations !!!</Typography>
              </Grid>

              <Grid item xs={12} component={Paper} p={3}>
                <Grid container>
                  <Grid item xs={12}>
                    <Typography
                      variant="subtitle2"
                      fontSize={{ xs: 12, md: 14 }}
                      color="secondary"
                      sx={{ textAlign: "center" }}
                    >
                      Payment Successfull !!!
                    </Typography>
                  </Grid>
                </Grid>

                <Grid item xs={12} align="center">
                  <Link to={printPath} target="_blank">
                    <PrintIcon
                      sx={{ color: "primary.main", textAlign: "center" }}
                      fontSize="large"
                    />
                  </Link>
                </Grid>

                <Grid item xs={12} mt={2}>
                  <Link to={`/ExternalPayment/${id}`} reloadDocument>
                    <Typography sx={{ textAlign: "center" }}>Close</Typography>
                  </Link>
                </Grid>
              </Grid>
            </Grid>
          ) : (
            <Card elevation={3}>
              <CardHeader
                avatar={<Avatar alt="Acharya universiteti" src={acharyaLogo} />}
                title="Acharya University"
                titleTypographyProps={{ variant: "subtitle2", fontSize: 16 }}
                subheader="Payment Window"
                subheaderTypographyProps={{
                  variant: "body2",
                  color: "#f7f7f7",
                }}
                sx={{
                  backgroundColor: "primary.main",
                  color: "headerWhite.main",
                  padding: 1,
                }}
              />
              <CardContent sx={{ padding: 3 }}>
                <Grid container rowSpacing={3}>
                  <Grid item xs={12} mb={1}>
                    <Typography variant="subtitle2" textAlign="justify">
                      {data?.voucherHead + " - " + data?.remarks}
                    </Typography>
                  </Grid>

                  <Grid item xs={12}>
                    <CustomTextField
                      name="name"
                      label="Name"
                      value={values.name}
                      handleChange={handleChange}
                      checks={checks.name}
                      errors={errorMessages.name}
                      required
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <CustomTextField
                      name="email"
                      label="Email"
                      value={values.email}
                      handleChange={handleChange}
                      checks={checks.email}
                      errors={errorMessages.email}
                      required
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <CustomTextField
                      name="mobileNo"
                      label="Mobile"
                      value={values.mobileNo}
                      handleChange={handleChange}
                      checks={checks.mobileNo}
                      errors={errorMessages.mobileNo}
                      required
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <CustomTextField
                      name="auid"
                      label="AUID / Any other info"
                      value={values.auid}
                      handleChange={handleChange}
                      checks={checks.auid}
                      errors={errorMessages.auid}
                      required
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <CustomTextField
                      name="amount"
                      label="Amount"
                      value={values.amount}
                      handleChange={handleChange}
                      checks={checks.amount}
                      errors={errorMessages.amount}
                      disabled={isFixed}
                      required
                    />
                  </Grid>

                  <Grid item xs={12} md={12} mb={2}>
                    <Button
                      onClick={handlePaymePayment}
                      // disabled={!requiredFieldsValid()}
                      variant="contained"
                      sx={{ width: "100%" }}
                    >
                      PAY NOW
                    </Button>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>
    </Box>
  );
}

export default ExternalPaymentForm;
