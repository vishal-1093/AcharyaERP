import { useEffect, useState } from "react";
import axios from "../../../services/Api";
import useAlert from "../../../hooks/useAlert";
import { Backdrop, Box, Button, CircularProgress, Grid } from "@mui/material";
import FormPaperWrapper from "../../../components/FormPaperWrapper";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";
import DetailedAttendanceReport from "./DetailedAttendanceReport";

const initialValues = { courseId: null };

const userId = JSON.parse(sessionStorage.getItem("AcharyaErpUser"))?.userId;
const empId = JSON.parse(sessionStorage.getItem("empId"));

function DetailedAttendancefilter() {
  const [values, setValues] = useState(initialValues);
  const [acyearOptions, setAcyearOptions] = useState([]);
  const [courseOptions, setCourseOptions] = useState([]);
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);

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
      const timeSlots = {};
      sortedDates.forEach((obj) => {
        const presentCount = responseData[obj].filter(
          (item) => item.present_status === true
        );
        const timeSlotFilter = responseData[obj].find(
          (item) => item.date_of_class === obj
        );
        totalCount[obj] = `${presentCount.length}/${responseData[obj].length}`;
        timeSlots[obj] = timeSlotFilter?.time_slot;
      });
      setData({ sortedDates, studentData, displayData, totalCount, timeSlots });
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

  console.log("data :>> ", data);
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
              <Grid item xs={12}>
                <DetailedAttendanceReport data={data} />
              </Grid>
            )}
          </Grid>
        </FormPaperWrapper>
      </Box>
    </>
  );
}

export default DetailedAttendancefilter;
