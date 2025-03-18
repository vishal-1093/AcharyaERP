import { useState, useEffect } from "react";
import GridIndex from "../../../components/GridIndex";
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
  IconButton,
  tableCellClasses,
  Paper,
} from "@mui/material";
import { Check, HighlightOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import SearchIcon from "@mui/icons-material/Search";
import CustomModal from "../../../components/CustomModal";
import axios from "../../../services/Api";
import moment from "moment";
import ModalWrapper from "../../../components/ModalWrapper";
import SwapHorizontalCircleIcon from "@mui/icons-material/SwapHorizontalCircle";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import useAlert from "../../../hooks/useAlert";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.headerWhite.main,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

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
  yearsemId: null,
  employeeId: null,
};

const label = { inputprops: { "aria-label": "Checkbox demo" } };

function RoomAssignmentIndex() {
  const [rows, setRows] = useState([]);
  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
    buttons: [],
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [studentDetailsOptions, setStudentDetailsOptions] = useState([]);
  const [unAssigned, setUnAssigned] = useState([]);
  const [values, setValues] = useState(initialValues);
  const [studentListOpen, setStudentListOpen] = useState(false);
  const [studentsCountOpen, setStudentsCountsOpen] = useState(false);
  const [data, setData] = useState([]);
  const [employeeListOpen, setEmployeeListOpen] = useState(false);
  const [employeeOptions, setEmployeeOptions] = useState([]);
  const [studentsList, setStudentsList] = useState([]);
  const [programSpeOptions, setProgramSpeOptions] = useState([]);
  const [yearSemOptions, setYearSemOptions] = useState([]);
  const [search, setSearch] = useState("");
  const [programType, setProgramType] = useState("Sem");
  const [existingData, setExistingData] = useState([]);

  const navigate = useNavigate();
  const { setAlertMessage, setAlertOpen } = useAlert();

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    getStudentsList();
  }, [data, values.programSpeId, values.yearsemId]);

  const getStudentsList = async () => {
    if (data.program_specialization_id && values.yearsemId)
      await axios
        .get(
          `/api/student/fetchStudentDetailForInternals?program_specialization_id=${data.program_specialization_id}&current_sem=${values.yearsemId}`
        )
        .then((res) => {
          setStudentDetailsOptions(
            res.data.data.map((obj) => {
              return data?.student_ids?.includes(obj.student_id)
                ? { ...obj, isChecked: true }
                : obj;
            })
          );
        })
        .catch((err) => console.error(err));
  };

  const getData = async () => {
    await axios
      .get(
        `/api/academic/fetchAllInternalTimeTableAssignmentDetail?page=${0}&page_size=${10000}&sort=created_date`
      )
      .then((res) => {
        setRows(res.data.data);
      })
      .catch((err) => console.error(err));
  };

  const handleActive = async (params) => {
    const id = params.row.id;
    setModalOpen(true);
    const handleToggle = async () => {
      if (params.row.active === true) {
        await axios
          .delete(`/api/academic/internalTimeTableAssignment/${id}`)
          .then((res) => {
            if (res.status === 200) {
              getData();
              setModalOpen(false);
            }
          });
      } else {
        await axios
          .delete(`/api/academic/activateInternalTimeTableAssignment/${id}`)
          .then((res) => {
            if (res.status === 200) {
              getData();
              setModalOpen(false);
            }
          });
      }
    };
    params.row.active === true
      ? setModalContent({
          title: "",
          message: "Do you want to make it Inactive?",
          buttons: [
            { name: "Yes", color: "primary", func: handleToggle },
            { name: "No", color: "primary", func: () => {} },
          ],
        })
      : setModalContent({
          title: "",
          message: "Do you want to make it Active?",
          buttons: [
            { name: "Yes", color: "primary", func: handleToggle },
            { name: "No", color: "primary", func: () => {} },
          ],
        });
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
      const uncheckTemp = unAssigned;
      if (
        uncheckTemp.includes(e.target.value) === true &&
        uncheckTemp.indexOf(e.target.value) > -1
      ) {
        uncheckTemp.splice(uncheckTemp.indexOf(e.target.value), 1);
      }

      setUnAssigned(uncheckTemp);

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
      const uncheckTemp = unAssigned;
      if (uncheckTemp.includes(e.target.value) === false) {
        uncheckTemp.push(e.target.value);
      }

      setUnAssigned(uncheckTemp);

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
    if (name === "programSpeId") {
      await axios
        .get(`/api/academic/fetchAllProgramsWithSpecialization/${1}`)
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

  const handleAssignStudents = async (params) => {
    setValues([]);
    setStudentDetailsOptions([]);
    setData(params.row);
    setStudentListOpen(true);
    await axios
      .get(`/api/academic/internalTimeTableAssignment/${params.row.id}`)
      .then((res) => {
        setValues((prev) => ({
          ...prev,
          studentId: res.data.data.student_ids,
        }));
      })
      .catch((err) => console.error(err));

    await axios
      .get(
        `/api/academic/fetchAllProgramsWithSpecialization/${params.row.school_id}`
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

  const handleStudentsCount = async (params) => {
    setStudentsCountsOpen(true);
    await axios
      .get(`/api/academic/getStudentDetailsToView/${params.row.id}`)
      .then((res) => {
        setStudentsList(res.data.data);
      })
      .catch((err) => console.error(err));
  };

  const handleEmployees = async (params) => {
    setEmployeeListOpen(true);
    setData(params.row);
    await axios
      .get(
        `/api/academic/getUnoccupiedEmployeesForInternals/${params.row.time_slots_id}/${params.row.selected_date}`
      )
      .then((res) => {
        setEmployeeOptions(
          res.data.data.map((obj) => ({
            label: obj.employeeName,
            value: obj.emp_id,
          }))
        );
      })
      .catch((err) => console.error(err));
  };

  const handleCreate = async () => {
    const temp = {};
    temp.internal_timetable_assignment_id = data.id;
    temp.active = true;
    temp.emp_ids = data.emp_ids;
    temp.room_id = data.room_id;
    temp.internal_id = data.internal_id;
    temp.internal_time_table_id = data.internal_time_table_id;
    temp.remarks = data.itta_remarks;
    temp.week_day = data.week_day;
    temp.time_slots_id = data.time_slots_id;
    temp.selected_date = data.selected_date;
    temp.student_ids = values.studentId;

    await axios
      .put(`/api/academic/internalTimeTableAssignment/${data.id}`, temp)
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          setAlertMessage({
            severity: "success",
            message: "Students Assigned",
          });
          setAlertOpen(true);
          getData();
          setStudentListOpen(false);
        } else {
          setAlertMessage({
            severity: "error",
            message: res.data.message,
          });
          setAlertOpen(true);
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

  const handleSwapEmployee = async () => {
    const temp = {};
    temp.internal_timetable_assignment_id = data.id;
    temp.active = true;
    temp.emp_ids = values.employeeId;
    temp.room_id = data.room_id;
    temp.internal_id = data.internal_id;
    temp.internal_time_table_id = data.internal_time_table_id;
    temp.remarks = data.itta_remarks;
    temp.week_day = data.week_day;
    temp.time_slots_id = data.time_slots_id;
    temp.selected_date = data.selected_date;
    temp.student_ids = data.student_ids;

    await axios
      .put(`/api/academic/internalTimeTableAssignment/${data.id}`, temp)
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          setAlertMessage({
            severity: "success",
            message: "Students Assigned",
          });
          setAlertOpen(true);
          getData();
          setEmployeeListOpen(false);
        } else {
          setAlertMessage({
            severity: "error",
            message: res.data.message,
          });
          setAlertOpen(true);
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

  const columns = [
    { field: "ac_year", headerName: "Academic Year", flex: 1, hide: true },
    { field: "internal_name", headerName: "Internal", flex: 1 },
    {
      field: "program_specialization_short_name",
      headerName: "Specialization",
      flex: 1,
    },
    {
      field: "course_with_coursecode",
      headerName: "Course",
      flex: 1,
    },
    {
      field: "date_of_exam",
      headerName: "Exam Date",
      flex: 1,
      valueGetter: (params) =>
        params.row.date_of_exam
          ? moment(params.row.date_of_exam).format("DD-MM-YYYY")
          : "",
    },
    {
      field: "timeSlots",
      headerName: "Exam Time",
      flex: 1,
      valueGetter: (params) =>
        params.row.timeSlots ? params.row.timeSlots : "NA",
    },
    {
      field: "roomcode",
      headerName: "Room Code",
      flex: 1,
      valueGetter: (params) =>
        params.row.roomcode ? params.row.roomcode : "NA",
    },
    {
      field: "employee_name",
      headerName: "Invigilator",
      flex: 1,
      valueGetter: (params) =>
        params.row.employee_name ? params.row.employee_name : "NA",
    },
    { field: "created_username", headerName: "Created By", flex: 1 },
    {
      field: "assign",
      headerName: " Assign Student",
      type: "actions",
      flex: 1,
      getActions: (params) => [
        <IconButton
          color="primary"
          onClick={() => handleAssignStudents(params)}
        >
          <AssignmentIndIcon />
        </IconButton>,
      ],
    },
    {
      field: "count_of_students",
      headerName: "Students Count",
      flex: 1,
      renderCell: (params) => {
        return (
          <Box sx={{ width: "100%" }}>
            <Typography
              variant="subtitle2"
              component="span"
              color="primary.main"
              sx={{ cursor: "pointer" }}
              onClick={() => handleStudentsCount(params)}
            >
              {params.row.count_of_students}
            </Typography>
          </Box>
        );
      },
    },
    {
      field: "swap",
      headerName: " Swap",
      type: "actions",
      flex: 1,
      getActions: (params) => [
        <IconButton color="primary" onClick={() => handleEmployees(params)}>
          <SwapHorizontalCircleIcon />
        </IconButton>,
      ],
    },
    {
      field: "created_date",
      headerName: "Created Date",
      flex: 1,

      valueGetter: (params) =>
        moment(params.row.created_date).format("DD-MM-YYYY"),
    },

    {
      field: "active",
      headerName: "Active",
      flex: 1,
      type: "actions",
      getActions: (params) => [
        params.row.active === true ? (
          <IconButton
            label="Result"
            style={{ color: "green" }}
            onClick={() => handleActive(params)}
          >
            <Check />
          </IconButton>
        ) : (
          <IconButton
            label="Result"
            style={{ color: "red" }}
            onClick={() => handleActive(params)}
          >
            <HighlightOff />
          </IconButton>
        ),
      ],
    },
  ];

  return (
    <Box sx={{ position: "relative", mt: 2 }}>
      <ModalWrapper
        title="Students List"
        maxWidth={800}
        open={studentsCountOpen}
        setOpen={setStudentsCountsOpen}
      >
        <Grid
          container
          justifyContent="center"
          alignItems="center"
          rowSpacing={2}
          columnSpacing={2}
        >
          <Grid item xs={12} md={10} mt={2}>
            <TableContainer component={Paper}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <StyledTableCell sx={{ textAlign: "center" }}>
                      Name
                    </StyledTableCell>
                    <StyledTableCell sx={{ textAlign: "center" }}>
                      AUID
                    </StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {studentsList.map((obj, i) => {
                    return (
                      <TableRow key={i}>
                        <StyledTableCell sx={{ textAlign: "center" }}>
                          {obj.student_name}
                        </StyledTableCell>
                        <StyledTableCell sx={{ textAlign: "center" }}>
                          {obj.auid}
                        </StyledTableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </ModalWrapper>
      <ModalWrapper
        title="Assign Students"
        open={studentListOpen}
        setOpen={setStudentListOpen}
        maxWidth={1000}
      >
        <Grid
          container
          justifyContent="center"
          alignItems="center"
          rowSpacing={2}
          columnSpacing={2}
        >
          <Grid item xs={12} md={3}>
            <CustomAutocomplete
              name="yearsemId"
              value={values.yearsemId}
              label="Year/Sem"
              options={[
                { label: "1", value: 1 },
                { label: "2", value: 2 },
                { label: "3", value: 3 },
                { label: "4", value: 4 },
                { label: "5", value: 5 },
                { label: "6", value: 6 },
                { label: "7", value: 7 },
                { label: "8", value: 8 },
                { label: "9", value: 9 },
                { label: "10", value: 10 },
                { label: "11", value: 11 },
                { label: "12", value: 12 },
              ]}
              handleChangeAdvance={handleChangeAdvance}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <CustomTextField
              label="Search"
              value={search}
              handleChange={handleSearch}
              InputProps={{
                endAdornment: <SearchIcon />,
              }}
            />
          </Grid>
          {studentDetailsOptions.length > 0 ? (
            <>
              <Grid item xs={12} textAlign="right">
                <Button
                  variant="contained"
                  sx={{ borderRadius: 2 }}
                  onClick={handleCreate}
                >
                  SUBMIT
                </Button>
              </Grid>
              <Grid item xs={12} md={10} mt={2}>
                <TableContainer component={Paper}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <StyledTableCell sx={{ textAlign: "center" }}>
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
                        <StyledTableCell sx={{ textAlign: "center" }}>
                          Name
                        </StyledTableCell>
                        <StyledTableCell sx={{ textAlign: "center" }}>
                          AUID
                        </StyledTableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {studentDetailsOptions
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
                        .map((obj, i) => {
                          return (
                            <TableRow key={i}>
                              <StyledTableCell sx={{ textAlign: "center" }}>
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
                              <StyledTableCell sx={{ textAlign: "center" }}>
                                {obj.student_name}
                              </StyledTableCell>
                              <StyledTableCell sx={{ textAlign: "center" }}>
                                {obj.auid}
                              </StyledTableCell>
                            </TableRow>
                          );
                        })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            </>
          ) : (
            <></>
          )}
        </Grid>
      </ModalWrapper>
      <ModalWrapper
        open={employeeListOpen}
        setOpen={setEmployeeListOpen}
        title="Swap Employee"
        maxWidth={800}
      >
        <Grid
          container
          justifyContent="flex-start"
          alignItems="center"
          rowSpacing={2}
          columnSpacing={2}
        >
          <Grid item xs={12} md={6}>
            <CustomAutocomplete
              name="employeeId"
              value={values.employeeId}
              label="Employee"
              handleChangeAdvance={handleChangeAdvance}
              options={employeeOptions}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Button
              variant="contained"
              onClick={handleSwapEmployee}
              sx={{ borderRadius: 2 }}
            >
              Swap
            </Button>
          </Grid>
        </Grid>
      </ModalWrapper>
      <CustomModal
        open={modalOpen}
        setOpen={setModalOpen}
        title={modalContent.title}
        message={modalContent.message}
        buttons={modalContent.buttons}
      />

      <GridIndex rows={rows} columns={columns} />
    </Box>
  );
}

export default RoomAssignmentIndex;
