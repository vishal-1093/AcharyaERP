import { useState, useEffect } from "react";
import GridIndex from "../../../components/GridIndex";
import {
  Button,
  Box,
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
  Typography,
} from "@mui/material";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import { Check, HighlightOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import CustomModal from "../../../components/CustomModal";
import axios from "../../../services/Api";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import ModalWrapper from "../../../components/ModalWrapper";
import useAlert from "../../../hooks/useAlert";
import { makeStyles } from "@mui/styles";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import moment from "moment";

const label = { inputProps: { "aria-label": "Checkbox demo" } };

const useStyles = makeStyles((theme) => ({
  table: {
    "& .MuiTableCell-root": {},
  },
  bg: {
    backgroundColor: theme.palette.primary.main,
    textAlign: "center",
  },
  red: {
    background: "#ff9999 !important",
  },
}));

const initialValues = {
  studentId: "",
};

const ELIGIBLE_REPORTED_STATUS = {
  1: "No status",
  2: "Not Eligible",
  3: "Eligible",
  4: "Not Reported",
  5: "Pass Out",
  6: "Promoted",
};

function SectionAssignmentIndex() {
  const [rows, setRows] = useState([]);
  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
    buttons: [],
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [studentsOpen, setStudentsOpen] = useState(false);
  const [studentDetails, setStudentDetails] = useState([]);
  const [values, setValues] = useState(initialValues);
  const [data, setData] = useState();
  const [search, setSearch] = useState("");
  const [studentList, setStudentList] = useState([]);
  const [studentListOpen, setStudentListOpen] = useState(false);
  const [selectAll, setSelectAll] = useState(false);

  const navigate = useNavigate();
  const classes = useStyles();
  const { setAlertMessage, setAlertOpen } = useAlert();

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    await axios
      .get(
        `/api/academic/fetchAllSectionAssignmentDetails?page=${0}&page_size=${10000}&sort=created_date`
      )
      .then((res) => {
        setRows(res.data.data);
      })
      .catch((err) => console.error(err));
  };

  const handleAdd = async (params) => {
    setStudentDetails([]);
    setStudentsOpen(true);
    setData(params);
    await axios
      .get(
        `/api/student/fetchAllStudentDetailForSectionAssignmentForUpdate/${params.row.school_id}/${params.row.program_id}/${params.row.program_specialization_id}/${params.row.current_year_sem}/${params.row.section_id}/${params.row.program_assignment_id}`
      )
      .then((res) => {
        const rowId = res.data.data.map((obj, index) => ({
          ...obj,
          id: index + 1,
          checked: false,
        }));
        setStudentDetails(rowId);
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    setSelectAll(studentDetails.every((obj) => obj.checked));
  }, [studentDetails]);

  const columnsStudent = [
    {
      field: "isSelected",
      headerName: "Checkbox Selection",
      flex: 1,
      sortable: false,
      renderHeader: () => (
        <FormGroup>
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
      field: "student_name",
      headerName: "Student Name",
      flex: 1,
    },
    {
      field: "auid",
      headerName: "AUID",
      flex: 1,
    },
    {
      field: "usn",
      headerName: "USN",
      flex: 1,
      valueGetter: (params) => params.row.usn ?? "NA",
    },
    {
      field: "reporting_date",
      headerName: "Reported Date",
      flex: 1,
      valueGetter: (params) =>
        params.row.reporting_date
          ? moment(params.row.reporting_date).format("DD-MM-YYYY")
          : "NA",
    },
    {
      field: "current",
      headerName: "Year/Sem",
      flex: 1,
      valueGetter: (params) =>
        params.row.current_year
          ? params.row.current_year + "/" + params.row.current_sem
          : "NA",
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
    const studentUpdatedList = studentDetails.map((obj) =>
      obj.id === id ? { ...obj, checked: event.target.checked } : obj
    );
    setStudentDetails(studentUpdatedList);
  };

  const handleHeaderCheckboxChange = (e) => {
    const allStudentsSelected = studentDetails.map((obj) => ({
      ...obj,
      checked: e.target.checked,
    }));

    setStudentDetails(allStudentsSelected);
  };

  const handleSubmit = async () => {
    const rowData = data.row;

    const studentsIds = [];

    studentDetails.map((obj) => {
      if (obj.checked === true) {
        studentsIds.push(obj.student_id);
      }
    });

    const temp = {};
    temp.active = true;
    temp.section_assignment_id = rowData.section_assignment_id;
    temp.ac_year_id = rowData.ac_year_id;
    temp.school_id = rowData.school_id;
    temp.program_id = rowData.program_id;
    temp.program_specialization_id = rowData.program_specialization_id;
    temp.program_assignment_id = rowData.program_assignment_id;
    temp.current_year_sem = rowData.current_year_sem;
    temp.section_id = rowData.section_id;
    temp.remarks = rowData.remarks;
    temp.student_ids =
      rowData.student_ids && studentsIds.length === 0
        ? rowData.student_ids
        : rowData.student_ids && studentsIds.length > 0
        ? rowData.student_ids + "," + studentsIds?.toString()
        : studentsIds?.toString();

    await axios
      .put(
        `/api/academic/SectionAssignmentOfStudentFromIndex/${rowData.section_assignment_id}`,
        temp
      )
      .then((res) => {
        getData();
        setStudentsOpen(false);
        setAlertMessage({
          severity: "success",
          message: "Section Assigned",
        });
        setAlertOpen(true);
      })
      .catch((error) => {
        setAlertMessage({
          severity: "error",
          message: error.response ? error.response.data.message : "Error",
        });
        setAlertOpen(true);
      });

    const tempOne = {};
    tempOne.active = true;
    tempOne.section_assignment_id = rowData.section_assignment_id;
    tempOne.program_assignment_id = rowData.program_assignment_id;
    tempOne.ac_year_id = rowData.ac_year_id;
    tempOne.school_id = rowData.school_id;
    tempOne.program_id = rowData.program_id;
    tempOne.program_specialization_id = rowData.program_specialization_id;
    tempOne.current_year_sem = rowData.current_year_sem;
    tempOne.section_id = rowData.section_id;
    tempOne.remarks = rowData.remarks;
    tempOne.student_ids = rowData.student_ids;

    await axios
      .post(`/api/academic/sectionAssignmentHistory`, tempOne)
      .then((res) => {
        setStudentsOpen(false);
        setAlertMessage({
          severity: "success",
          message: "Section Assigned",
        });
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

  const handleActive = async (params) => {
    const id = params.row.id;
    setModalOpen(true);
    const handleToggle = async () => {
      if (params.row.active === true) {
        await axios
          .delete(`/api/academic/SectionAssignment/${id}`)
          .then((res) => {
            if (res.status === 200) {
              getData();
              setModalOpen(false);
            }
          })
          .catch((err) => console.error(err));
      } else {
        await axios
          .delete(`/api/academic/activateSectionAssignment/${id}`)
          .then((res) => {
            if (res.status === 200) {
              getData();
              setModalOpen(false);
            }
          })
          .catch((err) => console.error(err));
      }
    };
    params.row.active === true
      ? setModalContent({
          title: "",
          message: "Do you want to make it Inactive?",
          buttons: [
            { name: "No", color: "primary", func: () => {} },
            { name: "Yes", color: "primary", func: handleToggle },
          ],
        })
      : setModalContent({
          title: "",
          message: "Do you want to make it Active?",
          buttons: [
            { name: "No", color: "primary", func: () => {} },
            { name: "Yes", color: "primary", func: handleToggle },
          ],
        });
  };

  const handleDetails = async (params) => {
    setStudentListOpen(true);
    const data = params.row;
    await axios
      .get(`/api/academic/studentDetailsBasedOnSectionAssignmentId/${data.id}`)
      .then((res) => {
        setStudentList(res.data.data);
      })
      .catch((err) => console.error(err));
  };

  const columns = [
    { field: "ac_year", headerName: "AC Year", flex: 1 },
    { field: "school_name_short", headerName: "School", flex: 1 },
    { field: "program_short_name", headerName: "Program", flex: 1 },
    {
      field: "program_specialization_short_name",
      headerName: "Specialization",
      flex: 1,
    },
    {
      field: "current_year_sem",
      headerName: "Year/Sem",
      flex: 1,
    },
    {
      field: "section_name",
      headerName: "Section",
      flex: 1,
    },

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
      valueGetter: (params) =>
        moment(params.row.created_date).format("DD-MM-YYYY"),
      hide: true,
    },
    {
      field: "count_of_students",
      headerName: "Count",
      width: 220,
      flex: 1,
      renderCell: (params) => {
        return (
          <Box sx={{ width: "100%" }}>
            <Typography
              variant="subtitle2"
              component="span"
              color="primary.main"
              sx={{ cursor: "pointer" }}
              onClick={() => handleDetails(params)}
            >
              {params.row.count_of_students === null
                ? 0
                : params.row.count_of_students}
            </Typography>
          </Box>
        );
      },
    },
    {
      field: "Add",
      headerName: "Add",
      type: "actions",
      getActions: (params) => [
        <IconButton
          label="Result"
          color="primary"
          onClick={() => handleAdd(params)}
        >
          <AddCircleOutlineIcon />
        </IconButton>,
      ],
    },
    {
      field: "created_by",
      headerName: "Update",

      renderCell: (params) => {
        return (
          <IconButton
            onClick={() =>
              navigate(
                `/TimeTableMaster/SectionAssignmentUpdate/${params.row.id}`
              )
            }
          >
            <EditIcon />
          </IconButton>
        );
      },
    },
    {
      field: "active",
      headerName: "Active",

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
    {
      field: "promote",
      headerName: "Promote Section",
      flex: 1,
      renderCell: (params) => {
        return (
          <Button
            variant="filled"
            size="small"
            onClick={() => navigate(`/SectionMaster/Promote/${params.row.id}`)}
          >
            Promote
          </Button>
        );
      },
    },
  ];

  return (
    <Box sx={{ position: "relative", mt: 2 }}>
      <CustomModal
        open={modalOpen}
        setOpen={setModalOpen}
        title={modalContent.title}
        message={modalContent.message}
        buttons={modalContent.buttons}
      />
      <ModalWrapper
        title="Student List"
        open={studentsOpen}
        setOpen={setStudentsOpen}
        maxWidth={900}
      >
        <Grid container rowSpacing={1}>
          <Grid item xs={12} align="right">
            <Button onClick={handleSubmit} variant="contained">
              Submit
            </Button>
          </Grid>
          <Grid item xs={12}>
            <GridIndex rows={studentDetails} columns={columnsStudent} />
          </Grid>
        </Grid>
      </ModalWrapper>

      <ModalWrapper
        title="Student List"
        maxWidth={850}
        open={studentListOpen}
        setOpen={setStudentListOpen}
      >
        <Grid container>
          <Grid item xs={12} md={12} mt={2}>
            <TableContainer component={Paper}>
              <Table size="small" className={classes.table}>
                <TableHead>
                  <TableRow className={classes.bg}>
                    <TableCell
                      sx={{
                        color: "white",
                        textAlign: "center",
                      }}
                    >
                      Student Name
                    </TableCell>
                    <TableCell sx={{ color: "white", textAlign: "center" }}>
                      AUID
                    </TableCell>
                    <TableCell sx={{ color: "white", textAlign: "center" }}>
                      USN
                    </TableCell>
                    <TableCell sx={{ color: "white", textAlign: "center" }}>
                      Reporting Date
                    </TableCell>
                    <TableCell sx={{ color: "white", textAlign: "center" }}>
                      Year / Sem
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {studentList.length > 0 ? (
                    studentList.map((val, i) => (
                      <TableRow key={i} style={{ height: 10 }}>
                        <TableCell sx={{ textAlign: "center" }}>
                          {val.student_name}
                        </TableCell>
                        <TableCell sx={{ textAlign: "center" }}>
                          {val.auid}
                        </TableCell>
                        <TableCell sx={{ textAlign: "center" }}>
                          {val.usn ?? "NA"}
                        </TableCell>
                        <TableCell sx={{ textAlign: "center" }}>
                          {val.reporting_date
                            ? moment(val.reporting_date).format("DD-MM-YYYY")
                            : "NA"}
                        </TableCell>
                        <TableCell sx={{ textAlign: "center" }}>
                          {val.current_sem
                            ? `${val.current_year} / ${val.current_sem}`
                            : "NA"}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <></>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </ModalWrapper>

      <Button
        onClick={() => navigate("/TimeTableMaster/SectionAssignmentForm/New")}
        variant="contained"
        disableElevation
        sx={{ position: "absolute", right: 0, top: -57, borderRadius: 2 }}
        startIcon={<AddIcon />}
      >
        Create
      </Button>
      <GridIndex
        rows={rows}
        columns={columns}
        getRowClassName={(params) => {
          return params.row.count_of_students === null ? classes.red : "";
        }}
      />
    </Box>
  );
}

export default SectionAssignmentIndex;
