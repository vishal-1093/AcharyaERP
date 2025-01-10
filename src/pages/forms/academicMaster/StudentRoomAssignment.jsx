import { useEffect, useMemo, useState } from "react";
import axios from "../../../services/Api";
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Grid,
  Paper,
  styled,
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Typography,
} from "@mui/material";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";

const StyledTableHeadCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.headerWhite.main,
    border: "1px solid rgba(224, 224, 224, 1)",
    textAlign: "center",
  },
}));

const StyledTableCellBody = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.body}`]: {
    border: "1px solid rgba(224, 224, 224, 1)",
  },
}));

const initialValues = { rowData: [], searchText: "", sectionName: "" };

function StudentRoomAssignment({
  rowData,
  getData,
  setAlertMessage,
  setAlertOpen,
  setWrapperOpen,
}) {
  const [values, setValues] = useState(initialValues);
  const [sectionOptions, setSectionOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [apiLoading, setApiLoading] = useState(false);
  const [updateData, setUpdateData] = useState([]);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    filterSectionData();
  }, [values.sectionName]);

  const filteredAndSortedRows = useMemo(() => {
    const { rowData, searchText } = values;
    let filteredRows = rowData.filter((row) =>
      Object.values(row).some((value) =>
        String(value).toLowerCase().includes(searchText.toLowerCase())
      )
    );

    if (orderBy) {
      filteredRows.sort((a, b) => {
        if (a[orderBy] < b[orderBy]) return order === "asc" ? -1 : 1;
        if (a[orderBy] > b[orderBy]) return order === "asc" ? 1 : -1;
        return 0;
      });
    }

    return filteredRows;
  }, [values, order, orderBy]);

  const fetchData = async () => {
    const {
      program_specialization_id: splId,
      current_sem: sem,
      current_year: year,
      course_assignment_id: courseId,
      internal_student_assignment_id: studentAssignmentId,
      date_of_exam: date,
      time_slots_id: timeSlotId,
      internal_session_id: internalId,
    } = rowData;
    try {
      setApiLoading(true);
      const [response, assignedResponse, stdResponse] = await Promise.all([
        axios.get(
          `/api/academic/getStudentDataByCourseAssignmentId/${splId}/${sem}/${year}/${courseId}`
        ),
        axios.get(
          `/api/academic/internalStudentIdsBasedOnDateAndTimeSlots/${date}/${timeSlotId}`
        ),
        studentAssignmentId !== null
          ? axios.get(
              `/api/academic/internalStudentAssignment/${studentAssignmentId}`
            )
          : null,
      ]);

      const responseData = response.data.data;
      const stdResponseData = stdResponse?.data?.data;
      const stdAssignedData = assignedResponse?.data?.data;

      const assignedStdList = {};
      stdAssignedData.forEach((obj) => {
        const stdList = obj.student_ids
          ?.split(",")
          .filter((item) => item.trim() !== "");
        if (stdList) {
          stdList.forEach((item) => {
            assignedStdList[item] = obj.internal_session_id;
          });
        }
      });

      const data = [];
      const sectionList = [];
      responseData.forEach((obj) => {
        const {
          student_id: studentId,
          student_name: studentName,
          auid,
          section_name: section,
          usn,
        } = obj;
        if (
          Object.keys(assignedStdList).includes(studentId.toString()) ===
            false ||
          assignedStdList[studentId] === internalId
        )
          data.push({
            studentId,
            studentName,
            auid,
            status: assignedStdList[studentId] === internalId,
            section,
            usn,
          });

        if (section && !sectionList.includes(section)) {
          sectionList.push(section);
        }
      });
      const optionData = [];
      sectionList.forEach((obj) => {
        optionData.push({ label: obj, value: obj });
      });

      setValues((prev) => ({
        ...prev,
        ["rowData"]: data,
      }));
      setUpdateData(stdResponseData);
      setSectionOptions(optionData);
    } catch (err) {
      console.error(err);
      setAlertMessage({
        severity: "error",
        message: err.response?.data?.message || "Failed to load data !!",
      });
      setAlertOpen(true);
      setWrapperOpen(false);
    } finally {
      setApiLoading(false);
    }
  };

  const filterSectionData = () => {
    const { rowData, sectionName } = values;
    const data = values.rowData.filter((obj) => obj.section === sectionName);
    setValues((prev) => ({
      ...prev,
      ["rowData"]: data,
    }));
  };
  const handleSort = (property) => {
    const isAscending = orderBy === property && order === "asc";
    setOrder(isAscending ? "desc" : "asc");
    setOrderBy(property);
  };

  console.log("values :>> ", values);
  const handleChangeStatus = (e) => {
    const { name, checked } = e.target;
    const [field, index] = name.split("-");
    const studentId = Number(index);
    setValues((prev) => ({
      ...prev,
      ["rowData"]: prev.rowData.map((obj) =>
        obj.studentId === studentId ? { ...obj, [field]: checked } : obj
      ),
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleChangeAdvance = (name, newValue) => {
    setValues((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const validate = () => {
    const filter = values.rowData?.filter((obj) => obj.status === true);
    if (filter.length === 0) return false;
    return true;
  };

  const handleCreate = async () => {
    try {
      setLoading(true);
      const {
        id,
        internal_session_id: sessionId,
        internal_student_assignment_id: studentAssignmentId,
      } = rowData;

      const studentIds = [];

      values.rowData.forEach((obj) => {
        if (obj.status === true) {
          studentIds.push(obj.studentId);
        }
      });

      let response;
      if (studentAssignmentId) {
        const putData = {
          ...updateData,
          student_ids: studentIds.join(","),
        };
        response = await axios.put(
          `/api/academic/internalStudentAssignment/${studentAssignmentId}`,
          putData
        );
      } else {
        const postData = {
          active: true,
          student_ids: studentIds.join(","),
          internal_room_assignment_id: id,
          internal_session_id: sessionId,
        };

        response = await axios.post(
          "/api/academic/internalStudentAssignment",
          postData
        );
      }

      if (response.data.success) {
        setAlertMessage({
          severity: "success",
          message: "Students have been assigned to the room successfully!",
        });
        setAlertOpen(true);
        getData();
      }
    } catch (err) {
      setAlertMessage({
        severity: "error",
        message: err.response?.data?.message || "Something went wrong!",
      });
      setAlertOpen(true);
    } finally {
      setLoading(false);
      setWrapperOpen(false);
    }
  };

  if (apiLoading) {
    return (
      <Typography
        variant="subtitle2"
        color="error"
        sx={{ textAlign: "center" }}
      >
        Please wait ....
      </Typography>
    );
  }

  const DisplayTableCell = ({ label, align = "left" }) => (
    <StyledTableCellBody sx={{ textAlign: align }}>
      <Typography variant="subtitle2" color="textSecondary">
        {label}
      </Typography>
    </StyledTableCellBody>
  );

  return (
    <Box sx={{ padding: 2 }}>
      <Grid container rowSpacing={3}>
        {values.rowData.length > 0 ? (
          <>
            <Grid item xs={12} mt={2} align="right">
              <Box sx={{ display: "flex", gap: 2, justifyContent: "right" }}>
                <Box sx={{ width: "30%" }}>
                  <CustomAutocomplete
                    name="sectionName"
                    label="Section"
                    value={values.sectionName}
                    options={sectionOptions}
                    handleChangeAdvance={handleChangeAdvance}
                  />
                </Box>
                <Box sx={{ width: "30%" }}>
                  <CustomTextField
                    name="searchText"
                    label="Search..."
                    value={values.searchText}
                    handleChange={handleChange}
                  />
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <TableContainer component={Paper}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <StyledTableHeadCell />
                      <StyledTableHeadCell>
                        <TableSortLabel
                          active={orderBy === "studentName"}
                          direction={orderBy === "studentName" ? order : "asc"}
                          onClick={() => handleSort("studentName")}
                          sx={{
                            color: "white",
                            "&:hover": { color: "white" },
                            "&.Mui-active": { color: "white" },
                            "& .MuiTableSortLabel-icon": {
                              color: "white",
                            },
                            "&:hover .MuiTableSortLabel-icon": {
                              color: "lightgray",
                            },
                          }}
                        >
                          Student Name
                        </TableSortLabel>
                      </StyledTableHeadCell>
                      <StyledTableHeadCell>
                        <TableSortLabel
                          active={orderBy === "auid"}
                          direction={orderBy === "auid" ? order : "asc"}
                          onClick={() => handleSort("auid")}
                          sx={{
                            color: "white",
                            "&:hover": { color: "white" },
                            "&.Mui-active": { color: "white" },
                            "& .MuiTableSortLabel-icon": {
                              color: "white",
                            },
                            "&:hover .MuiTableSortLabel-icon": {
                              color: "lightgray",
                            },
                          }}
                        >
                          AUID
                        </TableSortLabel>
                      </StyledTableHeadCell>
                      <StyledTableHeadCell>
                        <TableSortLabel
                          active={orderBy === "section_name"}
                          direction={orderBy === "section_name" ? order : "asc"}
                          onClick={() => handleSort("section_name")}
                          sx={{
                            color: "white",
                            "&:hover": { color: "white" },
                            "&.Mui-active": { color: "white" },
                            "& .MuiTableSortLabel-icon": {
                              color: "white",
                            },
                            "&:hover .MuiTableSortLabel-icon": {
                              color: "lightgray",
                            },
                          }}
                        >
                          Section
                        </TableSortLabel>
                      </StyledTableHeadCell>
                      <StyledTableHeadCell>
                        <TableSortLabel
                          active={orderBy === "section_name"}
                          direction={orderBy === "section_name" ? order : "asc"}
                          onClick={() => handleSort("section_name")}
                          sx={{
                            color: "white",
                            "&:hover": { color: "white" },
                            "&.Mui-active": { color: "white" },
                            "& .MuiTableSortLabel-icon": {
                              color: "white",
                            },
                            "&:hover .MuiTableSortLabel-icon": {
                              color: "lightgray",
                            },
                          }}
                        >
                          USN
                        </TableSortLabel>
                      </StyledTableHeadCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {filteredAndSortedRows.map((obj, i) => (
                      <TableRow key={i}>
                        <StyledTableCellBody sx={{ width: "3%" }}>
                          <Checkbox
                            name={`status-${obj.studentId}`}
                            onChange={handleChangeStatus}
                            checked={obj.status}
                            sx={{
                              padding: 0,
                            }}
                          />
                        </StyledTableCellBody>
                        <DisplayTableCell label={obj.studentName} />
                        <DisplayTableCell label={obj.auid} />
                        <DisplayTableCell label={obj.section} />
                        <DisplayTableCell label={obj.usn} />
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </>
        ) : (
          <Grid item xs={12}>
            <Typography
              variant="subtitle2"
              color="error"
              sx={{ textAlign: "center" }}
            >
              No Students.
            </Typography>
          </Grid>
        )}

        {values.rowData.length > 0 && (
          <Grid item xs={12} align="right">
            <Button
              variant="contained"
              onClick={handleCreate}
              disabled={
                loading ||
                (rowData.internal_student_assignment_id === null && !validate())
              }
            >
              {loading ? (
                <CircularProgress
                  size={25}
                  color="blue"
                  style={{ margin: "2px 13px" }}
                />
              ) : (
                <Typography variant="subtitle2">Assign</Typography>
              )}
            </Button>
          </Grid>
        )}
      </Grid>
    </Box>
  );
}

export default StudentRoomAssignment;
