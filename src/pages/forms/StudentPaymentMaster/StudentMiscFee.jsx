import { Button, Grid, Paper, Typography } from "@mui/material";
import acharyaLogo from "../../../assets/acharyaLogo.png";
import { useEffect, useState } from "react";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import axios from "../../../services/Api";
import useAlert from "../../../hooks/useAlert";
import { useNavigate } from "react-router-dom";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";

const username = JSON.parse(sessionStorage.getItem("AcharyaErpUser"))?.userName;

const requiredFields = ["mobile"];

function StudentMiscFee() {
  const [studentData, setStudentData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    mobile: "",
    voucherId: null,
    payingNow: "",
  });
  const [voucherData, setVoucherData] = useState([]);

  const { setAlertMessage, setAlertOpen } = useAlert();
  const navigate = useNavigate();

  const checks = {
    mobile: [data.mobile !== "", /^[0-9]{10}$/.test(data.mobile)],
    payingNow: [/^[0-9]{1,100}$/.test(data.payingNow)],
  };
  const errorMessages = {
    mobile: [
      "This field is required",
      "Please provide indian valid mobile number",
    ],
    payingNow: ["Enter only numbers"],
  };

  useEffect(() => {
    getStudentDues();
    getVoucherData();
  }, []);

  const getVoucherData = async () => {
    await axios
      .get(`/api/finance/feePaymentDetailsForPayment/BULK`)
      .then((res) => {
        setVoucherData(
          res.data.data.vocherHead.map((obj) => ({
            amount: obj.amount,
            fee_payment_window_id: obj.fee_payment_window_id,
            label: obj.voucher_head,
            value: obj.voucher_head_new_id,
            fixed: obj.fixed,
          }))
        );
      });
  };

  const getStudentDues = async () => {
    try {
      const studentDataResponse = await axios.get(
        `/api/student/studentDetailsByAuid/${username}`
      );

      if (studentDataResponse.data.data.length > 0) {
        const studentDueResponse = await axios.get(
          `/api/student/getStudentDetailsForTransaction?studentId=${studentDataResponse.data.data[0].student_id}`
        );
        setStudentData(studentDueResponse.data.data);
        setData((prev) => ({
          ...prev,
          ["mobile"]: studentDueResponse.data.data.mobile,
        }));
        setLoading(true);
      } else {
        setAlertMessage({
          severity: "error",
          message: "Student Data Not Found...",
        });
        setAlertOpen(true);
      }
    } catch (error) {
      setAlertMessage({
        severity: "error",
        message: error.response.data.message,
      });
      setAlertOpen(true);
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const voucherSelected = voucherData.find(
      (obj) => obj.value === data.voucherId
    );

    if (e.target.name === "mobile") {
      setData((prev) => ({
        ...prev,
        [e.target.name]: e.target.value,
      }));
    } else {
      setData((prev) => ({
        ...prev,
        [e.target.name]: e.target.value,
        ["payingNow"]:
          voucherSelected.amount === 0
            ? e.target.value
            : e.target.value > voucherSelected.amount
            ? voucherSelected.amount
            : e.target.value,
      }));
    }
  };

  const handleChangeAdvance = (name, newValue) => {
    const voucherSelected = voucherData.find((obj) => obj.value === newValue);

    if (voucherSelected.fixed) {
      setData((prev) => ({
        ...prev,
        [name]: newValue,
        ["payingNow"]: voucherSelected.amount,
        ["disabled"]: true,
      }));
    } else {
      setData((prev) => ({
        ...prev,
        [name]: newValue,
        ["payingNow"]: "",
        ["disabled"]: false,
      }));
    }
  };

  const requiredFieldsValid = () => {
    for (let i = 0; i < requiredFields.length; i++) {
      const field = requiredFields[i];
      if (Object.keys(checks).includes(field)) {
        const ch = checks[field];
        for (let j = 0; j < ch.length; j++) if (!ch[j]) return false;
      } else if (!data[field]) return false;
    }
    return true;
  };

  const handleCreate = async () => {
    try {
      if (data.mobile === "") {
        setAlertMessage({
          severity: "error",
          message: "Please enter mobile number",
        });
        setAlertOpen(true);
      } else {
        const feeHeadSelected = voucherData?.find(
          (obj) => obj.value === data.voucherId
        );

        const payload = {
          studentId: studentData?.studentId,
          schoolId: studentData?.schoolId,
          currentYear: studentData?.currentYear,
          currentSem: studentData?.currentSem,
          acYearId: studentData?.acYearId,
          mobile: data.mobile,
          feehead: feeHeadSelected?.label,
          voucherHeadId: data.voucherId,
          amount: data.payingNow,
        };

        const paymentResponse = await axios.post(
          `/api/student/bulkPayment`,
          payload
        );

        if (paymentResponse.status === 200 || paymentResponse.status === 201) {
          navigate("/student-razor-pay", {
            state: {
              response: paymentResponse.data,
              student_data: studentData,
              mobile: data.mobile,
              schoolId: studentData?.schoolId,
              feeName: "Miscellanous",
            },
          });
        }
      }
    } catch (error) {
      console.log(error);
      setAlertMessage({
        severity: "error",
        message: error.response ? error.response.data.message : "Error Occured",
      });
      setAlertOpen(true);
    }
  };

  return (
    <>
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        sx={{ height: "80%" }}
      >
        <Grid item xs={12} md={2.8}>
          <Paper
            elevation={4}
            sx={{
              padding: "20px",
              background: "	#F0F0F0",
              borderRadius: "15px",
            }}
          >
            <Grid
              container
              justifyContent="center"
              rowSpacing={2}
              alignItems="center"
            >
              <Grid item xs={12} align="center">
                <img
                  src={acharyaLogo}
                  style={{ width: "25%", borderRadius: "8px" }}
                />
              </Grid>

              {loading ? (
                <>
                  <Grid item xs={12} align="center">
                    <CustomTextField
                      name="name"
                      value={studentData?.studentName}
                    />
                  </Grid>
                  <Grid item xs={12} align="center">
                    <CustomTextField name="name" value={studentData?.auid} />
                  </Grid>
                  <Grid item xs={12} mt={2}>
                    <CustomTextField
                      name="mobile"
                      value={data.mobile}
                      label="Mobile Number"
                      handleChange={handleChange}
                      checks={checks.mobile}
                      errors={errorMessages.mobile}
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <CustomAutocomplete
                      name="voucherId"
                      label="Fee Head"
                      value={data.voucherId}
                      handleChangeAdvance={handleChangeAdvance}
                      options={voucherData}
                    />
                  </Grid>
                  <Grid item xs={12} mt={2}>
                    <CustomTextField
                      type="number"
                      name="payingNow"
                      label={data.payingNow === "" ? "Enter Amount" : ""}
                      value={data.payingNow}
                      handleChange={!data.disabled ? handleChange : ""}
                      checks={checks.payingNow}
                      errors={errorMessages.payingNow}
                      disabled={data.voucherId === null}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Button
                      variant="contained"
                      sx={{ width: "100%" }}
                      onClick={handleCreate}
                      disabled={!requiredFieldsValid()}
                    >
                      Pay Now
                    </Button>
                  </Grid>

                  <Grid item xs={12} md={12} align="center">
                    <Typography variant="subtitle2" sx={{ fontSize: 14 }}>
                      For any queries please mail / contact us :
                    </Typography>

                    <Typography variant="subtitle2" sx={{ fontSize: 14 }}>
                      accounts@acharya.ac.in / 6364883311
                    </Typography>
                  </Grid>
                </>
              ) : (
                <>
                  <Grid item xs={12} align="center">
                    <Typography variant="subtitle2" color="error">
                      NO DATA FOUND!!!
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={12} align="center">
                    <Typography variant="subtitle2" sx={{ fontSize: 14 }}>
                      For any queries please mail / contact us :
                    </Typography>

                    <Typography variant="subtitle2" sx={{ fontSize: 14 }}>
                      accounts@acharya.ac.in / 6364883311
                    </Typography>
                  </Grid>
                </>
              )}
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </>
  );
}
export default StudentMiscFee;
