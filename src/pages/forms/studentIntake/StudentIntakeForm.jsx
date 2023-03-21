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
  academicYearOptions,
  SchoolNameOptions,
  programOptions,
  admSubCategoryOptions,
  handleChangeAdvance,
  handleSelectAll,
  handleSelectNone,
  handleClick,
}) {
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
  }, []);

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
            <Grid item xs={12} md={3}>
              <CustomAutocomplete
                name="acYearId"
                label="Academic Year"
                value={values.acYearId}
                options={academicYearOptions}
                handleChangeAdvance={handleChangeAdvance}
                required
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <CustomAutocomplete
                name="schoolId"
                label="Institute"
                value={values.schoolId}
                options={SchoolNameOptions}
                handleChangeAdvance={handleChangeAdvance}
                required
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <CustomAutocomplete
                name="programAssignmentId"
                label="Program"
                value={values.programAssignmentId}
                options={programOptions}
                handleChangeAdvance={handleChangeAdvance}
                required
              />
            </Grid>
            <Grid item xs={12} md={3}>
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
