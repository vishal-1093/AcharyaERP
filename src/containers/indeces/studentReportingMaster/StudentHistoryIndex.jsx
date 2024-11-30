import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Button,
  IconButton,
  Grid,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableCell,
  TableBody,
  Collapse,
  TableRow,
} from "@mui/material";
import ExpandMoreOutlinedIcon from "@mui/icons-material/ExpandMoreOutlined";
import KeyboardArrowUpOutlinedIcon from "@mui/icons-material/KeyboardArrowUpOutlined";
import AddIcon from "@mui/icons-material/Add";
import axios from "../../../services/Api";
import { makeStyles } from "@mui/styles";
import moment from "moment";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";

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

function StudentHistoryIndex() {
  const [rows, setRows] = useState([]);
  const [studentDetails, setStudentDetails] = useState([]);
  const [studentDetailsOpen, setStudentDetailsOpen] = useState(false);

  const { schoolId } = useParams();
  const { programId } = useParams();
  const { yearsemId } = useParams();
  const { currentYearSem } = useParams();
  const classes = useStyles();
  const navigate = useNavigate();
  const setCrumbs = useBreadcrumbs();

  useEffect(() => {
    getData();
    setCrumbs([{ name: "Report Index", link: "/ReportMaster/History" }]);
  }, []);

  const handleDetails = async (id) => {
    setStudentDetailsOpen((prev) => ({
      ...prev,
      [id]: studentDetailsOpen[id] === true ? false : true,
    }));
    await axios(`/api/student/reportingStudentsHistoryByStudentId/${id}`)
      .then((res) => {
        setStudentDetails(res.data.data);
      })
      .catch((err) => console.error(err));
  };

  const getData = async () => {
    if (parseInt(currentYearSem) === 1) {
      await axios(
        `/api/student/getAllStudentDetailsForHistoryIndex?school_id=${schoolId}&program_id=${programId}&current_year=${yearsemId}`
      )
        .then((res) => {
          setRows(res.data.data);
        })
        .catch((err) => console.error(err));
    } else {
      await axios(
        `/api/student/getAllStudentDetailsForHistoryIndex?school_id=${schoolId}&program_id=${programId}&current_sem=${yearsemId}`
      )
        .then((res) => {
          setRows(res.data.data);
        })
        .catch((err) => console.error(err));
    }
  };

  return (
    <>
      <Grid container justifyContent="center">
        <Grid item xd={12} md={12} mt={2}>
          <TableContainer component={Paper}>
            <Table className={classes.table} size="small">
              <TableHead className={classes.bg}>
                <TableRow>
                  <TableCell></TableCell>
                  <TableCell
                    sx={{
                      color: "white",
                      textAlign: "center",
                    }}
                  >
                    Student Name
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "white",
                      textAlign: "center",
                    }}
                  >
                    AUID
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "white",
                      textAlign: "center",
                    }}
                  >
                    USN
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "white",
                      textAlign: "center",
                    }}
                  >
                    Year/Sem
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "white",
                      textAlign: "center",
                    }}
                  >
                    Reporting Date
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "white",
                      textAlign: "center",
                    }}
                  >
                    Remarks
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody className={classes.table}>
                {rows.map((obj, i) => {
                  return (
                    <>
                      <TableRow key={i}>
                        <TableCell>
                          <IconButton
                            onClick={() => handleDetails(obj.student_id)}
                          >
                            {studentDetailsOpen[obj.student_id] ? (
                              <KeyboardArrowUpOutlinedIcon />
                            ) : (
                              <ExpandMoreOutlinedIcon />
                            )}
                          </IconButton>
                        </TableCell>
                        <TableCell>{obj.student_name}</TableCell>
                        <TableCell>{obj.auid}</TableCell>
                        <TableCell>{obj.usn}</TableCell>
                        <TableCell>
                          {currentYearSem === "1"
                            ? obj.current_year
                            : obj.current_sem}
                        </TableCell>
                        <TableCell>
                          {obj.reporting_date
                            ? moment(obj.reporting_date).format("DD-MM-YYYY")
                            : ""}
                        </TableCell>
                        <TableCell>{obj.remarks}</TableCell>
                      </TableRow>
                      <TableCell
                        style={{ paddingBottom: 0, paddingTop: 0 }}
                        colSpan={7}
                      >
                        <Collapse
                          in={studentDetailsOpen[obj.student_id]}
                          timeout="auto"
                          unmountOnExit
                        >
                          <Box sx={{ margin: 1 }}>
                            <TableContainer component={Paper}>
                              <Table size="small" className={classes.table}>
                                <TableHead className={classes.bg}>
                                  <TableRow>
                                    <TableCell
                                      sx={{
                                        color: "white",
                                        textAlign: "center",
                                      }}
                                    >
                                      Student Name
                                    </TableCell>
                                    <TableCell
                                      sx={{
                                        color: "white",
                                        textAlign: "center",
                                      }}
                                    >
                                      AUID
                                    </TableCell>
                                    <TableCell
                                      sx={{
                                        color: "white",
                                        textAlign: "center",
                                      }}
                                    >
                                      USN
                                    </TableCell>
                                    <TableCell
                                      sx={{
                                        color: "white",
                                        textAlign: "center",
                                      }}
                                    >
                                      Year/Sem
                                    </TableCell>
                                    <TableCell
                                      sx={{
                                        color: "white",
                                        textAlign: "center",
                                      }}
                                    >
                                      Reporting Date
                                    </TableCell>
                                    <TableCell
                                      sx={{
                                        color: "white",
                                        textAlign: "center",
                                      }}
                                    >
                                      Remarks
                                    </TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {studentDetails.map((val, i) => {
                                    return (
                                      <TableRow key={i}>
                                        <TableCell>
                                          {val.student_name}
                                        </TableCell>
                                        <TableCell>{val.auid}</TableCell>
                                        <TableCell>{val.usn}</TableCell>
                                        <TableCell>
                                          {currentYearSem === "1"
                                            ? obj.current_year
                                            : obj.current_sem}
                                        </TableCell>
                                        <TableCell>
                                          {obj.reporting_date
                                            ? moment(obj.reporting_date).format(
                                                "DD-MM-YYYY"
                                              )
                                            : ""}
                                        </TableCell>
                                        <TableCell>{val.remarks}</TableCell>
                                      </TableRow>
                                    );
                                  })}
                                </TableBody>
                              </Table>
                            </TableContainer>
                          </Box>
                        </Collapse>
                      </TableCell>
                    </>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </>
  );
}

export default StudentHistoryIndex;
