import { useState, useEffect } from "react";
import {
  Grid,
  Button,
  Box,
  Checkbox,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  styled,
  tableCellClasses,
  Paper,
} from "@mui/material";
import axios from "../../../services/Api";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";
import CustomDatePicker from "../../../components/Inputs/CustomDatePicker";
import useAlert from "../../../hooks/useAlert";
import FormPaperWrapper from "../../../components/FormPaperWrapper";
import { makeStyles } from "@mui/styles";
import ModalWrapper from "../../../components/ModalWrapper";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import SearchIcon from "@mui/icons-material/Search";

const label = { inputprops: { "aria-label": "Checkbox demo" } };

const initialValues = {
  internalId: null,
  internalName: "",
  fromDate: null,
  toDate: null,
  acYearId: null,
  schoolId: null,
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

const requiredFields = ["courseId"];

const useStyles = makeStyles((theme) => ({
  bg: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.headerWhite.main,
    padding: "6px",
    textAlign: "center",
  },
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.headerWhite.main,
  },
}));

function SessionRoomInvigilatorAssignment() {
  const [isNew, setIsNew] = useState(false);
  const [values, setValues] = useState(initialValues);
  const [loading, setLoading] = useState(false);
  const [sessionAssignmentId, setSessionAssignmentId] = useState(null);
  const [academicYearOptions, setAcademicYearOptions] = useState(null);
  const [internalTypeOptions, setInternalTypeOptions] = useState([]);
  const [schoolOptions, setSchoolOptions] = useState(null);
  const [programSpeOptions, setProgramSpeOptions] = useState(null);
  const [programOptions, setProgramOptions] = useState(null);
  const [yearSemOptions, setYearSemOptions] = useState([]);
  const [programType, setProgramType] = useState("Sem");
  const [programId, setProgramId] = useState(null);
  const [programAssigmentId, setProgramAssignmentId] = useState(null);
  const [open, setOpen] = useState(false);
  const [roomOptions, setRoomOptions] = useState([]);
  const [courseOptions, setCourseOptions] = useState([]);
  const [search, setSearch] = useState("");
  const [timeSlotId, setTimeSlotId] = useState(null);
  const [invigilatorOptions, setInvigilatorOptions] = useState([]);
  const [studentDetailsOptions, setStudentDetailsOptions] = useState([]);
  const [unAssigned, setUnAssigned] = useState([]);
  const [internalTimetableId, setInternalTimetableId] = useState(null);

  const { id } = useParams();
  const { pathname } = useLocation();
  const { setAlertMessage, setAlertOpen } = useAlert();
  const classes = useStyles();

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
    getInternalTypes();
    getSessionAssginmentData();
  }, []);

  useEffect(() => {
    getRoomData();
  }, [values.programSpeId, values.dateOfExam, values.courseId]);

  useEffect(() => {
    getSchool();
    getAcademicyear();
    getProgramSpeData();
    getCourseData();
    getInvigilatorData();
    getStudentList();
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

  const getAcademicyear = async () => {
    await axios
      .get(`/api/academic/academic_year`)
      .then((res) => {
        res.data.data.filter((val) => {
          if (val.ac_year_id === values.acYearId) {
            setAcademicYearOptions(val.ac_year);
          }
        });
      })
      .catch((error) => console.error(error));
  };

  const getProgramSpeData = async () => {
    if (values.schoolId)
      await axios
        .get(
          `/api/academic/fetchAllProgramsWithSpecialization/${values.schoolId}`
        )
        .then((res) => {
          res.data.data
            .filter(
              (val) => val.program_specialization_id === values.programSpeId
            )
            .map((obj) => {
              setProgramSpeOptions(obj.program_specialization_short_name);
              setProgramOptions(obj.program_short_name);
            });
        })
        .catch((err) => console.error(err));
  };

  const getInternalTypes = async () => {
    await axios
      .get(`/api/academic/InternalTypes`)
      .then((res) => {
        setInternalTypeOptions(
          res.data.data.map((obj) => ({
            value: obj.internal_master_id,
            label: obj.internal_name,
          }))
        );
      })
      .catch((error) => console.error(error));
  };

  const getSchool = async () => {
    await axios
      .get(`/api/institute/school`)
      .then((res) => {
        res.data.data
          .filter((val) => val.school_id === values.schoolId)
          .map((obj) => setSchoolOptions(obj.school_name_short));
      })
      .catch((error) => console.error(error));
  };

  const getRoomData = async () => {
    if (values.programSpeId && values.courseId && values.dateOfExam)
      await axios
        .get(
          `/api/academic/ittaRoomidBasedOnTimeAndDate/${values.programSpeId}/${
            values.courseId
          }/${values.dateOfExam.toISOString()}`
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
          `/api/academic/ittaCourseBasedOnDate/${id}/${values.dateOfExam.toISOString()}`
        )
        .then((res) => {
          setCourseOptions(
            res.data.data.map((obj) => ({
              value: obj.course_id,
              label: obj.course_name,
            }))
          );
        })
        .catch((error) => console.error(error));
  };

  const getInvigilatorData = async () => {
    if (values.courseId && timeSlotId && values.dateOfExam)
      await axios
        .get(
          `/api/academic/ittaEmpBasedOnTimeAndDate/${timeSlotId}/${values.dateOfExam.toISOString()}/${
            values.courseId
          }`
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

  const getStudentList = async () => {
    if (
      values.courseId &&
      values.schoolId &&
      values.programSpeId &&
      values.acYearId &&
      values.yearsemId
    )
      await axios
        .get(
          `/api/academic/IttaStudentDetails/${values.internalId}/${values.courseId}/${values.schoolId}/${values.programSpeId}/${values.acYearId}/${values.yearsemId}`
        )
        .then((res) => {
          setStudentDetailsOptions(res.data.data);
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

  const handleChange = (e) => {
    const { name, checked } = e.target;

    if (name === "selectAll" && checked === true) {
      let tempUser = studentDetailsOptions.map((test) => {
        return { ...test, isChecked: checked };
      });
      setStudentDetailsOptions(tempUser);

      setValues({
        ...values,
        studentId: studentDetailsOptions
          .map((obj) => obj.student_id)
          .toString(),
      });
    } else if (name === "selectAll" && checked === false) {
      let tempUser = studentDetailsOptions.map((test) => {
        return { ...test, isChecked: checked };
      });
      setStudentDetailsOptions(tempUser);

      setValues({
        ...values,
        studentId: [],
      });
    } else if (name !== "selectAll" && checked === true) {
      if (!isNew) {
        const uncheckTemp = unAssigned;
        if (
          uncheckTemp.includes(e.target.value) === true &&
          uncheckTemp.indexOf(e.target.value) > -1
        ) {
          uncheckTemp.splice(uncheckTemp.indexOf(e.target.value), 1);
        }

        setUnAssigned(uncheckTemp);
      }

      let temp = studentDetailsOptions.map((obj) => {
        return obj.student_id.toString() === name
          ? { ...obj, isChecked: checked }
          : obj;
      });
      setStudentDetailsOptions(temp);
      const newTemp = [];
      temp.map((obj) => {
        if (obj.isChecked === true) {
          newTemp.push(obj.student_id);
        }
      });
      setValues({
        ...values,
        studentId: newTemp.toString(),
      });
    } else if (name !== "selectAll" && checked === false) {
      if (!isNew) {
        const uncheckTemp = unAssigned;
        if (uncheckTemp.includes(e.target.value) === false) {
          uncheckTemp.push(e.target.value);
        }

        setUnAssigned(uncheckTemp);
      }

      let temp = studentDetailsOptions.map((obj) => {
        return obj.student_id.toString() === name
          ? { ...obj, isChecked: checked }
          : obj;
      });

      setStudentDetailsOptions(temp);

      const existData = [];

      values.studentId.split(",").map((obj) => {
        existData.push(obj);
      });

      const index = existData.indexOf(e.target.value);

      if (index > -1) {
        existData.splice(index, 1);
      }

      setValues({
        ...values,
        studentId: existData.toString(),
      });
    }
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const handleChangeAdvance = async (name, newValue) => {
    if (name === "courseId") {
      await axios
        .get(`/api/academic/internalTimeTable`)
        .then((res) => {
          res.data.data.filter((val) => {
            if (val.course_id === newValue) {
              setTimeSlotId(val.time_slots_id);
              setInternalTimetableId(val.internal_time_table_id);
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

  const handleOpen = () => {
    setOpen(true);
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
      temp.internal_time_table_id = internalTimetableId;
      temp.remarks = values.remarks;
      temp.week_day = day;
      temp.time_slots_id = timeSlotId;
      temp.selected_date = values.dateOfExam;
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
          } else {
            setAlertMessage({
              severity: "error",
              message: res.data ? res.data.message : "Error Occured",
            });
          }
          setAlertOpen(true);
          setOpen(false);
          window.location.reload();
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

  const handleUpdate = async (e) => {
    if (!requiredFieldsValid()) {
      setAlertMessage({
        severity: "error",
        message: "Please fill required fields",
      });
      setAlertOpen(true);
    } else {
      setLoading(true);
      const temp = {};
      temp.active = true;
      temp.internal_id = sessionAssignmentId;
      temp.internal_master_id = values.internalId;
      temp.internal_name = values.internalName
        ? values.internalName
        : internalTypeOptions
            .filter((obj) => obj.value === values.internalId)
            .map((val) => val.value)
            .toString();
      temp.from_date = values.fromDate;
      temp.to_date = values.toDate;
      temp.ac_year_id = values.acYearId;
      temp.school_id = values.schoolId;
      temp.program_specialization_id = values.programSpeId;
      temp.program_id = programId ? programId : values.programIdForUpdate;
      temp.program_assignment_id = programAssigmentId;
      temp.year_sem = values.yearsemId;
      temp.min_marks = values.minMarks;
      temp.max_marks = values.maxMarks;
      temp.remarks = values.remarks;

      await axios
        .put(`/api/academic/internalSessionAssignment/${id}`, temp)
        .then((res) => {
          setLoading(false);
          if (res.status === 200 || res.status === 201) {
            setAlertMessage({
              severity: "success",
              message: "Session Assignment Updated",
            });
            navigate("/SessionAssignmentIndex", { replace: true });
          } else {
            setAlertMessage({
              severity: "error",
              message: res.data ? res.data.message : "Error Occured",
            });
          }
          setAlertOpen(true);
        })
        .catch((error) => {
          setLoading(false);
          setAlertMessage({
            severity: "error",
            message: error.response.data.message,
          });
        });
    }
  };

  return (
    <Box component="form" overflow="hidden" p={1}>
      <FormPaperWrapper>
        <Grid container rowSpacing={2.5} columnSpacing={2}>
          <Grid item xs={12} md={12}>
            <Typography variant="subtitle2" className={classes.bg}>
              {values.internalName}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Paper elevation={2}>
              <Grid
                container
                alignItems="center"
                rowSpacing={1.5}
                pl={2}
                pr={2}
                pb={2}
              >
                <Grid item xs={12} md={2}>
                  <Typography variant="subtitle2">Ac Year</Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="body2" color="textSecondary">
                    {academicYearOptions}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={2}>
                  <Typography variant="subtitle2">School</Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="body2" color="textSecondary">
                    {schoolOptions}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={2}>
                  <Typography variant="subtitle2">Program</Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="body2" color="textSecondary">
                    {programOptions}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={2}>
                  <Typography variant="subtitle2">Specialization</Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="body2" color="textSecondary">
                    {programSpeOptions}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={2}>
                  <Typography variant="subtitle2">Year/Sem</Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="body2" color="textSecondary">
                    {values.yearsemId}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={2}>
                  <Typography variant="subtitle2">Remarks</Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="body2" color="textSecondary">
                    {values.remarks}
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
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
          {values.roomCode ? (
            <Grid item xs={12} md={4}>
              <Button
                variant="contained"
                sx={{ borderRadius: 2 }}
                onClick={handleOpen}
              >
                ASSIGN STUDENTS
              </Button>
            </Grid>
          ) : (
            " "
          )}

          <ModalWrapper maxWidth={800} open={open} setOpen={setOpen}>
            <Grid container rowSpacing={2}>
              <Grid item xs={12} md={2.8} textAlign="right">
                <CustomTextField
                  name="search"
                  value={search}
                  handleChange={handleSearch}
                  InputProps={{
                    endAdornment: <SearchIcon />,
                  }}
                />
              </Grid>
              <Grid item xs={12} md={12} mt={2}>
                <TableContainer component={Paper}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <StyledTableCell>
                          <Checkbox
                            {...label}
                            sx={{ "& .MuiSvgIcon-root": { fontSize: 10 } }}
                            style={{ color: "white" }}
                            name="selectAll"
                            checked={
                              !studentDetailsOptions.some(
                                (user) => user?.isChecked !== true
                              )
                            }
                            onChange={handleChange}
                          />
                        </StyledTableCell>
                        <StyledTableCell>Name</StyledTableCell>
                        <StyledTableCell>AUID</StyledTableCell>
                        <StyledTableCell>USN</StyledTableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {studentDetailsOptions
                        .filter((val) => {
                          if (val.auid === "") {
                            return val;
                          } else if (
                            val.auid
                              .toLowerCase()
                              .includes(search.toLowerCase()) ||
                            val.student_name
                              .toLowerCase()
                              .includes(search.toLowerCase())
                          ) {
                            return val;
                          }
                        })
                        .map((obj, i) => {
                          return (
                            <TableRow key={i}>
                              <StyledTableCell>
                                <Checkbox
                                  {...label}
                                  sx={{
                                    "& .MuiSvgIcon-root": { fontSize: 10 },
                                  }}
                                  name={obj.student_id}
                                  value={obj.student_id}
                                  onChange={handleChange}
                                  checked={obj?.isChecked || false}
                                />
                              </StyledTableCell>
                              <StyledTableCell>
                                {obj.student_name}
                              </StyledTableCell>
                              <StyledTableCell>{obj.auid}</StyledTableCell>
                              <StyledTableCell>{obj.usn}</StyledTableCell>
                            </TableRow>
                          );
                        })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
              <Grid item xs={12} textAlign="right">
                <Button
                  variant="contained"
                  sx={{ borderRadius: 2 }}
                  onClick={handleCreate}
                >
                  SUBMIT
                </Button>
              </Grid>
            </Grid>
          </ModalWrapper>
        </Grid>
      </FormPaperWrapper>
    </Box>
  );
}

export default SessionRoomInvigilatorAssignment;
