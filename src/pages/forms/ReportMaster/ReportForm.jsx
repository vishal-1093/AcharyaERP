import { useState, useEffect } from "react";
import { Box, Grid, Button, CircularProgress } from "@mui/material";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";
import CustomSelect from "../../../components/Inputs/CustomSelect";
import FormWrapper from "../../../components/FormWrapper";
import axios from "../../../services/Api";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import useAlert from "../../../hooks/useAlert";

const initialValues = {
  acYearId: null,
  schoolId: "",
  programSpeId: "",
  yearsemId: null,
  status: "",
};

const requiredFields = ["schoolId", "programMajor"];

function ReportForm() {
  const [isNew, setIsNew] = useState(true);
  const [values, setValues] = useState(initialValues);
  const [loading, setLoading] = useState(false);
  const [syllabusId, setSyllabusId] = useState(null);
  const [acYearOptions, setAcYearOptions] = useState([]);
  const [schoolOptions, setSchoolOptions] = useState([]);
  const [yearSemOptions, setYearSemOptions] = useState([]);
  const [programSpeOptions, setProgramSpeOptions] = useState([]);
  const [programType, setProgramType] = useState(1);
  const [programId, setProgramId] = useState(null);

  const { id } = useParams();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { setAlertMessage, setAlertOpen } = useAlert();
  const setCrumbs = useBreadcrumbs();

  const checks = {};

  const errorMessages = {};

  useEffect(() => {
    getSchoolData();
    getAcYearData();
    if (pathname.toLowerCase() === "/reportmaster/report/new") {
      setIsNew(true);
      setCrumbs([
        { name: "Report Index", link: "/ReportMaster/Report" },
        { name: "Report" },
        { name: "Create" },
      ]);
    } else {
      setIsNew(false);
      getEmptypeData();
    }
  }, [pathname]);

  useEffect(() => {
    getProgramSpecializationData();
    getYearSemData();
  }, [
    values.acYearId,
    values.schoolId,
    values.programSpeId,
    values.yearsemId,
    programType,
  ]);

  const getAcYearData = async () => {
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
      .catch((error) => console.error(error));
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

  const getProgramSpecializationData = async () => {
    if (values.acYearId && values.schoolId)
      await axios
        .get(
          `/api/academic/fetchProgramWithSpecialization/${values.acYearId}/${values.schoolId}`
        )
        .then((res) => {
          setProgramSpeOptions(
            res.data.data.map((obj) => ({
              value: obj.program_specialization_id,
              label: obj.specialization_with_program,
            }))
          );
        })
        .catch((err) => console.error(err));
  };

  const getYearSemData = async (id) => {
    if (values.acYearId && values.schoolId && values.programSpeId)
      await axios
        .get(
          `/api/academic/FetchAcademicProgram/${values.acYearId}/${
            isNew ? programId : values.programIdForUpdate
          }/${values.schoolId}`
        )
        .then((res) => {
          const yearsem = [];
          res.data.data.map((obj) => {
            if (obj.program_type_id === 2) {
              setProgramType(2);
              for (let i = 1; i <= obj.number_of_semester; i++) {
                yearsem.push({ value: i, label: "Sem" + "-" + i });
              }
            } else if (obj.program_type_id === 1) {
              setProgramType(1);
              for (let i = 1; i <= obj.number_of_years; i++) {
                yearsem.push({ value: i, label: "Year" + "-" + i });
              }
            }
          });

          setYearSemOptions(
            yearsem.map((obj) => ({
              value: obj.value,
              label: obj.label,
            }))
          );
        })
        .catch((err) => console.error(err));
  };
  const getEmptypeData = async () => {
    await axios(`/api/academic/syllabus/${id}`)
      .then((res) => {
        setValues({
          syllabusName: res.data.data.syllabus_name,
          programMajor: res.data.data.program_specialization_id,
          syllabusCode: res.data.data.syllabus_code,
        });
        setSyllabusId(res.data.data.syllabus_id);
        setCrumbs([
          { name: "SyllabusIndex", link: "SyllabusIndex" },
          { name: "Syllabus" },
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

  const handleChangeAdvance = async (name, newValue) => {
    if (name === "programSpeId") {
      await axios
        .get(
          `/api/academic/fetchProgramWithSpecialization/${values.acYearId}/${values.schoolId}`
        )
        .then((res) => {
          setProgramId(
            res.data.data
              .filter((val) => val.program_specialization_id === newValue)
              .map((obj) => {
                return obj.program_id;
              })
          );
        })
        .catch((err) => console.error(err));
      setValues((prev) => ({
        ...prev,
        [name]: newValue,
      }));
    } else {
      setValues((prev) => ({
        ...prev,
        [name]: newValue,
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

  const handleCreate = () => {
    navigate(
      `/ReportMaster/Report/${values.schoolId}/${programId}/${values.acYearId}/${values.yearsemId}/${programType}`
    );
  };

  const handleUpdate = async () => {
    if (!requiredFieldsValid()) {
      setAlertMessage({
        severity: "error",
        message: "Please fill all required fields",
      });
      setAlertOpen(true);
    } else {
      setLoading(true);
      const temp = {};
      temp.active = true;
      temp.syllabus_id = syllabusId;
      temp.syllabus_name = values.syllabusName;
      temp.syllabus_code = values.syllabusCode;
      temp.program_specialization_id = values.programMajor;

      await axios
        .put(`/api/academic/syllabus/${id}`, temp)
        .then((res) => {
          setLoading(false);
          if (res.status === 200 || res.status === 201) {
            navigate("/ReportMaster/Report", { replace: true });
            setAlertMessage({
              severity: "success",
              message: "Syllabus updated",
            });
          } else {
            setAlertMessage({
              severity: "error",
              message: res.data ? res.data.message : "An error occured",
            });
          }
          setAlertOpen(true);
        })
        .catch((err) => {
          setLoading(false);
          setAlertMessage({
            severity: "error",
            message: err.response
              ? err.response.data.message
              : "An error occured",
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
          rowSpacing={4}
          columnSpacing={{ xs: 2, md: 4 }}
        >
          <Grid item xs={12} md={2.4}>
            <CustomAutocomplete
              name="acYearId"
              label="AC Year"
              value={values.acYearId}
              options={acYearOptions}
              handleChangeAdvance={handleChangeAdvance}
              required
            />
          </Grid>
          <Grid item xs={12} md={2.4}>
            <CustomAutocomplete
              name="schoolId"
              label="School"
              value={values.schoolId}
              options={schoolOptions}
              handleChangeAdvance={handleChangeAdvance}
              required
            />
          </Grid>

          <Grid item xs={12} md={2.4}>
            <CustomAutocomplete
              name="programSpeId"
              label="Program Major"
              value={values.programSpeId}
              options={programSpeOptions}
              handleChangeAdvance={handleChangeAdvance}
              required
            />
          </Grid>
          <Grid item xs={12} md={2.4}>
            <CustomAutocomplete
              name="yearsemId"
              label="Year/Sem"
              value={values.yearsemId}
              options={yearSemOptions}
              handleChangeAdvance={handleChangeAdvance}
              required
            />
          </Grid>
          <Grid item xs={12} md={2.4}>
            <CustomSelect
              name="status"
              label="Status"
              value={values.status}
              items={[
                { label: "Reporting", value: "1" },
                { label: "Eligible/Not Eligible", value: "2" },
                { label: "Promote", value: "3" },
              ]}
              handleChange={handleChange}
              required
            />
          </Grid>

          <Grid item xs={12} textAlign="right">
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

export default ReportForm;
