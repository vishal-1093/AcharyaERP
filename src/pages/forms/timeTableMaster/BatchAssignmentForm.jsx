import { useState, useEffect } from "react";
import {
  Grid,
  Button,
  CircularProgress,
  IconButton,
  Box,
  Paper,
  Checkbox,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  styled,
  tableCellClasses,
} from "@mui/material";

import FormWrapper from "../../../components/FormWrapper";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";
import useAlert from "../../../hooks/useAlert";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import axios from "../../../services/Api";
import { makeStyles } from "@mui/styles";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import CustomMultipleAutocomplete from "../../../components/Inputs/CustomMultipleAutocomplete";
import { TablePagination } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
const label = { inputProps: { "aria-label": "Checkbox demo" } };

const initialValues = {
  acYearId: null,
  schoolId: null,
  programSpeId: [],
  yearsemId: null,
  batchId: "",
  remarks: "",
  intervalTypeId: "",
  programIdForUpdate: null,
  studentId: "",
};
const requiredFields = [
  "acYearId",
  "schoolId",
  "programSpeId",
  "yearsemId",
  "batchId",
  "intervalTypeId",
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
  table: {
    "& .MuiTableCell-root": {
      borderLeft: "1px solid rgba(224, 224, 224, 1)",
      fontSize: "15px",
    },
  },
  bg: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.headerWhite.main,
    padding: "6px",
    textAlign: "center",
  },
}));

