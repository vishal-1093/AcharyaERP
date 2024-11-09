import { useEffect, useState } from "react";
import axiosNoToken from "../../../services/ApiWithoutToken";
import {
  Box,
  Button,
  Divider,
  Grid,
  Paper,
  styled,
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import logo from "../../../assets/acharyaLogo.png";
import { useNavigate, useParams } from "react-router-dom";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import useAlert from "../../../hooks/useAlert";
import moment from "moment";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.tableBg.main,
    color: theme.palette.tableBg.textColor,
    border: "1px solid rgba(224, 224, 224, 1)",
  },
}));

const StyledTableCellBody = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.body}`]: {
    border: "1px solid rgba(224, 224, 224, 1)",
  },
}));

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
  const [transactionData, setTransactionData] = useState([]);

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

  useEffect(() => {
    getTransactionData();
  }, [values.npfStatus]);

  const stripTime = (date) => {
    const newDate = new Date(date);
    newDate.setHours(0, 0, 0, 0);
    return newDate;
  };

  const isCurrentDateGreater = (givenDate) => {
    const currentDate = stripTime(new Date());
    const targetDate = stripTime(new Date(givenDate));

    return currentDate > targetDate;
  };

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
        applicationNoNpf,
        link_exp: linkExp,
        school_id,
      } = response.data;

      const linkExpFormat = linkExp?.split("-").reverse().join("-");

      setValues((prev) => ({
        ...prev,
        candidateName,
        email,
        program,
        amount,
        npfStatus,
        voucherHeadId,
        mobile,
        applicationNoNpf,
        linkExp: isCurrentDateGreater(linkExpFormat),
        school_id,
      }));
    } catch (err) {
      setAlertMessage({
        severity: "error",
        message: err.response?.data?.message || "Failed to load Data !!",
      });
      setAlertOpen(true);
    }
  };

  const getTransactionData = async () => {
    const { npfStatus } = values;

    if (npfStatus !== 4) return;
    try {
      const { data: response } = await axiosNoToken.get(
        "/api/student/getCandidateTransactionDetails",
        { params: { candidateId: id } }
      );
      setTransactionData(response.data);
    } catch (err) {
      setAlertMessage({
        severity: "error",
        message:
          err.response?.data?.message ||
          "Failed to load Transaction Details !!",
      });
      setAlertOpen(true);
    }
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
      const { mobile, voucherHeadId, amount, school_id } = values;
      const postData = {
        studentId: id,
        mobile,
        voucherHeadId,
        amount,
        schoolId: school_id,
      };
      const { data: response } = await axiosNoToken.post(
        "/api/student/registrationFee",
        postData
      );
      const { status } = response;
      if (status === 200 || status === 201) {
        navigate("/candidate-razor-pay", {
          state: {
            response: response.data,
            candidateId: id,
            schoolId: school_id,
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

  const DisplayText = ({ label }) => (
    <Typography variant="subtitle2" color="textSecondary">
      {label}
    </Typography>
  );

  const DisplayContent = ({ label, value }) => {
    return (
      <>
        <Grid item xs={12} md={3}>
          <Typography variant="subtitle2">{label}</Typography>
        </Grid>
        <Grid item xs={12} md={9}>
          <Typography variant="subtitle2" color="textSecondary">
            {value}
          </Typography>
        </Grid>
      </>
    );
  };

  const validateDisable = () => {
    const { mobile } = values;
    if (!mobile) return true;
    if (Object.keys(checks).includes("mobile")) {
      const ch = checks["mobile"];
      for (let j = 0; j < ch.length; j++) if (!ch[j]) return true;
    }
    return false;
  };

  return (
    <>
      {values.npfStatus === 4 ? (
        <Box
          sx={{
            margin: { xs: "20px", md: "50px" },
          }}
        >
          <Grid container justifyContent="center">
            <Grid item xs={12} md={6}>
              <Paper elevation={4} sx={{ padding: 4, borderRadius: "15px" }}>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <Grid container>
                    <Grid item xs={12} align="center">
                      <img src={logo} width="120px" />
                    </Grid>
                    <Grid item xs={12} align="center">
                      <Divider sx={{ padding: 0 }} />
                    </Grid>
                  </Grid>
                  <Paper
                    elevation={2}
                    sx={{
                      padding: 4,
                      borderLeft: 6,
                      borderColor: "success.main",
                      marginTop: 2,
                    }}
                  >
                    <Grid container rowSpacing={1} columnSpacing={2}>
                      <DisplayContent
                        label="Application No."
                        value={values.applicationNoNpf}
                      />
                      <DisplayContent
                        label="Name"
                        value={values.candidateName}
                      />
                      <DisplayContent
                        label="Mobile No."
                        value={values.mobile}
                      />
                      <DisplayContent label="Email" value={values.email} />
                    </Grid>
                  </Paper>
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <StyledTableCell>Order ID</StyledTableCell>
                          <StyledTableCell>Transaction ID</StyledTableCell>
                          <StyledTableCell>Payment ID</StyledTableCell>
                          <StyledTableCell>Transaction Date</StyledTableCell>
                          <StyledTableCell>Status</StyledTableCell>
                        </TableRow>
                      </TableHead>

                      <TableBody>
                        {transactionData?.map((obj, i) => (
                          <TableRow key={i}>
                            <StyledTableCellBody>
                              <DisplayText label={obj.orderID} />
                            </StyledTableCellBody>
                            <StyledTableCellBody>
                              <DisplayText label={obj.transactionID} />
                            </StyledTableCellBody>
                            <StyledTableCellBody>
                              <DisplayText label={obj.paymentId} />
                            </StyledTableCellBody>
                            <StyledTableCellBody>
                              <DisplayText
                                label={
                                  obj.transactionDate
                                    ? moment(obj.transactionDate).format(
                                        "DD-MM-YYYY LT"
                                      )
                                    : ""
                                }
                              />
                            </StyledTableCellBody>
                            <StyledTableCellBody>
                              <DisplayText label={obj.status} />
                            </StyledTableCellBody>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      ) : (
        <Box
          sx={{
            margin: { xs: "50px 20px 20px 20px", md: "150px 15px 0px 15px" },
          }}
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
                    {values.linkExp ? (
                      <Box sx={{ textAlign: "center" }}>
                        <Typography
                          variant="subtitle2"
                          color="error"
                          sx={{ fontSize: 14 }}
                        >
                          Payment link has been expied. Please contact Admin.
                        </Typography>
                      </Box>
                    ) : (
                      <>
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
                            disabled={validateDisable()}
                            sx={{ width: "100%" }}
                          >
                            Pay Now
                          </Button>
                        )}
                      </>
                    )}
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      )}
    </>
  );
}

export default CandidateRegistrationPayment;
