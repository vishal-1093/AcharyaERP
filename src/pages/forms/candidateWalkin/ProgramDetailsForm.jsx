import { lazy, memo, useState } from "react";
import { Box, Button, Grid, Typography } from "@mui/material";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import ModalWrapper from "../../../components/ModalWrapper";
import { Visibility } from "@mui/icons-material";

const FeeTemplateView = lazy(() =>
  import("../../../components/FeeTemplateView")
);

const ProgramDetailsForm = memo(
  ({ programValues, setProgramValues, data, noOfYears }) => {
    const [modalOpen, setModalOpen] = useState(false);
    const {
      ac_year: acYear,
      school_name: school,
      program_name: program,
      program_specialization_name: specialization,
      fee_template_name: feeTemplate,
      is_regular: isRegular,
      fee_template_id: feetemplateId,
    } = data;

    const handleChange = (e) => {
      const { name, value } = e.target;
      setProgramValues((prev) => ({ ...prev, [name]: value }));
    };

    const handleChangeAdvance = (name, newValue) => {
      setProgramValues((prev) => ({ ...prev, [name]: newValue }));
    };

    const DisplayContent = ({ label, value }) => {
      return (
        <>
          <Grid item xs={12} md={3}>
            <Typography variant="subtitle2">{label}</Typography>
          </Grid>
          <Grid item xs={12} md={9}>
            <Typography variant="subtitle2" color="textSecondary">
              {value}
            </Typography>
          </Grid>
        </>
      );
    };

    return (
      <>
        <ModalWrapper open={modalOpen} setOpen={setModalOpen} maxWidth={1200}>
          <Box sx={{ padding: 1 }}>
            <FeeTemplateView feeTemplateId={feetemplateId} type={2} />
          </Box>
        </ModalWrapper>

        <Grid container columnSpacing={2} rowSpacing={1}>
          <Grid item xs={12} md={6}>
            <Grid container columnSpacing={2} rowSpacing={1}>
              <DisplayContent label="AC Year" value={acYear} />
              <DisplayContent label="School" value={school} />
              <DisplayContent label="Program" value={program} />
              <DisplayContent label="Specialization" value={specialization} />
              <Grid item xs={12} md={3}>
                <Typography variant="subtitle2">Fee Template</Typography>
              </Grid>
              <Grid item xs={12} md={9}>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => setModalOpen(true)}
                  endIcon={<Visibility />}
                >
                  {feeTemplate}
                </Button>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} md={6}>
            <Grid container columnSpacing={4} rowSpacing={1}>
              <Grid item xs={12} md={6}>
                <CustomAutocomplete
                  name="currentYearSem"
                  label="Current Year/Sem"
                  value={programValues.currentYearSem}
                  options={noOfYears}
                  handleChangeAdvance={handleChangeAdvance}
                  disabled={isRegular}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <CustomTextField
                  name="preferredName"
                  label="Preffered Name For Email"
                  value={programValues.preferredName}
                  handleChange={handleChange}
                  disabled
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </>
    );
  }
);

export default ProgramDetailsForm;
