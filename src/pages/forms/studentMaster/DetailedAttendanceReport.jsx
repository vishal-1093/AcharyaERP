import { useEffect, useRef, useState } from "react";
import axios from "../../../services/Api";
import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Grid,
  styled,
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import FormPaperWrapper from "../../../components/FormPaperWrapper";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";
import useAlert from "../../../hooks/useAlert";
import { useDownloadExcel } from "react-export-table-to-excel";

const initialValues = { courseId: null };

const userId = JSON.parse(sessionStorage.getItem("AcharyaErpUser"))?.userId;
const empId = JSON.parse(sessionStorage.getItem("empId"));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.headerWhite.main,
    border: "1px solid rgba(224, 224, 224, 1)",
    textAlign: "center",
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
}));

const StyledTableCellBody = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.body}`]: {
    border: "1px solid rgba(224, 224, 224, 1)",
    textAlign: "center",
  },
}));

function DetailedAttendanceReport() {
  const [values, setValues] = useState(initialValues);
  const [acyearOptions, setAcyearOptions] = useState([]);
  const [courseOptions, setCourseOptions] = useState([]);
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);

  const tableRef = useRef(null);

  const { setAlertMessage, setAlertOpen } = useAlert();

  const { onDownload } = useDownloadExcel({
    currentTableRef: tableRef.current,
    filename: "File",
    sheet: "File",
  });

  const handleExport = () => {
    if (tableRef.current) {
      onDownload();
    } else {
      console.error("Table reference is not available for export.");
    }
  };

  const exportPdf = () => {
    // const doc = new jsPDF();
    // autoTable(doc, {
    //   theme: "grid",
    //   columns: tableHeaders,
    //   body: rows.map((obj) => Object.values(obj)),
    // });
    // doc.save("file.pdf");
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [acyearRes, courseRes] = await Promise.all([
        axios.get("/api/academic/academic_year"),
        axios.get(`/api/academic/getSubjectAssignmentDetailsData/${userId}`),
      ]);
      const acyearOptionData = [];
      acyearRes.data.data?.forEach((obj) => {
        acyearOptionData.push({
          value: obj.ac_year_id,
          label: obj.ac_year,
        });
      });
      const courseOptionData = [];
      courseRes.data.data.forEach((obj) => {
        courseOptionData.push({
          value: obj.course_assignment_id,
          label:
            obj.course_name +
            "-" +
            obj.course_code +
            "-" +
            obj.program_type_name.slice(0, 3) +
            "-" +
            obj.year_sem,
          course_assignment_id: obj.course_assignment_id,
          program_assignment_id: obj.program_assignment_id,
          program_id: obj.program_id,
          program_specialization_id: obj.program_specialization_id,
          year_sem: obj.year_sem,
          school_id: obj.school_id,
        });
      });

      setAcyearOptions(acyearOptionData);
      setCourseOptions(courseOptionData);
    } catch (err) {
      setAlertMessage({
        severity: "error",
        message: err.response?.data?.message || "Something went wrong.",
      });
      setAlertOpen(true);
    }
  };
  console.log("data :>> ", data);
  const handleChangeAdvance = (name, newValue) => {
    setValues((prev) => ({ ...prev, [name]: newValue }));
  };

  const handleSubmit = async () => {
    const { acyearId, courseId } = values;
    if (!acyearId || !courseId) return;
    try {
      setLoading(true);
      const response = await axios.get(
        `/api/student/getDetailedStudentAttendanceReportSectionwiseForEmployee?ac_year_id=${acyearId}&emp_id=${empId}&course_assignment_id=${courseId}`
      );
      const responseData = response.data.data;
      if (Object.keys(responseData).length === 0) {
        setAlertMessage({
          severity: "error",
          message: "Attendance Data Not Found !!",
        });
        setAlertOpen(true);
        return;
      }
      const classDates = Object.keys(responseData);
      const sortedDates = classDates.sort((a, b) => {
        const dateA = new Date(a.split("-").reverse().join("-"));
        const dateB = new Date(b.split("-").reverse().join("-"));
        return dateA - dateB;
      });
      const rowData = Object.values(responseData).flat();
      const studentData = rowData.filter(
        (item, index, self) =>
          index === self.findIndex((t) => t.student_id === item.student_id)
      );
      const displayData = {};
      studentData.forEach((std) => {
        let count = 0;
        sortedDates.forEach((date) => {
          const filter = rowData.find(
            (item) =>
              item.date_of_class === date && item.student_id === std.student_id
          );
          if (filter) {
            if (filter.present_status) {
              count = count + 1;
            }
            displayData[`${date}-${std.student_id}`] = filter.present_status
              ? count
              : "A";
          }
        });
      });
      const totalCount = {};
      sortedDates.forEach((obj) => {
        const presentCount = responseData[obj].filter(
          (item) => item.present_status === true
        );
        totalCount[obj] = `${presentCount.length}/${responseData[obj].length}`;
      });
      setData({ sortedDates, studentData, displayData, totalCount });
    } catch (err) {
      console.error(err);

      setAlertMessage({
        severity: "error",
        message: err.response?.data?.message || "Something went wrong.",
      });
      setAlertOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const DisplayHeader = ({ label }) => {
    return <Typography variant="subtitle2">{label}</Typography>;
  };

  const DisplayBody = ({ label }) => {
    return (
      <Typography variant="subtitle2" color="textSecondary">
        {label}
      </Typography>
    );
  };

  const tableHeaders = () => (
    <TableHead>
      <TableRow>
        <StyledTableCell>Sl No.</StyledTableCell>
        <StyledTableCell>AUID</StyledTableCell>
        <StyledTableCell>USN</StyledTableCell>
        <StyledTableCell>Student Name</StyledTableCell>
        {data.sortedDates.map((obj, i) => (
          <StyledTableCell key={i}>{i + 1}</StyledTableCell>
        ))}
      </TableRow>
    </TableHead>
  );

  const tableBody = () => (
    <TableBody>
      {data.studentData.map((obj, i) => {
        return (
          <StyledTableRow key={i}>
            <StyledTableCellBody>
              <DisplayBody label={i + 1} />
            </StyledTableCellBody>
            <StyledTableCellBody sx={{ textAlign: "left !important" }}>
              <DisplayBody label={obj.auid} />
            </StyledTableCellBody>
            <StyledTableCellBody sx={{ textAlign: "left !important" }}>
              <DisplayBody label={obj.usn} />
            </StyledTableCellBody>
            <StyledTableCellBody sx={{ textAlign: "left !important" }}>
              <DisplayBody label={obj.student_name} />
            </StyledTableCellBody>
            {data.sortedDates.map((item, j) => (
              <StyledTableCellBody key={j}>
                <Typography
                  variant="subtitle2"
                  sx={{
                    color:
                      data.displayData[`${item}-${obj.student_id}`] === "A"
                        ? "error.main"
                        : "success.main",
                  }}
                >
                  {data.displayData[`${item}-${obj.student_id}`]}
                </Typography>
              </StyledTableCellBody>
            ))}
          </StyledTableRow>
        );
      })}
      <StyledTableRow>
        <StyledTableCellBody colSpan={4} sx={{ textAlign: "left !important" }}>
          <DisplayHeader label="Present Count/Total Count" />
        </StyledTableCellBody>
        {data.sortedDates.map((obj, i) => (
          <StyledTableCellBody key={i}>
            <DisplayHeader label={data.totalCount[obj]} />
          </StyledTableCellBody>
        ))}
      </StyledTableRow>
      <StyledTableRow>
        <StyledTableCellBody colSpan={4} sx={{ textAlign: "left !important" }}>
          <DisplayHeader label="Date" />
        </StyledTableCellBody>
        {data.sortedDates.map((obj, i) => (
          <StyledTableCellBody key={i}>
            <DisplayHeader label={`${obj.substr(0, 6)}${obj.substr(8, 10)}`} />
          </StyledTableCellBody>
        ))}
      </StyledTableRow>
      <StyledTableRow>
        <StyledTableCellBody colSpan={4} sx={{ textAlign: "left !important" }}>
          <DisplayHeader label="Faculty" />
        </StyledTableCellBody>
        {data.sortedDates.map((obj, i) => (
          <StyledTableCellBody key={i} />
        ))}
      </StyledTableRow>
      <StyledTableRow>
        <StyledTableCellBody colSpan={4} sx={{ textAlign: "left !important" }}>
          <DisplayHeader label="HOD" />
        </StyledTableCellBody>
        {data.sortedDates.map((obj, i) => (
          <StyledTableCellBody key={i} />
        ))}
      </StyledTableRow>
      <StyledTableRow>
        <StyledTableCellBody colSpan={4} sx={{ textAlign: "left !important" }}>
          <DisplayHeader label="Principal" />
        </StyledTableCellBody>
        {data.sortedDates.map((obj, i) => (
          <StyledTableCellBody key={i} />
        ))}
      </StyledTableRow>
    </TableBody>
  );

  return (
    <>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      <Box sx={{ margin: { xs: 1, md: 2 } }}>
        <FormPaperWrapper>
          <Grid container rowSpacing={2} columnSpacing={2}>
            <Grid item xs={12} md={2}>
              <CustomAutocomplete
                name="acyearId"
                label="Ac Year"
                value={values.acyearId}
                options={acyearOptions}
                handleChangeAdvance={handleChangeAdvance}
                required
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <CustomAutocomplete
                name="courseId"
                label="Course"
                value={values.courseId}
                options={courseOptions}
                handleChangeAdvance={handleChangeAdvance}
              />
            </Grid>

            <Grid item xs={12} align="right">
              <Button variant="contained" onClick={handleSubmit}>
                GO
              </Button>
            </Grid>

            {Object.values(data).length > 0 && (
              <>
                <Grid item xs={12} align="right">
                  <Box
                    sx={{ display: "flex", gap: 2, justifyContent: "right" }}
                  >
                    <Button
                      variant="contained"
                      size="small"
                      onClick={handleExport}
                    >
                      Export to Excel
                    </Button>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <TableContainer>
                    <Table size="small" ref={tableRef}>
                      {tableHeaders()}
                      {tableBody()}
                    </Table>
                  </TableContainer>
                </Grid>
              </>
            )}
          </Grid>
        </FormPaperWrapper>
      </Box>
    </>
  );
}

export default DetailedAttendanceReport;
