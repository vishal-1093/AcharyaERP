import { useEffect, useMemo, useState } from "react";
import axios from "../../../services/Api";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import { useNavigate, useParams } from "react-router-dom";
import useAlert from "../../../hooks/useAlert";
import {
  Box,
  Button,
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
import FormPaperWrapper from "../../../components/FormPaperWrapper";
import CustomModal from "../../../components/CustomModal";
import moment from "moment";

const StyledTableHeadCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.headerWhite.main,
    border: "1px solid rgba(224, 224, 224, 1)",
    textAlign: "center",
  },
}));

const StyledTableHead = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.tableBg.main,
    color: theme.palette.tableBg.textColor,
    border: "1px solid rgba(224, 224, 224, 1)",
    textAlign: "center",
  },
}));

const StyledTableCellBody = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.body}`]: {
    border: "1px solid rgba(224, 224, 224, 1)",
  },
}));

const breadCrumbsList = [
  { name: "Internal Assesment", link: "/internals" },
  { name: "Add Marks" },
];

const initialValues = {
  rowData: [],
};

function InternalMarksForm() {
  const [values, setValues] = useState(initialValues);
  const [data, setData] = useState([]);
  const [internalsData, setInternalsData] = useState([]);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("");
  const [loading, setLoading] = useState(false);
  const [confirmContent, setConfirmContent] = useState({
    title: "",
    message: "",
    buttons: [],
  });
  const [confirmOpen, setConfirmOpen] = useState(false);

  const { id } = useParams();
  const setCrumbs = useBreadcrumbs();
  const { setAlertMessage, setAlertOpen } = useAlert();
  const navigate = useNavigate();

  useEffect(() => {
    getData();
    setCrumbs(breadCrumbsList);
  }, []);

  const getData = async () => {
    try {
      const intRes = await axios.get(
        `/api/academic/internalTimeTableAssignmentDetailsByInternalSessionId/${id}`
      );
      const internalsData = intRes.data.data[0];
      const checkResponse = await axios.get(
        `/api/academic/checkInternalExamAttendanceStatus/${internalsData.id}`
      );
      const attendanceStatusData = checkResponse.data.data;
      if (!attendanceStatusData.attendance_status) {
        setAlertMessage({
          severity: "error",
          message: "Internal attendance could not be found.",
        });
        setAlertOpen(true);
        navigate("/internals");
      }

      const [response, marksRes] = await Promise.all([
        axios.get(`/api/academic/getStudentIdsByInternalSessionId/${id}`),
        axios.get(
          `/api/student/getStudentMarkDetailsByInternalSessionId/${id}`
        ),
      ]);
      const responseData = response.data.data;
      const marksResData = marksRes.data.data;
      if (responseData) {
        const stdRes = await axios.get(
          `/api/student/studentDetailsByStudentIds/${responseData}`
        );
        const stdResData = stdRes.data.data;
        const updateData = [];
        stdResData.forEach((obj) => {
          const {
            student_id: studentId,
            student_name: studentName,
            auid,
            usn,
          } = obj;
          const filterMarks = marksResData.find(
            (obj) => obj.student_id === studentId
          );
          updateData.push({
            studentId,
            studentName,
            auid,
            usn: usn,
            scoredMarks: filterMarks?.marks_obtained_internal || "",
            percentage: filterMarks?.percentage || "",
            isReadOnly: filterMarks?.student_id ? true : false,
            evaluator: filterMarks?.created_username || "",
            evaluationDate: filterMarks?.created_date || "",
          });
        });
        setValues((prev) => ({ ...prev, ["rowData"]: updateData }));
        setData(updateData);
      }
      setInternalsData(internalsData);
    } catch (err) {
      console.error(err);

      setAlertMessage({
        severity: "error",
        message: err.response?.data?.message || "Something went wrong",
      });
      setAlertOpen(true);
    }
  };

  const filteredAndSortedRows = useMemo(() => {
    const { rowData, searchText } = values;
    let filteredRows = rowData.filter(
      (row) =>
        !searchText ||
        Object.values(row).some((value) => {
          if (value === null || value === undefined) return false;
          return String(value).toLowerCase().includes(searchText.toLowerCase());
        })
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleChangeInternal = (e) => {
    const { name, value } = e.target;
    const maxMarks = internalsData.max_marks;
    if (!/^\d*$/.test(value)) return;
    const actualValue = value > maxMarks ? maxMarks : value;
    let percentage = (actualValue / maxMarks) * 100;
    percentage =
      percentage % 1 === 0 ? percentage : parseFloat(percentage.toFixed(2));
    const [field, index] = name.split("-");
    const parsedIndex = parseInt(index, 10);
    setValues((prev) => ({
      ...prev,
      rowData: prev.rowData.map((obj) =>
        obj.studentId === parsedIndex
          ? { ...obj, [field]: actualValue, percentage }
          : obj
      ),
    }));
  };

  const handleSort = (property) => {
    const isAscending = orderBy === property && order === "asc";
    setOrder(isAscending ? "desc" : "asc");
    setOrderBy(property);
  };

  const validate = () => {
    const filter = values.rowData?.filter(
      (obj) => obj.isReadOnly === false && obj.scoredMarks !== ""
    );
    if (filter.length === 0) return false;
    return true;
  };

  const handleCreate = async () => {
    const { rowData } = values;
    try {
      setLoading(true);
      const postData = [];
      rowData.forEach((obj) => {
        const { studentId, percentage } = obj;
        const { max_marks: maxMarks } = internalsData;
        const tempObj = {
          active: true,
          student_id: studentId,
          marks_obtained_internal: obj.scoredMarks,
          total_marks_internal: maxMarks,
          percentage,
          internal_session_id: id,
        };
        postData.push(tempObj);
      });
      const response = await axios.post("/api/student/studentMarks", postData);
      if (response.data.success) {
        setAlertMessage({
          severity: "success",
          message: "Internals marks has been added successfully !!",
        });
        setAlertOpen(true);
        navigate("/internals");
      }
    } catch (err) {
      setAlertMessage({
        severity: "error",
        message: err.response?.data?.message || "Something went wrong!",
      });
      setAlertOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = () => {
    setConfirmContent({
      title: "",
      message: "Would you like to confirm?",
      buttons: [
        { name: "Yes", color: "primary", func: handleCreate },
        { name: "No", color: "primary", func: () => {} },
      ],
    });
    setConfirmOpen(true);
  };

  const DisplayTableCell = ({ label, align = "left" }) => (
    <StyledTableCellBody sx={{ textAlign: align }}>
      <Typography variant="subtitle2" color="textSecondary">
        {label}
      </Typography>
    </StyledTableCellBody>
  );

  const DisplayBodyText = ({ label }) => (
    <Typography variant="subtitle2" color="textSecondary">
      {label}
    </Typography>
  );
  return (
    <>
      <CustomModal
        open={confirmOpen}
        setOpen={setConfirmOpen}
        title={confirmContent.title}
        message={confirmContent.message}
        buttons={confirmContent.buttons}
      />

      <Box>
        <FormPaperWrapper>
          <Grid container rowSpacing={3}>
            <Grid item xs={12}>
              <TableContainer component={Paper}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <StyledTableHeadCell>Internal Name</StyledTableHeadCell>
                      <StyledTableHeadCell>Exam Date</StyledTableHeadCell>
                      <StyledTableHeadCell>Time Slot</StyledTableHeadCell>
                      <StyledTableHeadCell>Course</StyledTableHeadCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <StyledTableCellBody>
                        <DisplayBodyText label={internalsData.internal_name} />
                      </StyledTableCellBody>
                      <StyledTableCellBody
                        sx={{ textAlign: "center !important" }}
                      >
                        <DisplayBodyText label={internalsData.date_of_exam} />
                      </StyledTableCellBody>
                      <StyledTableCellBody
                        sx={{ textAlign: "center !important" }}
                      >
                        <DisplayBodyText label={internalsData.timeSlots} />
                      </StyledTableCellBody>
                      <StyledTableCellBody>
                        <DisplayBodyText
                          label={internalsData.course_with_coursecode}
                        />
                      </StyledTableCellBody>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
            <Grid item xs={12} mt={2} align="right">
              <Box sx={{ display: "flex", gap: 2, justifyContent: "right" }}>
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
                      <StyledTableHead sx={{ width: "4%" }}>
                        Sl No.
                      </StyledTableHead>
                      <StyledTableHead>
                        <TableSortLabel
                          active={orderBy === "studentName"}
                          direction={orderBy === "studentName" ? order : "asc"}
                          onClick={() => handleSort("studentName")}
                          sx={{
                            color: "tableBg.textColor",
                            "&:hover": { color: "tableBg.textColor" },
                            "&.Mui-active": { color: "tableBg.textColor" },
                            "& .MuiTableSortLabel-icon": {
                              color: "tableBg.textColor",
                            },
                            "&:hover .MuiTableSortLabel-icon": {
                              color: "lightgray",
                            },
                          }}
                        >
                          Student Name
                        </TableSortLabel>
                      </StyledTableHead>
                      <StyledTableHead>
                        <TableSortLabel
                          active={orderBy === "auid"}
                          direction={orderBy === "auid" ? order : "asc"}
                          onClick={() => handleSort("auid")}
                          sx={{
                            color: "tableBg.textColor",
                            "&:hover": { color: "tableBg.textColor" },
                            "&.Mui-active": { color: "tableBg.textColor" },
                            "& .MuiTableSortLabel-icon": {
                              color: "tableBg.textColor",
                            },
                            "&:hover .MuiTableSortLabel-icon": {
                              color: "lightgray",
                            },
                          }}
                        >
                          AUID
                        </TableSortLabel>
                      </StyledTableHead>
                      <StyledTableHead>
                        <TableSortLabel
                          active={orderBy === "section_name"}
                          direction={orderBy === "section_name" ? order : "asc"}
                          onClick={() => handleSort("section_name")}
                          sx={{
                            color: "tableBg.textColor",
                            "&:hover": { color: "tableBg.textColor" },
                            "&.Mui-active": { color: "tableBg.textColor" },
                            "& .MuiTableSortLabel-icon": {
                              color: "tableBg.textColor",
                            },
                            "&:hover .MuiTableSortLabel-icon": {
                              color: "lightgray",
                            },
                          }}
                        >
                          USN
                        </TableSortLabel>
                      </StyledTableHead>
                      <StyledTableHead>Max Marks</StyledTableHead>
                      <StyledTableHead>Min Marks</StyledTableHead>
                      <StyledTableHead>Scored Marks</StyledTableHead>
                      <StyledTableHead>Percentage</StyledTableHead>
                      <StyledTableHead>Evaluator</StyledTableHead>
                      <StyledTableHead>Date of Evaluation</StyledTableHead>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredAndSortedRows.length > 0 ? (
                      filteredAndSortedRows.map((obj, i) => (
                        <TableRow key={i}>
                          <DisplayTableCell label={i + 1} align="center" />
                          <DisplayTableCell label={obj.studentName} />
                          <DisplayTableCell label={obj.auid} align="center" />
                          <DisplayTableCell label={obj.usn} align="center" />
                          <DisplayTableCell
                            label={internalsData.max_marks}
                            align="center"
                          />
                          <DisplayTableCell
                            label={internalsData.min_marks}
                            align="center"
                          />
                          <StyledTableCellBody
                            sx={{ width: "10%", textAlign: "center" }}
                          >
                            {obj.isReadOnly ? (
                              <DisplayBodyText label={obj.scoredMarks} />
                            ) : (
                              <CustomTextField
                                name={`scoredMarks-${obj.studentId}`}
                                value={obj.scoredMarks}
                                handleChange={handleChangeInternal}
                              />
                            )}
                          </StyledTableCellBody>
                          <StyledTableCellBody
                            sx={{ width: "4%", textAlign: "center" }}
                          >
                            <DisplayBodyText
                              label={obj.percentage && `${obj.percentage}%`}
                            />
                          </StyledTableCellBody>
                          <StyledTableCellBody sx={{ textAlign: "center" }}>
                            <DisplayBodyText label={obj.evaluator} />
                          </StyledTableCellBody>
                          <StyledTableCellBody sx={{ textAlign: "center" }}>
                            <DisplayBodyText
                              label={
                                obj.evaluationDate
                                  ? moment(obj.evaluationDate).format(
                                      "DD-MM-YYYY LT"
                                    )
                                  : ""
                              }
                            />
                          </StyledTableCellBody>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <StyledTableCellBody
                          colSpan={8}
                          sx={{ textAlign: "center" }}
                        >
                          <DisplayBodyText label="No Records." />
                        </StyledTableCellBody>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
            <Grid item xs={12} align="right">
              <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={loading || !validate()}
              >
                {loading ? (
                  <CircularProgress
                    size={25}
                    color="blue"
                    style={{ margin: "2px 13px" }}
                  />
                ) : (
                  <Typography variant="subtitle2">Submit</Typography>
                )}
              </Button>
            </Grid>
          </Grid>
        </FormPaperWrapper>
      </Box>
    </>
  );
}

export default InternalMarksForm;
