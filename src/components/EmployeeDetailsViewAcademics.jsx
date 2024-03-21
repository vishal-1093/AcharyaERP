import React, { useEffect } from "react";
import { useState } from "react";
import {
  Grid,
  Tabs,
  Tab,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  styled,
  tableCellClasses,
  IconButton,
  Typography,
} from "@mui/material";
import axios from "../services/Api";
import { useParams } from "react-router";
import CustomModal from "./CustomModal";
import { Check, HighlightOff } from "@mui/icons-material";
import { makeStyles } from "@mui/styles";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import ModalWrapper from "./ModalWrapper";
import OverlayLoader from "./OverlayLoader";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.headerWhite.main,
    border: "1px solid rgba(224, 224, 224, 1)",
    textAlign: "center",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    border: "1px solid rgba(224, 224, 224, 1)",
  },
}));
const CustomTabs = styled(Tabs)({
  "& .MuiTabs-flexContainer": {
    flexDirection: "column",
  },
});

const useStyles = makeStyles((theme) => ({
  table: {
    "& .MuiTableCell-root": {
      borderLeft: "1px solid rgba(224, 224, 224, 1)",
      textAlign: "center",
    },
  },
  bg: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.headerWhite.main,
    textAlign: "center",
  },
}));

const CustomTab = styled(Tab)(({ theme }) => ({
  fontSize: "14px",
  transition: "background-color 0.3s",
  backgroundColor: "rgba(74, 87, 169, 0.1)",
  color: "#46464E",
  "&.Mui-selected": {
    backgroundColor: "rgba(74, 87, 169, 0.2)",
    color: "orange",
  },
  "&:hover": {
    backgroundColor: "rgba(74, 87, 169, 0.2)",
  },
  [theme.breakpoints.up("xs")]: {
    fontSize: "11px",
  },
  [theme.breakpoints.up("sm")]: {
    fontSize: "12px",
  },
  [theme.breakpoints.up("md")]: {
    fontSize: "14px",
  },
  [theme.breakpoints.up("lg")]: {
    fontSize: "14px",
  },
}));

