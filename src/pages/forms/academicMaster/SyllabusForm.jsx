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
import DeleteIcon from "@mui/icons-material/Delete";
import CustomModal from "../../../components/CustomModal";

const initValues = {
  courseName: "",
  syllabusCode: "",
  programSpeId: "",
  syllabusId: "",
  duration: "",
  learnings: "",
  topics: "",
};
const initialValues = {
  courseId: null,
  objectiveUpdate: "",
  hoursUpdate: "",
  learningUpdate: "",
  topicUpdate: "",
  courseObjective: [
    {
      objective: "",
      topic_name: "",
      learning: "",
      hours: "",
    },
  ],
};

const requiredFields = [];

function SyllabusForm() {
  const [isNew, setIsNew] = useState(true);
  const [values, setValues] = useState(initialValues);
  const [data, setData] = useState(initValues);
  const [courseObjectiveId, setcourseObjectiveId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [courseOptions, setCourseOptions] = useState([]);

  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
    buttons: [],
  });
  const [modalOpen, setModalOpen] = useState(false);

  const { setAlertMessage, setAlertOpen } = useAlert();
  const setCrumbs = useBreadcrumbs();
  const { id } = useParams();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const location = useLocation();
  const state = location?.state;

  useEffect(() => {
    if (pathname.toLowerCase() === "/coursesubjectivemaster/syllabus/new") {
      setIsNew(true);
      setCrumbs([
        {
          name: "Course Syllabus Master",
          link: "/CourseSubjectiveMaster/Syllabus",
        },
        { name: "Syllabus" },
        { name: "Create" },
      ]);
    } else {
      setIsNew(false);
      setCrumbs([
        {
          name: "CourseSubjectiveMaster",
          link: "/CourseSubjectiveMaster/Syllabus",
        },
        { name: "Syllabus" },
        { name: "Update" },
      ]);
      getCourseObjectiveData();
    }
  }, [pathname]);

  const checks = {
    objective: [values.description !== ""],
  };

  const errorMessages = {
    objective: ["This field required"],
  };

  const getCourseObjectiveData = async () => {
    await axios
      .get(`/api/academic/getSyllabusDetails/${id}`)
      .then((res) => {
        const temp = [];
        if (res?.data?.data?.length === 0) {
          setValues((prev) => ({
            ...prev,
            courseId: Number(id),
          }));
        } else {
          res?.data?.data?.map((obj) => {
            temp.push({
              objective: obj.syllabus_objective,
              topic_name: obj.topic_name,
              learning: obj.learning,
              hours: obj.duration,
              syllabus_id: obj.id,
            });
          });

          setValues({ courseId: Number(id), courseObjective: temp });
        }
        setcourseObjectiveId(res.data.data.syllabus_id);
        if (state?.toLowerCase() === "/courseassignmentemployeeindex") {
          setCrumbs([
            {
              name: "My Course",
              link: "/courseassignmentemployeeindex",
            },
            { name: "Course Syllabus" },
            { name: "Update" },
            { name: res.data.data.course_objective_id },
          ]);
        }
      })
      .catch((error) => console.error(error));
  };

  const handleChange = (e) => {
    const splitName = e.target.name.split("-");

    setValues((prev) => ({
      ...prev,
      courseObjective: prev.courseObjective.map((obj, i) => {
        if (i === parseInt(splitName[1]))
          return {
            ...obj,
            [splitName[0]]: e.target.value,
          };
        return obj;
      }),
    }));
  };

  const handleChangeAdvance = async (name, newValue) => {
    const splitName = name.split("-");

    setValues((prev) => ({
      ...prev,
      courseObjective: prev.courseObjective.map((obj, i) => {
        if (i === parseInt(splitName[1]))
          return {
            ...obj,
            [splitName[0]]: newValue,
          };
        return obj;
      }),
    }));
    if (name === "courseId") {
      await axios
        .get(`/api/academic/getCoursesConcateWithCodeNameAndYearSem`)
        .then((res) => {
          res.data.data
            .filter((item) => item.course_id === newValue)
            .map((filteredItem) => {
              data.courseName = filteredItem.course_name;
              data.courseCode = filteredItem.course_code;
            });
        })
        .catch((err) => console.error(err));
    }
    setValues((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };
  const add = () => {
    setValues((prev) => ({
      ...prev,
      ["courseObjective"]: prev["courseObjective"].concat({
        objective: "",
        learning: "",
        topic_name: "",
      }),
    }));
  };

  const remove = (index) => {
    const temp = values.courseObjective;
    temp.pop();
    setValues((prev) => ({
      ...prev,
      ["courseObjective"]: temp,
    }));
  };

  const handleDelete = async (obj, i) => {
    setModalOpen(true);
    const handleToggle = async () => {
      await axios
        .delete(`/api/academic/syllabus/${obj.syllabus_id}`)
        .then((res) => {
          if (res.status === 200) {
            getCourseObjectiveData();
            setModalOpen(false);
          }
        })
        .catch((err) => console.error(err));
    };

    setModalContent({
      title: "",
      message: `Are you sure yo want to delete Module-${i + 1}`,
      buttons: [
        { name: "Yes", color: "primary", func: handleToggle },
        { name: "No", color: "primary", func: () => {} },
      ],
    });
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
      .get(`/api/academic/getCoursesConcateWithCodeNameAndYearSem`)
      .then((res) => {
        setCourseOptions(
          res.data.data.map((obj) => ({
            value: obj.course_assignment_id,
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
      const temp = [];
      values.courseObjective.forEach((obj, i) => {
        const inc = i + 1;
        temp.push({
          active: true,
          module: "Module" + " - " + inc,
          course_assignment_id: values.courseId,
          duration: obj.hours,
          syllabus_code: data.courseCode,
          syllabus_objective: obj.objective,
          syllabus_path: data.courseName,
          learning: obj.learning,
          topic_name: obj.topic_name,
        });
      });

      await axios
        .post(`/api/academic/syllabusObjective`, temp)
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
          navigate("/CourseSubjectiveMaster/Syllabus", { replace: true });
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

      const temp = [];
      values.courseObjective.forEach((obj, i) => {
        const inc = i + 1;
        temp.push({
          active: true,
          module: "Module" + " - " + inc,
          syllabus_id: obj.syllabus_id,
          course_assignment_id: values.courseId,
          duration: obj.hours,
          syllabus_code: data.courseCode,
          syllabus_objective: obj.objective,
          syllabus_path: data.courseName,
          learning: obj.learning,
          topic_name: obj.topic_name,
        });
      });

      await axios
        .put(`/api/academic/syllabus/${id}`, temp)
        .then((res) => {
          if (res.status === 200 || res.status === 201) {
            setAlertMessage({
              severity: "success",
              message: "Form Updated Successfully",
            });
            if (state?.toLowerCase() === "/courseassignmentemployeeindex") {
              navigate("/courseassignmentemployeeindex", { replace: true });
            } else {
              navigate("/CourseSubjectiveMaster/Syllabus", { replace: true });
            }
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
          console.log(error);

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
    <FormWrapper>
      <CustomModal
        open={modalOpen}
        setOpen={setModalOpen}
        title={modalContent.title}
        message={modalContent.message}
        buttons={modalContent.buttons}
      />
      <Grid container spacing={1}>
        <Grid item xs={12} md={4}>
          <CustomAutocomplete
            name="courseId"
            label="Select Course"
            value={values.courseId}
            options={courseOptions}
            handleChangeAdvance={handleChangeAdvance}
            disabled={!isNew}
            required
          />
        </Grid>

        {values.courseObjective.map((obj, i) => (
          <Grid item xs={12} key={i}>
            <Box
              sx={{
                border: "1px solid #e0e0e0",
                borderRadius: 2,
                p: 3,
                backgroundColor: "#fafafa",
              }}
            >
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={6}>
                  <Box sx={{ fontWeight: "bold", fontSize: "1.1rem", mb: 1 }}>
                    Module {i + 1}
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} textAlign="right">
                  {values.courseObjective.length > 1 && !isNew && (
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      onClick={() => handleDelete(obj, i)}
                      startIcon={<DeleteIcon />}
                    >
                      Remove Module
                    </Button>
                  )}
                </Grid>

                <Grid item xs={12} md={6}>
                  <CustomTextField
                    multiline
                    rows={3}
                    inputProps={{ maxLength: 500 }}
                    label="Objective"
                    name={`objective-${i}`}
                    value={obj.objective}
                    handleChange={handleChange}
                    required
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <CustomTextField
                    multiline
                    rows={3}
                    inputProps={{ maxLength: 500 }}
                    label="Topics"
                    name={`topic_name-${i}`}
                    value={obj.topic_name}
                    handleChange={handleChange}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <CustomTextField
                    inputProps={{ maxLength: 300 }}
                    label="Teaching-Learning Process"
                    name={`learning-${i}`}
                    value={obj.learning}
                    handleChange={handleChange}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <CustomTextField
                    label="Duration (Hrs)"
                    name={`hours-${i}`}
                    value={obj.hours}
                    handleChange={handleChange}
                    required
                  />
                </Grid>
              </Grid>
            </Box>
          </Grid>
        ))}

        <Grid item xs={12} textAlign="right">
          <Button
            variant="contained"
            color="error"
            size="small"
            onClick={() => remove()}
            sx={{ marginRight: 2 }}
          >
            <RemoveIcon />
          </Button>

          <Button variant="contained" color="success" onClick={add}>
            <AddIcon />
          </Button>
        </Grid>

        <Grid item xs={12} textAlign="right" mt={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={isNew ? handleCreate : handleUpdate}
            disabled={loading}
            sx={{ borderRadius: 2, minWidth: 120 }}
          >
            {loading ? (
              <CircularProgress size={24} />
            ) : (
              <strong>{isNew ? "Create" : "Update"}</strong>
            )}
          </Button>
        </Grid>
      </Grid>
    </FormWrapper>
  );
}

export default SyllabusForm;
