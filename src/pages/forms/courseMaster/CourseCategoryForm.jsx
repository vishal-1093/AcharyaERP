import { useState, useEffect } from "react";
import { Box, Grid, Button, CircularProgress } from "@mui/material";
import FormWrapper from "../../../components/FormWrapper";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import axios from "../../../services/Api";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import useAlert from "../../../hooks/useAlert";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";

const initialValues = {
  courseCategory: "",
  courseCategoryCode: "",
};

const requiredFields = ["courseCategory", "courseCategoryCode"];

function CourseCategoryForm() {
  const [isNew, setIsNew] = useState(true);
  const [values, setValues] = useState(initialValues);
  const [courseCategoryId, setcourseCategoryId] = useState(null);
  const [loading, setLoading] = useState(false);

  const { id } = useParams();
  const { pathname } = useLocation();
  const setCrumbs = useBreadcrumbs();
  const { setAlertMessage, setAlertOpen } = useAlert();
  const navigate = useNavigate();

  const checks = {
    courseCategory: [
      values.courseCategory !== "",
      /^[A-Za-z ]+$/.test(values.courseCategory),
    ],
    courseCategoryCode: [values.courseCategoryCode !== ""],
  };
  const errorMessages = {
    courseCategory: ["This field is required", "Enter only characters"],
    courseCategoryCode: ["This field required"],
  };

  useEffect(() => {
    if (pathname.toLowerCase() === "/coursecategoryform/new") {
      setIsNew(true);
      setCrumbs([
        { name: "CourseMaster", link: "/CourseMaster/Category" },
        { name: "Course Category" },
        { name: "Create" },
      ]);
    } else {
      setIsNew(false);
      getProgramData();
    }
  }, []);

  const getProgramData = async () => {
    await axios
      .get(`/api/academic/CourseCategory/${id}`)
      .then((res) => {
        setValues({
          courseCategory: res.data.data.course_category_name,
          courseCategoryCode: res.data.data.course_category_code,
        });
        setcourseCategoryId(res.data.data.course_category_id);
        setCrumbs([
          { name: "CourseMaster", link: "/CourseMaster/Category" },
          { name: "Course Category" },
          { name: "Update" },
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
        message: "Please fill required fields",
      });
      setAlertOpen(true);
    } else {
      setLoading(true);
      const temp = {};
      temp.active = true;
      temp.course_category_name = values.courseCategory;
      temp.course_category_code = values.courseCategoryCode;
      await axios
        .post(`/api/academic/CourseCategory`, temp)
        .then((res) => {
          setLoading(false);
          if (res.status === 200 || res.status === 201) {
            setAlertMessage({
              severity: "success",
              message: "Course Category Created",
            });
            navigate("/CourseMaster/Category", { replace: true });
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
        message: "Please fill required fields",
      });
      setAlertOpen(true);
    } else {
      setLoading(true);
      const temp = {};
      temp.active = true;
      temp.course_category_id = courseCategoryId;
      temp.course_category_name = values.courseCategory;
      temp.course_category_code = values.courseCategoryCode;
      await axios
        .put(`/api/academic/CourseCategory/${id}`, temp)
        .then((res) => {
          setLoading(false);
          if (res.status === 200 || res.status === 201) {
            setAlertMessage({
              severity: "success",
              message: "Course Category Updated",
            });
            navigate("/CourseMaster/Category", { replace: true });
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
            message: error.response.data.message,
          });
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
          <Grid item xs={12} md={6}>
            <CustomTextField
              name="courseCategory"
              label="Course Category"
              value={values.courseCategory}
              handleChange={handleChange}
              errors={errorMessages.courseCategory}
              checks={checks.courseCategory}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <CustomTextField
              name="courseCategoryCode"
              label="Course Category Code"
              value={values.courseCategoryCode}
              handleChange={handleChange}
              errors={errorMessages.courseCategoryCode}
              checks={checks.courseCategoryCode}
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

export default CourseCategoryForm;
