import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Box, Grid, Button, CircularProgress, Typography } from "@mui/material";
import FormWrapper from "../../../components/FormWrapper";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";
import axios from "../../../services/Api";
import useAlert from "../../../hooks/useAlert";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import Divider from "@mui/material/Divider";
import CustomDatePicker from "../../../components/Inputs/CustomDatePicker";
import file from "../../../assets/file.csv";

const initialValues = {
  acYearId: null,
  schoolId: null,
  programId: null,
  programSpeId: null,
  yearsemId: null,
  sectionId: null,
  courseId: null,
  referenceBook: "",
  planDate: null,
  lessonPlanContents: "",
  teachingAid: "",
};

const requiredFields = [
  "acYearId",
  "schoolId",
  "programId",
  "programSpeId",
  "yearsemId",
  "courseId",
  "referenceBook",
];

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
  const [programType, setProgramType] = useState("Sem");
  const [fileUpload, setFileUpload] = useState("");

  const { id } = useParams();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { setAlertMessage, setAlertOpen } = useAlert();
  const setCrumbs = useBreadcrumbs();

  const checks = {};

  const errorMessages = {};

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
    getYearSemData();
    getSectionData();
    getReferenceBookData();
    getCourseData();
  }, [
    values.acYearId,
    values.schoolId,
    programId,
    values.programSpeId,
    values.yearsemId,
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
            label: obj.school_name_short,
          }))
        );
      })
      .catch((err) => console.error(err));
  };

  const getProgramSpeData = async () => {
    if (values.acYearId && values.schoolId)
      await axios
        .get(
          `/api/academic/fetchProgramWithSpecialization/${values.acYearId}/${values.schoolId}`
        )
        .then((res) => {
          setProgramSpeOptions(
            res.data.data.map((obj) => ({
              value: obj.program_specialization_id,
              label: obj.specialization_with_program,
            }))
          );
        })
        .catch((err) => console.error(err));
  };

  const getYearSemData = async (id) => {
    if (values.acYearId && values.schoolId && values.programSpeId)
      await axios
        .get(
          `/api/academic/FetchAcademicProgram/${values.acYearId}/${
            isNew ? programId : values.programIdForUpdate
          }/${values.schoolId}`
        )
        .then((res) => {
          const yearsem = [];
          res.data.data.map((obj) => {
            if (obj.program_type_id === 2) {
              setProgramType("Sem");
              for (let i = 1; i <= obj.number_of_semester; i++) {
                yearsem.push({ value: i, label: "Sem" + "-" + i });
              }
            } else if (obj.program_type_id === 1) {
              setProgramType("Year");
              for (let i = 1; i <= obj.number_of_years; i++) {
                yearsem.push({ value: i, label: "Year" + "-" + i });
              }
            }
          });

          setYearSemOptions(
            yearsem.map((obj) => ({
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
    if (values.schoolId && values.programSpeId)
      await axios
        .get(
          `/api/academic/referenceBooksForLessonPlan/${values.schoolId}/${values.programSpeId}`
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
    if (
      values.acYearId &&
      values.schoolId &&
      values.programSpeId &&
      values.yearsemId
    )
      await axios
        .get(
          `/api/academic/coursesForLessonPlan/${values.schoolId}/${programId}/${values.programSpeId}/${values.yearsemId}`
        )
        .then((res) => {
          setSubjectOptions(
            res.data.data.map((obj) => ({
              value: obj.course_id,
              label: obj.course,
            }))
          );
        })
        .catch((err) => console.error(err));
  };

  const handleChange = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value,
    });
  };

  const handleChangeAdvance = async (name, newValue) => {
    if (name === "programSpeId") {
      await axios
        .get(
          `/api/academic/fetchProgramWithSpecialization/${values.acYearId}/${values.schoolId}`
        )
        .then((res) => {
          setProgramId(
            res.data.data
              .filter((val) => val.program_specialization_id === newValue)
              .map((obj) => {
                return obj.program_id;
              })
          );
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
      setLoading(true);
      if (values.planDate && values.lessonPlanContents !== "") {
        const temp = {};
        const lp = {};
        const lpa = {};
        lp.ac_year_id = values.acYearId;
        lp.actve = true;
        lp.book_id = values.referenceBook;
        lp.program_id = programId.toString();
        lp.program_specialization_id = values.programSpeId;
        lp.school_id = values.schoolId;
        lp.section_id = values.sectionId;
        lp.subject_id = values.courseId;
        lp.year_sem = values.yearsemId;
        temp.lp = lp;
        lpa.active = true;
        lpa.contents = values.lessonPlanContents;
        lpa.plan_date = values.planDate;
        lpa.teaching_aid = values.teachingAid;
        temp.lpa = lpa;

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
        const dataArray = new FormData();
        dataArray.append("ac_year_id", values.acYearId);
        dataArray.append("active", true);
        dataArray.append("book_id", values.referenceBook);
        dataArray.append("file", fileUpload);
        dataArray.append("program_id", programId);
        dataArray.append("program_specialization_id", values.programSpeId);
        dataArray.append("school_id", values.schoolId);
        dataArray.append("section_id", 1);
        dataArray.append("year_sem", values.yearsemId);
        dataArray.append("subject_id", values.courseId);

        await axios
          .post(`/api/academic/LessonPlan`, dataArray)
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
      }
    }
  };

  let element = (
    <a href={file} style={{ textDecoration: "none", color: "white" }}>
      Download Sample File
    </a>
  );

  return (
    <Box component="form" overflow="hidden" p={1}>
      <FormWrapper>
        <Grid
          container
          alignItems="center"
          justifyContent="flex-start"
          rowSpacing={2.8}
          columnSpacing={{ xs: 2, md: 4 }}
        >
          <Grid item xs={12} md={4}>
            <CustomAutocomplete
              name="acYearId"
              label="AC Year"
              value={values.acYearId}
              options={acYearOptions}
              handleChangeAdvance={handleChangeAdvance}
              required
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <CustomAutocomplete
              name="schoolId"
              label="School"
              value={values.schoolId}
              options={schoolOptions}
              handleChangeAdvance={handleChangeAdvance}
              required
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <CustomAutocomplete
              name="programSpeId"
              label="Program Major"
              value={values.programSpeId}
              options={programSpeOptions}
              handleChangeAdvance={handleChangeAdvance}
              required
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <CustomAutocomplete
              name="yearsemId"
              label="Year/Sem"
              value={values.yearsemId}
              options={yearSemOptions}
              handleChangeAdvance={handleChangeAdvance}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <CustomAutocomplete
              name="sectionId"
              label="Section"
              value={values.sectionId}
              options={sectionOptions}
              handleChangeAdvance={handleChangeAdvance}
              // required
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <CustomAutocomplete
              name="courseId"
              label="Course"
              value={values.courseId}
              options={subjectOptions}
              handleChangeAdvance={handleChangeAdvance}
              required
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <CustomAutocomplete
              name="referenceBook"
              label="Reference Book"
              value={values.referenceBook}
              options={referenceBookOptions}
              handleChangeAdvance={handleChangeAdvance}
              required
            />
          </Grid>

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
          <Grid item xs={12} md={3}>
            <input
              type="file"
              onChange={handleUpload}
              disabled={
                values.teachingAid !== "" && values.lessonPlanContents !== ""
              }
            />
          </Grid>

          <Grid item xs={12} md={9}>
            <Button variant="contained" color="success">
              {element}
            </Button>
          </Grid>

          <Grid item textAlign="right">
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
