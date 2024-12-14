import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
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
  CircularProgress,
  Snackbar,
  Alert,
  Skeleton,
  Typography,
} from "@mui/material";
import ExpandMoreOutlinedIcon from "@mui/icons-material/ExpandMoreOutlined";
import KeyboardArrowUpOutlinedIcon from "@mui/icons-material/KeyboardArrowUpOutlined";
import axios from "../../../services/Api";
import { makeStyles } from "@mui/styles";
import moment from "moment";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";

// Reusable TableHeader component
const TableHeader = () => (
  <TableHead style={{ backgroundColor: "#edeff7", color: "white" }}>
    <TableRow>
      <TableCell sx={{ width: "8%" }}></TableCell>
      <TableCell sx={{ textAlign: "center", width: "10%" }}>
        Student Name
      </TableCell>
      <TableCell sx={{ textAlign: "center", width: "10%" }}>AUID</TableCell>
      <TableCell sx={{ textAlign: "center", width: "10%" }}>USN</TableCell>
      <TableCell sx={{ textAlign: "center", width: "10%" }}>Year/Sem</TableCell>
      <TableCell sx={{ textAlign: "center", width: "10%" }}>
        Reporting Date
      </TableCell>
      <TableCell sx={{ textAlign: "center", width: "10%" }}>
        Created Date
      </TableCell>
      <TableCell sx={{ textAlign: "center", width: "10%" }}>
        Created By
      </TableCell>
      <TableCell sx={{ textAlign: "center", width: "10%" }}>Status</TableCell>
      <TableCell sx={{ textAlign: "center", width: "20%" }}>Remarks</TableCell>
    </TableRow>
  </TableHead>
);

const useStyles = makeStyles((theme) => ({
  table: {
    "& .MuiTableCell-root": {
      borderLeft: "1px solid rgba(224, 224, 224, 1)",
      textAlign: "center",
      padding: "8px",
    },
    "& .MuiTableRow-root:hover": {
      backgroundColor: "#f4f6f8",
    },
  },
  tableCell: {
    fontSize: "14px", // Adjust font size
  },
  header: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
  },
  collapseContainer: {
    margin: "10px 0",
  },
  skeleton: {
    marginTop: "10px",
  },
  errorAlert: {
    position: "absolute",
    top: "10%",
    right: "10%",
    zIndex: 1000,
  },
  iconButton: {
    color: theme.palette.primary.main,
  },
  statusCell: {
    fontWeight: "bold",
    color: theme.palette.success.main,
  },
  remarksCell: {
    fontStyle: "italic",
  },
}));

const ELIGIBLE_REPORTED_STATUS = {
  1: "No status",
  2: "Not Eligible",
  3: "Eligible",
  4: "Not Reported",
  5: "Pass Out",
  6: "Promoted",
};

