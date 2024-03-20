import { lazy, useEffect, useState } from "react";
import axios from "../../../services/Api";
import { Box, Button, CircularProgress, Grid, Typography } from "@mui/material";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import useAlert from "../../../hooks/useAlert";
import { convertDateYYYYMMDD } from "../../../utils/Utils";
const FormWrapper = lazy(() => import("../../../components/FormWrapper"));
const CustomDatePicker = lazy(() =>
  import("../../../components/Inputs/CustomDatePicker")
);
const CustomAutocomplete = lazy(() =>
  import("../../../components/Inputs/CustomAutocomplete")
);
const initialValues = { month: null, date: "" };

const triggerOption = [
  { value: "Attendance", label: "Attendance" },
  { value: "Salary", label: "Salary" },
  { value: "BiometricAttendance", label: "Biometric Attendance" },
  { value: "StudentDueReport", label: "Student Due Report" },
  { value: "EmployeesRejoined", label: "Employees Rejoined leave Pattern" },
  { value: "LeavePattern", label: "Employee Leave Pattern" },
  { value: "BioTransaction", label: "Employee Bio Transaction" },
];
function EmpAttendanceTrigger() {
  const [values, setValues] = useState(initialValues);
  const [data, setData] = useState(initialValues);
  const setCrumbs = useBreadcrumbs();
  const { setAlertMessage, setAlertOpen } = useAlert();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setCrumbs([{ name: "Scheduler Trigger" }]);
  }, []);

  const handleChangeAdvance = (name, newValue) => {
    setValues((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleChangeTrigger = async (name, newValue) => {
    setData((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleCreate = async () => {
    const splitMonth = values?.month?.substr(0, 7)?.split("-");
    const temp = {};
    temp.month = parseInt(splitMonth?.[1]);
    temp.year = parseInt(splitMonth?.[0]);
    setLoading(true);
    if (data?.trigger === "Attendance") {
      await axios
        .post(
          `/api/employee/employeeAttendanceTrigger?month=${temp.month}&year=${temp.year}`
        )
        .then((res) => {
          if (res.status === 200) {
            setAlertMessage({
              severity: "success",
              message: "Attendace Query Executed successfully !!",
            });
            setAlertOpen(true);
            setLoading(false);
            setValues(initialValues);
          }
        })
        .catch((err) => {
          setAlertMessage({
            severity: "error",
            message: "Execution Failed !!",
          });
          setAlertOpen(true);
          setLoading(false);
          setData("");
        });
    } else if (data?.trigger === "Salary") {
      await axios
        .post(
          `/api/employee/calculateEmployeeSalaryTrigger?month=${temp.month}&year=${temp.year}`
        )
        .then((res) => {
          if (res.status === 200) {
            setAlertMessage({
              severity: "success",
              message: "Salary Query Executed successfully !!",
            });
            setAlertOpen(true);
            setLoading(false);
          }
        })
        .catch((err) => {
          setAlertMessage({
            severity: "error",
            message: "Execution Failed !!",
          });
          setAlertOpen(true);
          setLoading(false);
        });
    } else if (data?.trigger === "BiometricAttendance") {
      await axios
        .post(
          `/api/employee/biometricAttendenceTrigger?month=${temp.month}&year=${temp.year}`
        )
        .then((res) => {
          if (res.status === 200) {
            setAlertMessage({
              severity: "success",
              message: "Biometric Attendance Query Executed successfully !!",
            });
            setAlertOpen(true);
            setLoading(false);
          }
        })
        .catch((err) => {
          setAlertMessage({
            severity: "error",
            message: "Execution Failed !!",
          });
          setAlertOpen(true);
          setLoading(false);
        });
    } else if (data?.trigger === "StudentDueReport") {
      await axios
        .post(`/api/student/studentDueReportTrigger`)
        .then((res) => {
          if (res.status === 200) {
            setAlertMessage({
              severity: "success",
              message: "Student Due Report Query Executed successfully !!",
            });
            setAlertOpen(true);
            setLoading(false);
          }
        })
        .catch((err) => {
          setAlertMessage({
            severity: "error",
            message: "Execution Failed !!",
          });
          setAlertOpen(true);
          setLoading(false);
        });
    } else if (data?.trigger === "EmployeesRejoined") {
      await axios
        .post(`/api/employee/employeeLeaveTriggerForRejoinedEmployees`)
        .then((res) => {
          if (res.status === 200) {
            setAlertMessage({
              severity: "success",
              message: "Employee Leave Rejoined Query Executed successfully !!",
            });
            setAlertOpen(true);
            setLoading(false);
          }
        })
        .catch((err) => {
          setAlertMessage({
            severity: "error",
            message: "Execution Failed !!",
          });
          setAlertOpen(true);
          setLoading(false);
        });
    } else if (data?.trigger === "LeavePattern") {
      await axios
        .post(`/api/employee/employeeLeavePatternTrigger`)
        .then((res) => {
          if (res.status === 200) {
            setAlertMessage({
              severity: "success",
              message: "Employee Leave Pattern Query Executed successfully !!",
            });
            setAlertOpen(true);
            setLoading(false);
          }
        })
        .catch((err) => {
          setAlertMessage({
            severity: "error",
            message: "Execution Failed !!",
          });
          setAlertOpen(true);
          setLoading(false);
        });
    } else if (data?.trigger === "BioTransaction") {
      await axios
        .post(
          `/api/employee/bioTransactionTrigger?date=${convertDateYYYYMMDD(
            values.date
          )}`
        )
        .then((res) => {
          if (res.status === 200) {
            setAlertMessage({
              severity: "success",
              message: "Bio Transection Query Executed successfully !!",
            });
            setAlertOpen(true);
            setLoading(false);
          }
        })
        .catch((err) => {
          setAlertMessage({
            severity: "error",
            message: "Execution Failed !!",
          });
          setAlertOpen(true);
          setLoading(false);
        });
    }
  };

  return (
    <Box>
      <FormWrapper>
        <Grid container columnSpacing={2} rowSpacing={2}>
          <Grid item xs={12} md={4}>
            <CustomAutocomplete
              name="trigger"
              label="Type"
              value={data.trigger}
              options={triggerOption}
              handleChangeAdvance={handleChangeTrigger}
            />
          </Grid>
          {(data?.trigger === "Attendance" ||
            data?.trigger === "Salary" ||
            data?.trigger === "BiometricAttendance") && (
            <Grid item xs={12} md={4}>
              <CustomDatePicker
                name="month"
                label="Month"
                value={values.month}
                handleChangeAdvance={handleChangeAdvance}
                views={["month", "year"]}
                openTo="month"
                inputFormat="MM/YYYY"
                helperText="mm/yyyy"
                disabled={data?.trigger === "StudentDueReport"}
              />
            </Grid>
          )}
          {data?.trigger === "BioTransaction" && (
            <Grid item xs={12} md={4}>
              <CustomDatePicker
                name="date"
                label="Requested Date"
                value={values.date}
                handleChangeAdvance={handleChangeAdvance}
              />
            </Grid>
          )}
          <Grid
            item
            xs={12}
            md={data?.trigger !== "StudentDueReport" ? 4 : 8}
            align="right"
          >
            <Button
              variant="contained"
              onClick={handleCreate}
              disabled={loading}
            >
              {loading ? (
                <CircularProgress
                  size={20}
                  color="blue"
                  style={{ margin: "0px 16px" }}
                />
              ) : (
                <Typography variant="subtitle2">Execute</Typography>
              )}
            </Button>
          </Grid>
        </Grid>
      </FormWrapper>
    </Box>
  );
}

export default EmpAttendanceTrigger;
