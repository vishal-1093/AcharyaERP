import { useState, useEffect } from "react";
import { Box, Grid, Button, CircularProgress } from "@mui/material";
import FormWrapper from "../../../components/FormWrapper";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import useAlert from "../../../hooks/useAlert";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import axios from "../../../services/Api";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";
import CustomDatePicker from "../../../components/Inputs/CustomDatePicker";
import CustomMultipleAutocomplete from "../../../components/Inputs/CustomMultipleAutocomplete";

const initialValues = {
  holidayTypeId: "",
  holidayName: "",
  leaveId: "",
  date: null,
  instituteId: [],
  jobTypeId: [],
  departmentId: [],
  leaveShortName: "",
  day: "",
};
const requiredFields = ["holidayTypeId", "holidayName", "date"];

function HolidayCalenderForm() {
  const [isNew, setIsNew] = useState(true);
  const [holidayTypeOptionsOne, setHolidayTypeOptionsOne] = useState([]);
  const [values, setValues] = useState(initialValues);
  const [HolidayCalenderId, setHolidayCalenderId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [holidayTypes, setHolidayTypes] = useState([]);
  const [Institutes, setInstitutes] = useState([]);
  const [JobTypes, setJobTypes] = useState([]);

  const { setAlertMessage, setAlertOpen } = useAlert();
  const setCrumbs = useBreadcrumbs();
  const { id } = useParams();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const checks = {
    holidayName: [values.holidayName !== ""],
    date: [values.date !== null],
    instituteId: isNew ? [values.instituteId.length > 0] : [],
    jobTypeId: isNew ? [values.jobTypeId.length > 0] : [],
  };

  const errorMessages = {
    holidayName: ["This field required"],
    date: ["This field is required"],
    instituteId: ["This field is required"],
    jobTypeId: ["This field is required"],
  };

  useEffect(() => {
    if (
      pathname.toLowerCase() === "/holidaycalendermaster/holidaycalenders/new"
    ) {
      setIsNew(true);
      setCrumbs([
        {
          name: "Holiday Calender Master",
          link: "/HolidayCalenderMaster/HolidayCalenders",
        },
        { name: "Holiday Calender" },
        { name: "Create" },
      ]);
    } else {
      setIsNew(false);
      getHolidayCalenderData();
      getHolidayTypes();
    }
  }, [pathname]);

  const getHolidayCalenderData = async () => {
    await axios
      .get(`/api/HolidayCalender/${id}`)
      .then((res) => {
        setValues({
          leaveId: res.data.data.leave_id,
          leaveShortName: res.data.data.leave_type_short,
          holidayTypeId: res.data.data.leave_type,
          holidayName: res.data.data.holidayName,
          date: res.data.data.fromDate,
          instituteId: res.data.data.schoolId,
          jobTypeId: res.data.data.jobTypeId,
          departmentId: res.data.data.dept_id,
          day: res.data.data.day,
        });
        setHolidayCalenderId(res.data.data.holidayCalendarId);
        setCrumbs([
          {
            name: "HolidayCalenderMaster",
            link: "/HolidayCalenderMaster/HolidayCalenders",
          },
          { name: "HolidayCalender" },
          { name: "Update" },
          { name: res.data.data.holidayName },
        ]);
      })
      .catch((error) => console.error(error));
  };

  const handleChange = (e) => {
    setValues((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
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
  useEffect(() => {
    getHolidayTypes();
    getInstitutNames();
    getJobTypes();
  }, []);

  const getHolidayTypes = async () => {
    await axios
      .get(`/api/getHolidayTypeLeaves`)
      .then((res) => {
        setHolidayTypeOptionsOne(res.data.data);
        setHolidayTypes(
          res.data.data.map((obj) => ({
            value: obj.leave_type_short,
            label: obj.leave_type,
          }))
        );
      })
      .catch((err) => console.error(err));
  };
  const getInstitutNames = async () => {
    await axios
      .get(`/api/institute/school`)
      .then((res) => {
        setInstitutes(
          res.data.data.map((obj) => ({
            value: obj.school_id,
            label: obj.school_name_short,
          }))
        );
      })
      .catch((err) => console.error(err));
  };
  const getJobTypes = async () => {
    await axios
      .get(`/api/employee/JobType`)
      .then((res) => {
        setJobTypes(
          res.data.data.map((obj) => ({
            value: obj.job_type_id,
            label: obj.job_type,
          }))
        );
      })
      .catch((err) => console.error(err));
  };
  const d = new Date(values.date);
  const weekday = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const days = weekday[d.getDay()];

  const handleCreate = async () => {
    if (!requiredFieldsValid()) {
      setAlertMessage({
        severity: "error",
        message: "please fill all fields",
      });
      setAlertOpen(true);
    } else {
      setLoading(true);

      const temp = {};
      temp.active = true;
      temp.leave_id = holidayTypeOptionsOne
        .filter((val) => val.leave_type_short === values.holidayTypeId)
        .map((obj) => obj.leave_id)
        .toString();

      temp.holidayName = values.holidayName;
      temp.fromDate = values.date;
      temp.schoolId = values.instituteId;
      temp.jobTypeId = values.jobTypeId.toString();
      temp.day = days;
      await axios
        .post(`/api/HolidayCalender`, temp)
        .then((res) => {
          setLoading(false);
          if (res.status === 200 || res.status === 201) {
            navigate("/HolidayCalenderMaster/HolidayCalenders", {
              replace: true,
            });
            setAlertMessage({
              severity: "success",
              message: "Form Submitted Successfully",
            });
          } else {
            setAlertMessage({
              severity: "error",
              message: res.data ? res.data.message : "An error occured",
            });
          }
          setAlertOpen(true);
        })
        .catch((err) => {
          setLoading(false);
          setAlertMessage({
            severity: "error",
            message: err.response
              ? err.response.data.message
              : "An error occured",
          });
          setAlertOpen(true);
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
    } else {
      setLoading(true);
      const temp = {};
      temp.active = true;
      temp.holidayCalendarId = HolidayCalenderId;
      temp.leave_id = holidayTypeOptionsOne
        .filter((val) => val.leave_type_short === values.holidayTypeId)
        .map((obj) => obj.leave_id)
        .toString();
      temp.leave_type = values.holidayTypeId;
      temp.leave_type_short = values.leaveShortName;
      temp.holidayName = values.holidayName;
      temp.fromDate = values.date;
      temp.schoolId = values.instituteId;
      temp.jobTypeId = values.jobTypeId ? values.jobTypeId.toString() : "";
      temp.dept_id = values.departmentId ? values.departmentId.toString() : "";
      temp.day = days;

      await axios
        .put(`/api/HolidayCalender/${id}`, temp)
        .then((res) => {
          setLoading(false);
          if (res.status === 200 || res.status === 201) {
            navigate("/HolidayCalenderMaster/HolidayCalenders", {
              replace: true,
            });
            setAlertMessage({
              severity: "success",
              message: "Form Updated Successfully",
            });
          } else {
            setAlertMessage({
              severity: "error",
              message: res.data ? res.data.message : "An error occured",
            });
          }
          setAlertOpen(true);
        })
        .catch((err) => {
          setLoading(false);
          setAlertMessage({
            severity: "error",
            message: err.response
              ? err.response.data.message
              : "An error occured",
          });
          setAlertOpen(true);
        });
    }
  };

  return (
    <Box component="form" overflow="hidden" p={1}>
      <FormWrapper>
        <Grid
          container
          alignItems="center"
          justifyContent="flex-end"
          rowSpacing={4}
          columnSpacing={{ xs: 2, md: 4 }}
        >
          <Grid item xs={12} md={6}>
            <CustomAutocomplete
              name="holidayTypeId"
              label="Holiday Type"
              options={holidayTypes}
              value={values.holidayTypeId}
              handleChangeAdvance={handleChangeAdvance}
              required
              disabled={!isNew}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <CustomTextField
              name="holidayName"
              label="Holiday Name"
              value={values.holidayName}
              handleChange={handleChange}
              checks={checks.holidayName}
              errors={errorMessages.holidayName}
              required
            />
          </Grid>

          <Grid item xs={12} md={6} mt={2.5}>
            <CustomDatePicker
              name="date"
              label="Date"
              value={values.date}
              handleChangeAdvance={handleChangeAdvance}
              checks={checks.date}
              errors={errorMessages.date}
              required
              disabled={!isNew}
              minDate={new Date().setMonth(new Date().getMonth() - 1)}
            />
          </Grid>

          {values.holidayTypeId.toLowerCase() === "dh" && isNew ? (
            <>
              <Grid item xs={12} md={6}>
                <CustomMultipleAutocomplete
                  name="instituteId"
                  label="Institute"
                  options={Institutes}
                  value={values.instituteId}
                  handleChangeAdvance={handleChangeAdvance}
                  checks={checks.instituteId}
                  errors={errorMessages.instituteId}
                  required
                  disabled={!isNew}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <CustomMultipleAutocomplete
                  name="jobTypeId"
                  label="Job Type"
                  options={JobTypes}
                  value={values.jobTypeId}
                  handleChangeAdvance={handleChangeAdvance}
                  checks={checks.jobTypeId}
                  errors={errorMessages.jobTypeId}
                  disabled={!isNew}
                />
              </Grid>
            </>
          ) : values.holidayTypeId.toLowerCase() === "dh" && !isNew ? (
            <>
              <Grid item xs={12} md={6}>
                <CustomAutocomplete
                  name="instituteId"
                  label="Institute"
                  options={Institutes}
                  value={values.instituteId}
                  handleChangeAdvance={handleChangeAdvance}
                  required
                  disabled={!isNew}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <CustomAutocomplete
                  name="jobTypeId"
                  label="Job Type"
                  options={JobTypes}
                  value={values.jobTypeId}
                  handleChangeAdvance={handleChangeAdvance}
                  disabled={!isNew}
                />
              </Grid>
            </>
          ) : (
            <></>
          )}

          <Grid item xs={12} md={6} textAlign="right">
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

export default HolidayCalenderForm;
