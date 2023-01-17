import { useState, useEffect } from "react";
import { Box, Grid, Button, CircularProgress } from "@mui/material";
import FormWrapper from "../../../components/FormWrapper";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import axios from "../../../services/Api";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import useAlert from "../../../hooks/useAlert";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";

const initialValues = {
  courseType: "",
  courseCode: "",
};

const requiredFields = ["courseType", "courseCode"];

function CourseTypeForm() {
  const [isNew, setIsNew] = useState(true);
  const [values, setValues] = useState(initialValues);
  const [courseTypeId, setCourseTypeId] = useState(null);
  const [loading, setLoading] = useState(false);

  const { id } = useParams();
  const { pathname } = useLocation();
  const setCrumbs = useBreadcrumbs();
  const { setAlertMessage, setAlertOpen } = useAlert();
  const navigate = useNavigate();

  const checks = {
    courseType: [
      values.courseType !== "",
      /^[A-Za-z ]+$/.test(values.courseType),
    ],
    courseCode: [values.courseCode !== ""],
  };
  const errorMessages = {
    courseType: ["This field is required", "Enter only characters"],
    courseCode: ["This field required"],
  };

  useEffect(() => {
    if (pathname.toLowerCase() === "/coursetypeform/new") {
      setIsNew(true);
      setCrumbs([
        { name: "CourseMaster", link: "/CourseMaster/Type" },
        { name: "Course Type" },
        { name: "Create" },
      ]);
    } else {
      setIsNew(false);
      getProgramData();
    }
  }, []);

  const getProgramData = async () => {
    await axios
      .get(`/api/academic/CourseType/${id}`)
      .then((res) => {
        setValues({
          courseType: res.data.data.course_type_name,
          courseCode: res.data.data.course_type_code,
        });
        setCourseTypeId(res.data.data.course_type_id);
        setCrumbs([
          { name: "CourseMaster", link: "/CourseMaster/Type" },
          { name: "Course Type" },
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
      temp.course_type_name = values.courseType;
      temp.course_type_code = values.courseCode;
      await axios
        .post(`/api/academic/CourseType`, temp)
        .then((res) => {
          setLoading(false);
          if (res.status === 200 || res.status === 201) {
            setAlertMessage({
              severity: "success",
              message: "Course Type Created",
            });
            navigate("/CourseMaster/Type", { replace: true });
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
      temp.course_type_id = courseTypeId;
      temp.course_type_name = values.courseType;
      temp.course_type_code = values.courseCode;
      await axios
        .put(`/api/academic/CourseType/${id}`, temp)
        .then((res) => {
          setLoading(false);
          if (res.status === 200 || res.status === 201) {
            setAlertMessage({
              severity: "success",
              message: "Course Type Updated",
            });
            navigate("/CourseMaster/Type", { replace: true });
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
              name="courseType"
              label="Course Type"
              value={values.courseType}
              handleChange={handleChange}
              errors={errorMessages.courseType}
              checks={checks.courseType}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <CustomTextField
              name="courseCode"
              label="Course Code"
              value={values.courseCode}
              handleChange={handleChange}
              errors={errorMessages.courseCode}
              checks={checks.courseCode}
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

export default CourseTypeForm;
