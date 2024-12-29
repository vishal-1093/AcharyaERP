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
import file from "../../../assets/sampleData.xlsx";
import ModalWrapper from "../../../components/ModalWrapper";
import CustomFileInput from "../../../components/Inputs/CustomFileInput";
import moment from "moment";
import CustomSelect from "../../../components/Inputs/CustomSelect";
import * as XLSX from "xlsx";
import CustomRadioButtons from "../../../components/Inputs/CustomRadioButtons";

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
  type: "",
  teachingMode: "",
  learningStyle: "",
  fieldType: ""
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

const requiredFieldsOne = ["acYearId", "courseId", "fieldType", "planDate", "type", "lessonPlanContents", "teachingAid", "teachingMode", "learningStyle"];
const requiredFieldsTwo = ["acYearId", "courseId", "fieldType", "fileName"];

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
      values.fileName && values?.fileName?.name?.endsWith(".xlsx"),
    ],
  };

  const errorMessages = {
    fileName: ["This field is required", "Please upload a xlsx File"],
  };

  const maxLength = 20;

  const getRemainingCharacters = (field) => maxLength - values[field].length;

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
    try {
      const response = await axios.get("/api/academic/academic_year");
      if (!response.data || !response.data.data) {
        throw new Error("Invalid response format");
      }
      const optionData = [];
      response.data.data.forEach((obj) => {
        if (obj.current_year >= 2023) {
          optionData.push({ value: obj.ac_year_id, label: obj.ac_year });
        }
      });

      setAcYearOptions(optionData);
    } catch (err) {
      setAlertMessage({
        severity: "error",
        message: err.message || "Failed to fetch the academic years !!",
      });
      setAlertOpen(true);
    }
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
    if (e.target.name === "teachingAid" && e.target.value.length > maxLength)
      return;
    setValues({
      ...values,
      [e.target.name]: e.target.value,
    });
    if (e.target.name === "fieldType") {
      setValues({
        ...values,
        planDate: "",
        lessonPlanContents: "",
        type: "",
        teachingAid: "",
        teachingMode: "",
        learningStyle: "",
        fileName: "",
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleReload = () => {
    window.location.reload();
  };

  const handleFileDrop = async (name, newFile) => {
    if (!newFile) return;

    try {
      const arrayBuffer = await newFile.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[1]];
      const csv = XLSX.utils.sheet_to_csv(sheet);
      if (!csv || csv.trim().length === 0) {
        throw new Error("The uploaded file has no data or is invalid.");
      }
      const csvBlob = new Blob([csv], { type: "text/csv" });
      const csvFile = new File([csvBlob], newFile.name, {
        type: "text/csv",
        lastModified: new Date().getTime(),
      });
      setValues((prev) => ({
        ...prev,
        [name]: csvFile,
      }));
    } catch (error) {
      console.error("Error processing file:", error);
      alert("Failed to process the file. Please upload a valid Excel file.");
    }
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
    const requiredFields = values.fieldType === "FIELD-1" ? requiredFieldsOne : requiredFieldsTwo
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
          type: values.type,
          teaching_mode: values.teachingMode,
          learning_style: values.learningStyle,
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
        type: obj.type,
        teaching_mode: obj.teaching_mode,
        learning_style: obj.learning_style,
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

  // const element = (
  //   <a href={file} download style={{ textDecoration: "none", color: "white" }}>
  //     Download Sample File
  //   </a>
  // );
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = file;
    link.download = "LessonPlan.xlsx";
    link.click();
  };

  return (
    <Box component="form" overflow="hidden" p={1}>
      <ModalWrapper maxWidth={1500} open={modalOpen} setOpen={setModalOpen}>
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

          <Grid item xs={12} md={12}>
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
                    <StyledTableCell sx={{ width: 100, textAlign: "center" }}>
                      Type
                    </StyledTableCell>
                    <StyledTableCell sx={{ width: 100, textAlign: "center" }}>
                      Learning Style
                    </StyledTableCell>
                    <StyledTableCell sx={{ width: 100, textAlign: "center" }}>
                      Teaching Mode
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
                          <StyledTableCell
                            sx={{ width: 100, textAlign: "center" }}
                          >
                            {obj.type}
                          </StyledTableCell>
                          <StyledTableCell
                            sx={{ width: 100, textAlign: "center" }}
                          >
                            {obj.learning_style}
                          </StyledTableCell>
                          <StyledTableCell
                            sx={{ width: 100, textAlign: "center" }}
                          >
                            {obj.teaching_mode}
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

          <Grid item xs={12} md={4}>
            <CustomRadioButtons
              name="fieldType"
              value={values.fieldType}
              label="Choose one"
              handleChange={handleChange}
              items={[
                { label: "Instant", value: "FIELD-1" },
                { label: "Bulk upload", value: "FIELD-2" },
              ]}
              required
              sx={{
                '& .MuiFormControlLabel-label': {
                  fontSize: 24, // Increase the font size for labels
                  fontWeight: 'bold',
                },
                '& .MuiRadio-root': {
                  size: 'large', // Adjust the radio button size
                },
                '& .MuiFormControlLabel-root': {
                  fontSize: 24, // Increase the font size for the radio button text
                },
              }}
            />
          </Grid>
          {values.fieldType === "FIELD-1" && <> <Grid item xs={12} md={12}>
            <Typography variant="subtitle2" style={{ fontSize: 16 }}>
              FIELD-1
            </Typography>
          </Grid>
            <Grid item xs={12} md={2}>
              <CustomDatePicker
                name="planDate"
                label="Plan Date"
                value={values.planDate}
                handleChangeAdvance={handleChangeAdvance}
                required
              />
            </Grid>

            <Grid item xs={12} md={2} mb={2.8}>
              <CustomTextField
                name="lessonPlanContents"
                label="Lesson Plan Contents"
                value={values.lessonPlanContents}
                handleChange={handleChange}
                checks={checks.lessonPlanContents}
                errors={errorMessages.lessonPlanContents}
                required
              />
            </Grid>

            <Grid item xs={12} md={2} mb={2.8}>
              <CustomSelect
                name="type"
                label="Type"
                value={values.type}
                handleChange={handleChange}
                items={[
                  { value: "Cognitive", label: "Cognitive" },
                  { value: "Psychomotor", label: "Psychomotor" },
                  { value: "Attitude", label: "Attitude" },
                ]}
                checks={checks.type}
                errors={errorMessages.type}
                required
              />
            </Grid>
            <Grid item xs={12} md={2} mb={2.8}>
              <CustomSelect
                name="learningStyle"
                label="Learning Style"
                value={values.learningStyle}
                handleChange={handleChange}
                items={[
                  { value: "Participative", label: "Participative" },
                  { value: "Experiential", label: "Experiential" },
                  { value: "Problem Solving", label: "Problem Solving" },
                ]}
                checks={checks.type}
                errors={errorMessages.type}
                required
              />
            </Grid>
            <Grid item xs={12} md={2} mb={2.8}>
              <CustomSelect
                name="teachingMode"
                label="Teaching Mode"
                value={values.teachingMode}
                handleChange={handleChange}
                items={[
                  { value: "Offline", label: "Offline" },
                  { value: "Online", label: "Online" },
                  { value: "Hybrid", label: "Hybrid" },
                ]}
                checks={checks.teachingMode}
                errors={errorMessages.teachingMode}
                required
              />
            </Grid>

            <Grid item xs={12} md={2} mb={2.8}>
              <CustomTextField
                name="teachingAid"
                label="Teaching Aid"
                value={values.teachingAid}
                handleChange={handleChange}
                checks={checks.teachingAid}
                errors={errorMessages.teachingAid}
                helperText={`Remaining characters : ${getRemainingCharacters(
                  "teachingAid"
                )}`}
                required
              />
            </Grid></>}
          {values.fieldType === "FIELD-2" && <>  <Grid item xs={12} md={12}>
            <Typography variant="subtitle2" style={{ fontSize: 16 }}>
              FIELD-2
            </Typography>
          </Grid>
            <Grid item xs={12} md={4}>
              <CustomFileInput
                name="fileName"
                label="xlsx File"
                helperText="xlsx - smaller than 2 MB"
                file={values.fileName}
                handleFileDrop={handleFileDrop}
                handleFileRemove={handleFileRemove}
                checks={checks.fileName}
                errors={errorMessages.fileName}
                disabled={
                  values.teachingAid !== "" && values.lessonPlanContents !== ""
                }
                required
              />

            </Grid>

            <Grid item xs={12} ml={4}>
              <Button
                variant="contained"
                color="success"
                onClick={handleDownload}
              >
                {"Download Sample File"}
              </Button>
            </Grid></>}

          <Grid item xs={12} align="right">
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
