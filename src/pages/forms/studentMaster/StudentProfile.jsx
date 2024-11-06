import {
  Box,
  Button,
  Grid,
  IconButton,
  Paper,
  Typography,
} from "@mui/material";
import acharyaLogo from "../../../assets/acharyaLogo.png";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import EventAvailable from "@mui/icons-material/EventAvailable";
import { useEffect, useState } from "react";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import axios from "../../../services/Api";
import useAlert from "../../../hooks/useAlert";
import { useNavigate } from "react-router-dom";
import SchedulerMaster from "../../../components/SchedulerMaster";

const username = JSON.parse(sessionStorage.getItem("AcharyaErpUser"))?.userName;

function StudentProfile() {
  const [values, setValues] = useState([]);
  const [totalPay, setTotalPay] = useState(null);
  const [studentData, setStudentData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({ mobile: "" });

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
    values.map((obj) => {
      if (obj.checked) {
        temp.push(obj.total_due);
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

        for (let i = 1; i <= studentDueResponse.data.data.numberOfSem; i++) {
          allsems.push("sem" + i);
        }

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
                          checked:
                            year === studentDueResponse?.data?.data?.currentSem,
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
                            ),
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
        justifyContent="flex-start"
        alignItems="center"
        columnSpacing={2}
        rowSpacing={2}
      >
        <Grid item xs={12} md={3}>
          <Paper
            elevation={5}
            sx={{
              padding: "20px",
              background: "	#F0F0F0",
              borderRadius: "15px",
              height: "36vw",
            }}
          >
            <Grid container justifyContent="center" alignItems="center">
              <Grid item xs={12} align="center">
                <img
                  src={acharyaLogo}
                  style={{ width: "25%", borderRadius: "8px" }}
                />
              </Grid>
              <Grid item xs={12} md={8} align="center">
                <Typography variant="subtitle2" sx={{ fontSize: 14 }}>
                  NAME : {studentData?.studentName}
                </Typography>
              </Grid>

              <Grid item xs={12} align="center">
                <Typography variant="subtitle2" sx={{ fontSize: 14 }}>
                  AUID : {studentData?.auid} (
                  {` ${studentData?.currentYear} / ${studentData?.currentSem} `}
                  )
                </Typography>
              </Grid>

              <Grid item xs={12} mt={2}>
                <Paper
                  elevation={4}
                  sx={{
                    padding: "10px",
                    borderRadius: "8px",
                  }}
                >
                  <Grid
                    container
                    justifyContent="flex-start"
                    alignItems="center"
                    rowSpacing={2}
                  >
                    <Grid item xs={12} md={12}>
                      <Paper
                        elevation={4}
                        sx={{
                          padding: "10px",
                          borderRadius: "8px",
                          background: "#F0F0F0",
                          height: "60px",
                        }}
                      >
                        <Grid
                          container
                          justifyContent="flex-start"
                          alignItems="center"
                        >
                          <Grid item xs={12} md={3}>
                            <Box
                              sx={{
                                width: 40, // Circle diameter
                                height: 40,
                                borderRadius: "50%", // Make it a circle
                                backgroundColor: "white", // Circle color
                                display: "flex", // Flexbox to center the icon
                                justifyContent: "center", // Center horizontally
                                alignItems: "center", // Center vertically
                              }}
                            >
                              <CurrencyRupeeIcon sx={{ fontSize: 30 }} />{" "}
                              {/* Change the icon and size */}
                            </Box>
                          </Grid>
                          <Grid item xs={12} md={9}>
                            <Typography variant="subtitle2">
                              STUDENT PAYMENT
                            </Typography>
                          </Grid>
                        </Grid>
                      </Paper>
                    </Grid>
                    <Grid item xs={12} md={12}>
                      <Paper
                        elevation={4}
                        sx={{
                          padding: "10px",
                          borderRadius: "8px",
                          background: "#F0F0F0",
                          height: "60px",
                        }}
                      >
                        <Grid
                          container
                          justifyContent="flex-start"
                          alignItems="center"
                        >
                          <Grid item xs={12} md={3}>
                            <Box
                              sx={{
                                width: 40, // Circle diameter
                                height: 40,
                                borderRadius: "50%", // Make it a circle
                                backgroundColor: "white", // Circle color
                                display: "flex", // Flexbox to center the icon
                                justifyContent: "center", // Center horizontally
                                alignItems: "center", // Center vertically
                              }}
                            >
                              <MenuBookIcon sx={{ fontSize: 30 }} />{" "}
                              {/* Change the icon and size */}
                            </Box>
                          </Grid>
                          <Grid item xs={12} md={9}>
                            <Typography variant="subtitle2">COURSES</Typography>
                          </Grid>
                        </Grid>
                      </Paper>
                    </Grid>
                    <Grid item xs={12} md={12}>
                      <Paper
                        elevation={4}
                        sx={{
                          padding: "10px",
                          borderRadius: "8px",
                          background: "#F0F0F0",
                          height: "60px",
                        }}
                      >
                        <Grid
                          container
                          justifyContent="flex-start"
                          alignItems="center"
                        >
                          <Grid item xs={12} md={3}>
                            <Box
                              sx={{
                                width: 40, // Circle diameter
                                height: 40,
                                borderRadius: "50%", // Make it a circle
                                backgroundColor: "white", // Circle color
                                display: "flex", // Flexbox to center the icon
                                justifyContent: "center", // Center horizontally
                                alignItems: "center", // Center vertically
                              }}
                            >
                              <EventAvailable sx={{ fontSize: 30 }} />{" "}
                              {/* Change the icon and size */}
                            </Box>
                          </Grid>
                          <Grid item xs={12} md={9}>
                            <Typography variant="subtitle2">
                              ATTENDENCE
                            </Typography>
                          </Grid>
                        </Grid>
                      </Paper>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        <Grid item xs={12} md={9}>
          <SchedulerMaster />
        </Grid>
      </Grid>
    </>
  );
}
export default StudentProfile;
