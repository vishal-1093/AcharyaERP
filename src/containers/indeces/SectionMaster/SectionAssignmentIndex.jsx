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
} from "@mui/material";
import { Check, HighlightOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import CustomModal from "../../../components/CustomModal";
import axios from "../../../services/Api";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import ModalWrapper from "../../../components/ModalWrapper";
import { makeStyles } from "@mui/styles";
const label = { inputProps: { "aria-label": "Checkbox demo" } };

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
    textAlign: "center",
  },
}));

const initialValues = {
  studentId: "",
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

  const navigate = useNavigate();
  const classes = useStyles();

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    await axios
      .get(
        `/api/academic/fetchAllSectionAssignmentDetails?page=${0}&page_size=${100}&sort=created_date`
      )
      .then((res) => {
        setRows(res.data.data.Paginated_data.content);
      })
      .catch((err) => console.error(err));
  };

  const handleAdd = async (params) => {
    setStudentsOpen(true);
    await axios
      .get(
        `/api/student/fetchAllStudentDetailForSectionAssignmentFromIndex/${params.row.ac_year_id}/${params.row.school_id}/${params.row.program_id}/${params.row.program_specialization_id}/${params.row.current_year_sem}`
      )
      .then((res) => {
        setStudentDetails(res.data.data);
      })
      .catch((err) => console.error(err));
  };

  const handleChange = (e) => {
    const { name, checked } = e.target;

    if (name === "selectAll" && checked === true) {
      let tempUser = studentDetails.map((test) => {
        return { ...test, isChecked: checked };
      });
      setStudentDetails(tempUser);

      setValues({
        ...values,
        studentId: studentDetails.map((obj) => obj.student_id),
      });
    } else if (name === "selectAll" && checked === false) {
      let tempUser = studentDetails.map((test) => {
        return { ...test, isChecked: checked };
      });
      setStudentDetails(tempUser);

      setValues({
        ...values,
        studentId: [],
      });
    } else if (name !== "selectAll" && checked === true) {
      let temp = studentDetails.map((obj) => {
        return obj.student_id.toString() === name
          ? { ...obj, isChecked: checked }
          : obj;
      });
      setStudentDetails(temp);
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
      let temp = studentDetails.map((obj) => {
        return obj.student_id.toString() === name
          ? { ...obj, isChecked: checked }
          : obj;
      });
      setStudentDetails(temp);

      const existData = [];

      values.studentId.map((obj) => {
        existData.push(obj);
      });

      const index = existData.indexOf(e.target.value);

      if (index === -1) {
        existData.splice(index, 1);
      }

      setValues({
        ...values,
        studentId: existData,
      });
    }
  };
  const handleSubmit = () => {
    console.log(values.studentId);
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
          });
      } else {
        await axios
          .delete(`/api/academic/activateSectionAssignment/${id}`)
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
      valueGetter: (params) => new Date(params.row.created_date),
      hide: true,
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
                `/SectionMaster/SectionAssignmentUpdate/${params.row.id}`
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
      <ModalWrapper open={studentsOpen} setOpen={setStudentsOpen}>
        <Grid container>
          <Grid item xs={12} md={12} mt={2.5}>
            <TableContainer component={Paper}>
              <Table size="small" className={classes.table}>
                <TableHead>
                  <TableRow className={classes.bg}>
                    <TableCell></TableCell>
                    <TableCell sx={{ color: "white", textAlign: "center" }}>
                      Student Name
                    </TableCell>
                    <TableCell sx={{ color: "white", textAlign: "center" }}>
                      AUID
                    </TableCell>
                    <TableCell sx={{ color: "white", textAlign: "center" }}>
                      USN
                    </TableCell>
                    <TableCell sx={{ color: "white", textAlign: "center" }}>
                      Section
                    </TableCell>
                    <TableCell sx={{ color: "white", textAlign: "center" }}>
                      Status
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {studentDetails.map((val, i) => (
                    <TableRow key={i} style={{ height: 10 }}>
                      <TableCell sx={{ textAlign: "center" }}>
                        {val.section_id === null ? (
                          <Checkbox
                            {...label}
                            name={val.student_id}
                            value={val.studentId}
                            onChange={handleChange}
                            checked={val?.isChecked || false}
                          />
                        ) : (
                          "Assigned"
                        )}
                      </TableCell>
                      <TableCell sx={{ textAlign: "center" }}>
                        {val.student_name}
                      </TableCell>
                      <TableCell sx={{ textAlign: "center" }}>
                        {val.auid}
                      </TableCell>
                      <TableCell sx={{ textAlign: "center" }}>
                        {val.usn}
                      </TableCell>
                      <TableCell sx={{ textAlign: "center" }}>
                        {val.section_id}
                      </TableCell>
                      <TableCell sx={{ textAlign: "center" }}>
                        {val.eligible_reported_status}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
          <Grid item xs={12} md={4} mt={2}>
            <Button variant="contained" onClick={handleSubmit}>
              Create
            </Button>
          </Grid>
        </Grid>
      </ModalWrapper>
      <Button
        onClick={() => navigate("/SectionMaster/SectionAssignmentForm/New")}
        variant="contained"
        disableElevation
        sx={{ position: "absolute", right: 0, top: -57, borderRadius: 2 }}
        startIcon={<AddIcon />}
      >
        Create
      </Button>
      <GridIndex rows={rows} columns={columns} />
    </Box>
  );
}

export default SectionAssignmentIndex;
