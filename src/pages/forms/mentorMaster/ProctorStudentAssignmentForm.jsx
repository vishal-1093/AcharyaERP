import { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Button,
  CircularProgress,
  Checkbox,
  styled,
  tableCellClasses,
} from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import FormWrapper from "../../../components/FormWrapper";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import axios from "../../../services/Api";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import useAlert from "../../../hooks/useAlert";
import ModalWrapper from "../../../components/ModalWrapper";
import StudentsAssigned from "./StudentsAssigned";
import SearchIcon from "@mui/icons-material/Search";
import { makeStyles } from "@mui/styles";
import moment from "moment";

const label = { inputProps: { "aria-label": "Checkbox demo" } };

const initialValues = {
  acYearId: null,
  schoolId: null,
  programSpeId: null,
  programId: null,
  yearsemId: null,
  programSpecializationId: null,
  proctorId: null,
  proctorStatus: 1,
  studentListId: [],
  studentId: [],
};

const requiredFields = ["proctorId", "schoolId"];

const useStyles = makeStyles((theme) => ({
  table: {
    "& .MuiTableCell-root": {
      borderLeft: "1px solid rgba(224, 224, 224, 1)",
      fontSize: "12px",
    },
    bg: {
      background: theme.palette.primary.main,
      color: theme.palette.headerWhite.main,
    },
  },
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.headerWhite.main,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

function ProctorStudentAssignmentForm() {
  const [isNew, setIsNew] = useState(true);
  const [values, setValues] = useState(initialValues);

  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const { id } = useParams();

  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { setAlertMessage, setAlertOpen } = useAlert();
  const setCrumbs = useBreadcrumbs();
  const [academicYearOptions, setAcademicYearOptions] = useState([]);

  const [schoolOptions, setSchoolOptions] = useState([]);

  const [programSpeOptions, setProgramSpeOptions] = useState([]);
  const [proctorOptions, setProctorOptions] = useState([]);
  const [studentDetails, setStudentDetails] = useState([]);
  const [proctorAssignId, setProctorAssignId] = useState(null);
  const [studentDetailsOptions, setStudentDetailsOptions] = useState([]);
  const [unAssigned, setUnAssigned] = useState([]);
  const [programId, setProgramId] = useState();
  const [search, setSearch] = useState("");

  const checks = [];

  useEffect(() => {
    getAcademicYearDetails();
    getSchoolData();
    if (pathname.toLowerCase() === "/mentorassignment") {
      setIsNew(true);
      setCrumbs([
        { name: "Mentor Student", link: "/MentorMaster" },
        { name: "Assignment" },
      ]);
    } else {
      setIsNew(false);
      getProctorAssignmentData();
    }
  }, [pathname]);

  useEffect(() => {
    getProgramSpeData();
    getStudentDetails();
    getStudentList();
    getEmployeesOptions();
  }, [
    values.acYearId,
    values.schoolId,
    values.proctorId,
    programId,
    values.programSpeId,
  ]);

  const getEmployeesOptions = async () => {
    await axios
      .get(`/api/employee/getEmployeeNameConcateWithEmployeeCodeAndDept`)
      .then((res) => {
        setProctorOptions(
          res.data.data.map((obj) => ({
            value: obj.emp_id,
            label: obj.mentor,
          }))
        );
      })
      .catch((err) => console.error(err));
  };

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

  const getSchoolData = async () => {
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

  const getProgramSpeData = async () => {
    if (values.schoolId)
      await axios
        .get(
          `/api/academic/fetchAllProgramsWithSpecialization/${values.schoolId}`
        )
        .then((res) => {
          setProgramSpeOptions(
            res.data.data.map((obj) => ({
              value: obj.program_specialization_id,
              label: obj.specialization_with_program,
            }))
          );
        })
        .catch((err) => console.error(err));
  };

  const getStudentDetails = async () => {
    if (values.proctorId)
      await axios
        .get(
          `/api/proctor/getProctorStatusAssignedStudentDetailsList/${values.proctorId}`
        )
        .then((res) => {
          setStudentDetails(res.data.data);
        })
        .catch((err) => console.error(err));
  };

  const getStudentList = async () => {
    if (values.acYearId && values.schoolId && programId && values.programSpeId)
      await axios
        .get(
          `/api/student/getStudentList/${values.acYearId}/${values.schoolId}/${programId}/${values.programSpeId}`
        )
        .then((res) => {
          console.log("students", res.data.data);

          setStudentDetailsOptions(res.data.data);
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
          { name: "Mentor Assignment Index", link: "/MentorMaster" },
          { name: "Mentor Assignment" },
          { name: "Update" },
        ]);
      })
      .catch((err) => console.error(err));
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const handleChangeAdvance = async (name, newValue) => {
    if (name === "programSpeId") {
      await axios
        .get(
          `/api/academic/fetchAllProgramsWithSpecialization/${values.schoolId}`
        )
        .then((res) => {
          res.data.data.filter((obj) => {
            if (obj.program_specialization_id === newValue) {
              setProgramId(obj.program_id);
            }
          });
        })
        .catch((err) => console.error(err));
      setValues((prev) => ({
        ...prev,
        [name]: newValue,
      }));
    }
    setValues((prev) => ({
      ...prev,
      [name]: newValue,
    }));
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
      temp.emp_id = values.proctorId;
      temp.school_id = values.schoolId;
      temp.student_id = values.studentId.split(",");
      temp.proctor_status = values.proctorStatus;

      await axios
        .post(`/api/proctor/ProctorStudentAssignment`, temp)
        .then((res) => {
          if (res.status === 200 || res.status === 201) {
            setLoading(false);
            navigate("/MentorMaster", { replace: true });
            setAlertMessage({
              severity: "success",
              message: "Students Assigned",
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
            navigate("/MentorMaster", { replace: true });
            setAlertMessage({
              severity: "success",
              message: "Updated Successfully",
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
              label="School"
              value={values.schoolId}
              options={schoolOptions}
              handleChangeAdvance={handleChangeAdvance}
              required
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <CustomAutocomplete
              name="programSpeId"
              label="Program Major"
              value={values.programSpeId}
              options={programSpeOptions}
              handleChangeAdvance={handleChangeAdvance}
              required
            />
          </Grid>

          {/* <Grid item xs={12} md={3}>
            <CustomAutocomplete
              name="yearsemId"
              label="Year/Sem"
              value={values.yearsemId}
              options={yearSemOptions}
              handleChangeAdvance={handleChangeAdvance}
              disabled={!isNew}
              required
            />
          </Grid> */}

          <Grid item xs={12} md={3}>
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
                Assigned Students
              </Button>
            ) : (
              <></>
            )}
          </Grid>
          <Grid
            container
            justifyContent="center"
            alignItems="center"
            rowSpacing={2}
            columnSpacing={2}
          >
            {values.programSpeId ? (
              <Grid item xs={12} md={3}>
                <CustomTextField
                  label="Search"
                  value={search}
                  handleChange={handleSearch}
                  InputProps={{
                    endAdornment: <SearchIcon />,
                  }}
                  disabled={!isNew}
                />
              </Grid>
            ) : (
              <></>
            )}

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

            <Grid item xs={10}>
              {values.programSpeId ? (
                <TableContainer component={Paper}>
                  <Table size="small" aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        <StyledTableCell
                          sx={{ color: "white", textAlign: "center" }}
                        >
                          <Checkbox
                            {...label}
                            sx={{ "& .MuiSvgIcon-root": { fontSize: 12 } }}
                            style={{ color: "white" }}
                            name="selectAll"
                            checked={
                              !studentDetailsOptions.some(
                                (user) => user?.isChecked !== true
                              )
                            }
                            onChange={handleChange}
                          />
                          Select All
                        </StyledTableCell>
                        <StyledTableCell
                          sx={{ color: "white", textAlign: "center" }}
                        >
                          AUID
                        </StyledTableCell>
                        <StyledTableCell
                          sx={{ color: "white", textAlign: "center" }}
                        >
                          Student
                        </StyledTableCell>
                        <StyledTableCell
                          sx={{ color: "white", textAlign: "center" }}
                        >
                          Year/Sem
                        </StyledTableCell>
                        <StyledTableCell
                          sx={{ color: "white", textAlign: "center" }}
                        >
                          Reporting Date
                        </StyledTableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {studentDetailsOptions
                        .filter((val) => {
                          if (search === "") {
                            return val;
                          } else if (
                            val.student_name
                              .toLowerCase()
                              .includes(search.toLowerCase()) ||
                            val.auid
                              .toLowerCase()
                              .includes(search.toLowerCase())
                          ) {
                            return val;
                          }
                        })
                        .map((val, i) => (
                          <TableRow key={i} style={{ height: 10 }}>
                            <StyledTableCell sx={{ textAlign: "center" }}>
                              <Checkbox
                                {...label}
                                sx={{
                                  "& .MuiSvgIcon-root": { fontSize: 12 },
                                }}
                                name={val.student_id}
                                value={val.student_id}
                                onChange={handleChange}
                                checked={val?.isChecked || false}
                              />
                            </StyledTableCell>

                            <StyledTableCell sx={{ textAlign: "center" }}>
                              {val.auid}
                            </StyledTableCell>
                            <StyledTableCell sx={{ textAlign: "center" }}>
                              {val.student_name}
                            </StyledTableCell>
                            <StyledTableCell sx={{ textAlign: "center" }}>
                              {val.current_sem
                                ? val.current_sem
                                : val.current_year}
                            </StyledTableCell>
                            <StyledTableCell sx={{ textAlign: "center" }}>
                              {moment(val.reporting_date).format("DD-MM-YYYY")}
                            </StyledTableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <></>
              )}
            </Grid>
          </Grid>
        </Grid>
      </FormWrapper>
    </Box>
  );
}

export default ProctorStudentAssignmentForm;
