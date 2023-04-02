import { useState, useEffect } from "react";
import {
  Grid,
  Button,
  CircularProgress,
  Box,
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
import { CheckBox, VpnLock } from "@mui/icons-material";
import ModalWrapper from "../../../components/ModalWrapper";

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

const requiredFields = ["acYearId", "schoolId", "programSpeId", "yearsemId"];

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

  const { id } = useParams();
  const { pathname } = useLocation();
  const { setAlertMessage, setAlertOpen } = useAlert();
  const classes = useStyles();

  const navigate = useNavigate();

  const checks = {
    fromDate: [values.fromDate !== null],
    toDate: [values.toDate !== null],
  };

  const errorMessages = {
    fromDate: ["This field is required"],
    toDate: ["This field is required"],
  };

  useEffect(() => {
    getInternalTypes();
    getSessionAssginmentData();
    getRoomData();
  }, []);

  useEffect(() => {
    getSchool();
    getAcademicyear();
    getProgramSpeData();
    getYearSemForUpdate();
    getCourseData();
  }, [
    values.acYearId,
    values.schoolId,
    values.programSpeId,
    values.yearsemId,
    values.dateOfExam,
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

  const getYearSemForUpdate = async () => {
    await axios
      .get(
        `/api/academic/fetchAllProgramsWithSpecialization/${values.schoolId}`
      )
      .then((res) => {
        const yearsem = [];
        res.data.data.filter((obj) => {
          if (obj.program_specialization_id === values.programSpeId) {
            yearsem.push(obj);

            setProgramAssignmentId(obj.program_assignment_id);
          }
        });

        const newYear = [];
        yearsem.map((obj) => {
          if (obj.program_type_name.toLowerCase() === "yearly") {
            setProgramType("Year");
            for (let i = 1; i <= obj.number_of_years; i++) {
              newYear.push({ value: i, label: "Year" + "-" + i });
            }
          }
          if (obj.program_type_name.toLowerCase() === "semester") {
            setProgramType("Sem");
            for (let i = 1; i <= obj.number_of_semester; i++) {
              newYear.push({ value: i, label: "Sem" + "-" + i });
            }
          }
        });

        setYearSemOptions(
          newYear.map((obj) => ({
            value: obj.value,
            label: obj.label,
          }))
        );
      })
      .catch((err) => console.error(err));
  };

  const getRoomData = async () => {
    await axios
      .get(`/api/academic/ittaRoomidBasedOnTimeAndDate`)
      .then((res) => {})
      .catch((error) => console.error(error));
  };

  const getCourseData = async () => {
    if (values.dateOfExam)
      await axios
        .get(
          `/api/academic/ittaCourseBasedOnDate/${values.dateOfExam.toISOString()}`
        )
        .then((res) => {})
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
    setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleChangeAdvance = async (name, newValue) => {
    if (name === "programSpeId") {
      await axios
        .get(
          `/api/academic/fetchAllProgramsWithSpecialization/${values.schoolId}`
        )
        .then((res) => {
          const yearsem = [];
          res.data.data.filter((obj) => {
            if (obj.program_specialization_id === newValue) {
              yearsem.push(obj);
              setProgramId(obj.program_id);
              setProgramAssignmentId(obj.program_assignment_id);
            }
          });

          const newYear = [];
          yearsem.map((obj) => {
            if (obj.program_type_name.toLowerCase() === "yearly") {
              setProgramId(obj.program_id);
              setProgramAssignmentId(obj.program_assignment_id);
              setProgramType("Year");
              for (let i = 1; i <= obj.number_of_years; i++) {
                newYear.push({ value: i, label: "Year" + "-" + i });
              }
            }
            if (obj.program_type_name.toLowerCase() === "semester") {
              setProgramType("Sem");
              for (let i = 1; i <= obj.number_of_semester; i++) {
                newYear.push({ value: i, label: "Sem" + "-" + i });
              }
            }
          });

          setYearSemOptions(
            newYear.map((obj) => ({
              value: obj.value,
              label: obj.label,
            }))
          );
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
      temp.internal_master_id = values.internalId;
      temp.internal_name = internalTypeOptions
        .filter((obj) => obj.value === values.internalId)
        .map((val) => val.label)
        .toString();
      temp.from_date = values.fromDate;
      temp.to_date = values.toDate;
      temp.ac_year_id = values.acYearId;
      temp.school_id = values.schoolId;
      temp.program_specialization_id = values.programSpeId;
      temp.program_id = programId;
      temp.program_assignment_id = programAssigmentId;
      temp.year_sem = values.yearsemId;
      temp.min_marks = values.minMarks;
      temp.max_marks = values.maxMarks;
      temp.remarks = values.remarks;
      temp.dateOfExam = values.dateOfExam;

      return false;

      await axios
        .post(`/api/academic/internalSessionAssignment`, temp)
        .then((res) => {
          setLoading(false);
          if (res.status === 200 || res.status === 201) {
            navigate("/SessionAssignmentIndex", { replace: true });
            setAlertMessage({
              severity: "success",
              message: "Session Assignment Created",
            });
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
                  <Typography variant="subtitle2">Min Marks</Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="body2" color="textSecondary">
                    {values.minMarks}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={2}>
                  <Typography variant="subtitle2">Max Marks</Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="body2" color="textSecondary">
                    {values.maxMarks}
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
              value={values.dateOfExam ? values.dateOfExam : values.fromDate}
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
              options={yearSemOptions}
              handleChangeAdvance={handleChangeAdvance}
              required
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <CustomAutocomplete
              name="invigilatorId"
              label="Invigilator"
              value={values.invigilatorId}
              options={yearSemOptions}
              handleChangeAdvance={handleChangeAdvance}
              required
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <CustomAutocomplete
              name="roomCode"
              label="Room"
              value={values.roomCode}
              options={yearSemOptions}
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
              <Grid item xs={12} md={12} mt={2}>
                <TableContainer component={Paper}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <StyledTableCell>
                          <CheckBox {...label} sx={{ height: 12 }} />
                        </StyledTableCell>
                        <StyledTableCell>Name</StyledTableCell>
                        <StyledTableCell>AUID</StyledTableCell>
                        <StyledTableCell>USN</StyledTableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <StyledTableCell>
                          <CheckBox {...label} sx={{ height: 12 }} />
                        </StyledTableCell>
                        <StyledTableCell>Name</StyledTableCell>
                        <StyledTableCell>AUID</StyledTableCell>
                        <StyledTableCell>USN</StyledTableCell>
                      </TableRow>
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
