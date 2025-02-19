import { Button, Grid, Paper, Typography } from "@mui/material";
import acharyaLogo from "../../../assets/acharyaLogo.png";
import axios from "../../../services/Api";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useEffect, useState } from "react";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import useAlert from "../../../hooks/useAlert";
import { useNavigate } from "react-router-dom";

const username = JSON.parse(sessionStorage.getItem("AcharyaErpUser"))?.userName;

function StudentExamFee() {
  const [values, setValues] = useState({ mobile: "" });
  const [voucherData, setVoucherData] = useState([]);
  const [payTillYears, setPayTillYears] = useState([]);
  const [data, setData] = useState([]);
  const [totalPaying, setTotalPaying] = useState();
  const [alert, setAlert] = useState("");
  const [studentData, setStudentData] = useState([]);
  const [loading, setLoading] = useState(false);

  const { setAlertMessage, setAlertOpen } = useAlert();
  const navigate = useNavigate();

  const checks = {
    mobile: [values.mobile !== "", /^[0-9]{10}$/.test(values.mobile)],
  };
  const errorMessages = {
    mobile: ["This field is required", "Invalid Mobile Number"],
  };

  useEffect(() => {
    let count = 0;
    payTillYears.forEach((year) => {
      voucherData[year]?.reduce((total, sum) => {
        count += Number(sum.amountPaying);
      }, 0);
    });

    setTotalPaying(count);
  }, [payTillYears, voucherData]);

  useEffect(() => {
    getVoucherData();
  }, []);

  const getVoucherData = async () => {
    try {
      const studentData = await axios.get(
        `/api/student/studentDetailsByAuid/${username}`
      );

      if (studentData.data.data.length > 0) {
        const studentDueResponse = await axios.get(
          `/api/student/getStudentDetailsForTransaction?studentId=${studentData.data.data[0].student_id}`
        );
        setStudentData(studentDueResponse.data.data);
        setValues((prev) => ({
          ...prev,
          ["mobile"]: studentDueResponse.data.data.mobile,
        }));
        setLoading(true);
        await axios
          .get(`/api/finance/feePaymentDetailsForPayment/Exam`)
          .then(async (res) => {
            if (Array.isArray(res.data.data)) {
              const years = [];
              const mainData = {};
              for (let i = 1; i <= res.data.data.length; i++) {
                years.push(i);
              }

              const allAmount = res?.data?.data?.[0]?.vocherHead?.map(
                (obj) => ({
                  ...obj,
                  amountPaying: "",
                  focused: false,
                })
              );

              years.forEach((obj) => {
                mainData[obj] = allAmount;
              });

              setPayTillYears(years);
              setVoucherData(mainData);
              setData(res.data.data[0]);
            } else {
              setAlert(res.data.data);
            }
          })
          .catch((err) => {
            setAlert(err.response ? err.response.data : "NO DATA FOUND!!!");
          });
      }
    } catch (error) {
      console.log(error);
      setAlertMessage({
        severity: "error",
        message: "NO DATA FOUND!!!",
      });
      setAlertOpen(true);
    }
  };

  const handleFocus = (entryId, feeId, e) => {
    setVoucherData((prevFeeData) => {
      // Check if the entryId exists
      if (!prevFeeData[entryId]) {
        console.warn(`No entry found with ID: ${entryId}`);
        return prevFeeData; // Return previous state
      }

      const updatedFees = voucherData[entryId].map((fee) => {
        if (fee.voucher_head_new_id === feeId) {
          return { ...fee, focused: true };
        }
        return fee; // Return unchanged fee
      });

      return { ...voucherData, [entryId]: updatedFees }; // Update the specific entry
    });
  };

  const handleBlur = (entryId, feeId, e) => {
    setVoucherData((prevFeeData) => {
      // Check if the entryId exists
      if (!prevFeeData[entryId]) {
        console.warn(`No entry found with ID: ${entryId}`);
        return prevFeeData; // Return previous state
      }

      const updatedFees = voucherData[entryId].map((fee) => {
        if (fee.voucher_head_new_id === feeId) {
          return { ...fee, focused: false };
        }
        return fee; // Return unchanged fee
      });

      return { ...voucherData, [entryId]: updatedFees }; // Update the specific entry
    });
  };

  const handleChange = (entryId, feeId, e) => {
    setVoucherData((prevFeeData) => {
      // Check if the entryId exists
      if (!prevFeeData[entryId]) {
        console.warn(`No entry found with ID: ${entryId}`);
        return prevFeeData; // Return previous state
      }

      const updatedFees = voucherData[entryId].map((fee) => {
        if (fee.voucher_head_new_id === feeId) {
          return { ...fee, amountPaying: parseFloat(e.target.value) || 0 };
        }
        return fee; // Return unchanged fee
      });

      return { ...voucherData, [entryId]: updatedFees }; // Update the specific entry
    });
  };

  const handleChangeMobile = (e) => {
    setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCreate = async () => {
    try {
      if (values.mobile === "") {
        setAlertMessage({
          severity: "error",
          message: "Please enter mobile number",
        });
        setAlertOpen(true);
      } else {
        const payload = {
          mobile: values.mobile,
          studentId: data.student_id,
          schoolId: studentData?.schoolId,
          currentYear: studentData.currentYear,
          currentSem: studentData.currentSem,
          total: totalPaying,
          acYearId: data.ac_year_id,
        };
        const yearWise = [];

        payTillYears.forEach((year) => {
          voucherData[year].forEach((obj) => {
            if (obj.amountPaying > 0)
              yearWise.push({
                sem: year,
                amount: obj.amountPaying,
                feeType: obj.voucher_head,
                voucherHeadNewId: obj.voucher_head_new_id,
                paidYear: year,
              });
          });
        });

        payload.examFeeDetails = yearWise;

        const paymentResponse = await axios.post(
          `/api/student/examFee`,
          payload
        );

        if (paymentResponse.status === 200 || paymentResponse.status === 201) {
          navigate("/student-razor-pay", {
            state: {
              response: paymentResponse.data,
              student_data: studentData,
              mobile: values.mobile,
              schoolId: studentData?.schoolId,
              feeName: "Exam",
            },
          });
        }
      }
    } catch (error) {
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
        rowSpacing={2}
      >
        <Grid item xs={12} align="center">
          <Typography variant="subtitle2" color="error">
            Note : Students are required to pay the university exam fee as per
            the notification issued by the institute. Any exam fee paid beyond
            the prescribed date and time will not be considered
          </Typography>
        </Grid>
        <Grid item xs={12} md={2.8}>
          <Paper
            elevation={4}
            sx={{
              padding: "20px",
              background: "	#F0F0F0",
              borderRadius: "15px",
            }}
          >
            <Grid container justifyContent="center" alignItems="center">
              <Grid item xs={12} align="center">
                <img
                  src={acharyaLogo}
                  style={{ width: "25%", borderRadius: "8px" }}
                />
              </Grid>

              {loading ? (
                <>
                  <Grid item xs={12} align="center">
                    <Typography variant="subtitle2" sx={{ fontSize: 14 }}>
                      {studentData?.studentName}
                    </Typography>
                    <Typography variant="subtitle2" sx={{ fontSize: 14 }}>
                      {studentData.auid
                        ? `${studentData.auid}  (${studentData.currentYear} / ${studentData.currentSem})  `
                        : ""}
                    </Typography>
                  </Grid>
                  {payTillYears.length > 0 ? (
                    <>
                      <Grid item xs={12} mt={2}>
                        <Paper
                          elevation={4}
                          sx={{ padding: "12px", borderRadius: "8px" }}
                        >
                          <Grid
                            container
                            justifyContent="flex-start"
                            alignItems="center"
                            rowSpacing={1}
                          >
                            {payTillYears.map((obj, i) => {
                              return (
                                <>
                                  <Grid item xs={12} key={i}>
                                    <Accordion
                                      sx={{
                                        background: "#F0F0F0",
                                      }}
                                    >
                                      <AccordionSummary
                                        expandIcon={<ExpandMoreIcon />}
                                        aria-controls="panel1-content"
                                        id="panel1-header"
                                      >
                                        <Typography variant="subtitle2">
                                          {"SEM-" + obj}
                                        </Typography>
                                      </AccordionSummary>
                                      <AccordionDetails>
                                        <Grid
                                          container
                                          justifyContent="flex-start"
                                          alignItems="center"
                                          rowSpacing={2}
                                        >
                                          {voucherData[obj]?.map((obj1, j) => {
                                            return (
                                              <>
                                                <Grid item xs={12}>
                                                  <CustomTextField
                                                    name={obj1.amountPaying}
                                                    label={
                                                      !obj1.focused
                                                        ? obj1.voucher_head
                                                        : "Enter Amount"
                                                    }
                                                    handleChange={(e) =>
                                                      handleChange(
                                                        obj,
                                                        obj1.voucher_head_new_id,
                                                        e
                                                      )
                                                    }
                                                    value={obj1.amountPaying}
                                                    onFocus={(e) =>
                                                      handleFocus(
                                                        obj,
                                                        obj1.voucher_head_new_id,
                                                        e
                                                      )
                                                    }
                                                    onBlur={(e) =>
                                                      handleBlur(
                                                        obj,
                                                        obj1.voucher_head_new_id,
                                                        e
                                                      )
                                                    }
                                                  />
                                                </Grid>
                                              </>
                                            );
                                          })}

                                          <Grid item xs={12}>
                                            <CustomTextField
                                              label="Total"
                                              value={voucherData?.[obj]?.reduce(
                                                (total, sum) =>
                                                  Number(total) +
                                                  Number(sum.amountPaying),
                                                0
                                              )}
                                            />
                                          </Grid>
                                        </Grid>
                                      </AccordionDetails>
                                    </Accordion>
                                  </Grid>
                                </>
                              );
                            })}
                          </Grid>
                        </Paper>
                      </Grid>
                      <Grid item xs={12} mt={2}>
                        <CustomTextField
                          name="totalPaying"
                          label="Total Paying"
                          value={totalPaying}
                        />
                      </Grid>
                      <Grid item xs={12} mt={2}>
                        <Grid item xs={12} mt={2}>
                          <CustomTextField
                            type="number"
                            name="mobile"
                            value={values.mobile}
                            label="Mobile Number"
                            handleChange={handleChangeMobile}
                            checks={checks.mobile}
                            errors={errorMessages.mobile}
                            required
                          />
                        </Grid>
                      </Grid>
                      <Grid item xs={12} mt={1}>
                        <Button
                          variant="contained"
                          sx={{ width: "100%" }}
                          onClick={handleCreate}
                        >
                          Pay Now
                        </Button>
                      </Grid>
                    </>
                  ) : (
                    <>
                      <Grid item xs={12} align="center">
                        <Typography variant="subtitle2" color="error">
                          {alert?.toUpperCase()}
                        </Typography>
                      </Grid>
                    </>
                  )}
                  <Grid item xs={12} mt={1} md={12} align="center">
                    <Typography variant="subtitle2" sx={{ fontSize: 14 }}>
                      For any queries please mail / contact us :
                    </Typography>

                    <Typography variant="subtitle2" sx={{ fontSize: 14 }}>
                      accounts@acharya.ac.in / 6364883311
                    </Typography>
                  </Grid>{" "}
                </>
              ) : (
                <>
                  <Grid item xs={12} align="center">
                    <Typography variant="subtitle2" color="error">
                      NO DATA FOUND!!!
                    </Typography>
                  </Grid>
                  <Grid item xs={12} mt={1} md={12} align="center">
                    <Typography variant="subtitle2" sx={{ fontSize: 14 }}>
                      For any queries please mail / contact us :
                    </Typography>

                    <Typography variant="subtitle2" sx={{ fontSize: 14 }}>
                      accounts@acharya.ac.in / 6364883311
                    </Typography>
                  </Grid>{" "}
                </>
              )}
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </>
  );
}
export default StudentExamFee;
