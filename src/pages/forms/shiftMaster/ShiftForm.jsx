import { useState, useEffect } from "react";
import axios from "../../../services/Api";
import { Box, Grid, Button, CircularProgress } from "@mui/material";
import FormWrapper from "../../../components/FormWrapper";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import useAlert from "../../../hooks/useAlert";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import CustomTimePicker from "../../../components/Inputs/CustomTimePicker";
import { convertTimeToString } from "../../../utils/DateTimeUtils";
import dayjs from "dayjs";
import CustomRadioButtons from "../../../components/Inputs/CustomRadioButtons";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";
import CustomMultipleAutocomplete from "../../../components/Inputs/CustomMultipleAutocomplete";

const initValues = {
  schoolId: [],
  shiftName: "",
  startTime: null,
  endTime: null,
  graceTime: null,
  isOff: "no",
};

const requiredFields = ["shiftName", "startTime", "endTime", "graceTime"];

function ShiftForm() {
  const [isNew, setIsNew] = useState(true);
  const [values, setValues] = useState(initValues);
  const [shiftId, setShiftId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [schoolOptions, setSchoolOptions] = useState([]);

  const { setAlertMessage, setAlertOpen } = useAlert();
  const setCrumbs = useBreadcrumbs();
  const { id } = useParams();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    if (pathname.toLowerCase() === "/shiftmaster/shifts/new") {
      setIsNew(true);
      setCrumbs([
        { name: "Shift Master", link: "/ShiftMaster/Shifts" },
        { name: "Shift" },
        { name: "Create" },
      ]);
    } else {
      setIsNew(false);
      getShiftData();
    }
    getSchoolOptions();
  }, [pathname]);

  const checks = {
    shiftName: [values.shiftName !== ""],
    startTime: [values.shortName !== null],
    endTime: [values.endTime !== null],
    graceTime: [values.graceTime !== null],
  };

  const errorMessages = {
    shiftName: ["This field required"],
    startTime: ["This field required"],
    endTime: ["This field is required"],
    graceTime: ["This field is required"],
  };

  const getShiftData = async () => {
    await axios
      .get(`/api/employee/Shift/${id}`)
      .then((res) => {
        setValues((prev) => ({
          ...prev,
          shiftName: res.data.data.shiftName,
          startTime: dayjs(res.data.data.frontend_use_start_time),
          endTime: dayjs(res.data.data.frontend_use_end_time),
          graceTime: dayjs(res.data.data.actual_start_time),
          schoolId: Number(res.data.data.school_id),
          isOff: res.data.data.is_saturday === true ? "yes" : "no",
        }));

        setShiftId(res.data.data.shiftCategoryId);
        setCrumbs([
          { name: "Shift Master", link: "/ShiftMaster/Shifts" },
          { name: "Shift" },
          { name: "Update" },
          { name: res.data.data.shiftName },
        ]);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const getSchoolOptions = async () => {
    await axios
      .get(`/api/institute/school`)
      .then((res) => {
        setSchoolOptions(
          res.data.data.map((obj) => ({
            value: obj.school_id,
            label: obj.school_name,
          }))
        );
      })
      .catch((err) => console.error(err));
  };

  const handleChange = (e) => {
    if (e.target.name === "shortName") {
      setValues((prev) => ({
        ...prev,
        [e.target.name]: e.target.value.toUpperCase(),
      }));
    } else {
      setValues((prev) => ({
        ...prev,
        [e.target.name]: e.target.value,
      }));
    }
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
      if (Object.keys(checks).includes(field)) {
        const ch = checks[field];
        for (let j = 0; j < ch.length; j++) if (!ch[j]) return false;
      } else if (!values[field]) return false;
    }
    return true;
  };

  const handleCreate = async () => {
    if (!requiredFieldsValid()) {
      setAlertMessage({
        severity: "error",
        message: "Please fill all fields",
      });
      setAlertOpen(true);
    } else if (dayjs(values.endTime).isBefore(dayjs(values.startTime))) {
      setAlertMessage({
        severity: "error",
        message: "End time cannot be less than start time",
      });
      setAlertOpen(true);
    } else if (
      dayjs(
        `${dayjs(values.startTime).format("YYYY-MM-DD")} ${dayjs(
          values.graceTime
        ).format("HH:mm:ss")}`
      ).isBefore(dayjs(values.startTime))
    ) {
      setAlertMessage({
        severity: "error",
        message: "Grace time cannot be less than start time",
      });
      setAlertOpen(true);
    } else {
      setLoading(true);
      const temp = {};
      temp.active = true;
      temp.shiftName = values.shiftName;
      temp.frontend_use_start_time = values.startTime;
      temp.frontend_use_end_time = values.endTime;
      temp.actual_start_time = values.graceTime;
      temp.grace_time = convertTimeToString(dayjs(values.graceTime).$d);
      temp.shiftStartTime = convertTimeToString(dayjs(values.startTime).$d);
      temp.shiftEndTime = convertTimeToString(dayjs(values.endTime).$d);
      temp.is_saturday = values.isOff === "yes" ? true : false;
      temp.school_id = values.schoolId;

      await axios
        .post(`/api/employee/Shift`, temp)
        .then((res) => {
          setLoading(false);
          setAlertMessage({
            severity: "success",
            message: res.data.message,
          });
          setAlertOpen(true);
          setAlertMessage({
            severity: "success",
            message: "Form Submitted Successfully",
          });
          navigate("/ShiftMaster/Shifts", { replace: true });
        })
        .catch((err) => {
          setLoading(false);
          setAlertMessage({
            severity: "error",
            message: err.response.data
              ? err.response.data.message
              : "Error submitting",
          });
          setAlertOpen(true);
          console.error(err);
        });
    }
  };

  const handleUpdate = async () => {
    if (!requiredFieldsValid()) {
      setAlertMessage({
        severity: "error",
        message: "please fill all fields",
      });
      setAlertOpen(true);
    } else if (dayjs(values.endTime).isBefore(dayjs(values.startTime))) {
      setAlertMessage({
        severity: "error",
        message: "End time cannot be less than start time",
      });
      setAlertOpen(true);
    } else if (
      dayjs(
        `${dayjs(values.startTime).format("YYYY-MM-DD")} ${dayjs(
          values.graceTime
        ).format("HH:mm:ss")}`
      ).isBefore(dayjs(values.startTime))
    ) {
      setAlertMessage({
        severity: "error",
        message: "Grace time cannot be less than start time",
      });
      setAlertOpen(true);
    } else {
      setLoading(true);
      const temp = {};
      temp.active = true;
      temp.shiftCategoryId = shiftId;
      temp.shiftName = values.shiftName;
      temp.frontend_use_start_time = values.startTime;
      temp.frontend_use_end_time = values.endTime;
      temp.actual_start_time = values.graceTime;
      temp.grace_time = convertTimeToString(dayjs(values.graceTime).$d);
      temp.shiftStartTime = convertTimeToString(dayjs(values.startTime).$d);
      temp.shiftEndTime = convertTimeToString(dayjs(values.endTime).$d);
      temp.is_saturday = values.isOff === "yes" ? true : false;
      temp.school_id = values.schoolId;

      await axios
        .put(`/api/employee/Shift/${id}`, temp)
        .then((res) => {
          if (res.status === 200 || res.status === 201) {
            setAlertMessage({
              severity: "success",
              message: "Form Updated Successfully",
            });
            navigate("/ShiftMaster/Shifts", { replace: true });
          } else {
            setLoading(false);
            setAlertMessage({
              severity: "error",
              message: res.data.message,
            });
          }
          setAlertOpen(true);
        })
        .catch((error) => {
          setLoading(false);
          setAlertMessage({
            severity: "error",
            message: error.response ? error.response.data.message : "Error",
          });
          setAlertOpen(true);
        });
    }
  };

  return (
    <Box>
      <FormWrapper>
        <Grid container rowSpacing={2} columnSpacing={2}>
          <Grid item xs={12} md={3}>
            {isNew ? (
              <CustomMultipleAutocomplete
                name="schoolId"
                label="School"
                value={values.schoolId}
                options={schoolOptions}
                handleChangeAdvance={handleChangeAdvance}
                required
              />
            ) : (
              <CustomAutocomplete
                name="schoolId"
                label="School"
                value={values.schoolId}
                options={schoolOptions}
                handleChangeAdvance={handleChangeAdvance}
                required
              />
            )}
          </Grid>

          <Grid item xs={12} md={3}>
            <CustomTextField
              name="shiftName"
              label="Shift Name"
              value={values.shiftName}
              handleChange={handleChange}
              checks={checks.shiftName}
              errors={errorMessages.shiftName}
              required
              fullWidth
              helperText=" "
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <CustomTimePicker
              name="startTime"
              label="Start time"
              value={values.startTime}
              handleChangeAdvance={handleChangeAdvance}
              checks={checks.startTime}
              errors={errorMessages.startTime}
              required
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <CustomTimePicker
              name="endTime"
              label="End time"
              value={values.endTime}
              handleChangeAdvance={handleChangeAdvance}
              checks={checks.endTime}
              errors={errorMessages.endTime}
              required
              disabled={!values.startTime}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <CustomTimePicker
              name="graceTime"
              label="Actual Start Time"
              value={values.graceTime}
              handleChangeAdvance={handleChangeAdvance}
              // seconds
              checks={checks.graceTime}
              errors={errorMessages.graceTime}
              required
              disabled={!(values.startTime && values.endTime)}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <CustomRadioButtons
              name="isOff"
              label="Is Saturday"
              value={values.isOff}
              items={[
                { value: "yes", label: "Yes" },
                { value: "no", label: "No" },
              ]}
              handleChange={handleChange}
              required
            />
          </Grid>

          <Grid item xs={12} align="right">
            <Button
              style={{ borderRadius: 7 }}
              variant="contained"
              color="primary"
              disabled={loading}
              onClick={isNew ? handleCreate : handleUpdate}
            >
              {loading ? (
                <CircularProgress
                  size={25}
                  color="blue"
                  style={{ margin: "2px 13px" }}
                />
              ) : (
                <strong>{isNew ? "Create" : "Update"}</strong>
              )}
            </Button>
          </Grid>
        </Grid>
      </FormWrapper>
    </Box>
  );
}

export default ShiftForm;
