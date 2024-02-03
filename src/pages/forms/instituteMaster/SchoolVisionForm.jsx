import { useState, useEffect } from "react";
import axios from "../../../services/Api";
import { Box, Grid, Button, CircularProgress } from "@mui/material";
import FormWrapper from "../../../components/FormWrapper";
import useAlert from "../../../hooks/useAlert";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";

const initValues = {
  schoolId: null,
  vision: "",
  mission: "",
};

const requiredFields = ["schoolId", "vision", "mission"];

function SchoolVisionForm() {
  const [isNew, setIsNew] = useState(true);
  const [values, setValues] = useState(initValues);
  const [visionMissionId, setvisionMissionId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [SchoolNameOptions, setSchoolNameOptions] = useState([]);

  const { setAlertMessage, setAlertOpen } = useAlert();
  const setCrumbs = useBreadcrumbs();
  const { id } = useParams();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    if (pathname.toLowerCase() === "/institutemaster/schoolvision/new") {
      setIsNew(true);
      setCrumbs([
        { name: "InstituteMaster", link: "/InstituteMaster/Visions" },
        { name: "School Vision/Mission " },
        { name: "Create" },
      ]);
    } else {
      setIsNew(false);
      getSchoolVisionData();
    }
  }, [pathname]);

  const checks = {
    vision: [values.vision !== "", values.vision.length < 500],
    mission: [values.mission !== "", values.mission.length < 500],
  };

  const errorMessages = {
    vision: ["This Field is Required", "Maximum characters 500"],
    mission: ["This Field is Required", "Maximum characters 500"],
  };

  const getSchoolVisionData = async () => {
    await axios
      .get(`/api/academic/academicSchoolVision/${id}`)
      .then((res) => {
        setValues({
          schoolId: res.data.data.schoolId,
          vision: res.data.data.asvVision,
          mission: res.data.data.asvMission,
        });
        setvisionMissionId(res.data.data.academicSchoolVisionId);
        setCrumbs([
          { name: "Institute Master", link: "/InstituteMaster/Visions" },
          { name: "School Vision/Mission " },
          { name: "Update" },
          { name: res.data.data.academicSchoolVisionId },
        ]);
      })
      .catch((error) => console.error(error));
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

  useEffect(() => {
    getSchoolNameOptions();
  }, []);

  const getSchoolNameOptions = async () => {
    await axios
      .get(`/api/institute/school`)
      .then((res) => {
        setSchoolNameOptions(
          res.data.data.map((obj) => ({
            value: obj.school_id,
            label: obj.school_name,
          }))
        );
      })
      .catch((err) => console.error(err));
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
      temp.schoolId = values.schoolId;
      temp.asvVision = values.vision;
      temp.asvMission = values.mission;
      temp.asvDescription = values.vision;

      await axios
        .post(`/api/academic/academicSchoolVision`, temp)
        .then((res) => {
          setLoading(false);
          setAlertMessage({
            severity: "success",
            message: res.data.message,
          });
          setAlertOpen(true);
          setAlertMessage({
            severity: "success",
            message: "Form Submitted Successfully !!",
          });
          navigate("/InstituteMaster/Visions", { replace: true });
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
      temp.academicSchoolVisionId = visionMissionId;
      temp.schoolId = values.schoolId;
      temp.asvVision = values.vision;
      temp.asvMission = values.mission;
      temp.asvDescription = values.vision;
      await axios
        .put(`/api/academic/academicSchoolVision/${id}`, temp)
        .then((res) => {
          if (res.status === 200 || res.status === 201) {
            setAlertMessage({
              severity: "success",
              message: "Form Updated Successfully !!",
            });
            navigate("/InstituteMaster/Visions", { replace: true });
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
        <Grid container rowSpacing={3}>
          <Grid item xs={12} md={4}>
            <CustomAutocomplete
              name="schoolId"
              label="Institute"
              options={SchoolNameOptions}
              value={values.schoolId}
              handleChangeAdvance={handleChangeAdvance}
              required
            />
          </Grid>

          <Grid item xs={12}>
            <Grid container columnSpacing={2}>
              <Grid item xs={12} md={6}>
                <CustomTextField
                  rows={6}
                  multiline
                  inputProps={{
                    minLength: 1,
                    maxLength: 500,
                  }}
                  label="Vision"
                  name={"vision"}
                  value={values.vision}
                  handleChange={handleChange}
                  checks={checks.vision}
                  errors={errorMessages.vision}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <CustomTextField
                  rows={6}
                  multiline
                  inputProps={{
                    minLength: 1,
                    maxLength: 500,
                  }}
                  label="Mission"
                  name="mission"
                  value={values.mission}
                  handleChange={handleChange}
                  checks={checks.mission}
                  errors={errorMessages.mission}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} textAlign="right" mt={5}>
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
      </FormWrapper>
    </Box>
  );
}

export default SchoolVisionForm;
