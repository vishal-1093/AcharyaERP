import { memo } from "react";
import { Grid } from "@mui/material";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";
import occupationList from "../../../utils/OccupationList";

const AdditionalDetailsForm = memo(
  ({
    additionalValues,
    setAdditionalValues,
    additonalChecks,
    additionalErrorMessages,
  }) => {
    const handleChange = (e) => {
      const { name, value } = e.target;
      setAdditionalValues((prev) => ({ ...prev, [name]: value }));
    };

    const handleChangeAdvance = (name, newValue) => {
      setAdditionalValues((prev) => ({ ...prev, [name]: newValue }));
    };

    return (
      <Grid container rowSpacing={2} columnSpacing={3}>
        {/* Father  */}
        <Grid item xs={12} md={4}>
          <Grid container rowSpacing={3} columnSpacing={2}>
            <Grid item xs={12}>
              <CustomTextField
                name="fatherName"
                label="Father Name"
                value={additionalValues.fatherName}
                handleChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <CustomTextField
                name="fatherMobile"
                label="Father Mobile"
                value={additionalValues.fatherMobile}
                handleChange={handleChange}
                checks={additonalChecks.fatherMobile}
                errors={additionalErrorMessages.fatherMobile}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <CustomTextField
                name="fatherEmail"
                label="Father Email"
                value={additionalValues.fatherEmail}
                handleChange={handleChange}
                checks={additonalChecks.fatherEmail}
                errors={additionalErrorMessages.fatherEmail}
              />
            </Grid>
            <Grid item xs={12}>
              <CustomTextField
                name="fatherOccupation"
                label="Father Occupation"
                value={additionalValues.fatherOccupation}
                handleChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <CustomTextField
                name="fatherQualification"
                label="Father Qualification"
                value={additionalValues.fatherQualification}
                handleChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <CustomTextField
                name="fatherIncome"
                label="Father Income"
                value={additionalValues.fatherIncome}
                handleChange={handleChange}
              />
            </Grid>
          </Grid>
        </Grid>
        {/* Mother  */}
        <Grid item xs={12} md={4}>
          <Grid container rowSpacing={3} columnSpacing={2}>
            <Grid item xs={12}>
              <CustomTextField
                name="motherName"
                label="Mother Name"
                value={additionalValues.motherName}
                handleChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <CustomTextField
                name="motherMobile"
                label="Mother Mobile"
                value={additionalValues.motherMobile}
                handleChange={handleChange}
                checks={additonalChecks.motherMobile}
                errors={additionalErrorMessages.motherMobile}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <CustomTextField
                name="motherEmail"
                label="Mother Email"
                value={additionalValues.motherEmail}
                handleChange={handleChange}
                checks={additonalChecks.motherEmail}
                errors={additionalErrorMessages.motherEmail}
              />
            </Grid>
            <Grid item xs={12}>
              <CustomTextField
                name="motherOccupation"
                label="Mother Occupation"
                value={additionalValues.motherOccupation}
                handleChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <CustomTextField
                name="motherQualification"
                label="Mother Qualification"
                value={additionalValues.motherQualification}
                handleChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <CustomTextField
                name="motherIncome"
                label="Mother Income"
                value={additionalValues.motherIncome}
                handleChange={handleChange}
              />
            </Grid>
          </Grid>
        </Grid>
        {/* Guardian */}
        <Grid item xs={12} md={4}>
          <Grid container rowSpacing={3} columnSpacing={2}>
            <Grid item xs={12}>
              <CustomTextField
                name="guardianName"
                label="Guardian Name"
                value={additionalValues.guardianName}
                handleChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <CustomTextField
                name="guardianMobile"
                label="Guardian Mobile"
                value={additionalValues.guardianMobile}
                handleChange={handleChange}
                checks={additonalChecks.guardianMobile}
                errors={additionalErrorMessages.guardianMobile}
              />
            </Grid>
            <Grid item xs={12}>
              <CustomTextField
                name="guardianEmail"
                label="Guardian Email"
                value={additionalValues.guardianEmail}
                handleChange={handleChange}
                checks={additonalChecks.guardianEmail}
                errors={additionalErrorMessages.guardianEmail}
              />
            </Grid>
            <Grid item xs={12}>
              <CustomTextField
                name="guardianOccupation"
                label="Guardian Occupation"
                value={additionalValues.guardianOccupation}
                handleChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <CustomTextField
                name="guardianRelationship"
                label="Guardian Relationship"
                value={additionalValues.guardianRelationship}
                handleChange={handleChange}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    );
  }
);

export default AdditionalDetailsForm;
