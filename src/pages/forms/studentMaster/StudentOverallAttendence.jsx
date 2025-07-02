import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Collapse,
  IconButton,
  Typography,
  Paper,
  Box,
  Grid,
} from "@mui/material";
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import axios from "../../../services/Api";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";
import CustomSelect from "../../../components/Inputs/CustomSelect";
import useAlert from "../../../hooks/useAlert";

// Color logic
const getColor = (percentage) => {
  if (percentage >= 75) return "#4caf50"; // Green
  if (percentage >= 60) return "#ff9800"; // Amber
  return "#f44336"; // Red
};

const Row = ({ student }) => {
  const [open, setOpen] = useState(false);
  const overall =
    student.studentAttendanceDetail.find((d) => d.overallAttendance)
      ?.overallAttendance ?? "N/A";

  const courseRows = student.studentAttendanceDetail
    .filter((d) => !d.overallAttendance)
    .filter(
      (value, index, self) =>
        index ===
        self.findIndex(
          (v) =>
            v.course_id === value.course_id &&
            v.course_assignment_id === value.course_assignment_id
        )
    );

  return (
    <>
      <TableRow
        hover
        sx={{ transition: "0.3s", "&:hover": { backgroundColor: "#f9fbfd" } }}
      >
        <TableCell>
          <IconButton size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
          </IconButton>
        </TableCell>
        <TableCell sx={{ color: "#2e3a59" }}>{student.auid}</TableCell>
        <TableCell sx={{ color: "#2e3a59" }}>{student.auid}</TableCell>
        <TableCell sx={{ color: "#2e3a59" }}>{student.studentName}</TableCell>
        <TableCell sx={{ color: "#2e3a59" }}>1/1</TableCell>
        <TableCell>
          <strong style={{ color: getColor(overall), fontWeight: 600 }}>
            {overall}%
          </strong>
        </TableCell>
      </TableRow>

      <TableRow>
        <TableCell
          colSpan={6}
          sx={{ paddingBottom: 0, paddingTop: 0, border: "none" }}
        >
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box
              sx={{
                margin: 1,
                backgroundColor: "#fafbfc",
                borderRadius: 2,
                p: 2,
              }}
            >
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: 600, color: "#37474f" }}
              >
                Course-wise Attendance
              </Typography>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ backgroundColor: "#f0f4f8" }}>
                    <TableCell>
                      <strong>Course Code</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Course Name</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Present</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Total</strong>
                    </TableCell>
                    <TableCell>
                      <strong>%</strong>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {courseRows.map((course, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        {course.course_assignment_coursecode}
                      </TableCell>
                      <TableCell>{course.course_name}</TableCell>
                      <TableCell>{course.present}</TableCell>
                      <TableCell>{course.total}</TableCell>
                      <TableCell>
                        <strong
                          style={{
                            color: getColor(course.percentage),
                            fontWeight: 500,
                          }}
                        >
                          {course.percentage}%
                        </strong>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

const AttendanceTable = () => {
  const [data, setData] = useState([]);
  const [acYearOptions, setAcyearOptions] = useState([]);
  const [SectionOptions, setSectionOptions] = useState([]);
  const [batchOptions, setBatchOptions] = useState([]);
  const [programOptions, setprogramOptions] = useState([]);
  const [schoolOptions, setSchoolOptions] = useState([]);
  const [values, setValues] = useState({
    schoolId: null,
    academicYear: "",
    program: "",
    sem: "",
    section: "",
    batch: "",
    batchSec: "Section",
  });

  const { setAlertMessage, setAlertOpen } = useAlert();

  useEffect(() => {
    getData();
  }, []);

  const getSchoolDetails = async () => {
    await axios
      .get(`/api/institute/school`)
      .then((res) => {
        const optionData = [];
        res.data.data.forEach((obj) => {
          optionData.push({
            value: obj?.school_id,
            label: obj?.school_name,
            school_name_short: obj?.school_name_short,
          });
        });
        setSchoolOptions(optionData);
      })
      .catch((err) => console.error(err));
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

  const getPrograms = async () => {
    if (!values.schoolId) return null;

    try {
      const { data: response } = await axios.get(
        `/api/academic/fetchAllProgramsWithSpecialization/${values.schoolId}`
      );
      const optionData = [];
      const responseData = response.data;
      response.data.forEach((obj) => {
        optionData.push({
          value: obj.program_specialization_id,
          label: `${obj.program_short_name} - ${obj.program_specialization_name}`,
          program_assignment_id: obj.program_assignment_id,
          program_id: obj.program_id,
        });
      });
      const programObject = responseData.reduce((acc, next) => {
        acc[next.program_specialization_id] = next;
        return acc;
      }, {});

      setprogramOptions(optionData);
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleChangeAdvance = (name, newValue) => {
    setValues((prevValues) => ({
      ...prevValues,
      [name]: newValue,
    }));
  };

  const getData = async () => {
    const selectedProgram = programOptions.find(
      (program) => program.value === values.program
    );

    try {
      const response = await axios.get(
        `/api/student/overallAttendanceInYearOrSem/${values.academicYear}/${selectedProgram.program_assignment_id}/${selectedProgram.program_id}/${selectedProgram.value}/${values.section}/${values.sem}`
      );

      if (response.data.data.length > 0) {
        setData(response.data.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Box padding={2}>
      <Grid container rowSpacing={1.5} columnSpacing={2}>
        {/* <Grid item xs={12} md={2.4}>
              <CustomSelect
                name="batchSec"
                value={values.batchSec}
                label="Batch/Section"
                items={[
                  { label: "Batch", value: "Batch" },
                  { label: "Section", value: "Section" },
                ]}
                handleChange={handleChange}
                disabled={Data.length > 0}
              />
            </Grid> */}

        <Grid item xs={12} md={2.4}>
          <CustomSelect
            name="academicYear"
            label="Academic Year*"
            value={values.academicYear}
            items={acYearOptions}
            handleChange={handleChange}
          />
        </Grid>

        <>
          <Grid item xs={12} md={2.4}>
            <CustomAutocomplete
              name="schoolId"
              label="School*"
              value={values.schoolId}
              options={schoolOptions}
              handleChangeAdvance={handleChangeAdvance}
            />
          </Grid>

          <Grid item xs={12} md={2.4}>
            <CustomAutocomplete
              name="program"
              label="Program Major*"
              value={values.program}
              options={programOptions}
              handleChangeAdvance={handleChangeAdvance}
            />
            {/* <CustomSelect
                  name="program"
                  label="Program Major*"
                  value={values.program}
                  items={programOptions}
                  handleChange={handleChange}
                  disabled={Data.length > 0}
                /> */}
          </Grid>
        </>

        <Grid item xs={12} md={2.4}>
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
          />
        </Grid>

        <Grid item xs={12} md={2.4}>
          <CustomSelect
            name="section"
            label="Section"
            value={values.section}
            items={SectionOptions}
            handleChange={handleChange}
          />
        </Grid>
      </Grid>

      <TableContainer
        component={Paper}
        sx={{
          mt: 1,
          borderRadius: 3,
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          fontFamily: `"Inter", "Roboto", "Segoe UI", sans-serif`,
        }}
      >
        <Table>
          <TableHead sx={{ backgroundColor: "#f0f4f8" }}>
            <TableRow>
              <TableCell />
              <TableCell sx={{ fontWeight: 700, color: "#2e3a59" }}>
                AUID
              </TableCell>
              <TableCell sx={{ fontWeight: 700, color: "#2e3a59" }}>
                USN
              </TableCell>
              <TableCell sx={{ fontWeight: 700, color: "#2e3a59" }}>
                Student Name
              </TableCell>
              <TableCell sx={{ fontWeight: 700, color: "#2e3a59" }}>
                Year/Sem
              </TableCell>
              <TableCell sx={{ fontWeight: 700, color: "#2e3a59" }}>
                Overall Attendance
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((student, idx) => (
              <Row key={idx} student={student} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default AttendanceTable;
