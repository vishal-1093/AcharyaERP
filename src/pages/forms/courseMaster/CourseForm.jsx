import { useState, useEffect } from "react";
import { Box, Grid, Button, CircularProgress } from "@mui/material";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import axios from "../../../services/Api";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import useAlert from "../../../hooks/useAlert";
import FormWrapper from "../../../components/FormWrapper";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";

const initialValues = {
  courseName: "",
  courseShortName: "",
  courseCode: "",
};
const requiredFields = ["courseName", "courseShortName"];

function CourseForm() {
  const [isNew, setIsNew] = useState(true);
  const [values, setValues] = useState(initialValues);
  const [courseId, setCourseId] = useState(null);
  const [loading, setLoading] = useState(false);

  const { id } = useParams();
  const { pathname } = useLocation();
  const { setAlertMessage, setAlertOpen } = useAlert();
  const setCrumbs = useBreadcrumbs();
  const navigate = useNavigate();

  const checks = {
    courseName: [
      values.courseName !== "",
      /^[A-Za-z ]+$/.test(values.courseName),
    ],
    courseShortName: [
      values.courseShortName !== "",
      /^[A-Za-z ]+$/.test(values.courseShortName),
    ],
  };

  const errorMessages = {
    courseName: ["This field required", "Enter Only Characters"],
    courseShortName: ["This field required", "Enter Only Characters"],
  };

  useEffect(() => {
    if (pathname.toLowerCase() === "/courseform") {
      setIsNew(true);

      setCrumbs([
        { name: "Course Master", link: "/CourseMaster/Course" },
        { name: "Course" },
        {
          name: "Create",
        },
      ]);
    } else {
      setIsNew(false);
      getCourseData();
    }
  }, [pathname]);

  const getCourseData = async () => {
    await axios
      .get(`/api/academic/Course/${id}`)
      .then((res) => {
        console.log(res);
        setValues({
          courseName: res.data.data.course_name,
          courseShortName: res.data.data.course_short_name,
          courseCode: res.data.data.course_code,
        });
        setCourseId(res.data.data.course_id);
        setCrumbs([
          { name: "Course Master", link: "/CourseMaster/Course" },
          { name: "Course" },
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
      temp.course_name = values.courseName;
      temp.course_short_name = values.courseShortName.toUpperCase();
      temp.course_code = values.courseCode;

      await axios
        .post(`/api/academic/Course`, temp)
        .then((res) => {
          setLoading(false);
          if (res.status === 200 || res.status === 201) {
            navigate("/CourseMaster/Course", { replace: true });
            setAlertMessage({
              severity: "success",
              message: "Course Created",
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
      temp.course_name = values.courseName;
      temp.course_short_name = values.courseShortName.toUpperCase();
      temp.course_code = values.courseCode;
      temp.course_id = courseId;

      await axios
        .put(`/api/academic/Course/${id}`, temp)
        .then((res) => {
          setLoading(false);
          if (res.status === 200 || res.status === 201) {
            setAlertMessage({
              severity: "success",
              message: "Course Updated",
            });
            navigate("/CourseMaster/Course", { replace: true });
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
          justifyContent="flex-end"
          rowSpacing={2}
          columnSpacing={{ xs: 2, md: 4 }}
        >
          <Grid item xs={12} md={4}>
            <CustomTextField
              name="courseName"
              label="Name"
              value={values.courseName}
              handleChange={handleChange}
              fullWidth
              errors={errorMessages.courseName}
              checks={checks.courseName}
              required
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <CustomTextField
              name="courseShortName"
              label="Short Name"
              value={values.courseShortName}
              handleChange={handleChange}
              inputProps={{
                style: { textTransform: "uppercase" },
              }}
              fullWidth
              errors={errorMessages.courseShortName}
              checks={checks.courseShortName}
              required
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <CustomTextField
              name="courseCode"
              label="Course Code"
              value={values.courseCode}
              handleChange={handleChange}
              fullWidth
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

export default CourseForm;
