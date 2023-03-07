import { useState, useEffect } from "react";
import { Box, Grid, Button } from "@mui/material";
import axios from "../../../services/Api";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";
import CheckboxAutocomplete from "../../../components/Inputs/CheckboxAutocomplete";
import FormWrapper from "../../../components/FormWrapper";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import { useLocation } from "react-router-dom";

function StudentIntakeForm({
  values,
  handleChangeAdvance,
  handleSelectAll,
  handleSelectNone,
  handleClick,
}) {
  const [academicYearOptions, setAcademicYearOptions] = useState([]);
  const [SchoolNameOptions, setSchoolNameOptions] = useState([]);
  const [programOptions, setProgramOptions] = useState([]);
  const [admSubCategoryOptions, setAdmSubCategoryOptions] = useState([]);

  const setCrumbs = useBreadcrumbs();
  const { pathname } = useLocation();

  useEffect(() => {
    if (pathname.toLowerCase() === "/studentintakeselection") {
      setCrumbs([
        { name: "Student Intake", link: "/StudentIntakeMaster/Studentintake" },
        {
          name: "Create",
        },
      ]);
    }
    getAcademicYearOptions();
    getSchoolNameOptions();
    getAdmSubCategoryData();
  }, []);

  useEffect(() => {
    getProgramData();
  }, [values.acYearId, values.schoolId]);

  const getAcademicYearOptions = async () => {
    await axios
      .get(`/api/academic/academic_year`)
      .then((res) => {
        setAcademicYearOptions(
          res.data.data.map((obj) => ({
            value: obj.ac_year_id,
            label: obj.ac_year,
          }))
        );
      })
      .catch((error) => console.error(error));
  };

  const getSchoolNameOptions = async () => {
    await axios
      .get(`/api/institute/school`)
      .then((res) => {
        setSchoolNameOptions(
          res.data.data.map((obj) => ({
            value: obj.school_id,
            label: obj.school_name_short,
          }))
        );
      })
      .catch((err) => console.error(err));
  };

  const getProgramData = async () => {
    if (values.acYearId && values.schoolId)
      await axios
        .get(
          `/api/academic/fetchProgram1/${values.acYearId}/${values.schoolId}`
        )
        .then((res) => {
          setProgramOptions(
            res.data.data.map((obj) => ({
              value: obj.program_id,
              label: obj.program_short_name,
            }))
          );
        })
        .catch((err) => console.error(err));
  };

  const getAdmSubCategoryData = async () => {
    await axios
      .get(`/api/student/FeeAdmissionSubCategory`)
      .then((res) => {
        setAdmSubCategoryOptions(
          res.data.data.map((obj) => ({
            value: obj.fee_admission_sub_category_id,
            label: obj.fee_admission_sub_category_short_name,
          }))
        );
      })
      .catch((err) => console.error(err));
  };

  return (
    <>
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
                name="acYearId"
                label="Academic Year"
                value={values.acYearId}
                options={academicYearOptions}
                handleChangeAdvance={handleChangeAdvance}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <CustomAutocomplete
                name="schoolId"
                label="Institute"
                value={values.schoolId}
                options={SchoolNameOptions}
                handleChangeAdvance={handleChangeAdvance}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <CustomAutocomplete
                name="programId"
                label="Program"
                value={values.programId}
                options={programOptions}
                handleChangeAdvance={handleChangeAdvance}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <CheckboxAutocomplete
                name="admSubCategoryId"
                label="Sub Category"
                value={values.admSubCategoryId}
                options={admSubCategoryOptions}
                handleChangeAdvance={handleChangeAdvance}
                handleSelectAll={handleSelectAll}
                handleSelectNone={handleSelectNone}
                required
              />
            </Grid>
            <Grid item xs={4} md={2}>
              <Button
                style={{ borderRadius: 7 }}
                variant="contained"
                color="primary"
                onClick={handleClick}
              >
                Create
              </Button>
            </Grid>
          </Grid>
        </FormWrapper>
      </Box>
    </>
  );
}
export default StudentIntakeForm;
