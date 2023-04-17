import { useState, useEffect } from "react";
import GridIndex from "../../../components/GridIndex";
import { Check, HighlightOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import CustomModal from "../../../components/CustomModal";
import axios from "../../../services/Api";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import ModalWrapper from "../../../components/ModalWrapper";
import CustomMultipleAutocomplete from "../../../components/Inputs/CustomMultipleAutocomplete";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";
import SearchIcon from "@mui/icons-material/Search";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import { TablePagination } from "@mui/material";
import { makeStyles } from "@mui/styles";
import useAlert from "../../../hooks/useAlert";
import {
  Box,
  Button,
  IconButton,
  Grid,
  Paper,
  Checkbox,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  tableCellClasses,
  styled,
} from "@mui/material";

const label = { inputProps: { "aria-label": "Checkbox demo" } };

const initialValues = {
  schoolId: null,
  programSpeId: null,
  programSpeIdOne: null,
  yearsemId: null,
  userId: "",
  userEmail: [],
};

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
    },
  },
  bg: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.headerWhite.main,
    textAlign: "center",
  },
}));

function BatchAssignmentIndex() {
  const [rows, setRows] = useState([]);
  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
    buttons: [],
  });
  const [values, setValues] = useState(initialValues);
  const [isNew, setIsNew] = useState(true);
  const [loading, setLoading] = useState(false);
  const { setAlertMessage, setAlertOpen } = useAlert();
  const [modalOpen, setModalOpen] = useState(false);
  const [studentsOpen, setStudentsOpen] = useState(false);
  const [studentOpen, setStudentOpen] = useState(false);
  const [usersOpen, setUsersOpen] = useState(false);
  const [assignedstudentDetails, setAssignedStudentDetails] = useState([]);
  const [unAssignedStudentDetails, setUnassignedStudentDetails] = useState([]);
  const [programSpeOptions, setProgramSpeOptions] = useState([]);
  const [programSpeOptionsOne, setProgramSpeOptionsOne] = useState([]);
  const [yearSemOptions, setYearSemOptions] = useState([]);
  const [SchoolNameOptions, setSchoolNameOptions] = useState([]);
  const [acYearId, setAcYearId] = useState(null);
  const [batchId, setBatchId] = useState(null);
  const [programSpecializationId, setprogramSpecializationId] = useState(null);
  const [names, setNames] = useState([]);
  const [search, setSearch] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [unAssigned, setUnAssigned] = useState([]);
  const [schID, setschID] = useState(null);
  const [currentYear, setCurrentYear] = useState(null);
  const [data, setData] = useState();
  const [userDetails, setUserDetails] = useState([]);
  const [batchStudentDetails, setBatchStudentDetails] = useState([]);
  const [otherStudentIds, setOtherStudentIds] = useState();
  const [rowData, setRowData] = useState();

  const navigate = useNavigate();
  const classes = useStyles();

  const columns = [
    { field: "ac_year", headerName: "Academic Year", flex: 1 },
    { field: "school_name_short", headerName: "Institute", flex: 1 },
    { field: "program_short_name", headerName: "Specialization", flex: 1 },
    { field: "batch_short_name", headerName: "Batch", flex: 1 },
    {
      field: "current_year",
      headerName: "Year/Sem",
      flex: 1,
      valueGetter: (params) =>
        params.row.current_sem
          ? params.row.current_sem
          : params.row.current_year,
    },
    { field: "interval_type_short", headerName: "Interval Type", flex: 1 },
    { field: "created_username", headerName: "Created By", flex: 1 },

    {
      field: "created_date",
      headerName: "Created Date",
      flex: 1,
      type: "date",
      valueGetter: (params) => new Date(params.row.created_date),
    },

    {
      field: "id",
      type: "actions",
      flex: 1,
      headerName: "Update",
      getActions: (params) => [
        <IconButton
          onClick={() =>
            navigate(`/TimeTableMaster/BatchAssignment/Update/${params.row.id}`)
          }
        >
          <EditIcon />
        </IconButton>,
      ],
    },
    {
      field: "add_student",
      headerName: "Add Student",
      type: "actions",
      getActions: (params) => [
        <IconButton
          label="Result"
          color="primary"
          onClick={() => handleStudent(params)}
        >
          <AddCircleOutlineIcon />
        </IconButton>,
      ],
    },
    {
      field: "Add_User",
      headerName: "Guest User",
      type: "actions",
      getActions: (params) => [
        <IconButton
          label="Result"
          color="primary"
          onClick={() => handleAddUser(params)}
        >
          <AddCircleOutlineIcon />
        </IconButton>,
      ],
    },
    {
      field: "add",
      headerName: "Other School",
      type: "actions",
      getActions: (params) => [
        <IconButton
          label="Result"
          color="primary"
          onClick={() => handleAddStudent(params)}
        >
          <AddCircleOutlineIcon />
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
  useEffect(() => {
    getData();
    getSchoolNameOptions();
    getProgramSpeData();
    getOtherStudentsData();
    getSameCollegeStudents();
  }, [
    schID,
    values.yearsemId,
    values.schoolId,
    acYearId,
    schID,
    values.programSpeIdOne,
  ]);
  useEffect(() => {
    getnewData();
  }, [otherStudentIds]);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleSorting = () => {
    const a = 10;
  };

  const handleChange = (e) => {
    const { name, checked } = e.target;

    if (name === "selectAll" && checked === true) {
      let tempUser = unAssignedStudentDetails.map((test) => {
        return { ...test, isChecked: checked };
      });
      setUnassignedStudentDetails(tempUser);

      setValues({
        ...values,
        studentId: unAssignedStudentDetails
          .map((obj) => obj.student_id)
          .toString(),
      });
    } else if (name === "selectAll" && checked === false) {
      let tempUser = unAssignedStudentDetails.map((test) => {
        return { ...test, isChecked: checked };
      });
      setUnassignedStudentDetails(tempUser);

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

      let temp = unAssignedStudentDetails.map((obj) => {
        return obj.student_id.toString() === name
          ? { ...obj, isChecked: checked }
          : obj;
      });
      setUnassignedStudentDetails(temp);
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

      let temp = unAssignedStudentDetails.map((obj) => {
        return obj.student_id.toString() === name
          ? { ...obj, isChecked: checked }
          : obj;
      });

      setUnassignedStudentDetails(temp);

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

  const getnewData = async () => {
    if (values.programSpeId) {
      await axios
        .get(
          `/api/academic/fetchStudentDetailForBatchAssignmentFromIndex?school_id=${schID}&program_specialization_id=${values.programSpeId}&current_year=${currentYear}&ac_year_id=${acYearId}&student_ids=${otherStudentIds}&unassigned_school_ids=${values.schoolId}`
        )
        .then((res) => {
          setAssignedStudentDetails(
            res.data.data[0].batch_assigned_student_details
          );
          setUnassignedStudentDetails(
            res.data.data[0].batch_unassigned_student_details
          );
        })
        .catch((err) => console.error(err));
    }
  };

  const getOtherStudentsData = async () => {
    if (values.schoolId && values.programSpeId && values.yearsemId) {
      await axios
        .get(
          `/api/academic/fetchBatchAssignmentDetailForStudentFromIndex?school_id=${schID}&program_id=${
            programSpecializationId + "," + values.programSpeId
          }&current_year=${currentYear}&ac_year_id=${acYearId}&batch_id=${batchId}`
        )
        .then((res) => {
          setOtherStudentIds(
            res.data.data.map((val) => {
              return val.student_ids.toString();
            })
          );
        })
        .catch((err) => console.error(err));
    }
  };
  const getSameCollegeStudents = async (params) => {
    if (values.programSpeIdOne && rowData.current_year != null) {
      await axios
        .get(
          `/api/academic/fetchUnAssignedStudentDetailsOfSchool?ac_year_id=${rowData.ac_year_id}&school_id=${rowData.school_id}&student_ids=${rowData.student_ids}&program_specialization_id=${values.programSpeIdOne}&program_id=${rowData.program_id}&current_year_sem=${rowData.current_year}`
        )
        .then((res) => {
          setBatchStudentDetails(res.data.data);
        })
        .catch((err) => console.error(err));
    } else if (values.programSpeIdOne && rowData.current_sem != null) {
      await axios
        .get(
          `/api/academic/fetchUnAssignedStudentDetailsOfSchool?ac_year_id=${rowData.ac_year_id}&school_id=${rowData.school_id}&student_ids=${rowData.student_ids}&program_specialization_id=${values.programSpeIdOne}&program_id=${rowData.program_id}&current_year_sem=${rowData.current_sem}`
        )
        .then((res) => {
          setBatchStudentDetails(res.data.data);
        })
        .catch((err) => console.error(err));
    }
  };

  const handleChangeStudent = (e) => {
    const { name, checked } = e.target;

    if (name === "selectAll" && checked === true) {
      let tempUser = batchStudentDetails.map((test) => {
        return { ...test, isChecked: checked };
      });
      setBatchStudentDetails(tempUser);

      setValues({
        ...values,
        studentId: batchStudentDetails.map((obj) => obj.student_id).toString(),
      });
    } else if (name === "selectAll" && checked === false) {
      let tempUser = batchStudentDetails.map((test) => {
        return { ...test, isChecked: checked };
      });
      setBatchStudentDetails(tempUser);

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

      let temp = batchStudentDetails.map((obj) => {
        return obj.student_id.toString() === name
          ? { ...obj, isChecked: checked }
          : obj;
      });
      setBatchStudentDetails(temp);
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

      let temp = batchStudentDetails.map((obj) => {
        return obj.student_id.toString() === name
          ? { ...obj, isChecked: checked }
          : obj;
      });

      setBatchStudentDetails(temp);

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

  const handleChangeUser = (e) => {
    const { name, checked } = e.target;

    if (name === "selectAll" && checked === true) {
      let tempUser = userDetails.map((test) => {
        return { ...test, isChecked: checked };
      });
      setUserDetails(tempUser);

      setValues({
        ...values,
        userId: userDetails.map((obj) => obj.user_id).toString(),
      });
    } else if (name === "selectAll" && checked === false) {
      let tempUser = userDetails.map((test) => {
        return { ...test, isChecked: checked };
      });
      setUserDetails(tempUser);

      setValues({
        ...values,
        userId: [],
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
      let temp = userDetails.map((obj) => {
        return obj.user_id.toString() === name
          ? { ...obj, isChecked: checked }
          : obj;
      });
      setUserDetails(temp);
      const newTemp = [];
      temp.map((obj) => {
        if (obj.isChecked === true) {
          newTemp.push(obj.user_id);
        }
      });
      setValues({
        ...values,
        userId: newTemp.toString(),
      });
    } else if (name !== "selectAll" && checked === false) {
      if (!isNew) {
        const uncheckTemp = unAssigned;
        if (uncheckTemp.includes(e.target.value) === false) {
          uncheckTemp.push(e.target.value);
        }

        setUnAssigned(uncheckTemp);
      }

      let temp = userDetails.map((obj) => {
        return obj.user_id.toString() === name
          ? { ...obj, isChecked: checked }
          : obj;
      });

      setUserDetails(temp);

      const existData = [];

      values.userId.split(",").map((obj) => {
        existData.push(obj);
      });

      const index = existData.indexOf(e.target.value);

      if (index > -1) {
        existData.splice(index, 1);
      }

      setValues({
        ...values,
        userId: existData.toString(),
      });
    }
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const handleChangeAdvance = async (name, newValue) => {
    if (name === "programSpeIdOne") {
      await axios
        .get(
          `/api/academic/fetchUnAssignedStudentDetailsOfSchool?ac_year_id=${rowData.ac_year_id}&school_id=${rowData.school_id}&student_ids=${rowData.student_ids}&program_specialization_id=${newValue}&program_id=${rowData.program_id}&current_year_sem=${rowData.current_year}`
        )
        .then((res) => {
          setBatchStudentDetails(res.data.data);
        })
        .catch((err) => console.error(err));
      setValues((prev) => ({
        ...prev,
        [name]: newValue,
      }));
    }

    if (name === "programSpeId") {
      await axios
        .get(
          `/api/academic/fetchProgramWithSpecialization/${acYearId}/${values.schoolId}`
        )
        .then((res) => {
          const yearsem = [];

          res.data.data.filter((fil) => {
            if (fil.program_specialization_id === newValue) {
              yearsem.push(fil);
            }
          });

          yearsem.map((obj) => {
            if (obj.program_type_code === "YEA") {
              const years = yearsem.map((obj) => obj.number_of_years);
              const newYear = [];

              for (let i = 1; i <= Math.max(...years); i++) {
                newYear.push({ value: i, label: "year" + "-" + i });
              }
              setYearSemOptions(
                newYear.map((obj) => ({
                  value: obj.value,
                  label: obj.label,
                }))
              );
            } else {
              const years = yearsem.map((obj) => obj.number_of_semester);
              const newYear = [];

              for (let i = 1; i <= Math.max(...years); i++) {
                newYear.push({ value: i, label: "sem" + "-" + i });
              }
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

  const getSchoolNameOptions = async () => {
    await axios
      .get(`/api/institute/school`)
      .then((res) => {
        setSchoolNameOptions(
          res.data.data
            .filter((fil) => fil.school_id !== schID)
            .map((obj) => ({
              value: obj.school_id,
              label: obj.school_name,
            }))
        );
      })
      .catch((err) => console.error(err));
  };

  const getProgramSpeData = async () => {
    if (values.schoolId)
      await axios
        .get(
          `/api/academic/fetchProgramWithSpecialization/${acYearId}/${values.schoolId}`
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

  const getData = async () => {
    await axios
      .get(
        `/api/academic/fetchAllBatchAssignmentDetails?page=${0}&page_size=${10000}&sort=created_date`
      )
      .then((res) => {
        setRows(res.data.data);
      })
      .catch((err) => console.error(err));
  };

  const handleStudent = async (params) => {
    setRowData(params.row);
    await axios
      .get(
        `/api/academic/fetchProgramWithSpecialization/${params.row.ac_year_id}/${params.row.school_id}`
      )
      .then((res) => {
        setProgramSpeOptionsOne(
          res.data.data.map((obj) => ({
            value: obj.program_specialization_id,
            label: obj.specialization_with_program,
          }))
        );
      })
      .catch((err) => console.error(err));

    setStudentOpen(true);
  };

  const handleAddUser = async (params) => {
    setData(params.row);
    setUsersOpen(true);
    if (params.row.current_sem === null) {
      await axios
        .get(
          `/api/academic/fetchGuestStudentDetails?school_id=${params.row.school_id}&program_id=${params.row.program_id}&current_year=${params.row.current_year}&ac_year_id=${params.row.ac_year_id}&batch_id=${params.row.batch_id}`
        )
        .then((res) => {
          setUserDetails(res.data.data[0].batch_assigned_guest_student_details);
          setNames(
            res.data.data[0].batch_unassigned_guest_student_details.map(
              (obj) => ({
                value: obj.user_id,
                label: obj.email,
              })
            )
          );
        })
        .catch((err) => console.error(err));
    } else if (params.row.current_year === null) {
      await axios
        .get(
          `/api/academic/fetchGuestStudentDetails?school_id=${params.row.school_id}&program_id=${params.row.program_id}&current_sem=${params.row.current_sem}&ac_year_id=${params.row.ac_year_id}&batch_id=${params.row.batch_id}`
        )
        .then((res) => {
          setUserDetails(res.data.data[0].batch_assigned_guest_student_details);
          setNames(
            res.data.data[0].batch_unassigned_guest_student_details.map(
              (obj) => ({
                value: obj.user_id,
                label: obj.email,
              })
            )
          );
        })
        .catch((err) => console.error(err));
    }
  };

  const handleAddStudent = async (params) => {
    setRowData(params.row);
    setBatchId(params.row.batch_id);
    setStudentsOpen(true);
    setAcYearId(params.row.ac_year_id);
    setschID(params.row.school_id);
    setCurrentYear(params.row.current_year);
    setprogramSpecializationId(params.row.program_id);
  };
  const handleCreateUser = async () => {
    const temp = {};
    temp.active = true;
    temp.batch_assignment_id = data.id;
    temp.batch_id = data.batch_id;
    temp.school_id = data.school_id;
    temp.program_id = data.program_id;
    temp.ac_year_id = data.ac_year_id;
    temp.section_id = data.section_id;
    temp.current_year = data.current_year;
    temp.current_sem = data.current_sem;
    temp.student_ids = data.student_ids;
    temp.batch_type = data.batch_type;
    temp.batch_master_id = data.batch_master_id;
    temp.guest_uesr_ids = data.guest_uesr_ids
      ? data.guest_uesr_ids + "," + values.userEmail.toString()
      : values.userEmail.toString();
    temp.remarks = data.remarks;
    temp.interval_type_id = data.interval_type_id;

    await axios
      .put(`/api/academic/BatchAssignment/${data.id}`, temp)
      .then((res) => {
        setLoading(false);
        setAlertMessage({
          severity: "success",
          message: res.data.message,
        });
        setAlertOpen(true);
        setAlertMessage({
          severity: "success",
          message: "Form Submitted Successfully",
        });
        setUsersOpen(false);
      })
      .catch((err) => {
        setLoading(false);
        setAlertMessage({
          severity: "error",
          message: err.response.data
            ? err.response.data.message
            : "Error submitting",
        });
        setAlertOpen(true);
      });
  };

  const handleCreateStudent = async () => {
    const temp = {};
    temp.active = true;
    temp.batch_assignment_id = rowData.id;
    temp.batch_id = rowData.batch_id;
    temp.school_id = rowData.school_id;
    temp.program_id = rowData.program_id;
    temp.ac_year_id = rowData.ac_year_id;
    temp.section_id = rowData.section_id;
    temp.current_year = rowData.current_year;
    temp.current_sem = rowData.current_sem;
    temp.student_ids = rowData.student_ids + "," + values.studentId;
    temp.batch_type = rowData.batch_type;
    temp.batch_master_id = rowData.batch_master_id;
    temp.guest_uesr_ids = rowData.guest_uesr_ids
      ? rowData.guest_uesr_ids.toString()
      : null;
    temp.remarks = rowData.remarks;
    temp.interval_type_id = rowData.interval_type_id;

    await axios
      .put(`/api/academic/BatchAssignment/${rowData.id}`, temp)
      .then((res) => {
        setLoading(false);
        setAlertMessage({
          severity: "success",
          message: res.data.message,
        });
        setAlertOpen(true);
        setAlertMessage({
          severity: "success",
          message: "Form Submitted Successfully",
        });
        setStudentOpen(false);
      })
      .catch((err) => {
        setLoading(false);
        setAlertMessage({
          severity: "error",
          message: err.response.data
            ? err.response.data.message
            : "Error submitting",
        });
        setAlertOpen(true);
      });
  };

  const handleCreateCollege = async () => {
    const temp = {};
    temp.active = true;
    temp.batch_assignment_id = rowData.id;
    temp.batch_id = rowData.batch_id;
    temp.school_id = rowData.school_id;
    temp.program_id = rowData.program_id;
    temp.ac_year_id = rowData.ac_year_id;
    temp.section_id = rowData.section_id;
    temp.current_year = rowData.current_year;
    temp.current_sem = rowData.current_sem;
    temp.student_ids = rowData.student_ids + "," + values.studentId;
    temp.batch_type = rowData.batch_type;
    temp.batch_master_id = rowData.batch_master_id;
    temp.guest_uesr_ids = rowData.guest_uesr_ids
      ? rowData.guest_uesr_ids.toString()
      : "";
    temp.remarks = rowData.remarks;
    temp.interval_type_id = rowData.interval_type_id;

    await axios
      .put(`api/academic/BatchAssignment/${rowData.id}`, temp)
      .then((res) => {
        setLoading(false);
        setAlertMessage({
          severity: "success",
          message: res.data.message,
        });
        setAlertOpen(true);
        setAlertMessage({
          severity: "success",
          message: "Form Submitted Successfully",
        });
        setStudentsOpen(false);
      })
      .catch((err) => {
        setLoading(false);
        setAlertMessage({
          severity: "error",
          message: err.response.data
            ? err.response.data.message
            : "Error submitting",
        });
        setAlertOpen(true);
      });
  };

  const handleActive = async (params) => {
    const id = params.row.id;

    const handleToggle = async () => {
      if (params.row.active === true) {
        await axios
          .delete(`/api/academic/BatchAssignment/${id}`)
          .then((res) => {
            if (res.status === 200) {
              getData();
            }
          })
          .catch((err) => console.error(err));
      } else {
        await axios
          .delete(`/api/academic/activateBatchAssignment/${id}`)
          .then((res) => {
            if (res.status === 200) {
              getData();
            }
          })
          .catch((err) => console.error(err));
      }
    };
    params.row.active === true
      ? setModalContent({
          title: "Deactivate",
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
    setModalOpen(true);
  };

  return (
    <>
      <CustomModal
        open={modalOpen}
        setOpen={setModalOpen}
        title={modalContent.title}
        message={modalContent.message}
        buttons={modalContent.buttons}
      />
      <ModalWrapper open={studentsOpen} setOpen={setStudentsOpen}>
        <Grid container columnSpacing={{ xs: 2, md: 4 }} mt={2.5}>
          <Grid item xs={12} md={4}>
            <CustomAutocomplete
              name="schoolId"
              label="Institute"
              value={values.schoolId}
              options={SchoolNameOptions}
              handleChangeAdvance={handleChangeAdvance}
              disabled={!isNew}
              required
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <CustomAutocomplete
              name="programSpeId"
              label="Specialization"
              value={values.programSpeId}
              options={programSpeOptions}
              handleChangeAdvance={handleChangeAdvance}
              disabled={!isNew}
              required
            />
          </Grid>

          <Grid item xs={12} md={4}>
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
        </Grid>
        {values.yearsemId ? (
          <Grid
            container
            justifyContent="center"
            columnSpacing={{ xs: 2, md: 4 }}
          >
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
          </Grid>
        ) : (
          <></>
        )}
        <Grid container justifyContent="center">
          {values.yearsemId ? (
            <>
              <Grid item xs={12} md={10} mt={2.5} textAlign="center">
                <TableContainer component={Paper}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <StyledTableCell>
                          <Checkbox
                            {...label}
                            sx={{ "& .MuiSvgIcon-root": { fontSize: 14 } }}
                            style={{ color: "white" }}
                            name="selectAll"
                            checked={
                              !assignedstudentDetails.some(
                                (user) => user?.isChecked !== true
                              )
                            }
                            // onChange={handleChange}
                          />
                        </StyledTableCell>

                        <StyledTableCell
                          onClick={() => handleSorting("auid")}
                          style={{ cursor: "pointer" }}
                        >
                          AUID
                        </StyledTableCell>
                        <StyledTableCell onClick={() => handleSorting("usn")}>
                          USN
                        </StyledTableCell>
                        <StyledTableCell
                          onClick={() => handleSorting("student_name")}
                          style={{ cursor: "pointer" }}
                        >
                          Student Name
                        </StyledTableCell>

                        <StyledTableCell>Status</StyledTableCell>
                        <StyledTableCell>SL.No</StyledTableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {assignedstudentDetails
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
                                  "& .MuiSvgIcon-root": { fontSize: 14 },
                                }}
                                name={obj.student_id}
                                value={obj.student_id}
                                // onChange={handleChange}
                                checked={true}
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
                        ))}{" "}
                      {unAssignedStudentDetails
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
                                  "& .MuiSvgIcon-root": { fontSize: 14 },
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
              </Grid>
            </>
          ) : (
            <></>
          )}

          <Grid item xs={12} md={10} mt={2} textAlign="right">
            <Button
              variant="contained"
              disableElevation
              sx={{
                borderRadius: 2,
              }}
              startIcon={<AddIcon />}
              onClick={handleCreateCollege}
            >
              Add
            </Button>
          </Grid>
        </Grid>
      </ModalWrapper>
      <ModalWrapper maxWidth={1000} open={usersOpen} setOpen={setUsersOpen}>
        <Grid container justifyContent="center">
          <>
            <Grid item md={3} ml={-5}>
              <CustomMultipleAutocomplete
                name="userEmail"
                label="User Email"
                handleChangeAdvance={handleChangeAdvance}
                options={names}
                value={values.userEmail}
              />
            </Grid>
            <Grid item md={4} marginLeft={4}>
              <Button
                variant="contained"
                disableElevation
                sx={{
                  borderRadius: 2,
                }}
                startIcon={<AddIcon />}
                onClick={handleCreateUser}
              >
                Add
              </Button>
            </Grid>
            <Grid item xs={12} md={8} mt={2}>
              <TableContainer component={Paper} className={classes.container}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <StyledTableCell
                        onClick={() => handleSorting("student_name")}
                        style={{ cursor: "pointer" }}
                      >
                        SELECT
                      </StyledTableCell>
                      <StyledTableCell
                        onClick={() => handleSorting("student_name")}
                        style={{ cursor: "pointer" }}
                      >
                        NAME
                      </StyledTableCell>
                      <StyledTableCell onClick={() => handleSorting("usn")}>
                        EMAIL
                      </StyledTableCell>

                      <StyledTableCell
                        onClick={() => handleSorting("auid")}
                        style={{ cursor: "pointer" }}
                      >
                        USER ID
                      </StyledTableCell>

                      <StyledTableCell>SL.No</StyledTableCell>
                      <StyledTableCell>Status</StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {userDetails ? (
                      userDetails.map((obj, i) => (
                        <TableRow key={i}>
                          <TableCell style={{ height: "10px" }}>
                            <Checkbox
                              {...label}
                              sx={{
                                "& .MuiSvgIcon-root": { fontSize: 14 },
                              }}
                              name={obj.user_id}
                              value={obj.user_id}
                              onChange={handleChangeUser}
                              checked={obj?.isChecked || false}
                            />
                          </TableCell>

                          <TableCell style={{ height: "10px" }}>
                            {obj.username}
                          </TableCell>
                          <TableCell style={{ height: "10px" }}>
                            {obj.email}
                          </TableCell>

                          <TableCell style={{ height: "10px" }}>
                            {obj.user_id}
                          </TableCell>
                          <TableCell style={{ height: "10px" }}>
                            {i + 1}
                          </TableCell>

                          <TableCell style={{ height: "10px" }}>
                            {obj.eligible_reported_status === null
                              ? "No status"
                              : obj.eligible_reported_status}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <></>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
              {/* <TablePagination
                rowsPerPageOptions={[40, 50, 60]}
                count={userDetails.length}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              /> */}
            </Grid>
          </>
        </Grid>
      </ModalWrapper>

      <ModalWrapper maxWidth={1000} open={studentOpen} setOpen={setStudentOpen}>
        <Grid container columnSpacing={{ xs: 2, md: 4 }} rowSpacing={2}>
          <Grid item xs={12} md={4} ml={10}>
            <CustomAutocomplete
              name="programSpeIdOne"
              label="Specialization"
              value={values.programSpeIdOne}
              options={programSpeOptionsOne}
              handleChangeAdvance={handleChangeAdvance}
              disabled={!isNew}
              required
            />
          </Grid>
        </Grid>

        <Grid container justifyContent="center">
          <>
            <Grid item xs={12} md={10} mt={2}>
              <TableContainer component={Paper} className={classes.container}>
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
                              !batchStudentDetails.some(
                                (user) => user?.isChecked !== true
                              )
                            }
                            onChange={handleChangeStudent}
                          />
                        ) : (
                          ""
                        )}
                      </StyledTableCell>

                      <StyledTableCell
                        onClick={() => handleSorting("auid")}
                        style={{ cursor: "pointer" }}
                      >
                        AUID
                      </StyledTableCell>
                      <StyledTableCell onClick={() => handleSorting("usn")}>
                        USN
                      </StyledTableCell>
                      <StyledTableCell
                        onClick={() => handleSorting("student_name")}
                        style={{ cursor: "pointer" }}
                      >
                        Student Name
                      </StyledTableCell>

                      <StyledTableCell>Status</StyledTableCell>
                      <StyledTableCell>SL.No</StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {batchStudentDetails
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
                                "& .MuiSvgIcon-root": { fontSize: 14 },
                              }}
                              name={obj.student_id}
                              value={obj.student_id}
                              onChange={handleChangeStudent}
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
                rowsPerPageOptions={[40, 50, 60]}
                count={batchStudentDetails.length}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </Grid>

            <Grid item xs={12} md={10} mt={2} textAlign="right">
              <Button
                variant="contained"
                disableElevation
                sx={{
                  borderRadius: 2,
                }}
                startIcon={<AddIcon />}
                onClick={handleCreateStudent}
              >
                Add
              </Button>
            </Grid>
          </>
        </Grid>
      </ModalWrapper>
      <Box sx={{ position: "relative" }}>
        <Button
          onClick={() => navigate("/TimeTableMaster/BatchAssignment/New")}
          variant="contained"
          disableElevation
          sx={{ position: "absolute", right: 0, top: -57, borderRadius: 2 }}
          startIcon={<AddIcon />}
          disabled={loading}
        >
          Create
        </Button>
        <GridIndex rows={rows} columns={columns} />
      </Box>
    </>
  );
}
export default BatchAssignmentIndex;
