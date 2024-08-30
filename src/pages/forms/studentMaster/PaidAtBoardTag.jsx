import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Box, Grid, Button, CircularProgress } from "@mui/material";
import FormWrapper from "../../../components/FormWrapper";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";
import axios from "../../../services/Api";
import useAlert from "../../../hooks/useAlert";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import moment from "moment";

const initialValues = {
  boardId: null,
  acYearId: null,
  schoolId: null,
  programId: null,
  programSpeId: null,
  yearsemId: null,
};

const userId = JSON.parse(sessionStorage.getItem("AcharyaErpUser"))?.userId;

const requiredFields = [];

function PaidAtBoardTag() {
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
    setCrumbs([{ name: "Paid At Board" }]);
  }, [pathname]);

  useEffect(() => {
    getProgramSpeData();
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
          <Grid item xs={12} md={2.4}>
            <CustomAutocomplete
              name="boardId"
              label="Board"
              value={values.boardId}
              options={acYearOptions}
              handleChangeAdvance={handleChangeAdvance}
              required
            />
          </Grid>

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
              name="schoolId"
              label="School"
              value={values.schoolId}
              options={schoolOptions}
              handleChangeAdvance={handleChangeAdvance}
              required
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
            />
          </Grid>
          <Grid item xs={12} md={2.4}>
            <CustomAutocomplete
              name="yearsemId"
              label="Year/Sem"
              value={values.yearsemId}
              options={yearSemOptions}
              handleChangeAdvance={handleChangeAdvance}
            />
          </Grid>

          <Grid item xs={12} align="right">
            <Button
              style={{ borderRadius: 7 }}
              variant="contained"
              color="primary"
              disabled={loading}
              onClick={handleCreate}
            >
              {loading ? (
                <CircularProgress
                  size={25}
                  color="blue"
                  style={{ margin: "2px 13px" }}
                />
              ) : (
                <strong>{"Submit"}</strong>
              )}
            </Button>
          </Grid>
        </Grid>
      </FormWrapper>
    </Box>
  );
}

export default PaidAtBoardTag;
