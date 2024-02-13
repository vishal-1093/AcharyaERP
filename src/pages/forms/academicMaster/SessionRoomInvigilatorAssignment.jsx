import { useState, useEffect } from "react";
import { Grid, Button, Box } from "@mui/material";
import axios from "../../../services/Api";
import { useNavigate, useParams } from "react-router-dom";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";
import CustomDatePicker from "../../../components/Inputs/CustomDatePicker";
import useAlert from "../../../hooks/useAlert";
import FormPaperWrapper from "../../../components/FormPaperWrapper";
import { makeStyles } from "@mui/styles";
import moment from "moment";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";

const label = { inputprops: { "aria-label": "Checkbox demo" } };

const initialValues = {
  internalId: null,
  internalName: "",
  fromDate: null,
  toDate: null,
  acYearId: null,
  schoolId: 1,
  programIdForUpdate: null,
  programSpeId: null,
  yearsemId: null,
  minMarks: "",
  maxMarks: "",
  remarks: "",
  studentId: "",
  roomCode: null,
  invigilatorId: null,
  courseId: null,
  dateOfExam: null,
};

const requiredFields = ["dateOfExam", "courseId", "invigilatorId", "roomCode"];

function SessionRoomInvigilatorAssignment() {
  const [values, setValues] = useState(initialValues);
  const [loading, setLoading] = useState(false);
  const [sessionAssignmentId, setSessionAssignmentId] = useState(null);
  const [programType, setProgramType] = useState("Sem");
  const [roomOptions, setRoomOptions] = useState([]);
  const [courseOptions, setCourseOptions] = useState([]);
  const [timeSlotId, setTimeSlotId] = useState(null);
  const [invigilatorOptions, setInvigilatorOptions] = useState([]);
  const [courseAssignmentId, setCourseAssignmentId] = useState(null);
  const [timeSlotOptions, setTimeSlotOptions] = useState([]);

  const { id } = useParams();
  const { setAlertMessage, setAlertOpen } = useAlert();

  const setCrumbs = useBreadcrumbs();

  const navigate = useNavigate();

  const checks = {
    fromDate: [values.fromDate !== null],
  };

  const errorMessages = {
    fromDate: ["This field is required"],
  };

  const weekdays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const date = new Date(values.dateOfExam);

  const day = weekdays[date.getDay()];

  useEffect(() => {
    getSessionAssginmentData();
    setCrumbs([{ name: "Session Master", link: "/SessionMaster/Room" }]);
  }, []);

  useEffect(() => {
    getRoomData();
  }, [values.programSpeId, values.dateOfExam, values.courseId]);

  useEffect(() => {
    getCourseData();
    getInvigilatorData();
  }, [
    values.acYearId,
    values.schoolId,
    values.programSpeId,
    values.yearsemId,
    values.dateOfExam,
    values.courseId,
    timeSlotId,
    programType,
  ]);

  const getRoomData = async () => {
    if (values.programSpeId && values.courseId && values.dateOfExam)
      await axios
        .get(
          `/api/academic/ittaRoomidBasedOnTimeAndDate/${values.programSpeId}/${
            values.courseId
          }/${moment(values.dateOfExam).format("YYYY-MM-DD")}`
        )
        .then((res) => {
          setRoomOptions(
            res.data.data.map((obj) => ({
              value: obj.room_id,
              label: obj.roomcode,
            }))
          );
        })
        .catch((error) => console.error(error));
  };

  const getCourseData = async () => {
    if (values.dateOfExam)
      await axios
        .get(
          `/api/academic/ittaCourseBasedOnDate/${id}/${moment(
            values.dateOfExam
          ).format("YYYY-MM-DD")}`
        )
        .then((res) => {
          setCourseOptions(
            res.data.data.map((obj) => ({
              value: obj.internal_time_table_id,
              label: obj.course_with_coursecode,
            }))
          );
        })
        .catch((error) => console.error(error));
  };

  const getInvigilatorData = async () => {
    if (values.courseId && timeSlotId && values.dateOfExam)
      await axios
        .get(
          `/api/academic/ittaEmpBasedOnTimeAndDate/${timeSlotId}/${moment(
            values.dateOfExam
          ).format("YYYY-MM-DD")}/${values.courseId}`
        )
        .then((res) => {
          setInvigilatorOptions(
            res.data.data.map((obj) => ({
              value: obj.emp_id,
              label: obj.employee_name,
            }))
          );
        })
        .catch((error) => console.error(error));
  };

  const getSessionAssginmentData = async () => {
    await axios
      .get(`/api/academic/internalSessionAssignment/${id}`)
      .then((res) => {
        setValues({
          internalId: res.data.data.internal_master_id,
          fromDate: res.data.data.from_date,
          toDate: res.data.data.to_date,
          acYearId: res.data.data.ac_year_id,
          schoolId: res.data.data.school_id,
          programSpeId: res.data.data.program_specialization_id,
          yearsemId: res.data.data.year_sem,
          sectionId: res.data.data.section_id,
          minMarks: res.data.data.min_marks,
          maxMarks: res.data.data.max_marks,
          remarks: res.data.data.remarks,
          programIdForUpdate: res.data.data.program_id,
          internalName: res.data.data.internal_name,
        });
        setSessionAssignmentId(res.data.data.internal_id);
      })
      .catch((err) => console.error(err));
  };

  const handleChangeAdvance = async (name, newValue) => {
    if (name === "courseId") {
      await axios
        .get(`/api/academic/internalTimeTable`)
        .then((res) => {
          res.data.data.filter((val) => {
            if (val.internal_time_table_id === newValue) {
              setTimeSlotId(val.time_slots_id);
              setCourseAssignmentId(val.internal_time_table_id);
            }
          });
        })
        .catch((error) => console.error(error));
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

  const handleCreate = async (e) => {
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
      temp.emp_ids = values.invigilatorId;
      temp.room_id = values.roomCode;
      temp.internal_id = id;
      temp.internal_time_table_id = values.courseId;
      temp.remarks = values.remarks;
      temp.week_day = day;
      temp.time_slots_id = timeSlotId;
      temp.selected_date = values.dateOfExam.substr(0, 19) + "Z";
      temp.student_ids = values.studentId;

      await axios
        .post(`/api/academic/internalTimeTableAssignment`, temp)
        .then((res) => {
          setLoading(false);
          if (res.status === 200 || res.status === 201) {
            setAlertMessage({
              severity: "success",
              message: "Room Assigned",
            });
            setAlertOpen(true);
            navigate("/SessionMaster/Room", { replace: true });
          } else {
            setAlertMessage({
              severity: "error",
              message: res.data ? res.data.message : "Error Occured",
            });
            setAlertOpen(true);
          }
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
      <FormPaperWrapper>
        <Grid container rowSpacing={2.5} columnSpacing={2}>
          <Grid item xs={12} md={3}>
            <CustomDatePicker
              name="dateOfExam"
              label="Date of Exam"
              value={values.dateOfExam ? values.dateOfExam : null}
              handleChangeAdvance={handleChangeAdvance}
              minDate={values.fromDate}
              maxDate={values.toDate}
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

          {/* <Grid item xs={12} md={3}>
            <CustomAutocomplete
              name="timeSlotId"
              label="Time slot"
              value={timeSlotId}
              options={timeSlotOptions}
              handleChangeAdvance={handleChangeAdvance}
              required
            />
          </Grid> */}

          <Grid item xs={12} md={3}>
            <CustomAutocomplete
              name="invigilatorId"
              label="Invigilator"
              value={values.invigilatorId}
              options={invigilatorOptions}
              handleChangeAdvance={handleChangeAdvance}
              required
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <CustomAutocomplete
              name="roomCode"
              label="Room"
              value={values.roomCode}
              options={roomOptions}
              handleChangeAdvance={handleChangeAdvance}
              required
            />
          </Grid>
          <Grid item xs={12} align="right">
            <Button
              variant="contained"
              sx={{ borderRadius: 2 }}
              onClick={handleCreate}
            >
              Submit
            </Button>
          </Grid>
        </Grid>
      </FormPaperWrapper>
    </Box>
  );
}

export default SessionRoomInvigilatorAssignment;
