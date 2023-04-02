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
  schoolId: null,
  programSpeId: null,
  programIdFromUpdate: null,
  visionUpdate: "",
  missionUpdate: "",
  data: [
    {
      vision: "",
      mission: "",
    },
  ],
};
const requiredFields = ["schoolId", "programSpeId"];

function VisionMissionForm() {
  const [isNew, setIsNew] = useState(true);
  const [values, setValues] = useState(initValues);
  const [visionMissionId, setvisionMissionId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [SchoolNameOptions, setSchoolNameOptions] = useState([]);
  const [programSpeOptions, setProgramSpeOptions] = useState([]);

  const { setAlertMessage, setAlertOpen } = useAlert();
  const setCrumbs = useBreadcrumbs();
  const { id } = useParams();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    if (pathname.toLowerCase() === "/academicmaster/visionmission/new") {
      setIsNew(true);
      setCrumbs([
        { name: "AcademicMaster", link: "/AcademicMaster/VisionMissions" },
        { name: "Vision/Mission " },
        { name: "Create" },
      ]);
    } else {
      setIsNew(false);
      getVisionMisionData();
    }
  }, [pathname]);

  const checks = {};

  const getVisionMisionData = async () => {
    await axios
      .get(`/api/academic/academicsProgramVision/${id}`)
      .then((res) => {
        setValues({
          visionUpdate: res.data.data.apvVision,
          schoolId: res.data.data.schoolId,
          programSpeId: res.data.data.dept_id,
          missionUpdate: res.data.data.apvMission,
        });
        setvisionMissionId(res.data.data.academicsProgramVisionId);
        setCrumbs([
          { name: "AcademicMaster", link: "/AcademicMaster/VisionMissions" },
          { name: "Vision/Mission " },
          { name: "Update" },
          { name: res.data.data.academicsProgramVisionId },
        ]);
      })
      .catch((error) => console.error(error));
  };

  const handleChange = (e) => {
    const splitName = e.target.name.split("-");

    setValues((prev) => ({
      ...prev,
      data: prev.data.map((obj, i) => {
        if (i === parseInt(splitName[1]))
          return {
            ...obj,
            [splitName[0]]: e.target.value,
          };
        return obj;
      }),
    }));
  };

  const handleChangeOne = (e) => {
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
    getDepartmentData();
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

  const getDepartmentData = async () => {
    await axios
      .get(`/api/dept`)
      .then((res) => {
        setProgramSpeOptions(
          res.data.data.map((obj) => ({
            value: obj.dept_id,
            label: obj.dept_name,
          }))
        );
      })
      .catch((err) => console.error(err));
  };

  const add = () => {
    setValues((prev) => ({
      ...prev,
      ["data"]: prev["data"].concat({
        vision: "",
        mission: "",
      }),
    }));
  };

  const remove = (index) => {
    const temp = values.data;
    temp.pop();
    setValues((prev) => ({
      ...prev,
      ["data"]: temp,
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
      values.data.forEach((obj) => {
        temp.push({
          dept_id: values.programSpeId,
          schoolId: values.schoolId,
          active: true,
          apvDescription: obj.vision ? obj.vision : obj.mission,
          apvMission: obj.mission,
          apvVision: obj.vision,
        });
      });

      await axios
        .post(`/api/academic/academicsProgramVision`, temp)
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
          navigate("/AcademicMaster/VisionMissions", { replace: true });
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
      temp.academicsProgramVisionId = visionMissionId;
      temp.apvVision = values.visionUpdate;
      temp.apvDescription = values.visionUpdate
        ? values.visionUpdate
        : values.missionUpdate;
      temp.apvMission = values.missionUpdate;
      temp.schoolId = values.schoolId;
      temp.dept_id = values.programSpeId;

      await axios
        .put(`/api/academic/academicsProgramVision/${id}`, temp)
        .then((res) => {
          if (res.status === 200 || res.status === 201) {
            setAlertMessage({
              severity: "success",
              message: "Form Updated Successfully",
            });
            navigate("/AcademicMaster/VisionMissions", { replace: true });
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
        <Grid container rowSpacing={3} columnSpacing={{ xs: 8, md: 6 }}>
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
          <Grid item xs={12} md={4}>
            <CustomAutocomplete
              name="programSpeId"
              label="Department"
              value={values.programSpeId}
              options={programSpeOptions}
              handleChangeAdvance={handleChangeAdvance}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <Grid container rowSpacing={3} columnSpacing={{ xs: 8, md: 6 }}>
              {isNew ? (
                values.data.map((obj, i) => {
                  return (
                    <>
                      <Grid item xs={12} md={6}>
                        <CustomTextField
                          rows={2}
                          multiline
                          inputProps={{
                            minLength: 1,
                            maxLength: 500,
                          }}
                          label="Vision"
                          name={"vision" + "-" + i}
                          value={values.data[i]["vision"]}
                          handleChange={handleChange}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <CustomTextField
                          rows={2}
                          multiline
                          inputProps={{
                            minLength: 1,
                            maxLength: 500,
                          }}
                          label="Mission"
                          name={"mission" + "-" + i}
                          value={values.data[i]["mission"]}
                          handleChange={handleChange}
                        />
                      </Grid>
                    </>
                  );
                })
              ) : (
                <>
                  {" "}
                  <Grid item xs={12} md={6}>
                    <CustomTextField
                      rows={2}
                      multiline
                      inputProps={{
                        minLength: 1,
                        maxLength: 500,
                      }}
                      label="Vision"
                      name={"visionUpdate"}
                      value={values.visionUpdate}
                      handleChange={handleChangeOne}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <CustomTextField
                      rows={2}
                      multiline
                      inputProps={{
                        minLength: 1,
                        maxLength: 500,
                      }}
                      label="Mission"
                      name={"missionUpdate"}
                      value={values.missionUpdate}
                      handleChange={handleChangeOne}
                    />
                  </Grid>
                </>
              )}
            </Grid>
          </Grid>
          {isNew ? (
            <Grid item xs={12} align="right">
              <Button
                variant="contained"
                color="error"
                onClick={remove}
                disabled={values.data.length === 1}
              >
                <RemoveIcon />
              </Button>

              <Button variant="contained" color="success" onClick={add}>
                <AddIcon />
              </Button>
            </Grid>
          ) : (
            <></>
          )}
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

export default VisionMissionForm;
