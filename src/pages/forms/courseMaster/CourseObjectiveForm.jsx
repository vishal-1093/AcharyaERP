import { useState, useEffect } from "react";
import { Box, Grid, Button, CircularProgress } from "@mui/material";
import FormWrapper from "../../../components/FormWrapper";
import useAlert from "../../../hooks/useAlert";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import axios from "../../../services/Api";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";

const initValues = {
  courseName: "",
  courseCode: "",
};

const requiredFields = [];

const voucherTableValues = [{ description: "" }];

function CourseObjectiveForm() {
  const [isNew, setIsNew] = useState(true);
  const [values, setValues] = useState({ courseId: null, description: {} });
  const [objective, setObjective] = useState([initValues]);
  const [data, setData] = useState(initValues);
  const [courseObjectiveId, setcourseObjectiveId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [courseOptions, setCourseOptions] = useState([]);
  const [voucherData, setVoucherData] = useState([voucherTableValues]);

  const { setAlertMessage, setAlertOpen } = useAlert();
  const setCrumbs = useBreadcrumbs();
  const { id } = useParams();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    if (pathname.toLowerCase() === "/coursemaster/courseobjective/new") {
      setIsNew(true);
      setCrumbs([
        { name: "CourseMaster", link: "/CourseMaster/courseobjectives" },
        { name: "Course Objective " },
        { name: "Create" },
      ]);
    } else {
      setIsNew(false);
      getCourseObjectiveData();
    }
  }, [pathname]);

  const checks = {
    description: [values.description !== ""],
  };

  const errorMessages = {
    description: ["This field required"],
  };

  const getCourseObjectiveData = async () => {
    await axios
      .get(`/api/academic/courseObjective/${id}`)
      .then((res) => {
        setValues({
          courseId: res.data.data.course_id,
          description: res.data.data.course_objective,
        });
        setcourseObjectiveId(res.data.data.course_objective_id);
        setCrumbs([
          { name: "CourseMaster", link: "/CourseMaster/CourseObjectives" },
          { name: "Course Objective" },
          { name: "Update" },
          { name: res.data.data.commencement_type },
        ]);
      })
      .catch((error) => console.error(error));
  };

  const handleChange = (e) => {
    const splitName = e.target.name.split("-");

    setValues((prev) => ({
      ...prev,
      description: { ...prev.description, [splitName[1]]: e.target.value },
    }));
    setValues((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  const handleChangeAdvance = async (name, newValue) => {
    if (name === "courseId") {
      await axios.get(`/api/academic/courseObjective`).then((res) => {
        res.data.data
          .filter((item) => item.course_id === newValue)
          .map((filteredItem) => {
            data.courseName = filteredItem.course_name;
            data.courseCode = filteredItem.course_code;
          });
      });
    }
    setValues((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };
  const addVoucherData = () => {
    setVoucherData((prev) => [...prev, voucherTableValues]);
  };

  const removeVoucherData = () => {
    const filterVoucherData = [...voucherData];
    filterVoucherData.pop();
    setVoucherData(filterVoucherData);
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
  useEffect(() => {
    getCourse();
  }, [values.courseId]);

  const getCourse = async () => {
    await axios
      .get(`/api/academic/getCoursesForCourseObjective`)
      .then((res) => {
        setCourseOptions(
          res.data.data.map((obj) => ({
            value: obj.course_id,
            label: obj.course,
          }))
        );
      })
      .catch((error) => console.error(error));
  };

  const handleCreate = async () => {
    if (!requiredFieldsValid()) {
      setAlertMessage({
        severity: "error",
        message: "please fill all fields",
      });
      setAlertOpen(true);
    } else {
      setLoading(true);
      const temp = {};
      temp.active = true;
      temp.course_id = values.courseId;
      temp.course_objective = values.description;
      const temp1 = [];
      temp1.push(temp);
      const temp2 = Object.values(values.description);
      const temp3 = [];
      temp2.map((obj, i) => {
        temp3.push({
          active: true,
          course_id: values.courseId,
          course_objective: obj,
          course_code: data.courseCode,
          course_name: data.courseName,
        });
      });
      console.log(temp);
      return false;
      await axios
        .post(`/api/academic/courseObjective`, temp3)
        .then((res) => {
          setLoading(false);
          setAlertMessage({
            severity: "success",
            message: res.data.message,
          });
          setAlertOpen(true);
          setAlertMessage({
            severity: "success",
            message: "Form Submitted Successfully",
          });
          navigate("/CourseMaster/CourseObjectives", { replace: true });
        })
        .catch((err) => {
          setLoading(false);
          setAlertMessage({
            severity: "error",
            message: err.response.data
              ? err.response.data.message
              : "Error submitting",
          });
          setAlertOpen(true);
          console.error(err);
        });
    }
  };
  const handleUpdate = async () => {
    if (!requiredFieldsValid()) {
      setAlertMessage({
        severity: "error",
        message: "please fill all fields",
      });
      setAlertOpen(true);
    } else {
      setLoading(true);
      const temp = {};
      temp.active = true;
      temp.course_objective_id = courseObjectiveId;
      temp.course_id = values.courseId;
      temp.course_objective = values.description;

      await axios
        .put(`/api/academic/courseObjectives/${id}`, temp)
        .then((res) => {
          if (res.status === 200 || res.status === 201) {
            setAlertMessage({
              severity: "success",
              message: "Form Updated Successfully",
            });
            navigate("/CourseMaster/CourseObjectives", { replace: true });
          } else {
            setLoading(false);
            setAlertMessage({
              severity: "error",
              message: res.data.message,
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
          rowSpacing={1}
          columnSpacing={{ xs: 2, md: 8 }}
        >
          <Grid item xs={12} md={4}>
            <CustomAutocomplete
              name="courseId"
              label="Course"
              value={values.courseId}
              options={courseOptions}
              handleChangeAdvance={handleChangeAdvance}
              disabled={!isNew}
              required
            />
          </Grid>
          <Grid item xs={12} md={4}></Grid>
          <Grid item xs={12} md={6} mt={2.5}>
            <CustomTextField
              rows={2}
              multiline
              name={"description" + "-" + 0}
              value={values.description[0]}
              label="Objectives"
              handeChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12} md={6} mt={2.5}>
            <CustomTextField
              rows={2}
              multiline
              name={"description" + "-" + 1}
              value={values.description[1]}
              label="Objectives"
              handeChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12} md={6} mt={2.5}>
            <CustomTextField
              rows={2}
              multiline
              name={"description" + "-" + 2}
              value={values.description[2]}
              label="Objectives"
              handeChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12} md={6} mt={2.5}>
            <CustomTextField
              rows={2}
              multiline
              name={"description" + "-" + 3}
              value={values.description[3]}
              label="Objectives"
              handeChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12} md={6} mt={2.5}>
            <CustomTextField
              rows={2}
              multiline
              name={"description" + "-" + 4}
              value={values.description[4]}
              label="Objectives"
              handeChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12} md={6} mt={2.5}>
            <CustomTextField
              rows={2}
              multiline
              name={"description" + "-" + 5}
              value={values.description[5]}
              label="Objectives"
              handeChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12} md={6} mt={2.5}>
            <CustomTextField
              rows={2}
              multiline
              name={"description" + "-" + 6}
              value={values.description[6]}
              label="Objectives"
              handeChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12} md={6} mt={2.5}>
            <CustomTextField
              rows={2}
              multiline
              name={"description" + "-" + 7}
              value={values.description[7]}
              label="Objectives"
              handeChange={handleChange}
              required
            />
          </Grid>
          {/* {voucherData.map((obj, i) => (
            <>
              <Grid item xs={12} md={6} mt={2.5}>
                <CustomTextField
                  rows={2}
                  multiline
                  name={"description" + "-" + i}
                  value={values.description[i]}
                  label="Objectives"
                  handeChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}></Grid>
            </>
          ))} */}

          <Grid item xs={12} md={2}>
            {/* <Button
              variant="contained"
              color="error"
              onClick={removeVoucherData}
              disabled={voucherData.length === 1}
              sx={{ ml: -3 }}
            >
              <RemoveIcon />
            </Button>

            <Button
              variant="contained"
              color="success"
              onClick={addVoucherData}
              sx={{ m: 2 }}
            >
              <AddIcon />
            </Button> */}

            <Grid item xs={12} md={6} mt={4} ml={10}>
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
        </Grid>
      </FormWrapper>
    </Box>
  );
}

export default CourseObjectiveForm;
