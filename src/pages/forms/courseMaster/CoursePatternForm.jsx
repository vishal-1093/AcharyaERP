import { useState, useEffect } from "react";
import { Box, Grid, Button, CircularProgress } from "@mui/material";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";
import CustomMultipleAutocomplete from "../../../components/Inputs/CustomMultipleAutocomplete";
import axios from "../../../services/Api";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import useAlert from "../../../hooks/useAlert";
import FormWrapper from "../../../components/FormWrapper";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";

const initialValues = {
  acYearId: null,
  schoolId: null,
  programId: [],
  courseCategoryId: null,
  percentage: "",
  credits: "",
};

const requiredFields = [
  "acYearId",
  "schoolId",
  "programId",
  "courseCategoryId",
  "percentage",
  "credits",
];

function CoursePatternForm() {
  const [isNew, setIsNew] = useState(true);
  const [values, setValues] = useState(initialValues);
  const [coursePatternId, setCoursePatternId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [acYearOptions, setAcYearOptions] = useState([]);
  const [schoolOptions, setSchoolOptions] = useState([]);
  const [programOptions, setProgramOptions] = useState([]);
  const [courseCategoryOptions, setCourseCategoryOptions] = useState([]);

  const { id } = useParams();
  const { pathname } = useLocation();
  const { setAlertMessage, setAlertOpen } = useAlert();
  const setCrumbs = useBreadcrumbs();
  const navigate = useNavigate();

  useEffect(() => {
    getAcademicYearData();
    getSchoolData();
    getCourseCategoryData();
    if (pathname.toLowerCase() === "/coursepatternform") {
      setIsNew(true);
      setCrumbs([
        { name: "Course Master", link: "/CourseMaster/Bucket" },
        { name: "Course Bucket" },
        {
          name: "Create",
        },
      ]);
    } else {
      setIsNew(false);
      getCoursePatternData();
    }
  }, [pathname]);

  useEffect(() => {
    getProgramData();
  }, [values.acYearId, values.schoolId]);

  const checks = {
    percentage: [values.percentage !== ""],
    credits: [values.credits !== "", /^[0-9.]{1,10}$/.test(values.credits)],
  };

  const errorMessages = {
    percentage: ["This field is required"],
    credits: ["This field is required", "Enter only numbers"],
  };

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

  const getProgramData = async () => {
    if (values.acYearId && values.schoolId)
      await axios
        .get(
          `/api/academic/getProgramAssignedTo/${values.acYearId}/${values.schoolId}`
        )
        .then((res) => {
          setProgramOptions(
            res.data.data.map((obj) => ({
              value: obj.program_id,
              label: obj.program_short_name,
            }))
          );
        })
        .catch((err) => console.error(err));
  };

  const getCourseCategoryData = async () => {
    await axios
      .get(`/api/academic/CourseCategory`)
      .then((res) => {
        setCourseCategoryOptions(
          res.data.data.map((obj) => ({
            value: obj.course_category_id,
            label: obj.course_category_name,
          }))
        );
      })
      .catch((err) => console.error(err));
  };

  const getCoursePatternData = async () => {
    await axios
      .get(`/api/academic/coursePattern/${id}`)
      .then((res) => {
        setValues({
          acYearId: res.data.data.ac_year_id,
          schoolId: res.data.data.school_id,
          programId: res.data.data.program_id,
          courseCategoryId: res.data.data.course_category_id,
          credits: res.data.data.credits,
          percentage: res.data.data.percentage_of_credit,
        });
        setCoursePatternId(res.data.data.course_pattern_id);
        setCrumbs([
          { name: "Course Master", link: "/CourseMaster/Bucket" },
          { name: "Course Bucket" },
          {
            name: "Update",
          },
        ]);
      })
      .catch((err) => console.error(err));
  };

  const handleChange = (e) => {
    setValues((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleChangeAdvance = (name, newValue) => {
    setValues((prev) => ({
      ...prev,
      [name]: newValue,
    }));
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

  const handleCreate = async (e) => {
    if (!requiredFieldsValid()) {
      setAlertMessage({
        severity: "error",
        message: "Please fill all fields",
      });
      setAlertOpen(true);
    } else {
      setLoading(true);
      const temp = {};
      temp.active = true;
      temp.ac_year_id = values.acYearId;
      temp.course_category_id = values.courseCategoryId;
      temp.credits = parseInt(values.credits);
      temp.percentage_of_credit = parseFloat(values.percentage);
      temp.program_id = values.programId;
      temp.school_id = values.schoolId;

      await axios
        .post(`/api/academic/coursePattern`, temp)
        .then((res) => {
          setLoading(false);
          if (res.status === 200 || res.status === 201) {
            navigate("/CourseMaster/Bucket", { replace: true });
            setAlertMessage({
              severity: "success",
              message: "Course Bucket Created",
            });
          } else {
            setAlertMessage({
              severity: "error",
              message: res.data ? res.data.message : "Error Occured",
            });
          }
          setAlertOpen(true);
        })
        .catch((error) => {
          setLoading(false);
          setAlertMessage({
            severity: "error",
            message: error.response ? error.response.data.message : "Error",
          });
          setAlertOpen(true);
        });
    }
  };

  const handleUpdate = async (e) => {
    if (!requiredFieldsValid()) {
      setAlertMessage({
        severity: "error",
        message: "Please fill all fields",
      });
      setAlertOpen(true);
    } else {
      setLoading(true);
      const temp = {};
      temp.active = true;
      temp.course_pattern_id = coursePatternId;
      temp.ac_year_id = values.acYearId;
      temp.course_category_id = values.courseCategoryId;
      temp.credits = parseInt(values.credits);
      temp.percentage_of_credit = parseFloat(values.percentage);
      temp.program_id = values.programId;
      temp.school_id = values.schoolId;

      await axios
        .put(`/api/academic/coursePattern/${id}`, temp)
        .then((res) => {
          setLoading(false);
          if (res.status === 200 || res.status === 201) {
            setAlertMessage({
              severity: "success",
              message: "Course Bucket Updated",
            });
            navigate("/CourseMaster/Bucket", { replace: true });
          } else {
            setAlertMessage({
              severity: "error",
              message: res.data ? res.data.message : "Error Occured",
            });
          }
          setAlertOpen(true);
        })
        .catch((error) => {
          setLoading(false);
          setAlertMessage({
            severity: "error",
            message: error.response ? error.response.data.message : "Error",
          });
          setAlertOpen(true);
        });
    }
  };

  return (
    <Box component="form" overflow="hidden" p={1}>
      <FormWrapper>
        <Grid
          container
          alignItems="center"
          justifyContent="flex-start"
          rowSpacing={2}
          columnSpacing={{ xs: 2, md: 4 }}
        >
          <Grid item xs={12} md={4}>
            <CustomAutocomplete
              name="acYearId"
              label="Academic Year"
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
            <CustomMultipleAutocomplete
              name="programId"
              label="Program"
              value={values.programId}
              options={programOptions}
              handleChangeAdvance={handleChangeAdvance}
              required
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <CustomAutocomplete
              name="courseCategoryId"
              label="Course Category"
              value={values.courseCategoryId}
              options={courseCategoryOptions}
              handleChangeAdvance={handleChangeAdvance}
              required
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <CustomTextField
              name="percentage"
              label="% of Credits"
              value={values.percentage}
              handleChange={handleChange}
              checks={checks.percentage}
              errors={errorMessages.percentage}
              required
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <CustomTextField
              name="credits"
              label="Credits"
              value={values.credits}
              checks={checks.credits}
              errors={errorMessages.credits}
              handleChange={handleChange}
              required
            />
          </Grid>

          <Grid item textAlign="right">
            <Button
              style={{ borderRadius: 7 }}
              variant="contained"
              color="primary"
              disabled={loading}
              onClick={isNew ? handleCreate : handleUpdate}
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

export default CoursePatternForm;