const EmployeeDetailsViewAcademics = () => {
  const [courses, setCourses] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const { userId } = useParams();
  const classes = useStyles();
  const empId = userId;
  const empIds = localStorage.getItem("empId");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
    buttons: [],
  });
  useEffect(() => {
    getCourses();
  }, []);
  const [syllabusData, setSyllabusData] = useState([]);
  const [loading, setLoading] = useState(false);

  const getCourses = async () => {
    await axios
      .get(`/api/academic/getCourseDetailsData/${empId ? empId : empIds}`)
      .then((res) => {
        setCourses(res.data.data);
      })
      .catch((err) => console.error(err));
  };
  const handleSubTabChange = (event, newValue) => {
    setSubTab(newValue);
    // setIsEditing(false);
  };
  const [subTab, setSubTab] = useState("Courses");

  const openSyllabusModal = async ({ courseId }) => {
    setIsModalOpen(true);
    if (courseId) {
      await getCourseSyllabusData(courseId);
    }
  };
  const getCourseSyllabusData = async (courseId) => {
    setLoading(true);
    await axios
      .get(`/api/academic/getSyllabusByCourseAssignmentId/${courseId}`)
      .then((res) => {
        setSyllabusData(res.data.data);
      });
    setLoading(false).catch((err) => {
      console.error(err);
      setLoading(false);
    });
  };
  const modalData = () => {
    return (
      <>
        {loading ? (
          <Grid item xs={12} align="center">
            <OverlayLoader />
          </Grid>
        ) : (
          <TableContainer elevation={3} sx={{ maxWidth: 1300 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <StyledTableCell>Topic</StyledTableCell>
                  <StyledTableCell>Module</StyledTableCell>
                  <StyledTableCell>learning Process</StyledTableCell>
                  <StyledTableCell>Duration</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {syllabusData.length > 0 ? (
                  syllabusData.map((obj, i) => {
                    return (
                      <TableRow key={i}>
                        <StyledTableCell>
                          <Typography variant="subtitle2" color="textSecondary">
                            {obj?.topic_name ? obj?.topic_name : "--"}
                          </Typography>
                        </StyledTableCell>
                        <StyledTableCell>
                          <Typography variant="subtitle2" color="textSecondary">
                            {obj?.syllabus_objective
                              ? obj?.syllabus_objective
                              : "--"}
                          </Typography>
                        </StyledTableCell>
                        <StyledTableCell>
                          <Typography variant="subtitle2" color="textSecondary">
                            {obj?.learning ? obj?.learning : "--"}
                          </Typography>
                        </StyledTableCell>
                        <StyledTableCell>
                          <Typography
                            style={{ textAlign: "center" }}
                            variant="subtitle2"
                            color="textSecondary"
                          >
                            {obj?.duration ? obj?.duration : "--"}
                          </Typography>
                        </StyledTableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} sx={{ textAlign: "center" }}>
                      <Typography variant="subtitle2">No Records</Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}{" "}
      </>
    );
  };

  const handleActive = async (id, active) => {
    //const id = params?.course_id;
    setModalOpen(true);
    const handleToggle = async () => {
      if (active == 1) {
        axios
          .delete(`/api/academic/SubjectAssignment/${id}`)
          .then((res) => {
            if (res.status === 200) {
              getCourses();
            }
          })
          .catch((err) => console.error(err));
      } else {
        axios
          .delete(`/api/academic/SubjectAssignment/${id}`)
          .then((res) => {
            if (res.status === 200) {
              getCourses();
            }
          })
          .catch((err) => console.error(err));
      }
    };
    active == 1
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
      <Grid container spacing={2} columnSpacing={4} sx={{ marginTop: "1px" }}>
        <Grid item xs={4} md={2}>
          <CustomTabs
            value={subTab}
            onChange={handleSubTabChange}
            orientation="vertical"
            variant="scrollable"
            className="customTabs"
          >
            <CustomTab value="Courses" label="My Courses" />
            <CustomTab value="Feedback" label="Feedback" />
          </CustomTabs>
        </Grid>
        <ModalWrapper
          open={isModalOpen}
          setOpen={setIsModalOpen}
          maxWidth={980}
          title={`Syllabus Details`}
        >
          {modalData()}
        </ModalWrapper>
        {/* <GridIndex rows={courses} columns={columns} /> */}
        <Grid item xs={8} md={10}>
          <Grid item xs={12}>
            <TableContainer component={Paper}>
              <Table size="small">
                <TableHead className={classes.bg}>
                  <TableRow>
                    <StyledTableCell
                      sx={{ color: "white", textAlign: "center" }}
                    >
                      Course Name
                    </StyledTableCell>
                    <StyledTableCell
                      sx={{ color: "white", textAlign: "center" }}
                    >
                      Course Code
                    </StyledTableCell>
                    <StyledTableCell
                      sx={{ color: "white", textAlign: "center" }}
                    >
                      Sem
                    </StyledTableCell>
                    <StyledTableCell
                      sx={{ color: "white", textAlign: "center" }}
                    >
                      Active
                    </StyledTableCell>

                    <StyledTableCell
                      sx={{ color: "white", textAlign: "center" }}
                    >
                      Syllabus
                    </StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {courses.length > 0 ? (
                    courses.map((obj, i) => {
                      return (
                        <TableRow key={i}>
                          <StyledTableCell
                            sx={{ width: 100, textAlign: "center" }}
                          >
                            {obj.course_name}
                          </StyledTableCell>
                          <StyledTableCell
                            sx={{ width: 100, textAlign: "center" }}
                          >
                            {obj.course_assignment_coursecode}
                          </StyledTableCell>
                          <StyledTableCell
                            sx={{ width: 100, textAlign: "center" }}
                          >
                            {obj.year_sem}
                          </StyledTableCell>
                          <StyledTableCell
                            sx={{ width: 100, textAlign: "center" }}
                          >
                            <IconButton
                              style={{
                                color: obj.active ? "green" : "red",
                              }}
                              onClick={() =>
                                handleActive(obj.subjet_assign_id, obj.active)
                              }
                            >
                              {obj.active ? <Check /> : <HighlightOff />}
                            </IconButton>
                          </StyledTableCell>
                          <StyledTableCell
                            sx={{ width: 100, textAlign: "center" }}
                          >
                            <IconButton
                              color="primary"
                              style={{ cursor: "pointer" }}
                              onClick={() =>
                                openSyllabusModal({
                                  courseId: obj?.course_id,
                                })
                              }
                            >
                              <RemoveRedEyeIcon fontSize="small" />
                            </IconButton>
                          </StyledTableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <></>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default EmployeeDetailsViewAcademics;
