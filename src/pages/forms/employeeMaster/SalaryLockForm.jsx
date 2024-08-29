import { lazy, useEffect, useState } from "react";
import axios from "../../../services/Api";
import { Box, Button, CircularProgress, Grid, Typography } from "@mui/material";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import useAlert from "../../../hooks/useAlert";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import dayjs from "dayjs";
import { convertUTCtoTimeZone } from "../../../utils/DateTimeUtils";
import moment from "moment";
const FormWrapper = lazy(() => import("../../../components/FormWrapper"));
const CustomDatePicker = lazy(() =>
  import("../../../components/Inputs/CustomDatePicker")
);

const initialValues = { month: null, leaveDate: null, payRollDate: null };

const requiredFields = ["month", "leaveDate", "payRollDate"];

const token = JSON.parse(sessionStorage.getItem("AcharyaErpUser"))?.token;

function SalaryLockForm() {
  const [isNew, setIsNew] = useState(true);
  const [values, setValues] = useState(initialValues);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const setCrumbs = useBreadcrumbs();
  const { setAlertMessage, setAlertOpen } = useAlert();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { id } = useParams();

  useEffect(() => {
    if (pathname.toLowerCase() === "/salarylockform/new") {
      setIsNew(true);
      setCrumbs([
        { name: "Salary Lock", link: "/RestrictWindow/salary" },
        { name: "Create" },
      ]);
    } else {
      setIsNew(false);
      getSalaryData();
      setCrumbs([
        { name: "Salary Lock", link: "/RestrictWindow/salary" },
        { name: "Update" },
      ]);
    }
  }, [pathname]);

  useEffect(() => {
    validateLeaveDate();
  }, [values.leaveDate, values.payRollDate]);

  const validateLeaveDate = () => {
    const { leaveDate, payRollDate } = values;

    if (leaveDate && payRollDate) {
      const leaveMoment = moment(leaveDate, "YYYY-MM-DD");
      const payRollMoment = moment(payRollDate, "YYYY-MM-DD");

      if (leaveMoment.isAfter(payRollMoment)) {
        setValues((prev) => ({
          ...prev,
          payRollDate: leaveDate,
        }));
      }
    }
  };

  const getSalaryData = async () => {
    await axios
      .get(`/api/lockScreen/getLockDateById/${id}`)
      .then((res) => {
        setValues({
          month: convertUTCtoTimeZone(
            dayjs(
              new Date(
                res.data.data.lock_year.toString() +
                  "-" +
                  res.data.data.lock_month.toString() +
                  "-01"
              )
            )
          ),
          leaveDate: res.data.data.leave_lock_date,
          payRollDate: res.data.data.payroll_lock_date,
        });

        setData(res.data.data);
      })
      .catch((err) => console.error(err));
  };

  const handleChangeAdvance = (name, newValue) => {
    setValues((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const requiredFieldsValid = () => {
    for (let i = 0; i < requiredFields.length; i++) {
      const field = requiredFields[i];
      if (!values[field]) return false;
    }
    return true;
  };

  const handleCreate = async () => {
    const splitMonth = values?.month?.substr(0, 7)?.split("-");

    const temp = {};
    temp.lock_month = splitMonth?.[1];
    temp.lock_year = splitMonth?.[0];
    temp.leave_lock_date = values.leaveDate;
    temp.payroll_lock_date = values.payRollDate;

    setLoading(true);
    await axios
      .post(`/api/lockScreen/saveLockDates?token=${token}`, temp)
      .then((res) => {
        if (res.data.status === 200) {
          setAlertMessage({
            severity: "success",
            message: "Salary lock date is created successfully !!",
          });
          setAlertOpen(true);
          navigate("/RestrictWindow/salary");
        }
      })
      .catch((err) => {
        setAlertMessage({
          severity: "error",
          message: err.response
            ? err.response.data.message
            : "An error occured",
        });
        setAlertOpen(true);
        setLoading(false);
      });
  };

  const handleUpdate = async () => {
    const splitMonth = values?.month?.substr(0, 7)?.split("-");

    const temp = { ...data };
    temp.lock_month = splitMonth?.[1];
    temp.lock_year = splitMonth?.[0];
    temp.leave_lock_date = values.leaveDate;
    temp.payroll_lock_date = values.payRollDate;

    await axios
      .put(`/api/lockScreen/updateLockDates/${id}?token=${token}`, temp)
      .then((res) => {
        if (res.data.status === 200) {
          setAlertMessage({
            severity: "success",
            message: "Salary lock date updated successfully !!",
          });

          setAlertOpen(true);
          navigate("/RestrictWindow/salary");
        }
      })
      .catch((err) => {
        setAlertMessage({
          severity: "error",
          message: err.response
            ? err.response.data.message
            : "An error occured",
        });
        setAlertOpen(true);
      });
  };

  return (
    <Box>
      <FormWrapper>
        <Grid container columnSpacing={2} rowSpacing={2}>
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
              disabled={!isNew}
              required
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <CustomDatePicker
              name="leaveDate"
              label="Attendance Lock Date"
              value={values.leaveDate}
              handleChangeAdvance={handleChangeAdvance}
              required
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <CustomDatePicker
              name="payRollDate"
              label="Pay Roll Lock"
              value={values.payRollDate}
              handleChangeAdvance={handleChangeAdvance}
              minDate={values.leaveDate}
              required
            />
          </Grid>

          <Grid item xs={12} align="right">
            <Button
              variant="contained"
              onClick={isNew ? handleCreate : handleUpdate}
              disabled={loading || !requiredFieldsValid()}
            >
              {loading ? (
                <CircularProgress
                  size={25}
                  color="blue"
                  style={{ margin: "2px 13px" }}
                />
              ) : (
                <Typography variant="subtitle2">
                  {isNew ? "Create" : "Update"}
                </Typography>
              )}
            </Button>
          </Grid>
        </Grid>
      </FormWrapper>
    </Box>
  );
}

export default SalaryLockForm;
