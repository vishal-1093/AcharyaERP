import { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Paper,
  Checkbox,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableContainer,
  Typography,
  Card,
  CardContent,
  TableHead,
  Button,
} from "@mui/material";
import GridIndex from "../../../components/GridIndex";
import { Check, HighlightOff, Visibility } from "@mui/icons-material";
import CustomModal from "../../../components/CustomModal";
import axios from "../../../services/Api";
import ModalWrapper from "../../../components/ModalWrapper";
import { makeStyles } from "@mui/styles";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import NoAccountsIcon from "@mui/icons-material/NoAccounts";
import useAlert from "../../../hooks/useAlert";
import FormWrapper from "../../../components/FormWrapper";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";
import moment from "moment";

const label = { inputProps: { "aria-label": "Checkbox demo" } };

const useStyles = makeStyles((theme) => ({
  bg: {
    backgroundColor: theme.palette.primary.main,
  },
  syllabus: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.headerWhite.main,
    textAlign: "center",
    padding: "5px",
  },
}));

const initialValues = {
  schoolId: "",
  programSpeId: "",
  yearsemId: "",
  studentId: [],
};

const ELIGIBLE_REPORTED_STATUS = {
  1: "No status",
  2: "Not Eligible",
  3: "Eligible",
  4: "Not Reported",
  5: "Pass Out",
  6: "Promoted",
};

