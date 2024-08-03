import { useState, useEffect, lazy } from "react";
import {
  Grid,
  Button,
  CircularProgress,
  Box,
  Paper,
  Checkbox,
  styled,
  IconButton,
  tableCellClasses,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import axios from "../../../services/Api";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import useAlert from "../../../hooks/useAlert";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import { makeStyles } from "@mui/styles";
import { TablePagination } from "@mui/material";
const FormWrapper = lazy(() => import("../../../components/FormWrapper"));
const CustomTextField = lazy(() =>
  import("../../../components/Inputs/CustomTextField")
);
const CustomAutocomplete = lazy(() =>
  import("../../../components/Inputs/CustomAutocomplete")
);
const label = { inputProps: { "aria-label": "Checkbox demo" } };

const initialValues = {
  acYearId: null,
  schoolId: null,
  programIdForUpdate: null,
  programSpeId: null,
  yearsemId: null,
  courseId: null,
  remarks: "",
  studentId: "",
};

const requiredFields = [
  "acYearId",
  "schoolId",
  "programSpeId",
  "yearsemId",
  "studentId",
];

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.headerWhite.main,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const useStyles = makeStyles((theme) => ({
  iconButton: {
    display: "flex",
    fontSize: 14,
  },
}));

function CourseStudentAssignment() {
  const [isNew, setIsNew] = useState(true);
  const [values, setValues] = useState(initialValues);
  const [loading, setLoading] = useState(false);
  const [sectionAssignmentId, setSectionAssignmentId] = useState(null);
  const [academicYearOptions, setAcademicYearOptions] = useState([]);
  const [programSpeOptions, setProgramSpeOptions] = useState([]);
  const [schoolOptions, setSchoolOptions] = useState([]);
  const [yearSemOptions, setYearSemOptions] = useState([]);
  const [studentDetailsOptions, setStudentDetailsOptions] = useState([]);
  const [courseOptions, setCourseOptions] = useState([]);
  const [programType, setProgramType] = useState("Sem");
  const [programId, setProgramId] = useState(null);
  const [unAssigned, setUnAssigned] = useState([]);
  const [order, setOrder] = useState("ASC");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(100);

  const { id } = useParams();
  const { pathname } = useLocation();
  const { setAlertMessage, setAlertOpen } = useAlert();
  const setCrumbs = useBreadcrumbs();
  const navigate = useNavigate();
  const classes = useStyles();

  const checks = {};

  useEffect(() => {
    getAcademicyear();
    getSchoolData();
    if (pathname.toLowerCase() === "/coursemaster/student/new") {
      setIsNew(true);
      setCrumbs([
        { name: "Course Master", link: "/Courseassignmentstudentindex" },
        { name: "Course  Assignment" },
      ]);
    } else {
      setIsNew(false);
      getCourseStudentAssignmentData();
    }
  }, []);

  useEffect(() => {
    getProgramSpeData();
    getYearSemData();
    getStudentDetailsData();
    getCourseDetails();
  }, [
    values.acYearId,
    values.schoolId,
    values.courseId,
    values.programSpeId,
    values.yearsemId,
    programType,
  ]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getSchoolData = async () => {
    await axios
      .get(`/api/institute/school`)
      .then((res) => {
        const data = [];
        res.data.data.forEach((obj) => {
          data.push({
            value: obj.school_id,
            label: obj.school_name,
          });
        });
        setSchoolOptions(data);
      })
      .catch((error) => console.error(error));
  };

  const getAcademicyear = async () => {
    await axios
      .get(`/api/academic/academic_year`)
      .then((res) => {
        const data = [];
        res.data.data.forEach((obj) => {
          data.push({
            value: obj.ac_year_id,
            label: obj.ac_year,
          });
        });
        setAcademicYearOptions(data);
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
          const data = [];
          res.data.data.forEach((obj) => {
            data.push({
              value: obj.program_specialization_id,
              label: obj.specialization_with_program,
            });
          });
          setProgramSpeOptions(data);
        })
        .catch((err) => console.error(err));
  };

  const getCourseDetails = async () => {
    if (
      values.schoolId &&
      values.acYearId &&
      values.programSpeId &&
      values.yearsemId
    )
      await axios
        .get(
          `/api/academic/courseDetailsForStudentsAssignment/${values.acYearId}/${values.programSpeId}/${values.yearsemId}/${values.schoolId}`
        )
        .then((res) => {
          const data = [];
          res.data.data.forEach((obj) => {
            data.push({
              value: obj.course_assignment_id,
              label: obj.course_name_with_code,
            });
          });
          setCourseOptions(data);
        })
        .catch((error) => console.error(error));
  };

  const getYearSemData = async (id) => {
    if (values.acYearId && values.schoolId && values.programSpeId)
      await axios
        .get(
          `/api/academic/FetchAcademicProgram/${values.acYearId}/${
            isNew ? programId : values.programIdForUpdate
          }/${values.schoolId}`
        )
        .then((res) => {
          const yearsem = [];
          res.data.data.map((obj) => {
            if (obj.program_type.toLowerCase() === "semester") {
              setProgramType("Sem");
              for (let i = 1; i <= obj.number_of_semester; i++) {
                yearsem.push({ value: i, label: "Sem" + "-" + i });
              }
            } else if (obj.program_type.toLowerCase() === "yearly") {
              setProgramType("Year");
              for (let i = 1; i <= obj.number_of_years; i++) {
                yearsem.push({ value: i, label: "Year" + "-" + i });
              }
            }
          });
          const year = [];
          yearsem.forEach((obj) => {
            year.push({
              value: obj.value,
              label: obj.label,
            });
          });
          setYearSemOptions(year);
        })
        .catch((err) => console.error(err));
  };

  const getStudentDetailsData = async () => {
    if (
      values.acYearId &&
      values.schoolId &&
      values.programSpeId &&
      values.yearsemId &&
      values.courseId &&
      programType === "Year"
    ) {
      await axios
        .get(
          `/api/academic/getStudentDetailsForCourseAssignment?course_assignment_id=${values.courseId}&ac_year_id=${values.acYearId}&program_specialization_id=${values.programSpeId}&current_year=${values.yearsemId}`
        )
        .then((res) => {
          setStudentDetailsOptions(
            res.data.data.course_unassigned_student_details_on_year
          );
        })
        .catch((err) => console.error(err));
    }
    if (
      values.acYearId &&
      values.schoolId &&
      values.programSpeId &&
      values.yearsemId &&
      values.courseId &&
      programType === "Sem"
    ) {
      await axios
        .get(
          `/api/academic/getStudentDetailsForCourseAssignment?course_assignment_id=${values.courseId}&ac_year_id=${values.acYearId}&program_specialization_id=${values.programSpeId}&current_sem=${values.yearsemId}`
        )
        .then((res) => {
          setStudentDetailsOptions(
            res.data.data.course_unassigned_student_details_on_sem
          );
        })
        .catch((err) => console.error(err));
    }
  };

  const getStudentDetailsDataOne = async () => {
    await axios
      .get(
        `/api/student/fetchAllStudentDetailForSectionAssignmentForUpdate/${values.acYearId}/${values.schoolId}/${values.programIdForUpdate}/${values.programSpeId}/${values.yearsemId}/${values.sectionId}`
      )
      .then((res) => {
        setStudentDetailsOptions(
          res.data.data.map((obj) => {
            return obj.section_id ? { ...obj, isChecked: true } : obj;
          })
        );
      })
      .catch((err) => console.error(err));
  };

  const getCourseStudentAssignmentData = async () => {
    await axios
      .get(`/api/academic/courseStudentAssignment/${id}`)
      .then((res) => {
        setValues({
          acYearId: res.data.data.ac_year_id,
          schoolId: res.data.data.school_id,
          programSpeId: res.data.data.program_specialization_id,
          yearsemId: res.data.data.current_year_sem,
          courseId: res.data.data.course_id,
          remarks: res.data.data.remarks,
          programIdForUpdate: res.data.data.program_id,
          studentId: res.data.data.student_ids,
        });
        setSectionAssignmentId(res.data.data.section_assignment_id);
        setCrumbs([
          { name: "Course Master", link: "/CourseMaster/Student" },
          { name: "Course Assignment" },
          { name: "Update" },
        ]);
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
        studentId: studentDetailsOptions.map((obj) => obj.student_id),
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
        studentId: newTemp,
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

      values.studentId.map((obj) => {
        existData.push(obj);
      });

      const index = existData.indexOf(e.target.value);

      if (index > -1) {
        existData.splice(index, 1);
      }

      setValues({
        ...values,
        studentId: existData,
      });
    }
  };

  const handleChangeAdvance = async (name, newValue) => {
    if (name === "programSpeId") {
      await axios
        .get(
          `/api/academic/fetchProgramWithSpecialization/${values.acYearId}/${values.schoolId}`
        )
        .then((res) => {
          setProgramId(
            res.data.data
              .filter((val) => val.program_specialization_id === newValue)
              .map((obj) => {
                return obj.program_id;
              })
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

  const handleSorting = (col) => {
    if (order === "ASC") {
      const sorted = [...studentDetailsOptions].sort((a, b) =>
        a[col].toLowerCase() > b[col].toLowerCase() ? 1 : -1
      );
      setStudentDetailsOptions(sorted);
      setOrder("DSC");
    }
    if (order === "DSC") {
      const sorted = [...studentDetailsOptions].sort((a, b) =>
        a[col].toLowerCase() < b[col].toLowerCase() ? 1 : -1
      );
      setStudentDetailsOptions(sorted);
      setOrder("ASC");
    }
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
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
      const temp = {};
      temp.active = true;
      temp.course_assignment_id = values.courseId;
      temp.student_id = values.studentId;

      await axios
        .post(`/api/academic/courseStudentAssignment`, temp)
        .then((res) => {
          setLoading(false);
          if (res.status === 200 || res.status === 201) {
            navigate("/Courseassignmentstudentindex", { replace: true });
            setAlertMessage({
              severity: "success",
              message: "Course Assigned",
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
      temp.section_assignment_id = sectionAssignmentId;
      temp.ac_year_id = values.acYearId;
      temp.school_id = values.schoolId;
      temp.program_id = values.programIdForUpdate;
      temp.program_specialization_id = values.programSpeId;
      temp.current_year_sem = values.yearsemId;
      temp.section_id = values.sectionId;
      temp.remarks = values.remarks;
      temp.student_ids = values.studentId.toString();

      await axios
        .put(
          `/api/academic/SectionAssignment/${id}/${unAssigned.toString()}`,
          temp
        )
        .then((res) => {
          setLoading(false);
          if (res.status === 200 || res.status === 201) {
            setAlertMessage({
              severity: "success",
              message: "Section Assignment Updated",
            });
            navigate("/SectionMaster/Assign", { replace: true });
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
      <FormWrapper>
        <Grid
          container
          alignItems="center"
          justifyContent="flex-start"
          rowSpacing={2}
          columnSpacing={{ xs: 2, md: 4 }}
        >
          <Grid item xs={12} md={2.4}>
            <CustomAutocomplete
              name="acYearId"
              label="Academic Year"
              value={values.acYearId}
              options={academicYearOptions}
              handleChangeAdvance={handleChangeAdvance}
              disabled={!isNew}
              required
            />
          </Grid>

          <Grid item xs={12} md={2.4}>
            <CustomAutocomplete
              name="schoolId"
              label="School"
              value={values.schoolId}
              options={schoolOptions}
              handleChangeAdvance={handleChangeAdvance}
              disabled={!isNew}
              required
            />
          </Grid>

          <Grid item xs={12} md={2.4}>
            <CustomAutocomplete
              name="programSpeId"
              label="Program Major"
              value={values.programSpeId}
              options={programSpeOptions}
              handleChangeAdvance={handleChangeAdvance}
              disabled={!isNew}
              required
            />
          </Grid>

          <Grid item xs={12} md={2.4}>
            <CustomAutocomplete
              name="yearsemId"
              label="Year/Sem"
              value={values.yearsemId}
              options={yearSemOptions}
              handleChangeAdvance={handleChangeAdvance}
              disabled={!isNew}
              required
            />
          </Grid>
          <Grid item xs={12} md={2.4}>
            <CustomAutocomplete
              name="courseId"
              label="Course"
              value={values.courseId}
              options={courseOptions}
              handleChangeAdvance={handleChangeAdvance}
              disabled={!isNew}
              required
            />
          </Grid>
        </Grid>

        <Grid
          container
          justifyContent="center"
          columnSpacing={{ xs: 2, md: 4 }}
        >
          {values.yearsemId ? (
            <Grid item xs={12} md={4} mt={2}>
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
        </Grid>

        <Grid container justifyContent="center">
          {values.yearsemId ? (
            <>
              <Grid item xs={12} md={10} mt={2}>
                <TableContainer component={Paper}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <StyledTableCell>
                          {isNew ? (
                            <Checkbox
                              {...label}
                              sx={{ "& .MuiSvgIcon-root": { fontSize: 14 } }}
                              style={{ color: "white" }}
                              name="selectAll"
                              checked={
                                !studentDetailsOptions.some(
                                  (user) => user?.isChecked !== true
                                )
                              }
                              onChange={handleChange}
                            />
                          ) : (
                            <></>
                          )}
                        </StyledTableCell>

                        <StyledTableCell
                          onClick={() => handleSorting("auid")}
                          style={{ cursor: "pointer" }}
                        >
                          <IconButton
                            classes={{ label: classes.iconButton }}
                            style={{ color: "white", fontSize: 12 }}
                          >
                            <ArrowUpwardIcon />
                            AUID
                          </IconButton>
                        </StyledTableCell>

                        <StyledTableCell
                          onClick={() => handleSorting("student_name")}
                          style={{ cursor: "pointer" }}
                        >
                          <IconButton
                            classes={{ label: classes.iconButton }}
                            style={{ color: "white", fontSize: 12 }}
                          >
                            <ArrowUpwardIcon />
                            Student Name
                          </IconButton>
                        </StyledTableCell>

                        <StyledTableCell>SL.No</StyledTableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {studentDetailsOptions
                        .slice(
                          page * rowsPerPage,
                          page * rowsPerPage + rowsPerPage
                        )
                        .filter((val) => {
                          if (search === "") {
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
                        .map((obj, i) => (
                          <TableRow key={i}>
                            <TableCell style={{ height: "10px" }}>
                              <Checkbox
                                {...label}
                                sx={{ "& .MuiSvgIcon-root": { fontSize: 12 } }}
                                name={obj.student_id}
                                value={obj.student_id}
                                onChange={handleChange}
                                checked={obj?.isChecked || false}
                              />
                            </TableCell>

                            <TableCell style={{ height: "10px" }}>
                              {obj.auid}
                            </TableCell>

                            <TableCell style={{ height: "10px" }}>
                              {obj.student_name}
                            </TableCell>

                            <TableCell style={{ height: "10px" }}>
                              {i + 1}
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                <TablePagination
                  component={Paper}
                  rowsPerPageOptions={[100, 120, 130]}
                  count={studentDetailsOptions.length}
                  page={page}
                  onPageChange={handleChangePage}
                  rowsPerPage={rowsPerPage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </Grid>
            </>
          ) : (
            <></>
          )}
        </Grid>

        <Grid container justifyContent="flex-end" textAlign="right">
          <Grid item xs={12} md={2} mt={4}>
            <Button
              style={{ borderRadius: 7 }}
              variant="contained"
              color="primary"
              disabled={loading || values.studentId == ""}
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

export default CourseStudentAssignment;
