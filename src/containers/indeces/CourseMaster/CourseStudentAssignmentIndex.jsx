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
  TableHead,
  Button,
} from "@mui/material";
import GridIndex from "../../../components/GridIndex";
import { Check, HighlightOff } from "@mui/icons-material";
import CustomModal from "../../../components/CustomModal";
import axios from "../../../services/Api";
import ModalWrapper from "../../../components/ModalWrapper";
import { makeStyles } from "@mui/styles";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import NoAccountsIcon from "@mui/icons-material/NoAccounts";
import useAlert from "../../../hooks/useAlert";
import FormWrapper from "../../../components/FormWrapper";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";

const label = { inputProps: { "aria-label": "Checkbox demo" } };

const useStyles = makeStyles((theme) => ({
  bg: {
    backgroundColor: theme.palette.primary.main,
  },
}));

const initialValues = {
  schoolId: "",
  programSpeId: "",
  yearsemId: "",
  studentId: [],
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

  const classes = useStyles();
  const { setAlertMessage, setAlertOpen } = useAlert();

  useEffect(() => {
    getSchoolData();
    getProgramSpecializationData();
  }, [values.schoolId]);

  useEffect(() => {
    getCourseDetails();
  }, [values.schoolId, values.programSpeId, values.yearsemId]);

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

  const columns = [
    { field: "course_name", headerName: " Course", flex: 1 },
    { field: "course_category_name", headerName: "C-Category", flex: 1 },
    { field: "course_code", headerName: "C-Code", flex: 1 },
    { field: "course_type_name", headerName: "C-Type", flex: 1 },
    { field: "syllabus_name", headerName: "Syllabus", flex: 1 },
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
      type: "date",
      valueGetter: (params) => new Date(params.row.created_date),
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
              for (let i = 1; i <= obj.number_of_years; i++) {
                newYear.push({ value: i, label: "Year" + "-" + i });
              }
            }
            if (obj.program_type_name.toLowerCase() === "semester") {
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
        setCourseId(data.course_id);
        axios
          .get(
            `/api/academic/getStudentDetailsForCourseAssignment?course_id=${data.course_id}&ac_year_id=${data.ac_year_id}&program_specialization_id=${data.program_specialization_id}&current_year=${data.year_sem}`
          )
          .then((res) => {
            setStudentsAssignedOptions(
              res.data.data.course_assigned_student_details
            );
          })
          .catch((err) => console.error(err));
      })
      .catch((err) => console.error(err));
  };

  const handleAssign = async (params) => {
    setStudentListOpen(true);
    await axios
      .get(`/api/academic/CourseAssignment/${params.row.id}`)
      .then((res) => {
        const data = res.data.data[0];
        setCourseId(data.course_id);
        axios
          .get(
            `/api/academic/getStudentDetailsForCourseAssignment?course_id=${data.course_id}&ac_year_id=${data.ac_year_id}&program_specialization_id=${data.program_specialization_id}&current_year=${data.year_sem}`
          )
          .then((res) => {
            setStudentDetailsOptions(
              res.data.data.course_unassigned_student_details_on_year
            );
          })
          .catch((err) => console.error(err));
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
    temp.active = true;
    temp.course_id = courseId;
    temp.student_id = values.studentId;

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
    await axios
      .get(
        `/api/academic/courseStudentAssignmentIdsOnStudentIds/${values.studentId}`
      )
      .then((res) => {
        const courseId = res.data.data.map((obj) => {
          return obj.course_student_assignment_id.toString();
        });
        axios
          .delete(`/api/academic/deactivateCourseStudentAssignment/${courseId}`)
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
          <Grid container justifyContent="flex-start" rowSpacing={2}>
            <Grid item xs={12} md={12} mt={2}>
              <TableContainer component={Paper}>
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
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
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
              <TableContainer component={Paper}>
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
              </TableContainer>
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
