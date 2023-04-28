import { useState, useEffect } from "react";
import { Box, Grid, Button, CircularProgress } from "@mui/material";
import FormWrapper from "../../../components/FormWrapper";
import useAlert from "../../../hooks/useAlert";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import axios from "../../../services/Api";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";
import CustomDatePicker from "../../../components/Inputs/CustomDatePicker";
import CustomMultipleAutocomplete from "../../../components/Inputs/CustomMultipleAutocomplete";
import CustomRadioButtons from "../../../components/Inputs/CustomRadioButtons";
import EmployeetimetableDetails from "../sectionMaster/EmployeetimetableDetails";
import { convertDateToString } from "../../../utils/DateTimeUtils";

const initValues = {
  acYearId: null,
  schoolId: null,
  fromDate: null,
  toDate: null,
  timeSlotId: null,
  batchId: null,
  courseId: null,
  employeeId: [],
  employeeIdOne: null,
  programIdForUpdate: null,
  yearsemId: null,
  weekdayIdOne: "",
  showAttendence: "no",
  intervalTypeId: "",
  onlineStatus: "No",
  remarks: "",
};

const requiredFields = [];

function TimetableForBatchForm() {
  const [isNew, setIsNew] = useState(true);
  const [values, setValues] = useState(initValues);
  const [intervalTypeId, setintervalTypeId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [SchoolNameOptions, setSchoolNameOptions] = useState([]);
  const [EmployeeOptions, setEmployeeOptions] = useState([]);
  const [academicYearOptions, setAcademicYearOptions] = useState([]);
  const [programId, setProgramId] = useState("");
  const [intervalTypeOptions, setIntervalTypeOptions] = useState([]);
  const [timeSlotsOptions, setTimeSlotOptions] = useState([]);
  const [courseOptions, setCourseOptions] = useState([]);
  const [batchOptions, setBatchOptions] = useState([]);
  const [roomOptions, setRoomOptions] = useState([]);
  const [weekdayId, setWeekdayId] = useState("");
  const [programType, setProgramType] = useState("Year");

  const { setAlertMessage, setAlertOpen } = useAlert();
  const setCrumbs = useBreadcrumbs();
  const { id } = useParams();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const weekdayOptions = [
    { value: "Sunday", label: "Sunday" },
    { value: "Monday", label: "Monday" },
    { value: "Tuesday", label: "Tuesday" },
    { value: "Wednesday", label: "Wednesday" },
    { value: "Thursday", label: "Thursday" },
    { value: "Friday", label: "Friday" },
    { value: "Saturday", label: "Saturday" },
  ];

  const weekday = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  useEffect(() => {
    getRoomData();
    if (pathname.toLowerCase() === "/timetablemaster/timetable/batch/new") {
      setIsNew(true);
      setCrumbs([
        {
          name: "TimetableMaster",
          link: "/TimetableMaster/Timetable",
        },
        { name: "Batch" },
        { name: "TimeTable" },
        { name: "Create" },
      ]);
    } else {
      setIsNew(false);
      getTimeItervalData();
    }
  }, [pathname]);

  const checks = {};

  const errorMessages = {};

  const getTimeItervalData = async () => {
    await axios
      .get(`/api/academic/TimeTable/${id}`)
      .then((res) => {
        setValues({
          acYearId: res.data.data.ac_year_id,
          schoolId: res.data.data.school_id,
          yearsemId: res.data.data.current_year,
          fromDate: res.data.data.from_date,
          toDate: res.data.data.to_date,
          weekdayIdOne: res.data.data.week_day,
          timeSlotId: res.data.data.time_slots_id,
          programIdForUpdate: res.data.data.program_id,
          intervalTypeId: res.data.data.interval_type_id,
          employeeId: res.data.data.emp_id,
          courseId: res.data.data.subject_assignment_id,
          batchId: res.data.data.batch_assignment_id,
          roomId: res.data.data.room_id,
          remarks: res.data.data.remarks,
          onlineStatus: res.data.data.is_status,
        });
        setintervalTypeId(res.data.data.intervalTypeId);
        setCrumbs(
          {
            name: "TimetableMaster",
            link: "/TimetableMaster/Timetable",
          },
          { name: "Batch" },
          { name: "TimeTable" },
          { name: "Create" }
        );
      })
      .catch((error) => console.error(error));
  };

  useEffect(() => {
    getSchoolNameOptions();
    getAcademicYearOptions();
    getIntervalTypeOptions();
    getEmployeeOptions();
    getYearSemData();
    getTimeSlotsOptions();

    getCourseData();
    getBatchData();
  }, [
    values.acYearId,
    values.schoolId,

    values.yearsemId,
    values.intervalTypeId,
    values.employeeId,
  ]);

  const getSchoolNameOptions = async () => {
    await axios
      .get(`/api/institute/school`)
      .then((res) => {
        setSchoolNameOptions(
          res.data.data.map((obj) => ({
            value: obj.school_id,
            label: obj.school_name,
          }))
        );
      })
      .catch((err) => console.error(err));
  };

  const getEmployeeOptions = async () => {
    await axios
      .get(`/api/academic/getAllEmployeesForTimeTable`)
      .then((res) => {
        setEmployeeOptions(
          res.data.data.map((obj) => ({
            value: obj.emp_id,
            label: obj.employeeName,
          }))
        );
      })
      .catch((err) => console.error(err));
  };

  const getAcademicYearOptions = async () => {
    await axios
      .get(`/api/academic/academic_year`)
      .then((res) => {
        setAcademicYearOptions(
          res.data.data.map((obj) => ({
            value: obj.ac_year_id,
            label: obj.ac_year,
          }))
        );
      })
      .catch((error) => console.error(error));
  };

  const getIntervalTypeOptions = async () => {
    await axios
      .get(`/api/academic/fetchIntervalTypesInBatchDropDownOfTimetable`)
      .then((res) => {
        setIntervalTypeOptions(
          res.data.data.map((obj) => ({
            value: obj.intervalTypeId,
            label: obj.intervalTypeName,
          }))
        );
      })
      .catch((err) => console.error(err));
  };

  const getYearSemData = async (id) => {
    if (values.acYearId && values.schoolId)
      await axios
        .get(
          `/api/academic/FetchAcademicProgram/${values.acYearId}/${
            isNew ? programId : values.programIdForUpdate
          }/${values.schoolId}`
        )
        .then((res) => {
          const yearsem = [];
          res.data.data.map((obj) => {
            if (obj.program_type_id === 2) {
              setProgramType("Sem");
              for (let i = 1; i <= obj.number_of_semester; i++) {
                yearsem.push({ value: i, label: "Sem" + "-" + i });
              }
            } else if (obj.program_type_id === 1) {
              setProgramType("Year");
              for (let i = 1; i <= obj.number_of_years; i++) {
                yearsem.push({ value: i, label: "Year" + "-" + i });
              }
            }
          });
        })
        .catch((err) => console.error(err));
  };

  const getTimeSlotsOptions = async () => {
    if (values.schoolId)
      await axios
        .get(`/api/academic/getTimeSlotsForTimeTable/${values.schoolId}`)
        .then((res) => {
          setTimeSlotOptions(
            res.data.data.map((obj) => ({
              value: obj.time_slots_id,
              label: obj.timeSlots,
            }))
          );
        })
        .catch((error) => console.error(error));
  };

  const getRoomData = async () => {
    await axios
      .get(`/api/getAllActiveRoomsForTimeTableBsn`)
      .then((res) => {
        setRoomOptions(
          res.data.data.map((obj) => ({
            value: obj.room_id,
            label: obj.concate_room_name,
          }))
        );
      })
      .catch((err) => console.error(err));
  };

  const getCourseData = async () => {
    if (values.employeeId.length > 0)
      await axios
        .get(
          `/api/academic/fetchAllCourseDetailsForTimeTable/${values.employeeId}`
        )
        .then((res) => {
          setCourseOptions(
            res.data.data.map((obj) => ({
              value: obj.subjetAssignId,
              label: obj.course_name,
            }))
          );
        })
        .catch((err) => console.error(err));
  };

  const getBatchData = async () => {
    if (values.intervalTypeId)
      await axios
        .get(
          `/api/academic/getAllBatchesForTimeTable?school_id=${values.schoolId}&ac_year_id=${values.acYearId}&current_year=${values.yearsemId}&interval_type_id=${values.intervalTypeId}`
        )
        .then((res) => {
          setBatchOptions(
            res.data.data.map((obj) => ({
              value: obj.batch_id,
              label: obj.batch_short_name,
            }))
          );
        })
        .catch((err) => console.error(err));
    await axios
      .get(
        `/api/academic/getAllBatchesForTimeTable?school_id=${values.schoolId}&ac_year_id=${values.acYearId}&current_sem=${values.yearsemId}&interval_type_id=${values.intervalTypeId}`
      )
      .then((res) => {
        setBatchOptions(
          res.data.data.map((obj) => ({
            value: obj.batch_id,
            label: obj.batch_short_name,
          }))
        );
      })
      .catch((err) => console.error(err));
  };

  const handleChange = (e) => {
    setValues((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleChangeAdvance = async (name, newValue) => {
    if (name === "toDate") {
      const date = new Date(newValue).getDay();
      const newDate = weekday[date];
      setWeekdayId(newDate);
    }

    if (name === "intervalTypeId") {
      await axios
        .get(`/api/academic/TimeIntervalTypes`)
        .then((res) => {
          res.data.data.filter((val) => {
            if (val.intervalTypeId === newValue) {
            }
          });
        })
        .catch((err) => console.error(err));
      setValues((prev) => ({
        ...prev,
        [name]: newValue,
      }));
    } else {
      setValues((prev) => ({
        ...prev,
        [name]: newValue,
      }));
    }
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
        message: "please fill all fields",
      });
      setAlertOpen(true);
    } else {
      setLoading(true);

      const temp = {};
      temp.active = true;
      temp.ac_year_id = values.acYearId;
      temp.school_id = values.schoolId;

      temp.program_id = programId.toString();
      programType === "Year"
        ? (temp.current_year = values.yearsemId)
        : (temp.current_sem = values.yearsemId);
      temp.from_date = values.fromDate;
      temp.to_date = values.toDate;
      temp.week_day = weekdayId;
      temp.time_slots_id = values.timeSlotId;
      temp.interval_type_id = values.intervalTypeId;
      temp.emp_id = values.employeeId;
      temp.subject_assignment_id = values.courseId;
      temp.batch_assignment_id = values.batchId;
      temp.room_id = values.roomId;
      temp.remarks = values.remarks;
      temp.is_online = values.onlineStatus;
      if (
        convertDateToString(values.fromDate.$d) ==
        convertDateToString(values.toDate.$d)
      ) {
        await axios
          .post(`/api/academic/TimeTable`, temp)
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

            navigate(`/TimetableMaster/Timetable`);
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
      } else {
        await axios
          .post(`/api/academic/createMultipleTimeTable`, temp)
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

            navigate(`/SectionMaster/Timetable`);
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
      temp.intervalTypeId = intervalTypeId;
      temp.intervalTypeName = values.intervalType;
      temp.intervalTypeShort = values.shortName;
      temp.remarks = values.remarks;
      temp.showBatch = values.showBatch;
      temp.outside = values.outsideCampus;
      temp.showSubject = values.showSubject;
      temp.showAttendance = values.showAttendence;

      await axios
        .put(`/api/academic/TimeIntervalTypes/${id}`, temp)
        .then((res) => {
          if (res.status === 200 || res.status === 201) {
            setAlertMessage({
              severity: "success",
              message: "Form Updated Successfully",
            });
            navigate("/TimetableMaster/TimeTables", { replace: true });
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
          <Grid item xs={12} md={3}>
            <CustomAutocomplete
              name="acYearId"
              label="Academic Year"
              value={values.acYearId}
              options={academicYearOptions}
              handleChangeAdvance={handleChangeAdvance}
              required
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <CustomAutocomplete
              name="schoolId"
              label="Institute"
              value={values.schoolId}
              options={SchoolNameOptions}
              handleChangeAdvance={handleChangeAdvance}
              required
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <CustomAutocomplete
              name="yearsemId"
              label="Year/Sem"
              value={values.yearsemId}
              options={[
                { label: "1", value: 1 },
                { label: "2", value: 2 },
                { label: "3", value: 3 },
                { label: "4", value: 4 },
                { label: "5", value: 5 },
                { label: "6", value: 6 },
                { label: "7", value: 7 },
                { label: "8", value: 8 },
              ]}
              handleChangeAdvance={handleChangeAdvance}
              required
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <CustomDatePicker
              name="fromDate"
              label="From Date"
              value={values.fromDate}
              handleChangeAdvance={handleChangeAdvance}
              checks={checks.fromDate}
              errors={errorMessages.fromDate}
              required
              disablePast
              helperText=""
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <CustomDatePicker
              name="toDate"
              label="To Date"
              value={values.toDate}
              handleChangeAdvance={handleChangeAdvance}
              checks={checks.toDate}
              errors={errorMessages.toDate}
              required
              minDate={values.fromDate}
              disablePast
              helperText=""
            />
          </Grid>
          {values.fromDate !== null &&
          new Date(values.fromDate).getDay() ===
            new Date(values.toDate).getDay() ? (
            <Grid item xs={12} md={3}>
              <CustomAutocomplete
                name="weekdayId"
                label="Weekday"
                value={weekdayId}
                options={weekdayOptions}
                handleChangeAdvance={handleChangeAdvance}
                disabled
                required
              />
            </Grid>
          ) : (
            <Grid item xs={12} md={3}>
              <CustomAutocomplete
                name="weekdayIdOne"
                label="Weekday"
                value={values.weekdayIdOne}
                options={weekdayOptions}
                handleChangeAdvance={handleChangeAdvance}
                required
              />
            </Grid>
          )}
          <Grid item xs={12} md={3}>
            <CustomAutocomplete
              name="timeSlotId"
              label="Time Slots"
              value={values.timeSlotId}
              options={timeSlotsOptions}
              handleChangeAdvance={handleChangeAdvance}
              required
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <CustomAutocomplete
              name="intervalTypeId"
              label="Interval Type"
              value={values.intervalTypeId}
              options={intervalTypeOptions}
              handleChangeAdvance={handleChangeAdvance}
              required
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <CustomAutocomplete
              name="batchId"
              label="Batch"
              value={values.batchId}
              options={batchOptions}
              handleChangeAdvance={handleChangeAdvance}
              required
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <CustomMultipleAutocomplete
              name="employeeId"
              label="Employee"
              value={values.employeeId}
              options={EmployeeOptions}
              handleChangeAdvance={handleChangeAdvance}
              required
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <CustomAutocomplete
              name="courseId"
              label="Course"
              value={values.courseId}
              options={courseOptions}
              handleChangeAdvance={handleChangeAdvance}
              required
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <CustomAutocomplete
              name="roomId"
              label="Room"
              value={values.roomId}
              options={roomOptions}
              handleChangeAdvance={handleChangeAdvance}
              required
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <CustomTextField
              name="remarks"
              label="Remarks"
              value={values.remarks}
              handleChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <CustomRadioButtons
              name="onlineStatus"
              label="Online Status"
              value={values.onlineStatus}
              items={[
                { value: true, label: "Yes" },
                { value: false, label: "No" },
              ]}
              handleChange={handleChange}
            />
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
        {isNew ? (
          <Grid container justifyContent="center">
            {values.employeeId.length > 0 ? (
              <Grid item xs={12} md={10} mt={4}>
                <EmployeetimetableDetails
                  data={values.employeeId}
                  date={
                    values.fromDate
                      ? convertDateToString(values.fromDate.$d)
                          .split("/")
                          .reverse()
                          .join("-")
                      : ""
                  }
                />
              </Grid>
            ) : (
              <></>
            )}
          </Grid>
        ) : (
          <></>
        )}
      </FormWrapper>
    </Box>
  );
}

export default TimetableForBatchForm;
