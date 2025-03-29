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
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";

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
  acYearId: null,
  school_Id: null,
  programId: null,
  yearSem: null,
  sectionId: null,
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
  const [academicYearOptions, setAcademicYearOptions] = useState([]);
  const [schoolOptions, setSchoolOptions] = useState([]);
  const [programOptions, setProgramOptions] = useState([]);
  const [sectionOptions, setSectionOptions] = useState([]);
  const [yearSemOptions, setYearSemOptions] = useState([]);

  const navigate = useNavigate();
  const classes = useStyles();
  const { setAlertMessage, setAlertOpen } = useAlert();

  useEffect(() => {
    getData();
    getAcYearData()
    getSchoolData();
  }, []);

  useEffect(() => {
    getData();
  }, [values.acYearId, values.programId, values.sectionId]);

  useEffect(() => {
    getProgram();
    getSectionData()
    getData();
  }, [values.school_Id]);



  useEffect(() => {
    if (values.yearSem) {
      getSectionData()
      getData();
    }
  }, [values.yearSem])

  const getProgram = async () => {
    const { school_Id } = values;
    if (!school_Id) return null;

    try {
      const { data: response } = await axios.get(
        `/api/academic/fetchAllProgramsWithSpecialization/${school_Id}`
      );
      const optionData = [];
      const responseData = response.data;
      response.data.forEach((obj) => {
        optionData.push({
          value: obj.program_specialization_id,
          label: `${obj.program_short_name} - ${obj.program_specialization_name}`,
          program_id: obj.program_id,
        });
      });
      const programObject = responseData.reduce((acc, next) => {
        acc[next.program_specialization_id] = next;
        return acc;
      }, {});
      setProgramOptions(optionData);
      // setProgramData(programObject);
    } catch (err) {
      setAlertMessage({
        severity: "error",
        message:
          err.response?.data?.message || "Failed to load the programs data",
      });
      setAlertOpen(true);
    }
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

  const getAcYearData = async () => {
    try {
      const response = await axios.get("/api/academic/academic_year");
      const newResponse = response.data.data.filter(
        (obj) => obj.current_year >= 2024
      );

      const optionData = [];
      const ids = [];
      newResponse.forEach((obj) => {
        optionData.push({ value: obj.ac_year_id, label: obj.ac_year });
        ids.push(obj.current_year);
      });
      const latestYear = Math.max(...ids);
      const latestYearId = response.data.data.filter(
        (obj) => obj.current_year === 2024
      );
      setAcademicYearOptions(optionData);
      setValues((prev) => ({
        ...prev,
        acYearId: latestYearId[0].ac_year_id,
      }));
    } catch (err) {
      setAlertMessage({
        severity: "error",
        message: "Failed to fetch the academic years !!",
      });
      setAlertOpen(true);
    }
  };
  const getData = async () => {
    if (values?.acYearId) {
      const programInfo = programOptions?.find((obj) => obj?.value == values.programId)
      try {
        const temp = {
          ac_year_id: values.acYearId,
          ...(values.programId && { program_id: programInfo?.program_id }),
          ...(values.programId && { program_specialization_id: values.programId }),
          ...(values.school_Id && { school_id: values.school_Id }),
          ...(values.yearSem && { current_year_sem: values.yearSem }),
          ...(values.sectionId && { section_id: values.sectionId }),
          page: 0,
          page_size: 100000,
          sort: "created_date",
        };
        const queryParams = Object.keys(temp)
          .filter((key) => temp[key] !== undefined && temp[key] !== null)
          .map((key) => `${key}=${encodeURIComponent(temp[key])}`)
          .join("&");

        const url = `/api/academic/fetchAllSectionAssignmentDetails?${queryParams}`;
        const response = await axios.get(url);
        const { data } = response.data;
        const mainData = data?.map((obj) =>
          obj.id === null ? { ...obj, id: obj.time_table_id } : obj
        );
        const uniqueData = Array.from(new Map(mainData?.map(item => [item.id, item])).values());
        setRows(uniqueData);
      } catch (err) {
        console.error("Error fetching data:", err);
        // setLoading(false);
      }
    }
  };

  const getSectionData = async () => {
    await axios
      // .get(`/api/academic/Section`)
      .get(`api/academic/getSectionDetailData?school_id=${values.school_Id}&ac_year_id=${values.acYearId}&program_specialization_id=${values.programId}&current_year_sem=${values.yearSem}`)
      .then((res) => {
        setSectionOptions(
          // res.data.data.filter(obj => obj.school_id === values.schoolId)
          //     .map((obj) => ({
          //         value: obj.section_id,
          //         label: obj.section_name,
          //     }))
          res?.data?.data?.map((obj) => ({
            value: obj?.section_id,
            label: obj?.section_name,
          }))
        )
      })
      .catch((err) => console.error(err));
  };
  const handleAdd = async (params) => {
    setStudentDetails([]);
    setStudentsOpen(true);
    setData(params);
    if (params.row.program_type.toLowerCase() === "yearly") {
      try {
        const studentResponse = await axios.get(
          `/api/student/fetchStudentDetailForSectionAssignment?school_id=${params.row.school_id}&program_id=${params.row.program_id}&program_specialization_id=${params.row.program_specialization_id}&current_year=${params.row.current_year_sem}`
        );

        const rowId = studentResponse.data.data.map((obj, index) => ({
          ...obj,
          id: index + 1,
          checked: false,
        }));

        setStudentDetails(rowId);
      } catch (error) {
        console.log(error);
      }
    } else if (params.row.program_type.toLowerCase() === "semester") {
      try {
        const studentResponse = await axios.get(
          `/api/student/fetchStudentDetailForSectionAssignment?school_id=${params.row.school_id}&program_id=${params.row.program_id}&program_specialization_id=${params.row.program_specialization_id}&current_sem=${params.row.current_year_sem}`
        );

        const rowId = studentResponse.data.data.map((obj, index) => ({
          ...obj,
          id: index + 1,
          checked: false,
        }));

        setStudentDetails(rowId);
      } catch (error) {
        console.log(error);
      }
    }
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
      valueGetter: (value, row) => row.usn ?? "NA",
    },
    {
      field: "reporting_date",
      headerName: "Reported Date",
      flex: 1,
      valueGetter: (value, row) =>
        row.reporting_date
          ? moment(row.reporting_date).format("DD-MM-YYYY")
          : "NA",
    },
    {
      field: "current",
      headerName: "Year/Sem",
      flex: 1,
      valueGetter: (value, row) =>
        row.current_year
          ? row.current_year + "/" + row.current_sem
          : "NA",
    },
    {
      field: "eligible_reported_status",
      headerName: "Reported",
      flex: 1,
      valueGetter: (value, row) =>
        row.eligible_reported_status
          ? ELIGIBLE_REPORTED_STATUS[row.eligible_reported_status]
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
          { name: "No", color: "primary", func: () => { } },
          { name: "Yes", color: "primary", func: handleToggle },
        ],
      })
      : setModalContent({
        title: "",
        message: "Do you want to make it Active?",
        buttons: [
          { name: "No", color: "primary", func: () => { } },
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
      //type: "date",
       valueGetter: (value, row) =>
        moment(row.created_date).format("DD-MM-YYYY"),
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

  const handleChangeAdvance = async (name, newValue) => {
    if (name === "programId") {
      axios
        .get(`/api/academic/fetchAllProgramsWithSpecialization/${values.school_Id}`)
        .then((res) => {
          const yearsem = [];

          res.data.data.filter((val) => {
            if (val.program_specialization_id === newValue) {
              yearsem.push(val);
            }
          });
          const newyearsem = [];
          yearsem.forEach((obj) => {
            for (let i = 1; i <= obj.number_of_semester; i++) {
              newyearsem.push({ label: `Sem-${i}`, value: i });
            }
          });

          setYearSemOptions(
            newyearsem.map((obj) => ({
              value: obj.value,
              label: obj.label,
            }))
          );
        })
        .catch((err) => console.error(err));
      setValues((prev) => ({
        ...prev,
        [name]: newValue,
        ...(name === "programId" && { yearSem: "", sectionId: "" }),
      }));
    } else {
      setValues((prev) => ({
        ...prev,
        [name]: newValue,
        ...(name === "school_Id" && { yearSem: "", programId: "", sectionId: "" }),
        ...(name === "yearSem" && { sectionId: "" }),
      }));
    }

  };
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
      <Grid
        container
        justifyContent="flex-start"
        rowSpacing={2}
        columnSpacing={4}
      >
        <Grid item xs={12} md={2}>
          <CustomAutocomplete
            name="acYearId"
            value={values.acYearId}
            label="Academic Year"
            options={academicYearOptions}
            handleChangeAdvance={handleChangeAdvance}
            required
          />
        </Grid>
        <Grid item xs={12} md={2}>
          <CustomAutocomplete
            name="school_Id"
            label="School"
            value={values.school_Id}
            options={schoolOptions}
            handleChangeAdvance={handleChangeAdvance}
            disabled={!values.acYearId}
          />
        </Grid>

        <Grid item xs={12} md={2}>
          <CustomAutocomplete
            name="programId"
            label="Program"
            options={programOptions}
            handleChangeAdvance={handleChangeAdvance}
            value={values.programId}
            disabled={!values.school_Id}
          />
        </Grid>
        <Grid item xs={12} md={2}>
          <CustomAutocomplete
            name="yearSem"
            label="Year/Sem"
            value={values.yearSem}
            options={yearSemOptions}
            handleChangeAdvance={handleChangeAdvance}
            disabled={!values.programId}
          />
        </Grid>

        <Grid item xs={12} md={2}>
          <CustomAutocomplete
            name="sectionId"
            label="Section"
            value={values.sectionId}
            options={sectionOptions}
            handleChangeAdvance={handleChangeAdvance}
            disabled={!values.yearSem}
          />
        </Grid>
        <Grid item xs={12} md={2} textAlign="right">
          <Button
            onClick={() => navigate("/TimeTableMaster/SectionAssignmentForm/New")}
            variant="contained"
            disableElevation
            sx={{
              borderRadius: 2,
            }}
            startIcon={<AddIcon />}
          >
            Create
          </Button>
        </Grid>
        <Grid item xs={12} md={12}>

          <GridIndex
            rows={rows}
            columns={columns}
            getRowClassName={(params) => {
              return params.row.count_of_students === null ? classes.red : "";
            }}
          />
        </Grid>
      </Grid>
    </Box>
  );
}

export default SectionAssignmentIndex;
