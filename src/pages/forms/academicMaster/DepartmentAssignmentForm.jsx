import { useState, useEffect } from "react";
import { Box, Grid, Button, CircularProgress } from "@mui/material";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import axios from "../../../services/Api";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";
import CustomMultipleAutocomplete from "../../../components/Inputs/CustomMultipleAutocomplete";
import { useLocation, useNavigate } from "react-router-dom";
import useAlert from "../../../hooks/useAlert";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import FormWrapper from "../../../components/FormWrapper";

const initialValues = {
  deptId: "",
  priority: "",
  schoolId: [],
};

const requiredFields = ["deptId", "priority", "schoolId"];

function DepartmentAssignmentForm() {
  const [values, setValues] = useState(initialValues);
  const [loading, setLoading] = useState(false);
  const [schoolOptions, setSchoolOptions] = useState([]);
  const [deptData, setDeptData] = useState([]);

  const { pathname } = useLocation();
  const setCrumbs = useBreadcrumbs();
  const { setAlertMessage, setAlertOpen } = useAlert();
  const navigate = useNavigate();

  const checks = {
    priority: [values.priority !== ""],
  };

  const errorMessages = {
    priority: ["This field is required"],
  };

  useEffect(() => {
    getDept();
    setCrumbs([
      { name: "AcademicMaster", link: "/AcademicMaster/Assignment" },
      { name: "Department Assigment" },
      { name: "Create" },
    ]);
  }, [pathname]);

  useEffect(() => {
    getSchoolOptions();
  }, [values]);

  const getSchoolOptions = async () => {
    if (values.deptId)
      await axios(`/api/allUnassignedSchoolToDepartment/${values.deptId}`)
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
  const getDept = async () => {
    await axios
      .get(`/api/dept`)
      .then((res) => {
        setDeptData(
          res.data.data.map((obj) => ({
            value: obj.dept_id,
            label: obj.dept_name,
          }))
        );
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleChange = (e) => {
    setValues((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleChangeAdvance = async (name, newValue) => {
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
      temp.dept_id = values.deptId;
      temp.priority = values.priority;
      temp.school_id = values.schoolId;
      await axios
        .post(`/api/DepartmentAssignment`, temp)
        .then((res) => {
          setLoading(false);
          if (res.status === 200 || res.status === 201) {
            navigate("/AcademicMaster/Assignment", { replace: true });
            setAlertMessage({
              severity: "success",
              message: "Department Assignment Created",
            });
          } else {
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
          justifyContent="flex-start"
          rowSpacing={2}
          columnSpacing={{ xs: 2, md: 4 }}
        >
          <Grid item xs={12} md={6}>
            <CustomAutocomplete
              name="deptId"
              label="Department"
              value={values.deptId}
              options={deptData}
              handleChangeAdvance={handleChangeAdvance}
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <CustomTextField
              type="number"
              name="priority"
              label="Priority"
              value={values.priority}
              handleChange={handleChange}
              errors={errorMessages.priority}
              checks={checks.priority}
              fullWidth
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <CustomMultipleAutocomplete
              name="schoolId"
              label="School"
              value={values.schoolId}
              options={schoolOptions}
              handleChangeAdvance={handleChangeAdvance}
              required
            />
          </Grid>

          <Grid item textAlign="right">
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
                <strong>Create</strong>
              )}
            </Button>
          </Grid>
        </Grid>
      </FormWrapper>
    </Box>
  );
}

export default DepartmentAssignmentForm;
