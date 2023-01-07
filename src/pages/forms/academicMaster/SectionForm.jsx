import { useState, useEffect } from "react";
import { Box, Grid, Button, CircularProgress } from "@mui/material";
import FormWrapper from "../../../components/FormWrapper";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import CustomMultipleAutocomplete from "../../../components/Inputs/CustomMultipleAutocomplete";
import useAlert from "../../../hooks/useAlert";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import ApiUrl from "../../../services/Api";
import axios from "axios";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";

const initValues = {
  sectionName: "",
  schoolId: [],
  volume: "",
  remarks: "",
  schoolIdOne: null,
};

const requiredFields = ["sectionName", "volume", "remarks", "schoolIdOne"];

function SectionForm() {
  const [isNew, setIsNew] = useState(true);
  const [values, setValues] = useState(initValues);
  const [SectionId, setSectionId] = useState(null);

  const [schoolShortName, setSchoolName] = useState([]);
  const [loading, setLoading] = useState(false);
  const { setAlertMessage, setAlertOpen } = useAlert();
  const setCrumbs = useBreadcrumbs();
  const { id } = useParams();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const checks = {
    sectionName: [values.sectionName !== ""],
    schoolIdOne: [values.schoolIdOne !== ""],
    volume: [values.volume !== "", /^[0-9]*$/.test(values.volume)],
    remarks: [values.remarks !== ""],
  };

  const errorMessages = {
    sectionName: ["This field required", "Enter Only Characters"],
    schoolIdOne: ["This field required"],
    volume: ["This field is required", "Allow only Number"],
    remarks: ["This field required"],
  };

  useEffect(() => {
    if (pathname.toLowerCase() === "/academicmaster/section/new") {
      setIsNew(true);
      setCrumbs([
        { name: "AcademicMaster", link: "/AcademicMaster" },
        { name: "Section" },
        { name: "Create" },
      ]);
    } else {
      setIsNew(false);
      getSectionData();
    }
  }, [pathname]);
  const handleChangeSchool = (name, newValue) => {
    setValues((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const getSectionData = async () => {
    await axios
      .get(`${ApiUrl}/academic/Section/${id}`)
      .then((res) => {
        setValues({
          sectionName: res.data.data.section_name,
          schoolIdOne: res.data.data.school_id,
          volume: res.data.data.volume,
          remarks: res.data.data.remarks,
        });
        setSectionId(res.data.data.section_id);
        setCrumbs([
          { name: "AcademicMaster", link: "/AcademicMaster" },
          { name: "Section" },
          { name: "Update" },
          { name: res.data.data.section_name },
        ]);
      })

      .catch((error) => {
        console.error(error);
      });
  };
  useEffect(() => {
    getSchoolName();
  }, []);
  const getSchoolName = async () => {
    await axios
      .get(`${ApiUrl}/institute/school`)
      .then((res) => {
        setSchoolName(
          res.data.data.map((object) => ({
            value: object.school_id,
            label: object.school_name_short,
          }))
        );
      })
      .catch((err) => console.error(err));
  };

  const handleChange = (e) => {
    if (e.target.name === "shortName") {
      setValues((prev) => ({
        ...prev,
        [e.target.name]: e.target.value.toUpperCase(),
      }));
    } else {
      setValues((prev) => ({
        ...prev,
        [e.target.name]: e.target.value,
      }));
    }
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
      temp.sectionName = values.sectionName;
      temp.volume = values.volume;
      temp.remarks = values.remarks;
      temp.school_id = values.schoolId;

      await axios
        .post(`${ApiUrl}/academic/Section`, temp)
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
          navigate("/AcademicMaster", { replace: true });
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
          console.log(err);
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
      temp.section_name = values.sectionName;
      temp.section_id = SectionId;
      temp.volume = values.volume;
      temp.remarks = values.remarks;
      temp.school_id = values.schoolIdOne;

      await axios
        .put(`${ApiUrl}/academic/Section/${id}`, temp)
        .then((res) => {
          if (res.status === 200 || res.status === 201) {
            setAlertMessage({
              severity: "success",
              message: "Form Updated Successfully",
            });
            navigate("/AcademicMaster", { replace: true });
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
          rowSpacing={4}
          columnSpacing={{ xs: 2, md: 4 }}
        >
          <Grid item xs={12} md={6}>
            <CustomTextField
              name="sectionName"
              label="Section Name"
              value={values.sectionName ?? ""}
              handleChange={handleChange}
              checks={checks.sectionName}
              errors={errorMessages.sectionName}
              required
            />
          </Grid>

          <Grid item xs={12} md={6}>
            {isNew ? (
              <CustomMultipleAutocomplete
                name="schoolId"
                label="School Name"
                value={values.schoolId}
                options={schoolShortName}
                handleChangeAdvance={handleChangeSchool}
                required
              />
            ) : (
              <CustomAutocomplete
                name="schoolIdOne"
                label="School"
                options={schoolShortName}
                handleChangeAdvance={handleChangeSchool}
                value={values.schoolIdOne ?? ""}
                checks={checks.schoolIdOne}
                errors={errorMessages.schoolIdOne}
              />
            )}
          </Grid>

          <Grid item xs={12} md={6}>
            <CustomTextField
              name="volume"
              label="Volume"
              value={values.volume ?? ""}
              handleChange={handleChange}
              checks={checks.volume}
              errors={errorMessages.volume}
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <CustomTextField
              rows={2}
              multiline
              name="remarks"
              label="Remarks"
              value={values.remarks ?? ""}
              handleChange={handleChange}
              checks={checks.remarks}
              errors={errorMessages.remarks}
              required
            />
          </Grid>

          <Grid item xs={12}>
            <Grid
              container
              alignItems="center"
              justifyContent="flex-end"
              textAlign="right"
            >
              <Grid item xs={4} md={2}>
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
        </Grid>
      </FormWrapper>
    </Box>
  );
}

export default SectionForm;