function BatchAssignmentForm() {
  const [isNew, setIsNew] = useState(true);
  const [values, setValues] = useState(initialValues);
  const [loading, setLoading] = useState(false);
  const [batchAssignmentId, setBatchAssignmentId] = useState(null);
  const [SchoolNameOptions, setSchoolNameOptions] = useState([]);
  const [academicYearOptions, setAcademicYearOptions] = useState([]);
  const [programSpeOptions, setProgramSpeOptions] = useState([]);
  const [yearSemOptions, setYearSemOptions] = useState([]);
  const [programId, setProgramId] = useState("");
  const [programType, setProgramType] = useState("Sem");
  const [batchOptions, setBatchOptions] = useState([]);
  const [intervalTypeOptions, setIntervalTypeOptions] = useState([]);
  const [studentDetailsOptions, setStudentDetailsOptions] = useState([]);
  const [unAssigned, setUnAssigned] = useState([]);
  const [order, setOrder] = useState("ASC");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(30);

  const { setAlertMessage, setAlertOpen } = useAlert();
  const setCrumbs = useBreadcrumbs();
  const { id } = useParams();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const classes = useStyles();

  const checks = {
    programSpeId: isNew ? [values.programSpeId.length > 0] : [],
    remarks: [values.remarks !== ""],
  };

  const errorMessages = {
    programSpeId: ["This field required"],
    remarks: ["This field required"],
  };

  useEffect(() => {
    if (pathname.toLowerCase() === "/timetablemaster/batchassignment/new") {
      setIsNew(true);
      setCrumbs([
        {
          name: "TimeTable Master",
          link: "/TimeTableMaster/BatchAssignments",
        },
        { name: "BatchAssignment" },
        { name: "Create" },
      ]);
    } else {
      setIsNew(false);
      getBatchAssignmentData();
    }
  }, [pathname]);

  const getBatchAssignmentData = async () => {
    await axios
      .get(`/api/academic/BatchAssignment/${id}`)
      .then((res) => {
        setValues({
          acYearId: res.data.data.ac_year_id,
          schoolId: res.data.data.school_id,
          programSpeId: res.data.data.program_id,
          yearsemId: res.data.data.current_year
            ? res.data.data.current_year
            : res.data.data.current_sem,
          batchId: res.data.data.batch_id,
          remarks: res.data.data.remarks,
          intervalTypeId: res.data.data.interval_type_id,
          studentId: res.data.data.student_ids,
          remarks: res.data.data.remarks,
        });
        setBatchAssignmentId(res.data.data.batch_assignment_id);
        setCrumbs([
          {
            name: "TimeTable Master",
            link: "/TimeTableMaster/BatchAssignments",
          },
          { name: "BatchAssignment" },
          { name: "Update" },
          { name: res.data.data.batch_assignment_id },
        ]);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    getSchoolNameOptions();
    getAcademicYearOptions();
    getProgramSpeData();
    getYearSemData();
    getBatchOptions();
    getStudentDetailsData();
    getIntervalTypeOptions();
  }, [
    values.acYearId,
    values.schoolId,
    programId,
    values.yearsemId,
    programType,
    values.batchId,
    values.intervalTypeId,
  ]);

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

  const getProgramSpeData = async () => {
    if (values.acYearId && values.schoolId)
      await axios
        .get(
          `/api/academic/fetchProgramWithSpecialization/${values.acYearId}/${values.schoolId}`
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

  const getBatchOptions = async () => {
    await axios
      .get(`/api/academic/Batch`)
      .then((res) => {
        setBatchOptions(
          res.data.data.map((obj) => ({
            value: obj.batch_id,
            label: obj.batch_short_name,
          }))
        );
      })
      .catch((error) => console.error(error));
  };

  const getIntervalTypeOptions = async () => {
    await axios
      .get(`/api/academic/TimeIntervalTypes`)
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

  const getYearSemData = async () => {
    if (!isNew)
      await axios
        .get(
          `/api/academic/fetchProgramWithSpecialization/${values.acYearId}/${values.schoolId}`
        )
        .then((res) => {
          const yearsem = [];
          res.data.data.filter((obj) => {
            if (obj.program_specialization_id === values.programSpeId) {
              yearsem.push(obj);
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

  const getStudentDetailsData = async () => {
    if (
      values.acYearId &&
      values.schoolId &&
      values.programSpeId &&
      values.yearsemId &&
      values.batchId
    ) {
      await axios
        .get(
          `/api/academic/fetchStudentDetailForBatchAssignment?school_id=${values.schoolId}&program_specialization_id=${values.programSpeId}&current_year=${values.acYearId}`
        )
        .then((res) => {
          setStudentDetailsOptions(res.data.data);
        })
        .catch((err) => console.error(err));
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleRemarks = (e) => {
    setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
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

  const handleChangeAdvance = async (name, newValue) => {
    if (name === "programSpeId") {
      await axios
        .get(
          `/api/academic/fetchProgramWithSpecialization/${values.acYearId}/${values.schoolId}`
        )
        .then((res) => {
          const t = {};
          res.data.data.map((obj) => {
            t[obj.program_specialization_id] = obj.program_type_name;
          });

          if (t[newValue[0]].toLowerCase() === "yearly") {
            setProgramSpeOptions(
              res.data.data
                .filter(
                  (fil) => fil.program_type_name.toLowerCase() === "yearly"
                )
                .map((obj) => ({
                  value: obj.program_specialization_id,
                  label: obj.specialization_with_program,
                }))
            );
          } else {
            setProgramSpeOptions(
              res.data.data
                .filter((fil) => fil.program_type_name === "semester")
                .map((obj) => ({
                  value: obj.program_specialization_id,
                  label: obj.specialization_with_program,
                }))
            );
          }

          const yearsem = [];

          newValue.forEach((obj) => {
            res.data.data.filter((fil) => {
              if (fil.program_id === obj) {
                yearsem.push(fil);
              }
            });
          });

          yearsem.map((obj) => {
            if (obj.program_type_code === "YEA") {
              const years = yearsem.map((obj) => obj.number_of_years);

              const newYear = [];

              for (let i = 1; i <= Math.max(...years); i++) {
                newYear.push({ value: i, label: "year" + "-" + i });
              }
              setProgramType("YEA");
              setYearSemOptions(
                newYear.map((obj) => ({
                  value: obj.value,
                  label: obj.label,
                }))
              );
            } else if (obj.program_type_code === "SEM") {
              const years = yearsem.map((obj) => obj.number_of_semester);
              const newYear = [];

              for (let i = 1; i <= Math.max(...years); i++) {
                newYear.push({ value: i, label: "sem" + "-" + i });
              }
              setProgramType("SEM");
              setYearSemOptions(
                newYear.map((obj) => ({
                  value: obj.value,
                  label: obj.label,
                }))
              );
            }
          });
        })
        .catch((err) => console.error(err));
    }
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
      temp.batch_id = values.batchId;
      programType === "YEA"
        ? (temp.current_year = values.yearsemId)
        : (temp.current_sem = values.yearsemId);
      temp.program_id = values.programSpeId;
      temp.remarks = values.remarks;
      temp.school_id = values.schoolId;
      temp.student_ids = values.studentId.toString();
      temp.interval_type_id = values.intervalTypeId;

      await axios
        .post(`/api/academic/BatchAssignment`, temp)
        .then((res) => {
          setLoading(false);
          if (res.status === 200 || res.status === 201) {
            navigate("/TimeTableMaster/BatchAssignments", {
              replace: true,
            });
            setAlertMessage({
              severity: "success",
              message: "Form Submitted Successfully",
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
        message: "please fill all fields",
      });
      setAlertOpen(true);
    } else {
      setLoading(true);
      const temp = {};
      temp.active = true;
      temp.batch_assignment_id = batchAssignmentId;
      temp.batch_id = values.batchId;
      temp.school_id = values.schoolId;
      temp.program_id = values.programSpeId;
      temp.ac_year_id = values.acYearId;
      programType === "YEA"
        ? (temp.current_year = values.yearsemId)
        : (temp.current_sem = values.yearsemId);
      temp.student_ids = values.studentId;
      temp.remarks = values.remarks;
      temp.interval_type_id = values.intervalTypeId;

      await axios
        .put(`/api/academic/BatchAssignment/${id}`, temp)
        .then((res) => {
          setLoading(false);
          if (res.status === 200 || res.status === 201) {
            navigate("/TimeTableMaster/BatchAssignments", {
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
          justifyContent="flex-start"
          rowSpacing={2}
          columnSpacing={{ xs: 2, md: 4 }}
        >
          <Grid item xs={12} md={3}>
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
          <Grid item xs={12} md={3}>
            <CustomAutocomplete
              name="schoolId"
              label="School"
              value={values.schoolId}
              options={SchoolNameOptions}
              handleChangeAdvance={handleChangeAdvance}
              disabled={!isNew}
              required
            />
          </Grid>
          {isNew ? (
            <Grid item xs={12} md={3}>
              <CustomMultipleAutocomplete
                name="programSpeId"
                label="Program Specialization"
                value={values.programSpeId}
                options={programSpeOptions}
                handleChangeAdvance={handleChangeAdvance}
                disabled={!isNew}
                checks={checks.programSpeId}
                errors={errorMessages.programSpeId}
                required
              />
            </Grid>
          ) : (
            <Grid item xs={12} md={3}>
              <CustomAutocomplete
                name="programSpeId"
                label="Program"
                value={values.programSpeId}
                options={programSpeOptions}
                handleChangeAdvance={handleChangeAdvance}
                disabled={!isNew}
                required
              />
            </Grid>
          )}

          <Grid item xs={12} md={3}>
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
          <Grid item xs={12} md={3}>
            <CustomAutocomplete
              name="batchId"
              label="Batch Name"
              value={values.batchId}
              options={batchOptions}
              handleChangeAdvance={handleChangeAdvance}
              disabled={!isNew}
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
              disabled={!isNew}
              required
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <CustomTextField
              name="remarks"
              label="Remarks"
              value={values.remarks}
              handleChange={handleRemarks}
              disabled={!isNew}
            />
          </Grid>

          <Grid
            container
            justifyContent="center"
            columnSpacing={{ xs: 2, md: 4 }}
          >
            {values.yearsemId ? (
              <Grid item xs={12} md={3} mt={2}>
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
                            ) : (
                              ""
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
                          <StyledTableCell onClick={() => handleSorting("usn")}>
                            <IconButton
                              classes={{ label: classes.iconButton }}
                              style={{ color: "white", fontSize: 12 }}
                            >
                              <ArrowUpwardIcon />
                              USN
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

                          <StyledTableCell>Status</StyledTableCell>
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
                                  sx={{
                                    "& .MuiSvgIcon-root": { fontSize: 12 },
                                  }}
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
                                {obj.usn}
                              </TableCell>
                              <TableCell style={{ height: "10px" }}>
                                {obj.student_name}
                              </TableCell>

                              <TableCell style={{ height: "10px" }}>
                                {obj.eligible_reported_status === null
                                  ? "No status"
                                  : obj.eligible_reported_status}
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
        </Grid>
        <Grid item xs={12} md={12} mt={2} textAlign="right">
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
      </FormWrapper>
    </Box>
  );
}

export default BatchAssignmentForm;
