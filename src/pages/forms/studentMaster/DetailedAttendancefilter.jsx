import { useEffect, useState } from "react";
import axios from "../../../services/Api";
import useAlert from "../../../hooks/useAlert";
import { Backdrop, Box, Button, CircularProgress, Grid } from "@mui/material";
import FormPaperWrapper from "../../../components/FormPaperWrapper";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";
import DetailedAttendanceReport from "./DetailedAttendanceReport";

const initialValues = { acyearId: null, courseId: null, empUserId: null };

const requiredFields = ["acyearId", "courseId"];

const userId = JSON.parse(sessionStorage.getItem("AcharyaErpUser"))?.userId;
const empId = JSON.parse(sessionStorage.getItem("empId"));
const roleShortName = JSON.parse(
  sessionStorage.getItem("AcharyaErpUser")
)?.roleShortName;

function DetailedAttendancefilter() {
  const [values, setValues] = useState(initialValues);
  const [acyearOptions, setAcyearOptions] = useState([]);
  const [courseOptions, setCourseOptions] = useState([]);
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const [empOptions, setEmpOptions] = useState([]);

  const { setAlertMessage, setAlertOpen } = useAlert();

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    getCourses();
  }, [userId, values.empUserId]);

  const fetchData = async () => {
    try {
      const [acyearRes, empResponse] = await Promise.all([
        axios.get("/api/academic/academic_year"),
        roleShortName === "SAA"
          ? axios.get("/api/employee/getAllActiveEmployeeDetailsWithUserId")
          : null,
      ]);
      const acyearOptionData = [];
      const acyearResData = acyearRes.data.data;
      const filterAcyear = acyearResData.filter((obj) => obj.ac_year_id > 5);
      filterAcyear.forEach((obj) => {
        acyearOptionData.push({
          value: obj.ac_year_id,
          label: obj.ac_year,
        });
      });
      const empResponseData = empResponse?.data.data;
      const empOptionData = [];
      empResponseData.forEach((obj) => {
        empOptionData.push({
          value: obj.id,
          label: `${obj.employee_name} - ${obj.empcode}`,
          empId: obj.emp_id,
        });
      });
      setAcyearOptions(acyearOptionData);
      setEmpOptions(empOptionData);
    } catch (err) {
      setAlertMessage({
        severity: "error",
        message: err.response?.data?.message || "Something went wrong.",
      });
      setAlertOpen(true);
    }
  };

  const getCourses = async () => {
    const id = roleShortName === "SAA" ? values.empUserId : userId;
    if (!id) return;
    try {
      const courseRes = await axios.get(
        `/api/academic/getSubjectAssignmentDetailsData/${id}`
      );
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

  const requiredFieldsValid = () => {
    for (let i = 0; i < requiredFields.length; i++) {
      const field = requiredFields[i];
      if (!values[field]) return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    const { acyearId, courseId } = values;
    if (!acyearId || !courseId) return;
    try {
      setLoading(true);
      const getEmpId = empOptions.find((obj) => obj.value === values.empUserId);
      const actualEmpId = roleShortName === "SAA" ? getEmpId?.empId : empId;
      const response = await axios.get(
        `/api/student/getDetailedStudentAttendanceReportSectionwiseForEmployee?ac_year_id=${acyearId}&emp_id=${actualEmpId}&course_assignment_id=${courseId}`
      );
      const responseData = response.data.data;
      if (Object.keys(responseData).length === 0) {
        setAlertMessage({
          severity: "error",
          message: "Attendance Data Not Found !!",
        });
        setAlertOpen(true);
        setValues(initialValues);
        return;
      }
      const classDates = [];
      Object.keys(responseData).forEach((obj) => {
        const timeTableIds = [];
        responseData[obj].forEach((item) => {
          if (!timeTableIds.includes(item.time_table_id)) {
            timeTableIds.push(item.time_table_id);
          }
        });
        timeTableIds.forEach((tt) => {
          classDates.push({ date: obj, id: tt });
        });
      });
      const sortedDates = classDates.sort((a, b) => {
        const dateA = new Date(a.date.split("-").reverse().join("-"));
        const dateB = new Date(b.date.split("-").reverse().join("-"));
        return dateA - dateB;
      });
      const rowData = Object.values(responseData).flat();
      const studentData = rowData.filter(
        (item, index, self) =>
          index === self.findIndex((t) => t.student_id === item.student_id)
      );
      const displayData = {};
      const stdPresentCount = {};
      studentData.forEach((std) => {
        const stdId = std.student_id;
        let count = 0;
        sortedDates.forEach((date) => {
          const filter = rowData.find(
            (item) =>
              item.date_of_class === date.date &&
              item.time_table_id === date.id &&
              item.student_id === stdId
          );
          if (filter) {
            if (filter.present_status) {
              count = count + 1;
            }
            displayData[`${date.date}-${date.id}-${stdId}`] =
              filter.present_status ? count : "A";
            stdPresentCount[stdId] = { count };
          }
        });
        let percentage =
          (stdPresentCount[stdId].count / sortedDates.length) * 100;
        percentage =
          percentage % 1 === 0 ? percentage : parseFloat(percentage.toFixed(2));
        stdPresentCount[stdId]["percentage"] = percentage;
      });
      const totalCount = {};
      const timeSlots = {};
      sortedDates.forEach((obj) => {
        const key = `${obj.date}-${obj.id}`;
        const totalClassCount = rowData.filter(
          (item) =>
            item.date_of_class === obj.date && item.time_table_id === obj.id
        );
        const presentCount = rowData.filter(
          (item) =>
            item.present_status === true &&
            item.date_of_class === obj.date &&
            item.time_table_id === obj.id
        );
        const timeSlotFilter = rowData.find(
          (item) =>
            item.date_of_class === obj.date && item.time_table_id === obj.id
        );
        totalCount[key] = `${presentCount.length}/${totalClassCount.length}`;
        timeSlots[key] = timeSlotFilter?.time_slot;
      });
      setData({
        sortedDates,
        studentData,
        displayData,
        totalCount,
        timeSlots,
        stdPresentCount,
      });
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
            {roleShortName === "SAA" && (
              <Grid item xs={12} md={4}>
                <CustomAutocomplete
                  name="empUserId"
                  label="Faculty"
                  value={values.empUserId}
                  options={empOptions}
                  handleChangeAdvance={handleChangeAdvance}
                  required
                />
              </Grid>
            )}
            <Grid item xs={12} md={4}>
              <CustomAutocomplete
                name="courseId"
                label="Course"
                value={values.courseId}
                options={courseOptions}
                handleChangeAdvance={handleChangeAdvance}
                required
              />
            </Grid>
            <Grid item xs={12} align="right">
              <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={!requiredFieldsValid()}
              >
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
