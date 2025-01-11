import { useEffect, useState } from "react";
import axios from "../../../services/Api";
import { Box, Button, Grid } from "@mui/material";
import FormPaperWrapper from "../../../components/FormPaperWrapper";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";
import useAlert from "../../../hooks/useAlert";

const initialValues = { courseId: null };

const userId = JSON.parse(sessionStorage.getItem("AcharyaErpUser"))?.userId;
const empId = JSON.parse(sessionStorage.getItem("empId"));

function DetailedAttendanceReport() {
  const [values, setValues] = useState(initialValues);
  const [acyearOptions, setAcyearOptions] = useState([]);
  const [courseOptions, setCourseOptions] = useState([]);

  const { setAlertMessage, setAlertOpen } = useAlert();

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

  const handleChangeAdvance = (name, newValue) => {
    setValues((prev) => ({ ...prev, [name]: newValue }));
  };

  const handleSubmit = async () => {
    const { acyearId, courseId } = values;
    if (!acyearId || !courseId) return;
    try {
      const response = await axios.get(
        `/api/student/getDetailedStudentAttendanceReportSectionwiseForEmployee?ac_year_id=${acyearId}&emp_id=${empId}&course_assignment_id=${courseId}`
      );
      console.log("response :>> ", response.data.data);
    } catch (err) {
      setAlertMessage({
        severity: "error",
        message: err.response?.data?.message || "Something went wrong.",
      });
      setAlertOpen(true);
    }
  };

  return (
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
        </Grid>
      </FormPaperWrapper>
    </Box>
  );
}

export default DetailedAttendanceReport;
