import { useState, useEffect } from "react";
import { Box, Grid, Button, CircularProgress } from "@mui/material";
import FormWrapper from "../../../components/FormWrapper";
import CheckboxAutocomplete from "../../../components/Inputs/CheckboxAutocomplete";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";
import CustomRadioButtons from "../../../components/Inputs/CustomRadioButtons";
import useAlert from "../../../hooks/useAlert";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import axios from "../../../services/Api";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import CustomTimePicker from "../../../components/Inputs/CustomTimePicker";
import { convertTimeToString } from "../../../utils/DateTimeUtils";
import dayjs from "dayjs";

const initValues = {
  schoolId: [],
  startTime: null,
  endTime: null,
  classTimetable: true,
};

const requiredFields = ["schoolId", "startTime", "endTime"];

function TimeSlotsForm() {
  const [isNew, setIsNew] = useState(true);
  const [values, setValues] = useState(initValues);
  const [timeSlotId, setTimeSlotId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [SchoolNameOptions, setSchoolNameOptions] = useState([]);

  const { setAlertMessage, setAlertOpen } = useAlert();
  const setCrumbs = useBreadcrumbs();
  const { id } = useParams();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    if (pathname.toLowerCase() === "/sectionmaster/timeslots/new") {
      setIsNew(true);
      setCrumbs([
        { name: "Section  Master", link: "/SectionMaster/TimeSlot" },
        { name: "TimeSlot" },
        { name: "Create" },
      ]);
    } else {
      setIsNew(false);
      getTimeSlotsData();
    }
  }, [pathname]);

  const checks = {
    startTime: [values.startTime !== null],
    endTime: [values.endTime !== null, values.endTime > values.startTime],
    schoolId: isNew ? [values.schoolId.length > 0] : [],
  };

  const errorMessages = {
    startTime: ["This field required"],
    endTime: ["This field is required", "it shoud be greater than start time"],
    schoolId: ["This field is required"],
  };

  function tConvert(time) {
    time = time
      .toString()
      .match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

    if (time.length > 1) {
      time = time.slice(1);
      time[5] = +time[0] < 12 ? " AM" : " PM";
      time[0] = +time[0] % 12 || 12;
    }
    return time.join("");
  }

  tConvert("18:00:00");

  const convertTimeToString1 = (time) => {
    if (time)
      return `${("0" + time.getHours()).slice(-2)}:${(
        "0" + time.getMinutes()
      ).slice(-2)}`;
  };

  const getTimeSlotsData = async () => {
    await axios
      .get(`/api/academic/timeSlots/${id}`)
      .then((res) => {
        setValues({
          schoolId: res.data.data.school_id,
          startTime: dayjs(res.data.data.starting_time_for_fornted),
          endTime: dayjs(res.data.data.ending_time_for_fornted),
          classTimetable: res.data.data.class_time_table,
        });
        setTimeSlotId(res.data.data.time_slots_id);
        setCrumbs([
          { name: "SectionMaster", link: "/SectionMaster/TimeSlot" },
          { name: "TimeSlot" },
          { name: "Update" },
          { name: res.data.data.school_id },
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
  const handleSelectAll = (name, options) => {
    setValues((prev) => ({
      ...prev,
      [name]: options.map((obj) => obj.value),
    }));
  };

  const handleSelectNone = (name) => {
    setValues((prev) => ({ ...prev, [name]: [] }));
  };

  const handleChange = (e) => {
    setValues((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
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
    getSchoolNameOptions();
  }, []);

  const getSchoolNameOptions = async () => {
    await axios
      .get(`/api/institute/school`)
      .then((res) => {
        setSchoolNameOptions(
          res.data.data.map((obj) => ({
            value: obj.school_id,
            label: obj.school_name_short,
          }))
        );
      })
      .catch((err) => console.error(err));
  };

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
      temp.school_id = values.schoolId;
      temp.starting_time_for_fornted = values.startTime;
      temp.ending_time_for_fornted = values.endTime;
      temp.starting_time = tConvert(
        convertTimeToString1(dayjs(values.startTime).$d)
      );
      temp.ending_time = tConvert(
        convertTimeToString1(dayjs(values.endTime).$d)
      );

      temp.class_time_table = values.classTimetable;

      await axios
        .post(`/api/academic/timeSlots`, temp)
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
          navigate("/SectionMaster/Timeslot", { replace: true });
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
    } else {
      setLoading(true);
      const temp = {};
      temp.active = true;
      temp.time_slots_id = timeSlotId;
      temp.school_id = values.schoolId;
      temp.starting_time_for_fornted = values.startTime;
      temp.ending_time_for_fornted = values.endTime;
      temp.starting_time = convertTimeToString(dayjs(values.startTime).$d);
      temp.ending_time = convertTimeToString(dayjs(values.endTime).$d);

      temp.class_time_table = values.classTimetable;

      await axios
        .put(`/api/academic/timeSlots/${id}`, temp)
        .then((res) => {
          if (res.status === 200 || res.status === 201) {
            setAlertMessage({
              severity: "success",
              message: "Form Updated Successfully",
            });
            navigate("/SectionMaster/Timeslot", { replace: true });
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
    <Box component="form" overflow="hidden" p={1}>
      <FormWrapper>
        <Grid
          container
          alignItems="center"
          justifyContent="flex-start"
          rowSpacing={4}
          columnSpacing={{ xs: 2, md: 4 }}
        >
          <Grid item xs={12} md={6}>
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
          <Grid item xs={12} md={6}>
            <CustomTimePicker
              name="endTime"
              label="End time"
              value={values.endTime}
              handleChangeAdvance={handleChangeAdvance}
              checks={checks.endTime}
              errors={errorMessages.endTime}
              minTime={values.startTime}
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            {isNew ? (
              <CheckboxAutocomplete
                name="schoolId"
                label="Institute"
                options={SchoolNameOptions}
                value={values.schoolId}
                handleChangeAdvance={handleChangeAdvance}
                handleSelectAll={handleSelectAll}
                handleSelectNone={handleSelectNone}
                checks={checks.schoolId}
                errors={errorMessages.schoolId}
                required
              />
            ) : (
              <CustomAutocomplete
                name="schoolId"
                label="Institute"
                options={SchoolNameOptions}
                value={values.schoolId}
                handleChangeAdvance={handleChangeAdvance}
                required
              />
            )}
          </Grid>
          <Grid item xs={12} md={3}>
            <CustomRadioButtons
              name="classTimetable"
              label="Class Time Table"
              value={values.classTimetable}
              items={[
                { value: true, label: "Yes" },
                { value: false, label: "No" },
              ]}
              handleChange={handleChange}
              required
            />
          </Grid>

          <Grid item xs={12} md={3} textAlign="right">
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

export default TimeSlotsForm;
