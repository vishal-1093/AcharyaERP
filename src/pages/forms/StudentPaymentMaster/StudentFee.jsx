import { Button, Grid, IconButton, Paper, Typography } from "@mui/material";
import acharyaLogo from "../../../assets/acharyaLogo.png";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import Checkbox from "@mui/material/Checkbox";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import { useEffect, useState } from "react";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import axios from "../../../services/Api";
import useAlert from "../../../hooks/useAlert";
import { useNavigate } from "react-router-dom";
import moment from "moment";

const username = JSON.parse(sessionStorage.getItem("AcharyaErpUser"))?.userName;

const requiredFields = ["mobile"];

function StudentFee() {
  const [values, setValues] = useState([]);
  const [totalPay, setTotalPay] = useState(null);
  const [studentData, setStudentData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({ mobile: "" });
  const [lockedDate, setLockedDate] = useState([]);
  const [matchingSems, setMatchingSems] = useState();
  const [buttonDisable, setButtonDisable] = useState(false);
  const [feetemplateObj, setFeetemplateObj] = useState({});
  const [feeCmaObj, setFeeCmaObj] = useState({});
  const [lateFeeObj, setLateFeeObj] = useState({});
  const [uniformObj, setUniformObj] = useState({});
  const [checkedAmount, setCheckedAmount] = useState();

  const { setAlertMessage, setAlertOpen } = useAlert();
  const navigate = useNavigate();

  const checks = {
    mobile: [data.mobile !== "", /^[0-9]{10}$/.test(data.mobile)],
  };
  const errorMessages = {
    mobile: [
      "This field is required",
      "Please provide indian valid mobile number",
    ],
  };

  useEffect(() => {
    getStudentDues();
  }, []);

  useEffect(() => {
    const temp = [];
    values.map((obj) => {
      if (obj.checked) {
        temp.push(obj.total_due);
      }
    });

    const totalPaying = temp.reduce((a, b) => Number(a) + Number(b), 0);

    setCheckedAmount(totalPaying);

    setTotalPay(totalPaying);

    const matchingSemesters = values.filter((semester) =>
      lockedDate.includes(semester.sems)
    );

    const partFeeLockedAmount = matchingSemesters.reduce(
      (total, sum) => Number(total) + Number(sum.lockedFee),
      0
    );

    setMatchingSems(partFeeLockedAmount);
  }, [lockedDate, values]);

  useEffect(() => {
    // Clear previous timeout if input changes before delay time
    const timer = setTimeout(() => {
      // Only show alert if value is less than threshold
      if (totalPay < matchingSems) {
        setAlertMessage({
          severity: "error",
          message: `You cannot pay less than ${matchingSems}`,
        });
        setAlertOpen(true);
        setButtonDisable(true);
      } else if (totalPay > checkedAmount) {
        setAlertMessage({
          severity: "error",
          message: `You cannot pay more than ${checkedAmount} , select next semester`,
        });
        setAlertOpen(true);
        setButtonDisable(true);
      } else {
        setAlertOpen(false);
        setButtonDisable(false);
      }
    }, 1000); // Wait for 1 second before triggering the alert

    // Cleanup the timer on component unmount or when the input value changes
    return () => clearTimeout(timer);
  }, [totalPay]);

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

        const allsems = [];
        const onlySems = [];
        const lockedTill = [];
        const array = [];

        const {
          feeTemplate,
          feeCma,
          uniformAndStationary,
          lateFee,
          numberOfSem,
          lockTill,
        } = studentDueResponse.data.data;

        // Populate allsems, onlySems, and lockedTill arrays
        for (let i = 1; i <= numberOfSem; i++) {
          allsems.push("sem" + i);
          onlySems.push(i);
        }

        for (let i = 1; i <= lockTill; i++) {
          lockedTill.push("sem" + i);
        }

        setLockedDate(lockedTill);

        // Check if each semester is locked
        const checktillSem = onlySems.map((sem) => sem <= lockTill);

        // Fill empty objects with default values
        const fillDefaultValues = (object) => {
          const filledObject = {};
          for (let i = 1; i <= numberOfSem; i++) {
            const semKey = "sem" + i;
            filledObject[semKey] = object[semKey] || 0; // Default value for missing semester is 0
          }
          return filledObject;
        };

        // Fill fee-related objects with default values if they're empty
        const filledFeeTemplate = fillDefaultValues(feeTemplate);
        const filledFeeCma = fillDefaultValues(feeCma);
        const filledUniformAndStationary =
          fillDefaultValues(uniformAndStationary);
        const filledLateFee = fillDefaultValues(lateFee);

        setFeetemplateObj(filledFeeTemplate);
        setFeeCmaObj(filledFeeCma);
        setLateFeeObj(filledLateFee);
        setUniformObj(filledUniformAndStationary);

        // Process each semester
        allsems.forEach((sem, i) => {
          const year = i + 1; // This is the semester number (1-based)

          // Iterate over feeTemplate, feeCma, uniformAndStationary, and lateFee
          Object.entries(filledFeeTemplate).forEach(
            ([templateKey, templateValue]) => {
              Object.entries(filledFeeCma).forEach(([cmaKey, cmaValue]) => {
                Object.entries(filledUniformAndStationary).forEach(
                  ([uniformKey, uniformValue]) => {
                    Object.entries(filledLateFee).forEach(
                      ([lateFeeKey, lateFeeValue]) => {
                        // Only proceed if all keys match
                        if (
                          sem === templateKey &&
                          templateKey === cmaKey &&
                          cmaKey === uniformKey &&
                          uniformKey === lateFeeKey
                        ) {
                          const total_due =
                            Number(templateValue) +
                            Number(uniformValue) +
                            Number(cmaValue) +
                            Number(lateFeeValue);

                          // Add the semester fee data if there's a due fee
                          if (total_due > 0) {
                            array.push({
                              active: false,
                              sems: "sem" + year,
                              checked: checktillSem[i],
                              freeze: checktillSem[i],
                              ["SEM-" + year]: sem,
                              semNames: "SEM-" + year,
                              balance_fee: templateValue,
                              total_due: total_due,
                              special_fee: cmaValue,
                              uniform_due: uniformValue,
                              late_fee: lateFeeValue,
                              lockedFee:
                                (Number(cmaValue) || 0) +
                                (Number(lateFeeValue) || 0) +
                                Number(uniformValue || 0),
                            });
                          }
                        }
                      }
                    );
                  }
                );
              });
            }
          );
        });

        // Filter out semesters with no due fees
        const newArray = array.filter((obj) => obj.total_due > 0);

        setValues(newArray);

        setLoading(true);
      } else {
        setAlertMessage({
          severity: "error",
          message: "No student data found",
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

  const handleOpen = (index) => {
    setValues((prev) =>
      prev.map((obj, i) => {
        if (index == i) return { ...obj, ["active"]: true };
        return obj;
      })
    );
  };

  const handleClose = (index) => {
    setValues((prev) =>
      prev.map((obj, i) => {
        if (index == i) return { ...obj, ["active"]: false };
        return obj;
      })
    );
  };

  const handleChange = (e) => {
    setData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const date = new Date(studentData.partFeeDate);
  const currentDate = new Date();
  const partFeeDate = new Date(date);

  const date1WithoutTime = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    currentDate.getDate()
  );
  const date2WithoutTime = new Date(
    partFeeDate.getFullYear(),
    partFeeDate.getMonth(),
    partFeeDate.getDate()
  );

  const handleChangeTotalPay = (e) => {
    if (date1WithoutTime <= date2WithoutTime) {
      setTotalPay(e.target.value);
    }
  };

  const validAmount = (partFeeAmount) => {
    if (partFeeAmount < matchingSems) {
      setAlertMessage({
        severity: "error",
        message: `You cannot pay less than ${matchingSems}`,
      });
      setAlertOpen(true);
      setButtonDisable(true);
    } else {
      setAlertOpen(false);
      setButtonDisable(false);
    }
  };

  const handleCheckboxChange = (index) => {
    setValues((prevCheckboxes) => {
      const newCheckboxes = [...prevCheckboxes];

      // If the checkbox is being checked
      if (!newCheckboxes[index].checked) {
        // Check if previous checkboxes are checked
        if (index > 0 && !prevCheckboxes[index - 1].checked) {
          // Prevent checking this checkbox if previous ones are not checked
          return prevCheckboxes;
        } else {
          // Check the current checkbox and uncheck all subsequent checkboxes
          for (let i = index; i < newCheckboxes.length; i++) {
            newCheckboxes[i].checked = false;
          }
          newCheckboxes[index].checked = true;
        }
      } else {
        for (let i = index; i < newCheckboxes.length; i++) {
          newCheckboxes[i].checked = false;
        }
      }

      return newCheckboxes;
    });
  };

  const isCheckboxDisabled = (index) => {
    return index > 0 && !values[index - 1].checked;
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
        const latestSelected = values?.filter((obj) => obj?.checked);
        const lastObject = latestSelected?.[latestSelected.length - 1];

        const uniformAndStationary = {};
        const feeCma = {};
        const feeTemplate = {};
        const lateFee = {};
        const allSems = [];
        for (let i = 1; i <= studentData.numberOfSem; i++) {
          allSems.push("sem" + i);
        }

        const payload = {
          studentId: studentData?.studentId,
          currentYear: studentData?.currentYear,
          currentSem: studentData?.currentSem,
          acYearId: studentData?.acYearId,
          hostelDue: studentData?.hostelDue?.totalDue,
          totalDue: Number(totalPay),
          schoolId: studentData?.schoolId,
          partFeeDate: studentData?.partFeeDate,
          allowSem: studentData?.allowSem ?? lastObject?.selectedSem,
        };

        values.forEach((obj, i) => {
          if (obj.checked) {
            uniformAndStationary[obj.sems] = 0;
            feeCma[obj.sems] = Number(obj.special_fee.toFixed(2));
            feeTemplate[obj.sems] = Number(obj.balance_fee.toFixed(2));
            lateFee[obj.sems] = Number(obj.late_fee.toFixed(2));
          }
        });

        payload.feeTemplate = feeTemplate;
        payload.lateFee = lateFee;
        payload.feeCma = feeCma;
        payload.uniformAndStationary = uniformAndStationary;

        const paymentResponse = await axios.post(
          `/api/student/studentTransaction`,
          payload
        );

        if (paymentResponse.status === 200 || paymentResponse.status === 201) {
          navigate("/student-razor-pay", {
            state: {
              response: paymentResponse.data,
              student_data: studentData,
              mobile: data.mobile,
              schoolId: studentData?.schoolId,
              feeName: "College",
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
                      {studentData?.auid} (
                      {` ${studentData?.currentYear} / ${studentData?.currentSem} `}
                      )
                    </Typography>
                  </Grid>

                  {values.length > 0 ? (
                    <>
                      <Grid item xs={12} mt={2}>
                        <Paper
                          elevation={4}
                          sx={{ padding: "10px", borderRadius: "8px" }}
                        >
                          <Grid
                            container
                            justifyContent="flex-start"
                            alignItems="center"
                            rowSpacing={1.2}
                          >
                            {values.map((obj, i) => {
                              return (
                                <>
                                  <Grid item xs={12} key={i}>
                                    <Paper
                                      elevation={2}
                                      sx={{
                                        background: "#F0F0F0",
                                        borderRadius: "20px",
                                        padding: obj.active ? "10px" : "",
                                      }}
                                    >
                                      <Grid
                                        container
                                        justifyContent="flex-start"
                                        alignItems="center"
                                        columnSpacing={1}
                                      >
                                        <Grid item xs={2} md={2} lg={2}>
                                          <Checkbox
                                            icon={<RadioButtonUncheckedIcon />}
                                            checkedIcon={<CheckCircleIcon />}
                                            onChange={(e) =>
                                              handleCheckboxChange(i)
                                            }
                                            checked={obj.checked}
                                            sx={{
                                              "& .MuiCheckbox-root": {
                                                borderRadius: "50%",
                                                border: "1px solid",
                                                color: "white",
                                                padding: 0,
                                                "&.Mui-checked": {
                                                  backgroundColor: "white",
                                                  color: "common.white",
                                                },
                                                "& .MuiSvgIcon-root": {
                                                  fontSize: 10,
                                                },
                                              },
                                            }}
                                            color="default"
                                            inputProps={{
                                              "aria-label": "custom checkbox",
                                            }}
                                            disabled={
                                              obj.freeze ||
                                              isCheckboxDisabled(i)
                                            }
                                          />
                                        </Grid>

                                        <Grid item xs={6} md={6} lg={6}>
                                          <Typography variant="subtitle2">
                                            {obj.semNames}
                                          </Typography>
                                        </Grid>
                                        <Grid
                                          item
                                          xs={2}
                                          md={2}
                                          lg={2}
                                          align="right"
                                        >
                                          <Typography
                                            variant="subtitle2"
                                            sx={{ textAlign: "right" }}
                                          >
                                            {obj.total_due}
                                          </Typography>
                                        </Grid>
                                        <Grid item xs={2} md={2} lg={2}>
                                          {obj.active ? (
                                            <>
                                              <IconButton
                                                onClick={() => handleClose(i)}
                                              >
                                                <ArrowDropUpIcon />
                                              </IconButton>
                                            </>
                                          ) : (
                                            <>
                                              <IconButton
                                                onClick={() => handleOpen(i)}
                                              >
                                                <ArrowDropDownIcon />
                                              </IconButton>
                                            </>
                                          )}
                                        </Grid>
                                        {obj.active ? (
                                          <>
                                            <Grid item xs={2} md={2}></Grid>

                                            {obj.balance_fee > 0 ? (
                                              <>
                                                <Grid item xs={6} md={6}>
                                                  <Typography variant="subtitle2">
                                                    Balance Fee
                                                  </Typography>
                                                </Grid>
                                                <Grid
                                                  item
                                                  xs={2}
                                                  md={2}
                                                  align="right"
                                                >
                                                  <Typography
                                                    variant="subtitle2"
                                                    sx={{ textAlign: "right" }}
                                                  >
                                                    {obj.balance_fee}
                                                  </Typography>
                                                </Grid>
                                                <Grid item xs={2} md={2}></Grid>
                                              </>
                                            ) : (
                                              <>
                                                <Grid item xs={6} md={6}></Grid>
                                                <Grid item xs={4} md={4}></Grid>
                                              </>
                                            )}

                                            {obj.uniform_due > 0 ? (
                                              <>
                                                <Grid item xs={2} md={2}></Grid>
                                                <Grid item xs={6} md={6}>
                                                  <Typography variant="subtitle2">
                                                    Uniform & Books
                                                  </Typography>
                                                </Grid>
                                                <Grid
                                                  item
                                                  xs={2}
                                                  md={2}
                                                  align="right"
                                                >
                                                  <Typography
                                                    variant="subtitle2"
                                                    sx={{ textAlign: "right" }}
                                                  >
                                                    {obj.uniform_due}
                                                  </Typography>
                                                </Grid>
                                                <Grid item xs={2} md={2}></Grid>
                                              </>
                                            ) : (
                                              <>
                                                <Grid item xs={2} md={2}></Grid>
                                                <Grid item xs={6} md={6}></Grid>
                                                <Grid item xs={4} md={4}></Grid>
                                              </>
                                            )}

                                            {obj.special_fee > 0 ? (
                                              <>
                                                <Grid item xs={2} md={2}></Grid>
                                                <Grid item xs={6} md={6}>
                                                  <Typography variant="subtitle2">
                                                    Add-on Fee
                                                  </Typography>
                                                </Grid>
                                                <Grid
                                                  item
                                                  xs={2}
                                                  md={2}
                                                  align="right"
                                                >
                                                  <Typography
                                                    variant="subtitle2"
                                                    sx={{ textAlign: "right" }}
                                                  >
                                                    {obj.special_fee}
                                                  </Typography>
                                                </Grid>
                                                <Grid item xs={2} md={2}></Grid>
                                              </>
                                            ) : (
                                              <>
                                                <Grid item xs={2} md={2}></Grid>
                                                <Grid item xs={6} md={6}></Grid>
                                                <Grid item xs={4} md={4}></Grid>
                                              </>
                                            )}

                                            {obj.late_fee > 0 ? (
                                              <>
                                                <Grid item xs={2} md={2}></Grid>
                                                <Grid item xs={6} md={6}>
                                                  <Typography variant="subtitle2">
                                                    Late Fee
                                                  </Typography>
                                                </Grid>
                                                <Grid
                                                  item
                                                  xs={2}
                                                  md={2}
                                                  align="right"
                                                >
                                                  <Typography
                                                    variant="subtitle2"
                                                    sx={{ textAlign: "right" }}
                                                  >
                                                    {obj.late_fee}
                                                  </Typography>
                                                </Grid>
                                                <Grid item xs={2} md={2}></Grid>
                                              </>
                                            ) : (
                                              <>
                                                <Grid item xs={2} md={2}></Grid>
                                                <Grid item xs={6} md={6}></Grid>
                                                <Grid item xs={4} md={4}></Grid>
                                              </>
                                            )}

                                            {obj.total_due > 0 ? (
                                              <>
                                                <Grid item xs={2} md={2}></Grid>
                                                <Grid item xs={6} md={6}>
                                                  <Typography variant="subtitle2">
                                                    Net Amount
                                                  </Typography>
                                                </Grid>
                                                <Grid
                                                  item
                                                  xs={2}
                                                  md={2}
                                                  align="right"
                                                >
                                                  <Typography
                                                    variant="subtitle2"
                                                    sx={{ textAlign: "right" }}
                                                  >
                                                    {obj.total_due}
                                                  </Typography>
                                                </Grid>
                                                <Grid item xs={2} md={2}></Grid>
                                              </>
                                            ) : (
                                              <>
                                                <Grid item xs={2} md={2}></Grid>
                                                <Grid item xs={6} md={6}></Grid>
                                                <Grid item xs={4} md={4}></Grid>
                                              </>
                                            )}
                                          </>
                                        ) : (
                                          <></>
                                        )}
                                      </Grid>
                                    </Paper>
                                  </Grid>
                                </>
                              );
                            })}
                          </Grid>
                        </Paper>
                      </Grid>
                      <Grid item xs={12} mt={2}>
                        <CustomTextField
                          type="number"
                          name="totalPaying"
                          label="Total Paying"
                          value={totalPay}
                          handleChange={handleChangeTotalPay}
                        />
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

                      <Grid item xs={12} md={12} mt={1}>
                        <Button
                          variant="contained"
                          sx={{ width: "100%" }}
                          onClick={handleCreate}
                          disabled={!requiredFieldsValid() || buttonDisable}
                        >
                          Pay Now
                        </Button>
                      </Grid>
                    </>
                  ) : (
                    <>
                      <Grid item xs={12} align="center">
                        <Typography
                          sx={{ fontSize: 15 }}
                          variant="subtitle2"
                          color="error"
                        ></Typography>
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
                  </Grid>
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
export default StudentFee;