function StudentHistoryIndex() {
  const [rows, setRows] = useState([]);
  const [studentDetails, setStudentDetails] = useState([]);
  const [studentDetailsOpen, setStudentDetailsOpen] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { schoolId, programId, yearsemId, currentYearSem } = useParams();
  const classes = useStyles();
  const setCrumbs = useBreadcrumbs();

  useEffect(() => {
    getData();
    setCrumbs([{ name: "Report Index", link: "/ReportMaster/History" }]);
  }, []);

  const handleDetails = async (id) => {
    setStudentDetailsOpen((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
    try {
      const res = await axios(
        `/api/student/reportingStudentsHistoryByStudentId/${id}`
      );
      setStudentDetails(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const getData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios(
        `/api/student/getAllStudentDetailsForHistoryIndex?school_id=${schoolId}&program_id=${programId}&current_year=${
          currentYearSem === "1" ? yearsemId : ""
        }&current_sem=${currentYearSem !== "1" ? yearsemId : ""}`
      );
      setRows(res.data.data);
    } catch (err) {
      setError("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {error && (
        <Snackbar
          open={Boolean(error)}
          autoHideDuration={6000}
          onClose={() => setError(null)}
          className={classes.errorAlert}
        >
          <Alert onClose={() => setError(null)} severity="error">
            {error}
          </Alert>
        </Snackbar>
      )}
      <Grid container justifyContent="center">
        <Grid item xs={12} md={12} mt={2}>
          {loading ? (
            <CircularProgress />
          ) : (
            <TableContainer component={Paper}>
              <Table className={classes.table} size="small">
                <TableHeader />
                <TableBody>
                  {rows.map((obj, i) => (
                    <React.Fragment key={i}>
                      <TableRow>
                        <TableCell>
                          <IconButton
                            className={classes.iconButton}
                            onClick={() => handleDetails(obj.student_id)}
                          >
                            {studentDetailsOpen[obj.student_id] ? (
                              <KeyboardArrowUpOutlinedIcon />
                            ) : (
                              <ExpandMoreOutlinedIcon />
                            )}
                          </IconButton>
                        </TableCell>
                        <TableCell className={classes.tableCell}>
                          {obj.student_name}
                        </TableCell>
                        <TableCell className={classes.tableCell}>
                          {obj.auid}
                        </TableCell>
                        <TableCell className={classes.tableCell}>
                          {obj.usn}
                        </TableCell>
                        <TableCell
                          className={classes.tableCell}
                        >{`${obj.current_year}/${obj.current_sem}`}</TableCell>
                        <TableCell className={classes.tableCell}>
                          {obj.reporting_date
                            ? moment(obj.reporting_date).format("DD-MM-YYYY")
                            : ""}
                        </TableCell>
                        <TableCell className={classes.tableCell}>
                          {obj.modified_date
                            ? moment(obj.modified_date).format("DD-MM-YYYY")
                            : ""}
                        </TableCell>
                        <TableCell className={classes.tableCell}>
                          {obj.modified_username}
                        </TableCell>
                        <TableCell className={classes.statusCell}>
                          {
                            ELIGIBLE_REPORTED_STATUS[
                              obj.eligible_reported_status
                            ]
                          }
                        </TableCell>
                        <TableCell className={classes.remarksCell}>
                          {obj.remarks}
                        </TableCell>
                      </TableRow>
                      <TableCell
                        style={{ paddingBottom: 0, paddingTop: 0 }}
                        colSpan={10}
                      >
                        <Collapse
                          in={studentDetailsOpen[obj.student_id]}
                          timeout="auto"
                          unmountOnExit
                        >
                          <Box
                            sx={{ margin: 1 }}
                            className={classes.collapseContainer}
                          >
                            {studentDetailsOpen[obj.student_id] &&
                            !studentDetails.length ? (
                              <>
                                <Typography variant="subtitle2">
                                  No Records Found
                                </Typography>
                                {/* <Skeleton
                                  variant="rectangular"
                                  width="100%"
                                  height={150}
                                /> */}
                              </>
                            ) : (
                              <TableContainer component={Paper}>
                                <Table size="small" className={classes.table}>
                                  <TableHeader />
                                  <TableBody>
                                    {studentDetails.map((val, i) => (
                                      <TableRow key={i}>
                                        <TableCell></TableCell>
                                        <TableCell>
                                          {val.student_name}
                                        </TableCell>
                                        <TableCell>{val.auid}</TableCell>
                                        <TableCell>{val.usn}</TableCell>
                                        <TableCell>{`${val.current_year}/${val.current_sem}`}</TableCell>
                                        <TableCell>
                                          {val.reporting_date
                                            ? moment(val.reporting_date).format(
                                                "DD-MM-YYYY"
                                              )
                                            : ""}
                                        </TableCell>
                                        <TableCell>
                                          {val.created_date
                                            ? moment(val.created_date).format(
                                                "DD-MM-YYYY"
                                              )
                                            : ""}
                                        </TableCell>
                                        <TableCell>
                                          {val.created_username}
                                        </TableCell>
                                        <TableCell>
                                          {
                                            ELIGIBLE_REPORTED_STATUS[
                                              val.eligible_reported_status
                                            ]
                                          }
                                        </TableCell>
                                        <TableCell>{val.remarks}</TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </TableContainer>
                            )}
                          </Box>
                        </Collapse>
                      </TableCell>
                    </React.Fragment>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Grid>
      </Grid>
    </>
  );
}

export default StudentHistoryIndex;
