import { useEffect, useState } from "react";
import axios from "../../../services/Api";
import { Box, Button, Grid } from "@mui/material";
import FormPaperWrapper from "../../../components/FormPaperWrapper";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";

const initialValues = {
  acyearId: null,
  schoolId: null,
  programId: null,
  yearSem: null,
};

const requiredFields = ["acyearId", "schoolId", "programId", "yearSem"];

function InternalAssignmentForm() {
  const [values, setValues] = useState(initialValues);
  const [schoolOptions, setSchoolOptions] = useState([]);
  const [acyearOptions, setAcyearOptions] = useState([]);
  const [programOptions, setProgramOptions] = useState([]);
  const [programData, setProgramData] = useState([]);
  const [yearSemOptions, setYearSemOptions] = useState([]);

  const setCrumbs = useBreadcrumbs();

  const checks = {};

  const errorMessages = {};

  useEffect(() => {
    setCrumbs([{ name: "Internal Assesment" }]);
    getAcyears();
    getSchools();
    getPrograms();
  }, []);

  useEffect(() => {
    getPrograms();
  }, [values.acyearId, values.schoolId]);

  useEffect(() => {
    const filterData = programData.filter(
      (obj) => obj.program_specialization_id === values.programId
    );
    console.log("filterData", filterData);
    if (filterData.length > 0) {
      const years = [];
      const sems = [];
      const optionData = [];

      filterData.forEach((obj) => {
        years.push(obj.number_of_years);
        sems.push(obj.number_of_semester);
      });

      const maxYear = Math.max(...years);
      const maxSem = Math.max(...sems);
      for (let i = 1; i <= maxSem > maxYear ? maxSem : maxYear.length; i++) {
        optionData.push({
          value: i,
          label: maxSem > maxYear ? i + "Sem" : i + "Year",
        });
      }
      setYearSemOptions(optionData);
    }
  }, [values.programId]);

  console.log("yearSemOptions", yearSemOptions);
  const getAcyears = async () => {
    await axios
      .get(`/api/academic/academic_year`)
      .then((res) => {
        const optionData = [];
        res.data.data.forEach((obj) => {
          optionData.push({
            value: obj.ac_year_id,
            label: obj.ac_year,
          });
        });
        setAcyearOptions(optionData);
      })
      .catch((err) => console.error(err));
  };

  const getSchools = async () => {
    await axios
      .get(`/api/institute/school`)
      .then((res) => {
        const optionData = [];
        res.data.data.forEach((obj) => {
          optionData.push({
            value: obj.school_id,
            label: obj.school_name_short,
          });
        });
        setSchoolOptions(optionData);
      })
      .catch((err) => console.error(err));
  };

  const getPrograms = async () => {
    if (values.schoolId && values.acyearId)
      await axios
        .get(
          `/api/academic/fetchAllProgramsWithSpecialization/${values.schoolId}`
        )
        .then((res) => {
          const optionData = [];
          res.data.data.forEach((obj) => {
            optionData.push({
              value: obj.program_specialization_id,
              label: obj.specialization_with_program,
            });
          });
          setProgramOptions(optionData);
          setProgramData(res.data.data);
        })
        .catch((err) => console.error(err));
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

  return (
    <Box>
      <FormPaperWrapper>
        <Grid container columnSpacing={3} rowSpacing={3}>
          <Grid item xs={12} md={3}>
            <CustomAutocomplete
              name="acyearId"
              label="Ac Year"
              value={values.acyearId}
              options={acyearOptions}
              handleChangeAdvance={handleChangeAdvance}
              required
            />
          </Grid>

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
              name="programId"
              label="Program Specialization"
              value={values.programId}
              options={programOptions}
              handleChangeAdvance={handleChangeAdvance}
              required
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <CustomAutocomplete
              name="yearSem"
              label="Year/Sem"
              value={values.yearSem}
              options={yearSemOptions}
              handleChangeAdvance={handleChangeAdvance}
              required
            />
          </Grid>

          <Grid item xs={12} align="right">
            <Button variant="contained" disabled={!requiredFieldsValid()}>
              GO
            </Button>
          </Grid>
        </Grid>
      </FormPaperWrapper>
    </Box>
  );
}

export default InternalAssignmentForm;
