import { useState, useEffect } from "react";
import { Box, Grid, Button } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";
import FormWrapper from "../../../components/FormWrapper";
import axios from "../../../services/Api";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import useAlert from "../../../hooks/useAlert";

const initialValues = {
  schoolId: "",
  programSpeId: "",
  yearsemId: null,
};

const requiredFields = ["schoolId", "programSpeId", "yearsemId"];

function ReportForm() {
  const [values, setValues] = useState(initialValues);
  const [acYearOptions, setAcYearOptions] = useState([]);
  const [schoolOptions, setSchoolOptions] = useState([]);
  const [yearSemOptions, setYearSemOptions] = useState([]);
  const [programSpeOptions, setProgramSpeOptions] = useState([]);
  const [programType, setProgramType] = useState(1);
  const [programId, setProgramId] = useState(null);

  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { setAlertMessage, setAlertOpen } = useAlert();
  const setCrumbs = useBreadcrumbs();

  useEffect(() => {
    getSchoolData();
    getAcYearData();
    if (pathname.toLowerCase() === "/reportmaster/reporting") {
      setCrumbs([
        { name: "Report Index" },
        { name: "Report" },
        { name: "Create" },
      ]);
    }
  }, [pathname]);

  useEffect(() => {
    getProgramSpecializationData();
  }, [values.schoolId, values.programSpeId, values.yearsemId, programType]);

  const checks = {};

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
            label: obj.school_name,
          }))
        );
      })
      .catch((err) => console.error(err));
  };

  const getProgramSpecializationData = async () => {
    if (values.schoolId)
      await axios
        .get(
          `/api/academic/fetchAllProgramsWithSpecialization/${values.schoolId}`
        )
        .then((res) => {
          setProgramSpeOptions(
            res.data.data.map((obj) => ({
              value: obj.program_specialization_id,
              label: obj.specialization_with_program,
            }))
          );

          const yearsem = [];
          res.data.data.filter((obj) => {
            if (obj.program_specialization_id === values.programSpeId) {
              yearsem.push(obj);
            }
          });

          const newYear = [];
          yearsem.map((obj) => {
            if (obj.program_type_name.toLowerCase() === "yearly") {
              setProgramType(1);
              for (let i = 1; i <= obj.number_of_years; i++) {
                newYear.push({ value: i, label: "Year" + "-" + i });
              }
            }
            if (obj.program_type_name.toLowerCase() === "semester") {
              setProgramType(2);
              for (let i = 1; i <= obj.number_of_semester; i++) {
                newYear.push({ value: i, label: "Sem" + "-" + i });
              }
            }
          });

          setYearSemOptions(
            newYear.map((obj) => ({
              value: obj.value,
              label: obj.label,
            }))
          );
        })
        .catch((err) => console.error(err));
  };

  const handleChangeAdvance = async (name, newValue) => {
    if (name === "programSpeId") {
      await axios
        .get(
          `/api/academic/fetchAllProgramsWithSpecialization/${values.schoolId}`
        )
        .then((res) => {
          res.data.data.filter((val) => {
            if (val.program_specialization_id === newValue) {
              setProgramId(val.program_id);
            }
          });
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
    if (!requiredFieldsValid()) {
      setAlertMessage({
        severity: "error",
        message: "Please select all the required fields",
      });
      setAlertOpen(true);
    } else {
      navigate(
        `/ReportMaster/Report/${values.schoolId}/${programId}/${values.yearsemId}/${programType}`
      );
    }
  };

  return (
    <Box component="form" overflow="hidden" p={1} mt={2}>
      <FormWrapper>
        <Grid
          container
          alignItems="center"
          justifyContent="flex-start"
          rowSpacing={4}
          columnSpacing={{ xs: 2, md: 4 }}
        >
          <Grid item xs={12} md={3}>
            <CustomAutocomplete
              name="schoolId"
              label="School"
              value={values.schoolId}
              options={schoolOptions}
              handleChangeAdvance={handleChangeAdvance}
              required
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <CustomAutocomplete
              name="programSpeId"
              label="Program Major"
              value={values.programSpeId}
              options={programSpeOptions}
              handleChangeAdvance={handleChangeAdvance}
              required
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <CustomAutocomplete
              name="yearsemId"
              label="Year/Sem"
              value={values.yearsemId}
              options={yearSemOptions}
              handleChangeAdvance={handleChangeAdvance}
              required
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <Button
              style={{ borderRadius: 7 }}
              variant="contained"
              color="primary"
              onClick={handleCreate}
            >
              <strong>{"Create"}</strong>
            </Button>
          </Grid>
        </Grid>
      </FormWrapper>
    </Box>
  );
}

export default ReportForm;
