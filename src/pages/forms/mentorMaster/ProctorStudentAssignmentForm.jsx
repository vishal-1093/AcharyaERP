import { useState, useEffect } from "react";
import { Box, Grid, Button, CircularProgress, Checkbox } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import FormWrapper from "../../../components/FormWrapper";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";
import axios from "../../../services/Api";
import ApiUrl from "../../../services/Api";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import useAlert from "../../../hooks/useAlert";
import ModalWrapper from "../../../components/ModalWrapper";
import StudentsAssigned from "./StudentsAssigned";
import { makeStyles } from "@mui/styles";
const label = { inputProps: { "aria-label": "Checkbox demo" } };
const initialValues = {
  acYearId: null,
  schoolId: null,
  programId: null,
  programSpecializationId: null,
  proctorId: null,
  proctorStatus: 1,
  studentListId: [],
  studentId: [],
};

const requiredFields = ["proctorId", "schoolId"];

const useStyles = makeStyles({
  table: {
    "& .MuiTableCell-root": {
      borderLeft: "1px solid rgba(224, 224, 224, 1)",
      fontSize: "15px",
    },
  },
});

function ProctorStudentAssignmentForm() {
  const [isNew, setIsNew] = useState(true);
  const [values, setValues] = useState(initialValues);
  const [users, setUsers] = useState([]);
  const [studentData, setStudentData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const { id } = useParams();
  const classes = useStyles();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { setAlertMessage, setAlertOpen } = useAlert();
  const setCrumbs = useBreadcrumbs();
  const [academicYearOptions, setAcademicYearOptions] = useState([]);
  const [schoolOptions, setSchoolOptions] = useState([]);
  const [programOptions, setProgramOptions] = useState([]);
  const [programSpeOptions, setProgramSpeOptions] = useState([]);
  const [proctorOptions, setProctorOptions] = useState([]);
  const [studentDetails, setStudentDetails] = useState([]);
  const [proctorHeadId, setProctorHeadId] = useState(null);
  const [proctorAssignId, setProctorAssignId] = useState(null);
  const checks = [];

  useEffect(() => {
    getAcademicYearDetails();
    getSchoolDetails();
    getEmailOptions();
    if (pathname.toLowerCase() === "/mentorstudentassignment/new") {
      setIsNew(true);
      setCrumbs([
        { name: "Mentor Assignment Index", link: "/MentorAssignmentIndex" },
        { name: "Mentor Assignment" },
        { name: "Create" },
      ]);
    } else {
      setIsNew(false);
      getProctorAssignmentData();
    }
  }, [pathname]);

  useEffect(() => {
    getProgramData();
    getProgramSpeData();
    getStudentDetails();
    getStudentList();
  }, [
    values.acYearId,
    values.schoolId,
    values.proctorId,
    values.programId,
    values.programSpecializationId,
  ]);

  const getAcademicYearDetails = async () => {
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
      .catch((err) => console.error(err));
  };

  const getSchoolDetails = async () => {
    await axios
      .get(`/api/institute/school`)
      .then((res) => {
        setSchoolOptions(
          res.data.data.map((obj) => ({
            value: obj.school_id,
            label: obj.school_name_short,
          }))
        );
      })
      .catch((err) => console.error(err));
  };

  const getEmailOptions = async () => {
    await axios
      .get(`/api/employee/activeEmployeeDetailsForProctor`)
      .then((res) => {
        setProctorOptions(
          res.data.data.map((obj) => ({
            value: obj.emp_id,
            label: obj.employee_name,
          }))
        );
      })
      .catch((err) => console.error(err));
  };

  const getProgramData = async () => {
    if (values.acYearId && values.schoolId)
      await axios
        .get(
          `/api/academic/fetchProgram1/${values.acYearId}/${values.schoolId}`
        )
        .then((res) => {
          setProgramOptions(
            res.data.data.map((obj) => ({
              value: obj.program_id,
              label: obj.program_short_name,
            }))
          );
        })
        .catch((error) => console.error(error));
  };

  const getProgramSpeData = async () => {
    if (values.schoolId && values.programId)
      await axios
        .get(
          `/api/academic/FetchProgramSpecialization/${values.schoolId}/${values.programId}`
        )
        .then((res) => {
          setProgramSpeOptions(
            res.data.data.map((obj) => ({
              value: obj.program_specialization_id,
              label: obj.program_specialization_short_name,
            }))
          );
        })
        .catch((error) => console.error(error));
  };

  const getStudentDetails = async () => {
    if (values.proctorId)
      await axios
        .get(`/api/proctor/getAllStudentDetailsList/${values.proctorId}`)
        .then((res) => {
          setStudentDetails(res.data.data);
        })
        .catch((err) => {
          console.error(err);
        });
  };

  const getStudentList = async () => {
    if (
      values.acYearId &&
      values.schoolId &&
      values.programId &&
      values.programSpecializationId
    )
      await axios
        .get(
          `/api/student/getStudentList/${values.acYearId}/${values.schoolId}/${values.programId}/${values.programSpecializationId}`
        )
        .then((res) => {
          setUsers(res.data.data);
        })
        .catch((err) => console.error(err));
  };

  const getProctorAssignmentData = async () => {
    await axios(`/api/proctor/ProctorStudentAssignment/${id}`)
      .then((res) => {
        setValues({
          schoolId: res.data.data.school_id,
          proctorId: res.data.data.proctor_id,
        });
        setProctorAssignId(res.data.data.proctor_assign_id);
        setCrumbs([
          { name: "Mentor Assignment Index", link: "/MentorAssignmentIndex" },
          { name: "Mentor Assignment" },
          { name: "Update" },
        ]);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const handleChangeAdvance = (name, newValue) => {
    setValues((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleChange = (e) => {
    const { name, checked } = e.target;

    if (name === "allSelect") {
      let temp = users.map((test) => {
        return { ...test, isChecked: checked };
      });
      setUsers(temp);
      if (checked === true) {
        const Ids = users.map((val) => {
          return val.student_id;
        });
        setValues({ ...values, studentId: Ids });
      } else {
        setValues({ ...values, studentId: [] });
      }
    } else {
      let temp = users.map((test) =>
        test.student_id == name ? { ...test, isChecked: checked } : test
      );
      setUsers(temp);
      if (checked === true) {
        studentData.push(e.target.value);
      } else {
        const indexVal = studentData.indexOf(e.target.value);
        studentData.splice(indexVal);
      }
      setValues({ ...values, studentId: studentData });
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
        message: "Please fill all required fields",
      });
      setAlertOpen(true);
    } else {
      setLoading(true);
      const temp = {};
      temp.active = true;
      temp.proctor_id = values.proctorId;
      temp.school_id = values.schoolId;
      temp.student_id = values.studentId;
      temp.proctor_status = values.proctorStatus;

      await axios
        .post(`/api/proctor/ProctorStudentAssignment`, temp)
        .then((res) => {
          if (res.status === 200 || res.status === 201) {
            setLoading(false);
            navigate("/MentorAssignmentIndex", { replace: true });
            setAlertMessage({
              severity: "success",
              message: "Proctor Head created",
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
        message: "Please fill all required fields",
      });
      setAlertOpen(true);
    } else {
      setLoading(true);
      const temp = {};
      temp.active = true;
      temp.proctor_assign_id = proctorAssignId;
      temp.proctor_id = values.proctorId;
      temp.school_id = values.schoolId;
      temp.student_id = values.studentListId;
      await axios
        .put(`/api/proctor/ProctorStudentAssignment/${id}`, temp)
        .then((res) => {
          setLoading(false);
          if (res.status === 200 || res.status === 201) {
            navigate("/MentorAssignmentIndex", { replace: true });
            setAlertMessage({
              severity: "success",
              message: "Proctor Head updated",
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
      <ModalWrapper
        open={modalOpen}
        setOpen={setModalOpen}
        label="Student List"
      >
        <StudentsAssigned studentDetails={studentDetails} />
      </ModalWrapper>
      <FormWrapper>
        <Grid
          container
          alignItems="center"
          justifyContent="flex-start"
          rowSpacing={4}
          columnSpacing={{ xs: 2, md: 4 }}
        >
          <Grid item xs={12} md={6}>
            <CustomAutocomplete
              name="acYearId"
              label="Academic Year"
              value={values.acYearId}
              options={academicYearOptions}
              handleChangeAdvance={handleChangeAdvance}
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <CustomAutocomplete
              name="schoolId"
              label="School"
              value={values.schoolId}
              options={schoolOptions}
              handleChangeAdvance={handleChangeAdvance}
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <CustomAutocomplete
              name="programId"
              label="Program"
              value={values.programId}
              options={programOptions}
              handleChangeAdvance={handleChangeAdvance}
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <CustomAutocomplete
              name="programSpecializationId"
              label="Program Specialization"
              value={values.programSpecializationId}
              options={programSpeOptions}
              handleChangeAdvance={handleChangeAdvance}
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <CustomAutocomplete
              name="proctorId"
              label="Mentor"
              value={values.proctorId}
              options={proctorOptions}
              handleChangeAdvance={handleChangeAdvance}
              required
            />
          </Grid>

          <Grid item xs={12} md={4}>
            {values.proctorId ? (
              <Button
                variant="contained"
                color="primary"
                onClick={() => setModalOpen(true)}
              >
                Proctor History
              </Button>
            ) : (
              <></>
            )}
          </Grid>

          <Grid item xs={12} md={6}>
            {values.programSpecializationId ? (
              <TableContainer component={Paper} sx={{ width: { md: 500 } }}>
                <Table
                  size="small"
                  aria-label="simple table"
                  className={classes.table}
                >
                  <TableHead
                    sx={{
                      backgroundColor: (theme) => theme.palette.primary.main,
                      color: (theme) => theme.palette.headerWhite.main,
                    }}
                  >
                    <TableRow style={{ height: 10 }}>
                      <TableCell>
                        <Checkbox
                          {...label}
                          name="allSelect"
                          checked={
                            users.filter((user) => user?.isChecked !== true)
                              .length < 1
                          }
                          onChange={handleChange}
                        />
                        Select All
                      </TableCell>
                      <TableCell>AUID</TableCell>
                      <TableCell>Student</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {users.map((val, i) => (
                      <TableRow key={i} style={{ height: 10 }}>
                        <TableCell>
                          <Checkbox
                            {...label}
                            name={val.student_id.toString()}
                            value={val.student_id}
                            onChange={handleChange}
                            checked={val?.isChecked || false}
                          />
                        </TableCell>

                        <TableCell>{val.auid}</TableCell>
                        <TableCell>{val.student_name}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <></>
            )}
          </Grid>

          <Grid item xs={12} textAlign="right">
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

export default ProctorStudentAssignmentForm;
