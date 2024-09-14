import { useState, useEffect } from "react";
import axios from "../../../services/Api";
import CustomSelect from "../../../components/Inputs/CustomSelect";
import {
  Grid,
  Typography,
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
  CircularProgress,
  Box,
} from "@mui/material";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import useAlert from "../../../hooks/useAlert";
import { useLocation } from "react-router-dom";
import { convertDateFormat } from "../../../utils/Utils";
import CustomTextField from "../../../components/Inputs/CustomTextField";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.auzColor.main,
    color: theme.palette.headerWhite.main,
    border: "1px solid rgba(224, 224, 224, 1)",
    textAlign: "center",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 12,
    border: "1px solid rgba(224, 224, 224, 1)",
    textAlign: "center",
  },
}));

const StyledInputCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.body}`]: {
    fontSize: 12,
    borderBottom: 0,
    textAlign: "center",
    border: "1px solid rgba(224, 224, 224, 1)",
  },
}));


const StudentMarks = () => {
  const [acYearOptions, setAcyearOptions] = useState([]);
  const [programOptions, setprogramOptions] = useState([]);
  const [assessmentId, setAssessmentId] = useState([]);
  const [courseId, setCourseId] = useState([]);
  const [programids, setprogramids] = useState([]);
  const [Data, setData] = useState([]);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const setCrumbs = useBreadcrumbs();
  const { setAlertMessage, setAlertOpen } = useAlert();
  const [loading, setLoading] = useState(false);
  const { pathname } = useLocation();

  const [values, setValues] = useState({
    academicYear: null,
    program: "",
    assesmentId: "",
    course: "",
    sem: "",
  });
  useEffect(() => {
    getacyear();
    getprogram();
    if (pathname.toLowerCase() === "/stdmarks/exam") {
      setCrumbs([
        { name: "Assesment Marks", link: "/stdmarks" }, { name: "Exam Marks" }]);
    }

  }, [pathname]);

  useEffect(() => {

    if (pathname.toLowerCase() === "/stdmarks/exam" && Data.length > 0) {
      const assessmentLabel = assessmentId.find(option => option.value === values.assesmentId)?.label;
      const programLabel = programOptions.find(option => option.value === values.program)?.label;
      const courseLabel = courseId.find(option => option.value === values.course)?.label;
      setCrumbs([
        { name: "Assesment Marks", link: "/stdmarks" }, { name: "Exam Marks" },
        { name: `${programLabel}` },
        { name: `${assessmentLabel}` },
        { name: `${courseLabel}` }
      ]);
    } else {
      setCrumbs([
        { name: "Assesment Marks", link: "/stdmarks" }, { name: "Exam Marks" },
      ]);
    }
  }, [Data]);


  const semeOption = [
    { value: 1, label: 1 },
    { value: 2, label: 2 },
    { value: 3, label: 3 },
    { value: 4, label: 4 },
    { value: 5, label: 5 },
    { value: 6, label: 6 },
  ]

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
    await axios
      .get(`/api/academic/fetchAllProgramsAndSpecializationWithProgramType`)
      .then((res) => {
        setprogramOptions(
          res.data.data.map((obj) => ({
            value: obj.program_specialization_id,
            label: `${obj.program_specialization_short_name}-${obj.program_short_name}`,
          }))
        );
        setprogramids(
          res.data.data.map((obj) => ({
            program_assignment_id: obj.program_assignment_id,
            program_specialization_id: obj.program_specialization_id,
            program_id: obj.program_id,
          }))
        );
      })
      .catch((error) => console.error(error));
  };
  const getAssesmentId = async (params) => {
    await axios
      .get(`/api/academic/getAllActiveInternalId/${values.academicYear}/${values.program}/${values.sem}`)
      .then((res) => {
        setAssessmentId(
          res.data.data.map((obj) => ({
            value: obj.internal_id,
            label: `${obj.internal_short_name} (${convertDateFormat(obj?.from_date)} To ${convertDateFormat(obj?.to_date)})`,
          }))
        );
      })
      .catch((error) => console.error(error));
  };

  const getCourseId = async (params) => {

    await axios
      .get(`/api/academic/getAllActivecourseid/${values.assesmentId}/${values.sem}`)
      .then((res) => {
        setCourseId(
          res.data.data.map((obj) => ({
            value: obj.course_assignment_id,
            label: obj.courseName,
          }))
        );
      })
      .catch((error) => console.error(error));
  };

  const handleSave = async () => {
    setLoading(true)
    const postData = []
    Data.forEach((obj, i) => {
      if (obj?.marks) {
        postData.push({
          student_id: obj.student_id,
          auid: null,
          course_id: null,
          marks_obtained_internal: obj?.marks,
          marks_obtained_external: 0,
          total_marks_internal: 0,
          total_marks_external: 0,
          percentage: obj?.percentage,
          grade: "",
          internal_id: values.assesmentId,
          current_year_sem: values.sem,
          ac_year_id: values.academicYear,
          batch_id: null,
          section_id: null,
          status: true,
          exam_room_id: null,
          active: true,
          course_assignment_id: values.course
        });
      }
    })
    if (postData.length > 0) {
      await axios
        .post(`/api/student/studentMarks`, postData)
        .then((res) => {
          if (res.status === 200 || res.status === 201) {
            setAlertMessage({
              severity: "success",
              message: "Data saved",
            });
            handleSubmit();
            setLoading(false)
          } else {
            setAlertOpen(true);
            setAlertMessage({
              severity: "error",
              message: "Error Occured",
            });
            setLoading(false)
          }
          setAlertOpen(true);
        })
        .catch((err) => {
          setAlertOpen(true);
          setAlertMessage({
            severity: "error",
            message: "Something went wrong !!!",
          });
          setLoading(false)
        });
    }
  }



  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));

    if (name === "program") {
      const selectedProgram = programids.find(
        (program) => program.program_id === parseInt(value, 10)
      );
      setSelectedProgram(selectedProgram);
    }
  };

  useEffect(() => {
    if (values.academicYear && values.program && values.sem) {
      getAssesmentId();
    }

    if (values.assesmentId && values.sem) {
      getCourseId();
    }
  }, [values.academicYear, values.program, values.sem, values.assesmentId]);

  const handleSubmit = async () => {
    setLoading(true)
    await axios
      .get(
        `/api/student/getInternalDetailsData/${values.academicYear}/${values.assesmentId}/${values.sem}/${values.program}/${values.course}`
      )
      .then((res) => {
        setData(res.data.data);
        setLoading(false)
      })
    setLoading(false)
      .catch((err) => console.error(err));
    setLoading(false)

  };


  return (
    <>
      {Data.length > 0 ?
        <>
          <Box sx={{ position: "relative", mt: 2 }}>
            <Button

              variant="contained"
              sx={{ position: "absolute", right: 0, top: -57, borderRadius: 2 }}
              onClick={handleSave}
              disabled={values?.course?.length === 0 || loading}
            >
              {loading ? (
                <CircularProgress
                  size={20}
                  color="blue"
                  style={{ margin: "0px 16px" }}
                />
              ) : (
                <Typography variant="subtitle2">Submit</Typography>
              )}
            </Button>

          </Box>
        </>
        : <>
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
                  // disabled={Data.length > 0}
                  />
                </Grid>



                <Grid item xs={12} md={3}>
                  <CustomSelect
                    name="program"
                    label="Program*"
                    value={values.program}
                    items={programOptions}
                    handleChange={handleChange}
                  //disabled={Data.length > 0}
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <CustomSelect
                    name="sem"
                    label="Sem*"
                    value={values.sem}
                    items={semeOption}
                    handleChange={handleChange}
                  //disabled={Data.length > 0}
                  />
                </Grid>

                <Grid item xs={12} md={3}>
                  <CustomSelect
                    name="assesmentId"
                    label="Exam*"
                    value={values.assesmentId}
                    items={assessmentId}
                    handleChange={handleChange}
                  //disabled={Data.length > 0}
                  />
                </Grid>

                <Grid item xs={12} md={3}>
                  <CustomSelect
                    name="course"
                    label="Course*"
                    value={values.course}
                    items={courseId}
                    handleChange={handleChange}
                  //disabled={Data.length > 0}
                  />
                </Grid>
              </Grid>

              <Grid item xs={12} mt={1} align="right">

                <Button

                  variant="contained"
                  sx={{ borderRadius: 2 }}
                  onClick={handleSubmit}
                  disabled={values?.course?.length === 0 || loading} >
                  {loading ? (
                    <CircularProgress
                      size={20}
                      color="blue"
                      style={{ margin: "0px 16px" }}
                    />
                  ) : (
                    <Typography variant="subtitle2">Submit</Typography>
                  )}
                </Button>
              </Grid>


            </Grid>


          </Grid>
        </>}
      <Grid item xs={12} mt={2}>
        {Data.length > 0 && (
          <TableContainer component={Paper}>
            <Table
              size="small"
              sx={{ borderSpacing: "1px" }}
            >
              <TableHead>
                <TableRow>
                  {/* <StyledTableCell>Sl.No.</StyledTableCell> */}
                  <StyledTableCell>Auid</StyledTableCell>
                  <StyledTableCell>Name</StyledTableCell>
                  {/* <StyledTableCell>USN</StyledTableCell> */}
                  <StyledTableCell>MAX MARKS</StyledTableCell>
                  <StyledTableCell>MIN MARKS</StyledTableCell>
                  <StyledTableCell>Marks</StyledTableCell>
                  <StyledTableCell>Percentage</StyledTableCell>

                </TableRow>
              </TableHead>
              <TableBody>
                {Data.map((row, index) => {
                  if (row?.marks_obtained_internal === null) {
                    return (
                      <TableRow
                        key={index}
                        sx={{ outline: "1px solid rgba(224, 224, 224, 1)" }}
                      >
                        {/* <StyledTableCell>{index + 1}</StyledTableCell> */}
                        <StyledTableCell>{row?.auid}</StyledTableCell>
                        <StyledTableCell>{row?.student_name}</StyledTableCell>
                        {/* <StyledTableCell>
                      {row?.USN}
                    </StyledTableCell> */}
                        <StyledTableCell>{row?.max_marks}</StyledTableCell>
                        <StyledTableCell>{row?.min_marks}</StyledTableCell>
                        <StyledInputCell width={115} >
                          <CustomTextField
                            type="number"
                            value={row?.marks}
                            style={{ textAlign: "center" }}

                            onChange={(e) => {
                              const newMarks = parseFloat(e.target.value);
                              if (newMarks >= 0 && newMarks <= row?.max_marks) {
                                const newData = [...Data];
                                newData[index] = { ...row, marks: newMarks };
                                setData(newData); // Assuming you have a state variable setData to update your data
                                const newPercentage = (newMarks / row?.max_marks) * 100;
                                newData[index] = { ...row, marks: newMarks, percentage: newPercentage };
                                setData(newData);
                              } else {

                                setAlertMessage({
                                  severity: "error",
                                  message: newMarks < 0 ? "Enter Valid Marks" : "Marks cannot be more than Max-Marks",
                                });
                                setAlertOpen(true);
                              }
                            }}
                          />
                        </StyledInputCell>

                        <StyledTableCell>{row?.percentage !== undefined
                          ? Number.isInteger(row?.percentage)
                            ? row?.percentage
                            : row?.percentage.toFixed(1)
                          : ""}</StyledTableCell>

                      </TableRow>
                    );
                  } else {
                    return null; // Do not render the row if auid or student_id is null
                  }
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Grid>
    </>
  );
};

export default StudentMarks;