function CourseStudentAssignmentIndex() {
  const [rows, setRows] = useState([]);
  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
    buttons: [],
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [studentListOpen, setStudentListOpen] = useState(false);
  const [studentDetailsOptions, setStudentDetailsOptions] = useState([]);
  const [studentsAssignedOptions, setStudentsAssignedOptions] = useState([]);
  const [assignedStudentListOpen, setAssignedStudentListOpen] = useState(false);
  const [courseId, setCourseId] = useState(null);
  const [search, setSearch] = useState("");
  const [order, setOrder] = useState("ASC");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(100);
  const [values, setValues] = useState(initialValues);
  const [unAssigned, setUnAssigned] = useState([]);
  const [isNew, setIsNew] = useState(false);
  const [schoolOptions, setSchoolOptions] = useState([]);
  const [programSpeOptions, setProgramSpeOptions] = useState([]);
  const [yearSemOptions, setYearSemOptions] = useState([]);
  const [modalSyllabusOpen, setModalSyllabusOpen] = useState(false);
  const [syllabusData, setSyllabusData] = useState([]);
  const [programType, setProgramType] = useState("");
  const [selectAll, setSelectAll] = useState(false);

  const classes = useStyles();
  const { setAlertMessage, setAlertOpen } = useAlert();

  useEffect(() => {
    getSchoolData();
    getProgramSpecializationData();
  }, [values.schoolId]);

  useEffect(() => {
    getCourseDetails();
  }, [values.schoolId, values.programSpeId, values.yearsemId]);

  useEffect(() => {
    setSelectAll(studentDetailsOptions.every((obj) => obj.checked));
  }, [studentDetailsOptions]);

  const getSchoolData = async () => {
    await axios
      .get(`/api/institute/school`)
      .then((res) => {
        setSchoolOptions(
          res.data.data.map((obj) => ({
            value: obj.school_id,
            label: obj.school_name,
          }))
        );
      })
      .catch((err) => console.error(err));
  };

  const getProgramSpecializationData = async () => {
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

  const getCourseDetails = async () => {
    if (values.schoolId && values.programSpeId && values.yearsemId)
      await axios
        .get(
          `/api/academic/fetchAllCourseDetailsForCourseMappingIndex/${values.schoolId}/${values.programSpeId}/${values.yearsemId}`
        )
        .then((res) => {
          setRows(res.data.data);
        })
        .catch((err) => console.error(err));
  };

  const columnsStudent = [
    {
      field: "isSelected",
      headerName: "Checkbox Selection",
      flex: 1,
      sortable: false,
      renderHeader: () => (
        <FormGroup>
          {" "}
          <FormControlLabel control={headerCheckbox} />
        </FormGroup>
      ),
      renderCell: (params) => (
        <Checkbox
          sx={{ padding: 0 }}
          checked={params.row.checked}
          onChange={handleCheckboxChange(params.row.id)}
        />
      ),
    },
    {
      field: "auid",
      headerName: "AUID",
      flex: 1,
    },
    {
      field: "student_name",
      headerName: "Student Name",
      flex: 1,
    },
    {
      field: "usn",
      headerName: "USN",
      flex: 1,
    },
    {
      field: "reporting_date",
      headerName: "Reported Date",
      flex: 1,
      valueGetter: (params) =>
        params.row.reporting_date
          ? moment(params.row.reporting_date).format("DD-MM-YYYY")
          : "",
    },
    {
      field: "current",
      headerName: "Year/Sem",
      flex: 1,
      valueGetter: (params) =>
        params.row.current_year + "/" + params.row.current_sem,
    },
    {
      field: "eligible_reported_status",
      headerName: "Reported",
      flex: 1,
      valueGetter: (params) =>
        params.row.eligible_reported_status
          ? ELIGIBLE_REPORTED_STATUS[params.row.eligible_reported_status]
          : "",
    },
  ];

  const headerCheckbox = (
    <Checkbox
      checked={selectAll}
      onClick={(e) => handleHeaderCheckboxChange(e)}
    />
  );

  const handleCheckboxChange = (id) => (event) => {
    const studentUpdatedList = studentDetailsOptions.map((obj) =>
      obj.id === id ? { ...obj, checked: event.target.checked } : obj
    );
    setStudentDetailsOptions(studentUpdatedList);
  };

  const handleHeaderCheckboxChange = (e) => {
    const allStudentsSelected = studentDetailsOptions.map((obj) => ({
      ...obj,
      checked: e.target.checked,
    }));

    setStudentDetailsOptions(allStudentsSelected);
  };

  const columns = [
    { field: "course_name", headerName: " Course", flex: 1 },
    { field: "course_category_name", headerName: "C-Category", flex: 1 },
    { field: "course_code", headerName: "C-Code", flex: 1 },
    { field: "course_type_name", headerName: "C-Type", flex: 1 },
    {
      field: "syllabus_name",
      headerName: "Syllabus",
      flex: 1,
      renderCell: (params) => {
        return (
          <IconButton
            color="primary"
            onClick={() => handleSyllabusOpen(params)}
          >
            <Visibility fontSize="small" />
          </IconButton>
        );
      },
    },
    { field: "year_sem", headerName: "Year/Sem", flex: 1 },
    { field: "school_name_short", headerName: "School", flex: 1 },
    { field: "dept_name_short", headerName: "Department", flex: 1 },
    {
      field: "created_username",
      headerName: "Created By",
      flex: 1,
      hide: true,
    },

    {
      field: "created_date",
      headerName: "Created Date",
      flex: 1,
      valueGetter: (params) =>
        moment(params.row.created_date).format("DD-MM-YYYY"),
      hide: true,
    },
    {
      field: "add",
      headerName: "Assign",
      type: "actions",
      flex: 1,
      renderCell: (params) => [
        <IconButton color="primary" onClick={() => handleAssign(params)}>
          <PersonAddAltIcon />
        </IconButton>,
      ],
    },
    {
      field: "assigned",
      headerName: "De-Assign",
      type: "actions",
      flex: 1,
      renderCell: (params) => [
        <IconButton color="primary" onClick={() => handleDeAssignList(params)}>
          <NoAccountsIcon />
        </IconButton>,
      ],
    },
    {
      field: "active",
      headerName: "Active",
      flex: 1,
      type: "actions",
      getActions: (params) => [
        params.row.active === true ? (
          <IconButton
            style={{ color: "green" }}
            onClick={() => handleActive(params)}
          >
            <Check />
          </IconButton>
        ) : (
          <IconButton
            style={{ color: "red" }}
            onClick={() => handleActive(params)}
          >
            <HighlightOff />
          </IconButton>
        ),
      ],
    },
  ];

  const handleSyllabusOpen = async (params) => {
    setModalSyllabusOpen(true);
    await axios
      .get(`/api/academic/getSyllabusByCourseAssignmentId/${params.row.id}`)
      .then((res) => {
        setSyllabusData(res.data.data);
      })
      .catch((err) => console.error(err));
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
            }
          });

          const newYear = [];
          yearsem.map((obj) => {
            if (obj.program_type_name.toLowerCase() === "yearly") {
              setProgramType("year");
              for (let i = 1; i <= obj.number_of_years; i++) {
                newYear.push({ value: i, label: "Year" + "-" + i });
              }
            }
            if (obj.program_type_name.toLowerCase() === "semester") {
              setProgramType("sem");
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

      const index = existData.indexOf(parseInt(e.target.value));

      if (index > -1) {
        existData.splice(index, 1);
      }

      setValues({
        ...values,
        studentId: existData,
      });
    }
  };

  const handleChangeAssigned = (e) => {
    const { name, checked } = e.target;

    if (name === "selectAll" && checked === true) {
      let tempUser = studentsAssignedOptions.map((test) => {
        return { ...test, isChecked: checked };
      });
      setStudentsAssignedOptions(tempUser);

      setValues({
        ...values,
        studentId: studentsAssignedOptions.map((obj) => obj.student_id),
      });
    } else if (name === "selectAll" && checked === false) {
      let tempUser = studentsAssignedOptions.map((test) => {
        return { ...test, isChecked: checked };
      });
      setStudentsAssignedOptions(tempUser);

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

      let temp = studentsAssignedOptions.map((obj) => {
        return obj.student_id.toString() === name
          ? { ...obj, isChecked: checked }
          : obj;
      });
      setStudentsAssignedOptions(temp);
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

      let temp = studentsAssignedOptions.map((obj) => {
        return obj.student_id.toString() === name
          ? { ...obj, isChecked: checked }
          : obj;
      });

      setStudentsAssignedOptions(temp);

      const existData = [];

      values.studentId.map((obj) => {
        existData.push(obj);
      });

      const index = existData.indexOf(parseInt(e.target.value));

      if (index > -1) {
        existData.splice(index, 1);
      }

      setValues({
        ...values,
        studentId: existData,
      });
    }
  };

  const handleDeAssignList = async (params) => {
    setAssignedStudentListOpen(true);
    await axios
      .get(`/api/academic/CourseAssignment/${params.row.id}`)
      .then((res) => {
        const data = res.data.data[0];
        setCourseId(params.row.id);
        axios
          .get(
            `/api/academic/getStudentDetailsForCourseAssignment?course_assignment_id=${params.row.id}&ac_year_id=${data.ac_year_id}&program_specialization_id=${data.program_specialization_id}&current_sem=${data.year_sem}`
          )
          .then((res) => {
            const rowId = res.data.data.course_assigned_student_details.map(
              (obj) => ({ ...obj, id: obj.student_id, checked: false })
            );
            setStudentsAssignedOptions(rowId);
          })
          .catch((err) => console.error(err));
      })
      .catch((err) => console.error(err));
  };

  const handleAssign = async (params) => {
    setStudentListOpen(true);
    await axios
      .get(`/api/academic/CourseAssignment/${params.row.id}`)
      .then(async (res) => {
        const data = res.data.data[0];
        setCourseId(params.row.id);

        if (programType === "year") {
          await axios
            .get(
              `/api/academic/getStudentDetailsForCourseAssignment?course_assignment_id=${params.row.id}&ac_year_id=${data.ac_year_id}&program_specialization_id=${data.program_specialization_id}&current_year=${data.year_sem}`
            )
            .then((res) => {
              const rowId =
                res.data.data.course_unassigned_student_details_on_year.map(
                  (obj) => ({ ...obj, id: obj.student_id, checked: false })
                );
              setStudentDetailsOptions(rowId);
            })
            .catch((err) => console.error(err));
        }
        if (programType === "sem") {
          await axios
            .get(
              `/api/academic/getStudentDetailsForCourseAssignment?course_assignment_id=${params.row.id}&ac_year_id=${data.ac_year_id}&program_specialization_id=${data.program_specialization_id}&current_sem=${data.year_sem}`
            )
            .then((res) => {
              const rowId =
                res.data.data.course_unassigned_student_details_on_sem.map(
                  (obj) => ({ ...obj, id: obj.student_id, checked: false })
                );
              setStudentDetailsOptions(rowId);
            })
            .catch((err) => console.error(err));
        }
      })
      .catch((err) => console.error(err));
  };

  const handleActive = async (params) => {
    const id = params.row.id;
    setModalOpen(true);
    const handleToggle = async () => {
      if (params.row.active === true) {
        await axios
          .delete(`/api/academic/CourseAssignment/${id}`)
          .then((res) => {
            if (res.status === 200) {
              // getTranscriptData();
            }
          })
          .catch((err) => console.error(err));
      } else {
        await axios
          .delete(`/api/academic/activateCourseAssignment/${id}`)
          .then((res) => {
            if (res.status === 200) {
              // getTranscriptData();
            }
          })
          .catch((err) => console.error(err));
      }
    };
    params.row.active === true
      ? setModalContent({
          title: "",
          message: "Do you want to make it Inactive ?",
          buttons: [
            { name: "Yes", color: "primary", func: handleToggle },
            { name: "No", color: "primary", func: () => {} },
          ],
        })
      : setModalContent({
          title: "",
          message: "Do you want to make it Active ?",
          buttons: [
            { name: "Yes", color: "primary", func: handleToggle },
            { name: "No", color: "primary", func: () => {} },
          ],
        });
    setModalOpen(true);
  };

  const handleSubmit = async () => {
    const temp = {};
    const studentIds = [];
    studentDetailsOptions?.map((obj) => {
      if (obj.checked) studentIds?.push(obj.student_id);
    });

    temp.active = true;
    temp.course_assignment_id = courseId;
    temp.student_id = studentIds;

    await axios
      .post(`/api/academic/courseStudentAssignment`, temp)
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          setAlertMessage({
            severity: "success",
            message: "Course Assigned",
          });
          setStudentListOpen(false);
        } else {
          setAlertMessage({
            severity: "error",
            message: res.data ? res.data.message : "Error Occured",
          });
        }
        setAlertOpen(true);
      })
      .catch((error) => {
        setAlertMessage({
          severity: "error",
          message: error.response ? error.response.data.message : "Error",
        });
        setAlertOpen(true);
      });
  };

  const handleSubmitUnassigned = async () => {
    const studentIds = [];
    studentDetailsOptions?.map((obj) => {
      if (obj.checked) studentIds?.push(obj.student_id);
    });

    await axios
      .get(`/api/academic/courseStudentAssignmentIdsOnStudentIds/${studentIds}`)
      .then((res) => {
        const courseStudentAssignmentId = res.data.data.map((obj) => {
          return obj.course_student_assignment_id.toString();
        });
        axios
          .delete(
            `/api/academic/deactivateCourseStudentAssignment/${courseStudentAssignmentId}`
          )
          .then((res) => {
            if (res.status === 200 || res.status === 201) {
              setAlertMessage({
                severity: "success",
                message: "Students De-Assigned",
              });
              setAlertOpen(true);
              setAssignedStudentListOpen(false);
            }
          })
          .catch((err) => console.error(err));
      })
      .catch((err) => console.error(err));
  };

  return (
    <>
      <ModalWrapper
        maxWidth={700}
        open={modalSyllabusOpen}
        setOpen={setModalSyllabusOpen}
      >
        <Grid container rowSpacing={2} columnSpacing={2}>
          <Grid item xs={12} mt={2}>
            <Typography variant="subtitle2" className={classes.syllabus}>
              Syllabus
            </Typography>
          </Grid>
          {syllabusData.map((obj, i) => {
            return (
              <Grid item xs={12} md={12} key={i}>
                <Card>
                  <CardContent>
                    <Grid
                      container
                      justifyContent="flex-start"
                      rowSpacing={0.5}
                      columnSpacing={2}
                    >
                      <Grid item xs={12}>
                        <Typography variant="subtitle2">
                          {"Module" + Number(i + 1)}{" "}
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="body2">
                          {obj.syllabus_objective}
                        </Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </ModalWrapper>

      <FormWrapper>
        <CustomModal
          open={modalOpen}
          setOpen={setModalOpen}
          title={modalContent.title}
          message={modalContent.message}
          buttons={modalContent.buttons}
        />
        <Box sx={{ position: "relative", mt: 2 }}>
          <Grid container rowSpacing={2} columnSpacing={{ xs: 2, md: 4 }}>
            <Grid item xs={12} md={3}>
              <CustomAutocomplete
                label="School"
                name="schoolId"
                value={values.schoolId}
                options={schoolOptions}
                handleChangeAdvance={handleChangeAdvance}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <CustomAutocomplete
                label="Program Major"
                name="programSpeId"
                value={values.programSpeId}
                options={programSpeOptions}
                handleChangeAdvance={handleChangeAdvance}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <CustomAutocomplete
                label="Year/Sem"
                name="yearsemId"
                value={values.yearsemId}
                options={yearSemOptions}
                handleChangeAdvance={handleChangeAdvance}
              />
            </Grid>
            <Grid item xs={12} md={12}>
              <GridIndex rows={rows} columns={columns} />
            </Grid>
          </Grid>
        </Box>
        <ModalWrapper
          title="Student List"
          open={studentListOpen}
          setOpen={setStudentListOpen}
          maxWidth={1000}
        >
          <Grid container justifyContent="flex-start">
            <Grid item xs={12} md={12}>
              {/* <TableContainer component={Paper}>
                <Table size="small">
                  <TableHead className={classes.bg}>
                    <TableRow>
                      <TableCell>
                        <Checkbox
                          {...label}
                          sx={{ "& .MuiSvgIcon-root": { fontSize: 11 } }}
                          style={{ color: "white" }}
                          name="selectAll"
                          checked={
                            !studentDetailsOptions.some(
                              (user) => user?.isChecked !== true
                            )
                          }
                          onChange={handleChange}
                        />
                      </TableCell>
                      <TableCell style={{ color: "white" }}>Name</TableCell>
                      <TableCell style={{ color: "white" }}>AUID</TableCell>
                      <TableCell style={{ color: "white" }}>USN</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {studentDetailsOptions !== undefined ? (
                      studentDetailsOptions
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
                                sx={{ "& .MuiSvgIcon-root": { fontSize: 11 } }}
                                name={obj.student_id}
                                value={obj.student_id}
                                onChange={handleChange}
                                checked={obj?.isChecked || false}
                              />
                            </TableCell>
                            <TableCell style={{ height: "10px" }}>
                              {obj.student_name}
                            </TableCell>
                            <TableCell style={{ height: "10px" }}>
                              {obj.auid}
                            </TableCell>
                            <TableCell style={{ height: "10px" }}>
                              {obj.usn}
                            </TableCell>
                          </TableRow>
                        ))
                    ) : (
                      <></>
                    )}
                  </TableBody>
                </Table>
              </TableContainer> */}

              <GridIndex
                rows={studentDetailsOptions}
                columns={columnsStudent}
              />
            </Grid>
            <Grid item xs={12} md={12} textAlign="right">
              <Button
                variant="contained"
                style={{ borderRadius: 10 }}
                onClick={handleSubmit}
              >
                Assign
              </Button>
            </Grid>
          </Grid>
        </ModalWrapper>

        <ModalWrapper
          title="Assigned Student List"
          open={assignedStudentListOpen}
          setOpen={setAssignedStudentListOpen}
          maxWidth={1000}
        >
          <Grid container justifyContent="flex-start" rowSpacing={2}>
            <Grid item xs={12} md={12} mt={2}>
              {/* <TableContainer component={Paper}>
                <Table size="small">
                  <TableHead className={classes.bg}>
                    <TableRow>
                      <TableCell>
                        <Checkbox
                          {...label}
                          sx={{ "& .MuiSvgIcon-root": { fontSize: 11 } }}
                          style={{ color: "white" }}
                          name="selectAll"
                          checked={
                            studentsAssignedOptions
                              ? !studentsAssignedOptions.some(
                                  (user) => user?.isChecked !== true
                                )
                              : ""
                          }
                          onChange={handleChangeAssigned}
                        />
                      </TableCell>
                      <TableCell style={{ color: "white" }}>Name</TableCell>
                      <TableCell style={{ color: "white" }}>AUID</TableCell>
                      <TableCell style={{ color: "white" }}>USN</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {studentsAssignedOptions
                      ? studentsAssignedOptions.map((obj, i) => (
                          <TableRow key={i}>
                            <TableCell style={{ height: "10px" }}>
                              <Checkbox
                                {...label}
                                sx={{ "& .MuiSvgIcon-root": { fontSize: 11 } }}
                                name={obj.student_id}
                                value={obj.student_id}
                                onChange={handleChangeAssigned}
                                checked={obj?.isChecked || false}
                              />
                            </TableCell>

                            <TableCell style={{ height: "10px" }}>
                              {obj.student_name}
                            </TableCell>
                            <TableCell style={{ height: "10px" }}>
                              {obj.auid}
                            </TableCell>
                            <TableCell style={{ height: "10px" }}>
                              {obj.usn}
                            </TableCell>
                          </TableRow>
                        ))
                      : ""}
                  </TableBody>
                </Table>
              </TableContainer> */}
              <GridIndex
                rows={studentsAssignedOptions}
                columns={columnsStudent}
              />
            </Grid>
            <Grid item xs={12} md={12} textAlign="right">
              <Button
                variant="contained"
                style={{ borderRadius: 10 }}
                onClick={handleSubmitUnassigned}
              >
                De-Assign
              </Button>
            </Grid>
          </Grid>
        </ModalWrapper>
      </FormWrapper>
    </>
  );
}
export default CourseStudentAssignmentIndex;
