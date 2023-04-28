import { useState, useEffect } from "react";
import { Box, Grid, Button, CircularProgress } from "@mui/material";
import FormWrapper from "../../../components/FormWrapper";
import useAlert from "../../../hooks/useAlert";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import axios from "../../../services/Api";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";
import CustomMultipleAutocomplete from "../../../components/Inputs/CustomMultipleAutocomplete";

const initialValues = {
  instituteId: [],
  departmentId: [],
  holidayTypeId: "",
  holidayName: "",
  leaveId: "",
  date: null,
  jobTypeId: [],
  leaveShortName: "",
  days: "",
};
const requiredFields = ["departmentId"];

function DeAssignDepartment() {
  const [isNew, setIsNew] = useState(true);
  const [values, setValues] = useState(initialValues);
  const [HolidayCalenderId, setHolidayCalenderId] = useState(null);
  const [holidayTypeOptionsOne, setHolidayTypeOptionsOne] = useState([]);
  const [loading, setLoading] = useState(false);
  const [Institutes, setInstitutes] = useState([]);
  const [DepartmentOptions, setDepartmentOptions] = useState([]);

  const { setAlertMessage, setAlertOpen } = useAlert();
  const setCrumbs = useBreadcrumbs();
  const { id } = useParams();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const checks = {
    departmentId: [values.departmentId.length > 0],
  };

  const errorMessages = {
    departmentId: ["This field is required"],
  };
  useEffect(() => {
    if (
      pathname.toLowerCase() ===
      "/holidaycalendermaster/deassigndepartments/" + id
    ) {
      getInstitutNames();
      getDepartmentNames();
      setIsNew(false);
      getHolidayCalenderData();
    } else {
      getHolidayCalenderData();
    }
  }, [pathname]);
  const getHolidayCalenderData = async () => {
    await axios
      .get(`/api/HolidayCalender/${id}`)
      .then((res) => {
        setValues({
          instituteId: res.data.data.schoolId,
          departmentId: res.data.data.dept_id ? res.data.data.dept_id : "",
          leaveId: res.data.data.leave_id,
          holidayTypeId: res.data.data.leave_type,
          holidayName: res.data.data.holidayName,
          date: res.data.data.fromDate,
          jobTypeId: res.data.data.jobTypeId,
          leaveShortName: res.data.data.leave_type_short,
        });
        setHolidayCalenderId(res.data.data.holidayCalendarId);
        setCrumbs([
          {
            name: "HolidayCalenderMaster",
            link: "/HolidayCalenderMaster/HolidayCalenders",
          },
          { name: "DeAssign Departments" },
          { name: res.data.data.holidayName },
        ]);
      })
      .catch((error) => console.error(error));
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

  const getDepartmentNames = async () => {
    await axios
      .get(`/api/dept`)
      .then((res) => {
        setDepartmentOptions(
          res.data.data.map((obj) => ({
            value: obj.dept_id,
            label: obj.dept_name,
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
        .filter((val) => val.leave_type === values.holidayTypeId)
        .map((obj) => obj.leave_id)
        .toString();
      // temp.leave_id = values.holidayTypeId;
      temp.leave_type_short = values.leaveShortName;
      temp.leave_type = values.holidayTypeId;
      temp.holidayName = values.holidayName;
      temp.fromDate = values.date;
      temp.schoolId = values.instituteId;
      temp.jobTypeId = values.jobTypeId ? values.jobTypeId.toString() : "";
      temp.dept_id = values.departmentId.toString();
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
              name="instituteId"
              label="Institute"
              options={Institutes}
              value={values.instituteId}
              handleChangeAdvance={handleChangeAdvance}
              disabled={!isNew}
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <CustomMultipleAutocomplete
              name="departmentId"
              label="Departments"
              options={DepartmentOptions}
              value={values.departmentId}
              handleChangeAdvance={handleChangeAdvance}
              required
              checks={checks.departmentId}
              errors={errorMessages.departmentId}
            />
          </Grid>

          <Grid item xs={12} md={6} textAlign="right">
            <Button
              style={{ borderRadius: 7 }}
              variant="contained"
              color="primary"
              disabled={loading}
              onClick={handleUpdate}
            >
              {loading ? (
                <CircularProgress
                  size={25}
                  color="blue"
                  style={{ margin: "2px 13px" }}
                />
              ) : (
                <strong>{"Update"}</strong>
              )}
            </Button>
          </Grid>
        </Grid>
      </FormWrapper>
    </Box>
  );
}
export default DeAssignDepartment;
