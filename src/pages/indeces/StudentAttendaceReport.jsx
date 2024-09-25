import { useState, useEffect, useRef } from "react";
import axios from "../../services/Api";
import {
  Grid,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  styled,
  tableCellClasses,
  TableBody,
  Button,
  IconButton,
  Tooltip,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import moment from "moment";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import ModalWrapper from "../../components/ModalWrapper";
import GridIndex from "../../components/GridIndex";
import CustomSelect from "../../components/Inputs/CustomSelect";
import { useDownloadExcel } from "react-export-table-to-excel";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.auzColor.main,
    color: theme.palette.headerWhite.main,
    textAlign: "center",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 12,
    borderBottom: 0,
    textAlign: "center",
  },
}));

const StyledTableCell1 = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.auzColor.main,
    color: theme.palette.headerWhite.main,
    textAlign: "center",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 12,
    borderBottom: 0,
    textAlign: "center",
  },
}));

const StudentAttendaceReport = () => {
  const [acYearOptions, setAcyearOptions] = useState([]);
  const [SectionOptions, setSectionOptions] = useState([]);
  const [programOptions, setprogramOptions] = useState([]);
  const [Data, setData] = useState([]);
  const [courses, setCourses] = useState([]);
  const [dynamicHeaders, setDynamicHeaders] = useState([]);
  const setCrumbs = useBreadcrumbs();
  const [ModalData, setModalData] = useState([]);
  const [columnWiseData, setColumnWiseData] = useState([]);
  const [selectedSection, setSelectionSection] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const [values, setValues] = useState({
    academicYear: "",
    program: "",
    sem: "",
    section: "",
  });

  const columns = [
    {
      field: "slNo",
      headerName: "Sl No",
      flex: 1,
      hideable: false,
      renderCell: (params) => params.api.getRowIndex(params.id) + 1,
    },
    {
      field: "employee_name_code",
      headerName: " Emoplpyee Name-Code",
      flex: 1,
      hideable: false,
    },
    {
      field: "selected_date",
      headerName: "Selected Date",
      flex: 1,
    },
    {
      field: "time_slot",
      headerName: "Time Slots",
      flex: 1,
      hideable: false,
    },
    {
      field: "roomcode",
      headerName: "Room Code",
      flex: 1,
      hideable: false,
    },
    {
      field: "batch_short_name",
      headerName: "Section/Batch",
      flex: 1,
      hideable: false,
    },
    {},
  ];

  useEffect(() => {
    setCrumbs([
      {
        name: "Student Attendance Report",
      },
    ]);
    getacyear();
    getprogram();
  }, []);

  useEffect(() => {
    if (values.academicYear && values.program && values.sem) {
      getsection();
    }
  }, [values.academicYear, values.program, values.sem]);

  useEffect(() => {
    if (values.academicYear && values.program && values.sem) {
      getCourse();
    }
  }, [values.academicYear, values.program, values.sem]);

  const getsection = async (params) => {
    await axios
      .get(
        `/api/academic/sectionDetailsByAcademicYearAndSpecializationId/${values.academicYear}/${values.program}/${values.sem}`
      )
      .then((res) => {
        setSectionOptions(
          res.data.data.map((obj) => ({
            value: obj.section_id,
            label: obj.section_name,
            section_id: obj.section_id,
          }))
        );
      })
      .catch((error) => console.error(error));
  };

  const getacyear = async (params) => {
    await axios
      .get(`/api/academic/academic_year`)
      .then((res) => {
        setAcyearOptions(
          res.data.data.map((obj) => ({
            value: obj.ac_year_id,
            label: obj.ac_year,
          }))
        );
      })
      .catch((error) => console.error(error));
  };

  const getprogram = async (params) => {
    try {
      const res = await axios.get(
        `/api/academic/fetchAllProgramsAndSpecializationWithProgramType`
      );

      const programOptionsData = res.data.data.map((obj) => ({
        value: obj.program_specialization_id,
        label: `${obj.program_specialization_short_name}-${obj.program_short_name}`,
        program_assignment_id: obj.program_assignment_id,
        program_id: obj.program_id,
      }));

      setprogramOptions(programOptionsData);
    } catch (error) {
      console.error(error);
    }
  };

  const getCourse = async (params) => {
    try {
      const selectedProgram = programOptions.find(
        (program) => program.value === values.program
      );
      const { program_assignment_id, program_id } = selectedProgram;
      const res = await axios.get(
        `/api/student/getCourseDetailsForAttendanceReport/${values.academicYear}/${program_assignment_id}/${program_id}/${values.sem}`
      );

      setCourses(
        res.data.data.map((obj) => ({
          value: obj.course_assignment_id,
          label: obj.course_name_with_course_assignment_code,
          course_id: obj.course_id,
          course_assignment_id: obj.course_assignment_id,
          name: obj.course_name_with_course_assignment_code,
        }))
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  function groupDataByCourseCode(dataArray) {
    const groupedData = [];

    dataArray.forEach((item, index) => {
      const selectedCourse = courses.find(
        (program) => program.value === values.course
      );

      const { name } = selectedCourse;
      const auid = item.auid;
      const num = index + 1;
      const studentName = item.studentName;
      const dateOfReporting = moment(item.dateOfReporting).format("DD-MM-YYYY");

      const studentAttendanceDetail = item.studentAttendanceDetail[name];

      studentAttendanceDetail?.length > 0 &&
        studentAttendanceDetail?.sort((a, b) => {
          return new Date(a?.date_of_class) - new Date(b?.date_of_class);
        });

      groupedData.push({
        auid,
        num,
        studentName,
        dateOfReporting,
        studentAttendanceDetail,
      });
    });

    const maxAttendanceObj = groupedData.reduce((maxObj, currentObj) => {
      if (
        currentObj?.studentAttendanceDetail?.length >
        (maxObj ? maxObj?.studentAttendanceDetail?.length : 0)
      ) {
        return currentObj;
      } else {
        return maxObj;
      }
    }, null);

    setDynamicHeaders(maxAttendanceObj);
    console.log("===studentAttendanceDetail", maxAttendanceObj);

    return groupedData;
  }

  const handleSubmit = async () => {
    const selectedProgram = programOptions.find(
      (program) => program.value === values.program
    );

    const selectedCourse1 = SectionOptions.find(
      (section) => section.section_id === values.section
    );

    console.log({ selectedCourse1 });

    setSelectionSection(selectedCourse1);
    const {
      program_assignment_id,
      program_id,
      value: program_specialization_id,
    } = selectedProgram;

    const selectedCourse = courses.find(
      (program) => program.value === values.course
    );

    const { course_assignment_id, course_id } = selectedCourse;

    try {
      const res = await axios.get(
        `/api/student/getDetailedStudentAttendanceReportSectionwise/${values.academicYear}/${program_assignment_id}/${program_id}/${program_specialization_id}/${values.section}/${values.sem}/${course_id}/${course_assignment_id}`
      );

      //setData(res.data.data);

      const groupedData = groupDataByCourseCode(res.data.data);

      const getIndexWiseCounts = (data) => {
        const counts = {};

        data.forEach((student) => {
          if (
            student?.studentAttendanceDetail &&
            student?.studentAttendanceDetail.length > 0
          ) {
            student?.studentAttendanceDetail?.forEach((attendance, index) => {
              if (!counts[index]) {
                counts[index] = {
                  present: 0,
                  absent: 0,
                };
              }

              if (attendance.present_status === true) {
                counts[index].present++;
              } else {
                counts[index].absent++;
              }
            });
          }
        });

        return counts;
      };

      const indexWiseCounts = getIndexWiseCounts(groupedData);
      console.log("Index-wise counts:", indexWiseCounts);
      setColumnWiseData(indexWiseCounts);

      setData(groupedData);
    } catch (err) {
      console.error(err);
    }
  };

  const getModalData = async (studentId, courseId, present_status) => {
    try {
      const response = await axios.get(
        `/api/student/getStudentAttendanceDetailsByStudentIdAcademicYearCourseIdAndCurrentYearSem/${studentId}/${values.academicYear}/${courseId}/${values.sem}`
      );

      // const employeeNames = Object.keys(response.data?.data);

      // const firstEmployeeName = employeeNames[0];
      // const employeeAttendanceData = response.data?.data[firstEmployeeName];

      const mergedData = Object.values(response?.data?.data).flat();

      // Filter records based on present_status
      const filteredData = mergedData.filter(
        (obj) => obj.present_status === true
      );

      const filteredData2 = mergedData.filter(
        (obj) => obj.present_status === false
      );

      let data = present_status ? filteredData : filteredData2;
      const modalRows = data?.map((item, index) => ({
        id: index + 1,
        employee_name_code: item.employee_name_code,
        selected_date: moment(item.selected_date).format("DD-MM-YYYY"),
        time_slot: item.time_slot,
        interval_time: item.interval_type_short,
        roomcode: item.roomcode,
        batch_short_name: item.batch_short_name,
        time_table_id: item?.time_table_id,
      }));
      setModalData(modalRows);
      setModalOpen(true);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Grid item xs={12} align="right">
        <IconButton onClick={() => window.location.reload()}>
          <RefreshIcon sx={{ color: "auzColor.main" }} fontSize="large" />
        </IconButton>
      </Grid>
      <Grid container>
        <Grid
          item
          xs={12}
          component={Paper}
          rowSpacing={2}
          elevation={3}
          p={2}
          marginTop={1}
        >
          <Grid container rowSpacing={1.5} columnSpacing={2}>
            <Grid item xs={12} md={3}>
              <CustomSelect
                name="academicYear"
                label="Academic Year*"
                value={values.academicYear}
                items={acYearOptions}
                handleChange={handleChange}
                disabled={Data.length > 0}
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <CustomSelect
                name="program"
                label="Program Major*"
                value={values.program}
                items={programOptions}
                handleChange={handleChange}
                disabled={Data.length > 0}
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <CustomSelect
                name="sem"
                value={values.sem}
                label="Sem*"
                items={[
                  { label: 1, value: 1 },
                  { label: 2, value: 2 },
                  { label: 3, value: 3 },
                  { label: 4, value: 4 },
                  { label: 5, value: 5 },
                  { label: 6, value: 6 },
                ]}
                handleChange={handleChange}
                disabled={Data.length > 0}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <CustomSelect
                name="section"
                label="Section"
                value={values.section}
                items={SectionOptions}
                handleChange={handleChange}
                required
                disabled={
                  !values.academicYear || !values.program || Data.length > 0
                }
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <CustomSelect
                name="course"
                label="Courses"
                value={values.course}
                items={courses}
                handleChange={handleChange}
                required
                disabled={
                  !values.academicYear ||
                  !values.program ||
                  !values.sem ||
                  Data.length > 0
                }
              />
            </Grid>
          </Grid>
          <Grid item xs={12} mt={1} align="right">
            <Button
              color="success"
              variant="contained"
              sx={{ borderRadius: 2 }}
              onClick={handleSubmit}
              disabled={Data.length > 0}
            >
              Submit
            </Button>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12} mt={2} mb={4}>
        {Data.length > 0 && (
          <StudentTable
            columnWiseData={columnWiseData}
            selectedSection={selectedSection}
            dynamicHeaders={dynamicHeaders}
            Data={Data}
          />
        )}
      </Grid>
      <ModalWrapper
        open={modalOpen}
        setOpen={setModalOpen}
        maxWidth={700}
        title="More Details"
      >
        <GridIndex rows={ModalData} columns={columns} />
      </ModalWrapper>
    </>
  );
};

export default StudentAttendaceReport;

const StudentTable = ({
  selectedSection,
  columnWiseData,
  dynamicHeaders,
  Data,
}) => {
  const tableRef = useRef(null);
  const { onDownload } = useDownloadExcel({
    currentTableRef: tableRef.current,
    filename: "Student Attendence",
    sheet: "Student Attendence",
  });

  return (
    <>
      <Grid item xs={12} mt={2} align="right">
        <Button variant="contained" onClick={onDownload}>
          Export to excel
        </Button>
      </Grid>
      <Grid item xs={12} mt={2} mb={4}>
        <TableContainer component={Paper}>
          <Table
            size="small"
            sx={{ borderCollapse: "separate", borderSpacing: "1px" }}
            ref={tableRef}
          >
            <TableHead>
              <TableRow>
                {" "}
                <StyledTableCell>
                  Year - &nbsp;
                  {dynamicHeaders?.studentAttendanceDetail[0]?.year_or_sem}
                </StyledTableCell>
                <StyledTableCell>
                  Sem - &nbsp;
                  {dynamicHeaders?.studentAttendanceDetail[0]?.year_or_sem}
                </StyledTableCell>
                <StyledTableCell>
                  Section - {selectedSection?.label}
                </StyledTableCell>
                <StyledTableCell>
                  Course Name -{" "}
                  {dynamicHeaders?.studentAttendanceDetail[0]?.course_name}
                </StyledTableCell>
                <StyledTableCell
                  colSpan={dynamicHeaders?.studentAttendanceDetail?.length}
                >
                  Classes
                </StyledTableCell>
              </TableRow>
              <TableRow>
                <StyledTableCell>Sl.No.</StyledTableCell>
                <StyledTableCell>Auid</StyledTableCell>
                <StyledTableCell>Student Name</StyledTableCell>
                <StyledTableCell>DOR</StyledTableCell>
                {dynamicHeaders?.studentAttendanceDetail?.map((row, index) => (
                  <>
                    <StyledTableCell1>{index + 1}</StyledTableCell1>
                  </>
                ))}
              </TableRow>
              {/* <TableRow>
                  {dynamicHeaders?.map((row, index) => (
                    <>
                      <StyledTableCell1 colSpan={2}>
                        {row.course_assignment_coursecode}
                      </StyledTableCell1>
                    </>
                  ))}
                </TableRow>
                <TableRow>
                  {dynamicHeaders.map((row, index) => (
                    <>
                      <StyledTableCell>Present</StyledTableCell>
                      <StyledTableCell>Absent</StyledTableCell>
                    </>
                  ))}
                </TableRow> */}
            </TableHead>
            <TableBody>
              {Data.map((row, index) => (
                <TableRow
                  key={index}
                  sx={{ outline: "1px solid rgba(224, 224, 224, 1)" }}
                >
                  <StyledTableCell>{index + 1}</StyledTableCell>
                  <StyledTableCell>{row.auid}</StyledTableCell>
                  <StyledTableCell>{row.studentName}</StyledTableCell>
                  {row.dateOfReporting ? (
                    <StyledTableCell>{row.dateOfReporting}</StyledTableCell>
                  ) : (
                    <StyledTableCell></StyledTableCell>
                  )}

                  {row?.studentAttendanceDetail &&
                    row?.studentAttendanceDetail?.map((subject, subIndex) => (
                      <>
                        {subject.present_status ? (
                          <StyledTableCell1 sx={{ color: "green" }}>
                            P
                          </StyledTableCell1>
                        ) : (
                          <StyledTableCell1 sx={{ color: "red" }}>
                            A
                          </StyledTableCell1>
                        )}
                      </>
                    ))}
                  {row?.studentAttendanceDetail === undefined &&
                    dynamicHeaders?.studentAttendanceDetail?.map((i) => (
                      <>
                        <StyledTableCell1> - </StyledTableCell1>
                      </>
                    ))}
                </TableRow>
              ))}
              <TableRow sx={{ outline: "1px solid" }}>
                <StyledTableCell colSpan={4}>
                  Present Count/Total Count
                </StyledTableCell>
                {dynamicHeaders?.studentAttendanceDetail?.map((row, index) => (
                  <>
                    <StyledTableCell>{`${columnWiseData[index].present}/${
                      columnWiseData[index].present +
                      columnWiseData[index].absent
                    }`}</StyledTableCell>
                  </>
                ))}
              </TableRow>
              <TableRow sx={{ outline: "1px solid" }}>
                <StyledTableCell colSpan={4}>Date</StyledTableCell>
                {dynamicHeaders?.studentAttendanceDetail?.map((row, index) => (
                  <>
                    <StyledTableCell>
                      {moment(row.date_of_class).format("DD-MM-YY")}
                    </StyledTableCell>
                  </>
                ))}
              </TableRow>
              <TableRow sx={{ outline: "1px solid" }}>
                <StyledTableCell colSpan={4}>Time Slot</StyledTableCell>
                {dynamicHeaders?.studentAttendanceDetail?.map((row, index) => (
                  <>
                    <Tooltip title={row.time_slot}>
                      <StyledTableCell>
                        {row.time_slot
                          ?.split("-")
                          .map((time) => {
                            const [hour] = time.split(":");
                            const [formattedHour] = hour.split(" ");
                            return formattedHour.trim();
                          })
                          .join(" - ")}
                      </StyledTableCell>
                    </Tooltip>
                  </>
                ))}
              </TableRow>
              <TableRow sx={{ outline: "1px solid" }}>
                <StyledTableCell colSpan={4}>Emp Code</StyledTableCell>
              </TableRow>
              <TableRow sx={{ outline: "1px solid" }}>
                <StyledTableCell colSpan={4}>Faculty Signature</StyledTableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </>
  );
};
