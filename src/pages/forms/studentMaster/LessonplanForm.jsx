import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  Grid,
  Button,
  CircularProgress,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  tableCellClasses,
  styled,
  Paper,
} from "@mui/material";
import FormWrapper from "../../../components/FormWrapper";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";
import axios from "../../../services/Api";
import useAlert from "../../../hooks/useAlert";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import Divider from "@mui/material/Divider";
import CustomDatePicker from "../../../components/Inputs/CustomDatePicker";
import file from "../../../assets/file.csv";
import ModalWrapper from "../../../components/ModalWrapper";
import CustomFileInput from "../../../components/Inputs/CustomFileInput";
import moment from "moment";

const initialValues = {
  acYearId: null,
  schoolId: null,
  programId: null,
  programSpeId: null,
  yearsemId: null,
  courseId: null,
  referenceBook: "",
  planDate: null,
  lessonPlanContents: "",
  teachingAid: "",
  fileName: "",
};

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.headerWhite.main,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const userId = JSON.parse(sessionStorage.getItem("AcharyaErpUser"))?.userId;

const requiredFields = [];

function LessonplanForm() {
  const [isNew, setIsNew] = useState(true);
  const [values, setValues] = useState(initialValues);
  const [acYearOptions, setAcYearOptions] = useState([]);
  const [schoolOptions, setSchoolOptions] = useState([]);
  const [programSpeOptions, setProgramSpeOptions] = useState([]);
  const [yearSemOptions, setYearSemOptions] = useState([]);
  const [sectionOptions, setSectionOptions] = useState([]);
  const [subjectOptions, setSubjectOptions] = useState([]);
  const [referenceBookOptions, setReferenceBookOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [programId, setProgramId] = useState(null);
  const [fileUpload, setFileUpload] = useState("");
  const [programAssigmentId, setProgramAssignmentId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [lessonplanData, setLessonplanData] = useState([]);
  const [alert, setAlert] = useState();

  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { setAlertMessage, setAlertOpen } = useAlert();
  const setCrumbs = useBreadcrumbs();

  const checks = {
    fileName: [
      values.fileName,
      values.fileName && values.fileName.name.endsWith(".csv"),
    ],
  };

  const errorMessages = {
    fileName: ["This field is required", "Please upload a CSV File"],
  };

  useEffect(() => {
    getAcademicYearData();
    getSchoolData();
    if (pathname.toLowerCase() === "/studentmaster/lessonplanform") {
      setIsNew(true);
      setCrumbs([
        { name: "Lesson Plan Index", link: "/StudentMaster/LessonplanIndex" },
        { name: "Lesson Plan" },
        { name: "Create" },
      ]);
    } else {
      setIsNew(false);
    }
  }, [pathname]);

  useEffect(() => {
    getProgramSpeData();
    getSectionData();
    getReferenceBookData();
    getCourseData();
  }, [
    values.acYearId,
    values.schoolId,
    programId,
    values.programSpeId,
    values.yearsemId,
    values.courseId,
  ]);

  const getAcademicYearData = async () => {
    await axios
      .get(`/api/academic/academic_year`)
      .then((res) => {
        setAcYearOptions(
          res.data.data.map((obj) => ({
            value: obj.ac_year_id,
            label: obj.ac_year,
          }))
        );
      })
      .catch((err) => console.error(err));
  };

  const getSchoolData = async () => {
    await axios
      .get(`/api/institute/school`)
      .then((res) => {
        setSchoolOptions(
          res.data.data.map((obj) => ({
            value: obj.school_id,
            label: obj.school_name,
          }))
        );
      })
      .catch((err) => console.error(err));
  };

  const getProgramSpeData = async () => {
    if (values.acYearId && values.schoolId)
      await axios
        .get(
          `/api/academic/fetchAllProgramsWithSpecialization/${values.schoolId}`
        )
        .then((res) => {
          setProgramSpeOptions(
            res.data.data.map((obj) => ({
              value: obj.program_specialization_id,
              label: obj.specialization_with_program,
            }))
          );

          const yearsem = [];
          res.data.data.forEach((obj) => {
            if (obj.program_specialization_id === values.programSpeId) {
              yearsem.push(obj);
            }
          });

          const newYear = [];
          yearsem.forEach((obj) => {
            if (obj.program_type_name.toLowerCase() === "yearly") {
              for (let i = 1; i <= obj.number_of_years; i++) {
                newYear.push({ value: i, label: "Year" + "-" + i });
              }
            }
            if (obj.program_type_name.toLowerCase() === "semester") {
              for (let i = 1; i <= obj.number_of_semester; i++) {
                newYear.push({ value: i, label: "Sem" + "-" + i });
              }
            }
          });

          setYearSemOptions(
            newYear.map((obj) => ({
              value: obj.value,
              label: obj.label,
            }))
          );
        })
        .catch((err) => console.error(err));
  };

  const getSectionData = async () => {
    if (
      values.acYearId &&
      values.schoolId &&
      values.programSpeId &&
      values.yearsemId
    )
      await axios
        .get(
          `/api/academic/sectionNameDetails/${values.acYearId}/${values.schoolId}/${programId}/${values.programSpeId}/${values.yearsemId}`
        )
        .then((res) => {
          setSectionOptions(
            res.data.data.map((obj) => ({
              value: obj.section_id,
              label: obj.section_name,
            }))
          );
        })
        .catch((err) => console.error(err));
  };

  const getReferenceBookData = async () => {
    if (values.programSpeId && values.courseId)
      await axios
        .get(
          `/api/academic/referenceBooksForLessonPlan/${values.programSpeId}/${values.courseId}`
        )
        .then((res) => {
          setReferenceBookOptions(
            res.data.data.map((obj) => ({
              value: obj.book_id,
              label: obj.title_of_book,
            }))
          );
        })
        .catch((err) => console.error(err));
  };

  const getCourseData = async () => {
    if (userId) {
      await axios
        .get(`/api/academic/getSubjectAssignmentDetailsData/${userId}`)
        .then((res) => {
          setSubjectOptions(
            res.data.data.map((obj) => ({
              value: obj.id,
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
            }))
          );
        })
        .catch((err) => console.error(err));
    }
  };

  const handleChange = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value,
    });
  };

  const handleReload = () => {
    window.location.reload();
  };

  const handleFileDrop = (name, newFile) => {
    if (newFile)
      setValues((prev) => ({
        ...prev,
        [name]: newFile,
      }));
  };
  const handleFileRemove = (name) => {
    setValues((prev) => ({
      ...prev,
      [name]: null,
    }));
  };

  const handleChangeAdvance = async (name, newValue) => {
    if (name === "courseId") {
      const selectedCourse = subjectOptions.find(
        (obj) => obj.value === newValue
      );
      setValues((prev) => ({
        ...prev,
        ["schoolId"]: selectedCourse.school_id,
        ["yearsemId"]: selectedCourse.year_sem,
        ["programSpeId"]: selectedCourse.program_specialization_id,
      }));
    }
    if (name === "programSpeId") {
      await axios
        .get(
          `/api/academic/fetchAllProgramsWithSpecialization/${values.schoolId}`
        )
        .then((res) => {
          res.data.data.filter((val) => {
            if (val.program_specialization_id === newValue) {
              setProgramId(val.program_id);
              setProgramAssignmentId(val.program_assignment_id);
            }
          });
        })
        .catch((err) => console.error(err));
      setValues((prev) => ({
        ...prev,
        [name]: newValue,
      }));
    } else {
      setValues((prev) => ({
        ...prev,
        [name]: newValue,
      }));
    }
  };

  const handleUpload = (e) => {
    if (e.target.files[0].name.includes(".csv") !== true) {
      setAlertMessage({
        severity: "error",
        message: "Upload only CSV format according to the sample file",
      });
      setAlertOpen(true);
    } else {
      setFileUpload(e.target.files[0]);
    }
  };

  const requiredFieldsValid = () => {
    for (let i = 0; i < requiredFields.length; i++) {
      const field = requiredFields[i];
      if (Object.keys(checks).includes(field)) {
        const ch = checks[field];
        for (let j = 0; j < ch.length; j++) if (!ch[j]) return false;
      } else if (!values[field]) return false;
    }
    return true;
  };

  const handleCreate = async () => {
    if (!requiredFieldsValid()) {
      setAlertMessage({
        severity: "error",
        message: "Please fill all required fields",
      });
      setAlertOpen(true);
    } else {
      if (values.planDate && values.lessonPlanContents !== "") {
        const temp = {};
        const lp = {};
        const tempOne = [];

        const selectedCourse = subjectOptions.find(
          (obj) => obj.value === Number(values.courseId)
        );

        lp.ac_year_id = values.acYearId;
        lp.active = true;
        lp.book_id = values.referenceBook;
        lp.program_id = selectedCourse.program_id;
        lp.program_assignment_id = selectedCourse.program_assignment_id;
        lp.program_specialization_id = selectedCourse.program_specialization_id;
        lp.school_id = values.schoolId;
        lp.section_id = values.sectionId;
        lp.course_assignment_id = selectedCourse.course_assignment_id;
        lp.year_sem = selectedCourse.year_sem;
        lp.subject_assignment_id = values.courseId;
        lp.user_id = userId;
        temp.lp = lp;
        tempOne.push({
          active: true,
          contents: values.lessonPlanContents,
          plan_date: moment(values.planDate).format("DD-MM-YYYY"),
          teaching_aid: values.teachingAid,
        });

        temp.lpa = tempOne;

        setLoading(true);

        await axios
          .post(`/api/academic/lessonPlan`, temp)
          .then((res) => {
            setLoading(false);
            if (res.status === 200 || res.status === 201) {
              navigate("/StudentMaster/LessonplanIndex", { replace: true });
              setAlertMessage({
                severity: "success",
                message: "Lesson Plan created",
              });
            } else {
              setAlertMessage({
                severity: "error",
                message: res.data ? res.data.message : "An error occured",
              });
            }
            setAlertOpen(true);
          })
          .catch((err) => {
            setLoading(false);
            setAlertMessage({
              severity: "error",
              message: err.response
                ? err.response.data.message
                : "An error occured",
            });
            setAlertOpen(true);
          });
      } else {
        const selectedCourse = subjectOptions.find(
          (obj) => obj.value === Number(values.courseId)
        );

        const dataArray = new FormData();
        dataArray.append("ac_year_id", values.acYearId);
        dataArray.append("active", true);
        dataArray.append("book_id", values.referenceBook);
        dataArray.append("file", values.fileName);
        dataArray.append("program_id", selectedCourse.program_id);
        dataArray.append(
          "program_specialization_id",
          selectedCourse.program_specialization_id
        );
        dataArray.append(
          "program_assignment_id",
          selectedCourse.program_assignment_id
        );
        dataArray.append("school_id", values.schoolId);
        dataArray.append("subject_assignment_id", values.courseId);
        dataArray.append("user_id", userId);
        dataArray.append("year_sem", selectedCourse.year_sem);
        dataArray.append(
          "course_assignment_id",
          selectedCourse.course_assignment_id
        );

        await axios
          .post(`/api/academic/LessonPlan`, dataArray)
          .then((res) => {
            setLoading(false);
            if (res.status === 200 || res.status === 201) {
              setModalOpen(true);
              setLessonplanData(res.data.data);
            } else {
              setAlertMessage({
                severity: "error",
                message: res.data ? res.data.message : "An error occured",
              });
            }
          })
          .catch((err) => {
            setLoading(false);
            setAlertMessage({
              severity: "error",
              message: err.response
                ? err.response.data.message
                : "An error occured",
            });
            setAlertOpen(true);
          });
      }
    }
  };

  const handleCreateCsvfile = async () => {
    const temp = {};
    const lp = {};
    const tempOne = [];

    const selectedCourse = subjectOptions.find(
      (obj) => obj.value === Number(values.courseId)
    );

    lp.ac_year_id = values.acYearId;
    lp.active = true;
    lp.book_id = values.referenceBook;
    lp.program_id = selectedCourse.program_id;
    lp.program_assignment_id = selectedCourse.program_assignment_id;
    lp.program_specialization_id = selectedCourse.program_specialization_id;
    lp.school_id = values.schoolId;
    lp.section_id = values.sectionId;
    lp.course_assignment_id = selectedCourse.course_assignment_id;
    lp.year_sem = selectedCourse.year_sem;
    lp.subject_assignment_id = values.courseId;
    lp.user_id = userId;
    temp.lp = lp;
    lessonplanData.forEach((obj, i) => {
      tempOne.push({
        active: true,
        contents: obj.contents,
        plan_date: obj.plan_date,
        teaching_aid: obj.teaching_aid,
      });
    });

    temp.lpa = tempOne;

    await axios
      .post(`/api/academic/lessonPlan`, temp)
      .then((res) => {
        setLoading(false);
        if (res.status === 200 || res.status === 201) {
          navigate("/StudentMaster/LessonplanIndex", { replace: true });
          setAlertMessage({
            severity: "success",
            message: "Lesson Plan created",
          });
        } else {
          setAlertMessage({
            severity: "error",
            message: res.data ? res.data.message : "An error occured",
          });
        }
        setAlertOpen(true);
      })
      .catch((err) => {
        setAlert(err.response.data.message);
        setLoading(false);
        setAlertMessage({
          severity: "error",
          message: err.response
            ? err.response.data.message
            : "An error occured",
        });
        setAlertOpen(true);
      });
  };

  let element = (
    <a href={file} style={{ textDecoration: "none", color: "white" }}>
      Download Sample File
    </a>
  );

  return (
    <Box component="form" overflow="hidden" p={1}>
      <ModalWrapper maxWidth={800} open={modalOpen} setOpen={setModalOpen}>
        <Grid
          container
          justifyContent="center"
          alignItems="center"
          rowSpacing={2}
          marginTop={2}
        >
          <Grid item xs={12}>
            <Grid item xs={12} align="center">
              <Typography variant="inherit" color="error">
                {alert}
              </Typography>
            </Grid>
            <Grid item xs={12} align="right">
              <Button
                variant="contained"
                color="error"
                onClick={handleReload}
                style={{ marginRight: "10px", borderRadius: 10 }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                style={{ borderRadius: 10 }}
                onClick={handleCreateCsvfile}
              >
                Upload
              </Button>
            </Grid>
          </Grid>

          <Grid item xs={12} md={10}>
            <TableContainer component={Paper}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <StyledTableCell sx={{ width: 100, textAlign: "center" }}>
                      Plan date
                    </StyledTableCell>
                    <StyledTableCell sx={{ width: 100, textAlign: "center" }}>
                      Contents
                    </StyledTableCell>
                    <StyledTableCell sx={{ width: 100, textAlign: "center" }}>
                      Teaching Aid
                    </StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {lessonplanData !== undefined ? (
                    lessonplanData.map((obj, i) => {
                      return (
                        <TableRow key={i}>
                          <StyledTableCell
                            sx={{ width: 100, textAlign: "center" }}
                          >
                            {obj.plan_date}
                          </StyledTableCell>
                          <StyledTableCell
                            sx={{ width: 100, textAlign: "center" }}
                          >
                            {obj.contents}
                          </StyledTableCell>
                          <StyledTableCell
                            sx={{ width: 100, textAlign: "center" }}
                          >
                            {obj.teaching_aid}
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
      </ModalWrapper>
      <FormWrapper>
        <Grid
          container
          alignItems="center"
          justifyContent="flex-start"
          rowSpacing={2.8}
          columnSpacing={{ xs: 2, md: 4 }}
        >
          <Grid item xs={12} md={2.4}>
            <CustomAutocomplete
              name="acYearId"
              label="AC Year"
              value={values.acYearId}
              options={acYearOptions}
              handleChangeAdvance={handleChangeAdvance}
              required
            />
          </Grid>

          <Grid item xs={12} md={2.4}>
            <CustomAutocomplete
              name="courseId"
              label="Course"
              value={values.courseId}
              options={subjectOptions}
              handleChangeAdvance={handleChangeAdvance}
              required
            />
          </Grid>

          <Grid item xs={12} md={2.4}>
            <CustomAutocomplete
              name="schoolId"
              label="School"
              value={values.schoolId}
              options={schoolOptions}
              handleChangeAdvance={handleChangeAdvance}
              required
              disabled
            />
          </Grid>

          <Grid item xs={12} md={2.4}>
            <CustomAutocomplete
              name="programSpeId"
              label="Program Major"
              value={values.programSpeId}
              options={programSpeOptions}
              handleChangeAdvance={handleChangeAdvance}
              required
              disabled
            />
          </Grid>
          <Grid item xs={12} md={2.4}>
            <CustomAutocomplete
              name="yearsemId"
              label="Year/Sem"
              value={values.yearsemId}
              options={yearSemOptions}
              handleChangeAdvance={handleChangeAdvance}
              disabled
            />
          </Grid>

          {/* <Grid item xs={12} md={4}>
            <CustomAutocomplete
              name="referenceBook"
              label="Reference Book"
              value={values.referenceBook}
              options={referenceBookOptions}
              handleChangeAdvance={handleChangeAdvance}
              required
            />
          </Grid> */}

          <Grid item xs={12} mt={2}>
            <Divider variant="middle" color="#bdbdbd" />
          </Grid>

          <Grid item xs={12} md={12} align="center">
            <Typography
              variant="inherit"
              style={{ fontSize: 18, color: "red" }}
            >
              Select Field-1 or Field-2
            </Typography>
          </Grid>
          <Grid item xs={12} md={12}>
            <Typography variant="subtitle2" style={{ fontSize: 16 }}>
              Field-1
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <CustomDatePicker
              name="planDate"
              label="Plan Date"
              value={values.planDate}
              handleChangeAdvance={handleChangeAdvance}
            />
          </Grid>
          <Grid item xs={12} md={4} mb={2.8}>
            <CustomTextField
              name="lessonPlanContents"
              label="Lesson Plan Contents"
              value={values.lessonPlanContents}
              handleChange={handleChange}
              checks={checks.lessonPlanContents}
              errors={errorMessages.lessonPlanContents}
            />
          </Grid>
          <Grid item xs={12} md={4} mb={2.8}>
            <CustomTextField
              name="teachingAid"
              label="Teaching Aid"
              value={values.teachingAid}
              handleChange={handleChange}
              checks={checks.teachingAid}
              errors={errorMessages.teachingAid}
            />
          </Grid>
          <Grid item xs={12} md={12}>
            <Typography variant="subtitle2" style={{ fontSize: 16 }}>
              Field-2
            </Typography>
          </Grid>

          <Grid item xs={12} md={4}>
            <CustomFileInput
              name="fileName"
              label="CSV File"
              helperText="PDF - smaller than 2 MB"
              file={values.fileName}
              handleFileDrop={handleFileDrop}
              handleFileRemove={handleFileRemove}
              checks={checks.fileName}
              errors={errorMessages.fileName}
              disabled={
                values.teachingAid !== "" && values.lessonPlanContents !== ""
              }
            />
          </Grid>

          <Grid item xs={12} md={9} ml={20}>
            <Button variant="contained" color="success">
              {element}
            </Button>
          </Grid>

          <Grid item sx={12} align="right">
            <Button
              style={{ borderRadius: 7 }}
              variant="contained"
              color="primary"
              disabled={loading}
              onClick={isNew ? handleCreate : ""}
            >
              {loading ? (
                <CircularProgress
                  size={25}
                  color="blue"
                  style={{ margin: "2px 13px" }}
                />
              ) : (
                <strong>{isNew ? "Create" : "Update"}</strong>
              )}
            </Button>
          </Grid>
        </Grid>
      </FormWrapper>
    </Box>
  );
}

export default LessonplanForm;
