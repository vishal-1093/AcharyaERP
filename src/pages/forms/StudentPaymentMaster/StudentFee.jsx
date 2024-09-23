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

function StudentFee() {
  const [values, setValues] = useState([]);
  const [totalPay, setTotalPay] = useState([]);
  const [studentData, setStudentData] = useState([]);
  const [loading, setLoading] = useState(false);

  const { setAlertMessage, setAlertOpen } = useAlert();

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
    setTotalPay(temp);
  }, [values]);

  const getStudentDues = async () => {
    try {
      const studentDueResponse = await axios.get(
        `/api/student/getStudentDetailsForTransaction?studentId=2776`
      );
      setStudentData(studentDueResponse.data.data);

      const array = [];
      const allsems = [];

      for (let i = 1; i <= studentDueResponse.data.data.numberOfSem; i++) {
        allsems.push("sem" + i);
      }

      allsems.map((obj, i) => {
        const year = i + 1;

        Object.keys(studentDueResponse.data.data.feeTemplate[0]).map(
          (obj1, j) => {
            Object.keys(studentDueResponse.data.data.feeCma).map((obj2) => {
              Object.keys(
                studentDueResponse.data.data.uniformAndStationary
              ).map((obj3) => {
                if (obj === obj1 && obj1 === obj2 && obj2 === obj3) {
                  array.push({
                    active: false,
                    sems: "sem" + year,
                    checked:
                      year === studentDueResponse?.data?.data?.currentSem,
                    ["SEM-" + year]: obj,
                    semNames: "SEM-" + year,
                    balance_fee:
                      studentDueResponse.data.data.feeTemplate[0][obj],
                    total_due:
                      Number(studentDueResponse.data.data.feeTemplate[0][obj]) +
                      Number(
                        studentDueResponse.data.data.uniformAndStationary[obj]
                      ),
                    special_fee: studentDueResponse.data.data.feeCma[obj],
                    uniform_due:
                      studentDueResponse.data.data.uniformAndStationary[obj],
                  });
                }
              });
            });
          }
        );
        const newArray = array.filter((obj) => obj.total_due > 0);

        setValues(newArray);
      });
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
        // If unchecking a checkbox, simply toggle it
        newCheckboxes[index].checked = false;
      }

      return newCheckboxes;
    });
  };

  const isCheckboxDisabled = (index) => {
    return index > 0 && !values[index - 1].checked;
  };

  const handleCreate = async () => {
    try {
      const uniformfee = {};
      const feeCma = {};
      const allSems = [];
      for (let i = 1; i <= studentData.numberOfSem; i++) {
        allSems.push("sem" + i);
      }

      const payload = {
        studentId: 2776,
        studentId: 1,
        currentYear: 1,
        currentSem: 1,
        acYearId: 1,
        hostelDue: 190000,
        totalDue: totalPay.reduce((a, b) => Number(a) + Number(b), 0),
      };

      values.forEach((obj, i) => {
        const year = i + 1;
        if (obj.checked === true) {
          uniformfee[obj.sems] = obj.uniform_due;
          feeCma[obj.sems] = obj.special_fee;
        }
      });
      payload.feeCma = feeCma;
      payload.uniformfee = uniformfee;

      const paymentResponse = await axios.post(
        `/api/student/studentTransaction`,
        payload
      );

      console.log(paymentResponse);
    } catch {}
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
              alignItems="center"
              //   rowSpacing={2}
            >
              <Grid item xs={12} align="center">
                <img
                  src={acharyaLogo}
                  style={{ width: "25%", borderRadius: "8px" }}
                />
              </Grid>
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
                      const year = i + 1;
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
                                    onChange={(e) => handleCheckboxChange(i)}
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
                                    disabled={isCheckboxDisabled(i)}
                                  />
                                </Grid>

                                <Grid item xs={5} md={6} lg={6}>
                                  <Typography variant="subtitle2">
                                    {obj.semNames}
                                  </Typography>
                                </Grid>
                                <Grid item xs={3} md={2} lg={2}>
                                  <Typography variant="subtitle2">
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
                                      <IconButton onClick={() => handleOpen(i)}>
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
                                        <Grid item xs={4} md={4}>
                                          <Typography variant="subtitle2">
                                            {obj.balance_fee}
                                          </Typography>
                                        </Grid>
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
                                            Uniform & Stationary Fee
                                          </Typography>
                                        </Grid>
                                        <Grid item xs={4} md={4}>
                                          <Typography variant="subtitle2">
                                            {obj.uniform_due}
                                          </Typography>
                                        </Grid>
                                      </>
                                    ) : (
                                      <>
                                        <Grid item xs={2} md={2}></Grid>
                                        <Grid item xs={6} md={6}></Grid>
                                        <Grid item xs={4} md={4}></Grid>
                                      </>
                                    )}

                                    {obj.fee_template > 0 ? (
                                      <>
                                        <Grid item xs={2} md={2}></Grid>
                                        <Grid item xs={6} md={6}>
                                          <Typography variant="subtitle2">
                                            Special Fee
                                          </Typography>
                                        </Grid>
                                        <Grid item xs={4} md={4}>
                                          <Typography variant="subtitle2">
                                            {obj.special_fee}
                                          </Typography>
                                        </Grid>
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
                                        <Grid item xs={4} md={4}>
                                          <Typography variant="subtitle2">
                                            {obj.late_fee}
                                          </Typography>
                                        </Grid>
                                      </>
                                    ) : (
                                      <>
                                        <Grid item xs={2} md={2}></Grid>
                                        <Grid item xs={6} md={6}></Grid>
                                        <Grid item xs={4} md={4}></Grid>
                                      </>
                                    )}

                                    {obj.total_due ? (
                                      <>
                                        <Grid item xs={2} md={2}></Grid>
                                        <Grid item xs={6} md={6}>
                                          <Typography variant="subtitle2">
                                            Net Amount
                                          </Typography>
                                        </Grid>
                                        <Grid item xs={4} md={4}>
                                          <Typography variant="subtitle2">
                                            {obj.total_due}
                                          </Typography>
                                        </Grid>
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
                  name="totalPaying"
                  label="Total Paying"
                  value={totalPay.reduce((a, b) => Number(a) + Number(b), 0)}
                />
              </Grid>
              <Grid item xs={12} mt={2}>
                <CustomTextField name="totalPaying" label="Mobile Number" />
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
              <Grid item xs={12} mt={1}>
                <Button sx={{ width: "100%" }}>Back</Button>
              </Grid>

              <Grid item xs={12} mt={1} md={12} align="center">
                <Typography variant="subtitle2" sx={{ fontSize: 14 }}>
                  For any queries please mail / contact us :
                </Typography>

                <Typography variant="subtitle2" sx={{ fontSize: 14 }}>
                  accounts@acharya.ac.in / 6364883311
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </>
  );
}
export default StudentFee;
