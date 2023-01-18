import { useState, useEffect } from "react";
import { Box, Grid, Button, CircularProgress } from "@mui/material";
import FormWrapper from "../../../components/FormWrapper";
import CheckboxAutocomplete from "../../../components/Inputs/CheckboxAutocomplete";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";
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
        { name: "SectionMaster", link: "/SectionMaster/TimeSlot" },
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
    endTime: [values.endTime !== null],
  };

  const errorMessages = {
    startTime: ["This field required"],
    endTime: ["This field is required"],
  };

  const getTimeSlotsData = async () => {
    await axios
      .get(`/api/academic/timeSlots/${id}`)
      .then((res) => {
        setValues({
          schoolId: res.data.data.school_id,
          startTime: dayjs(res.data.data.starting_time_for_fornted),
          endTime: dayjs(res.data.data.ending_time_for_fornted),
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
      temp.starting_time = convertTimeToString(dayjs(values.startTime).$d);
      temp.ending_time = convertTimeToString(dayjs(values.endTime).$d);

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
          navigate("/SectionMaster/TimeSlot", { replace: true });
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

      await axios
        .put(`/api/academic/timeSlots/${id}`, temp)
        .then((res) => {
          if (res.status === 200 || res.status === 201) {
            setAlertMessage({
              severity: "success",
              message: "Form Updated Successfully",
            });
            navigate("/SectionMaster/TimeSlot", { replace: true });
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
          justifyContent="flex-end"
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
              required
              disabled={!values.startTime}
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

export default TimeSlotsForm;
