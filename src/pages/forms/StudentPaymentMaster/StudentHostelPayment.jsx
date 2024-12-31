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

const username = JSON.parse(sessionStorage.getItem("AcharyaErpUser"))?.userName;

function StudentHostelPayment() {
  const [values, setValues] = useState([]);
  const [totalPay, setTotalPay] = useState(null);
  const [studentData, setStudentData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({ mobile: "" });
  const [hostelDueData, setHostelDueData] = useState([]);

  const { setAlertMessage, setAlertOpen } = useAlert();
  const navigate = useNavigate();

  const checks = {
    mobile: [data.mobile !== "", /^[0-9]{10}$/.test(data.mobile)],
  };
  const errorMessages = {
    mobile: ["This field is required", "Invalid Mobile Number"],
  };

  useEffect(() => {
    getStudentDues();
  }, []);

  useEffect(() => {
    const temp = [];
    hostelDueData.map((obj) => {
      if (obj.checked) {
        temp.push(obj.total_amount);
      }
    });

    const totalPaying = temp.reduce((a, b) => Number(a) + Number(b), 0);

    setTotalPay(totalPaying);
  }, [values]);

  const getStudentDues = async () => {
    try {
      const studentDataResponse = await axios.get(
        `/api/student/studentDetailsByAuid/${username}`
      );

      if (studentDataResponse.data.data.length > 0) {
        const hostelDueResponse = await axios.get(
          `/api/finance/studentHostelDue/${studentDataResponse.data.data[0].student_id}`
        );

        const checktill = [1];

        const newArray = hostelDueResponse.data.data.map((obj) => ({
          ...obj,
          active: false,
          checked: checktill[0],
          freeze: checktill[0],
        }));

        setHostelDueData(newArray);

        const studentDueResponse = await axios.get(
          `/api/student/getStudentDetailsForTransaction?studentId=${studentDataResponse.data.data[0].student_id}`
        );
        setStudentData(studentDueResponse.data.data);
        setData((prev) => ({
          ...prev,
          ["mobile"]: studentDueResponse.data.data.mobile,
        }));
        setLoading(true);
        const array = [];
        const allsems = [];
        const onlySems = [];

        for (let i = 1; i <= studentDueResponse.data.data.numberOfSem; i++) {
          allsems.push("sem" + i);
          onlySems.push(i);
        }

        for (let i = 1; i <= studentDueResponse.data.data.lockTill; i++) {
          onlySems.push(i);
        }

        const checktillSem = onlySems.map(
          (obj) => obj <= studentDueResponse.data.data.lockTill
        );

        allsems.map((obj, i) => {
          const year = i + 1;

          Object.keys(studentDueResponse.data.data.feeTemplate).map(
            (obj1, j) => {
              Object.keys(studentDueResponse.data.data.feeCma).map((obj2) => {
                Object.keys(
                  studentDueResponse.data.data.uniformAndStationary
                ).map((obj3) => {
                  Object.keys(studentDueResponse.data.data.lateFee).map(
                    (obj4) => {
                      if (
                        obj === obj1 &&
                        obj1 === obj2 &&
                        obj2 === obj3 &&
                        obj3 === obj4
                      ) {
                        array.push({
                          active: false,
                          sems: "sem" + year,
                          checked: checktillSem[i],
                          freeze: checktillSem[i],
                          ["SEM-" + year]: obj,
                          semNames: "SEM-" + year,
                          balance_fee:
                            studentDueResponse.data.data.feeTemplate[obj],
                          total_due:
                            Number(
                              studentDueResponse.data.data.feeTemplate[obj]
                            ) +
                            Number(
                              studentDueResponse.data.data.uniformAndStationary[
                                obj
                              ]
                            ) +
                            Number(studentDueResponse.data.data.feeCma[obj]) +
                            Number(studentDueResponse.data.data.lateFee[obj]),
                          special_fee: studentDueResponse.data.data.feeCma[obj],
                          uniform_due:
                            studentDueResponse.data.data.uniformAndStationary[
                              obj
                            ],
                          late_fee: studentDueResponse.data.data.lateFee[obj],
                        });
                      }
                    }
                  );
                });
              });
            }
          );

          const newArray = array.filter((obj) => obj.total_due > 0);

          setValues(newArray);
        });
      } else {
        setAlertMessage({
          severity: "error",
          message: "No student data found",
        });
        setAlertOpen(true);
      }
    } catch (error) {
      console.log(error);

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

  const handleChangeTotalPay = (e) => {
    setTotalPay(e.target.value);
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

  const handleCreate = async () => {
    try {
      if (data.mobile === "") {
        setAlertMessage({
          severity: "error",
          message: "Please enter mobile number",
        });
        setAlertOpen(true);
      } else {
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
          totalDue: totalPay,
          schoolId: studentData?.schoolId,
        };

        values.forEach((obj, i) => {
          if (obj.checked === true) {
            uniformAndStationary[obj.sems] = Number(obj.uniform_due.toFixed(2));
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

                  {hostelDueData.length > 0 ? (
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
                            rowSpacing={1.5}
                          >
                            {hostelDueData.map((obj, i) => {
                              return (
                                <>
                                  <Grid item xs={12} key={i}>
                                    <Paper
                                      elevation={2}
                                      sx={{
                                        background: "#F0F0F0",
                                        borderRadius: "10px",
                                      }}
                                    >
                                      <Grid
                                        container
                                        justifyContent="flex-start"
                                        alignItems="center"
                                        columnSpacing={1}
                                      >
                                        <Grid item xs={2} md={2}>
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

                                        <Grid item xs={7} md={6}>
                                          <Typography variant="subtitle2">
                                            {obj.ac_year}
                                          </Typography>
                                        </Grid>
                                        <Grid item xs={1} md={3} align="right">
                                          <Typography variant="subtitle2">
                                            {obj.total_amount}
                                          </Typography>
                                        </Grid>
                                        <Grid item xs={1} md={1}></Grid>
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
                        >
                          NO HOSTEL DUES
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
export default StudentHostelPayment;
