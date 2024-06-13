import { lazy, useState } from "react";
import { Box, Button, Grid, Paper, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
const CustomDatePicker = lazy(() =>
  import("../../../components/Inputs/CustomDatePicker")
);
const CustomRadioButtons = lazy(() =>
  import("../../../components/Inputs/CustomRadioButtons")
);
const SalaryBreakupView = lazy(() =>
  import("../../../components/SalaryBreakupView")
);

function EmpRejoinForm({
  offerData,
  values,
  handleChange,
  handleChangeAdvance,
  loading,
  requiredFieldsValid,
  handleRejoinStaff,
}) {
  const [confirmRejoin, setConfirmRejoin] = useState(false);

  const navigate = useNavigate();

  return (
    <Box mt={2}>
      <Grid container justifyContent="center" columnSpacing={4} rowSpacing={4}>
        <Grid item xs={12} md={7}>
          <SalaryBreakupView id={offerData?.offer_id} />
        </Grid>

        <Grid item xs={12} md={5}>
          <Grid container columnSpacing={2} rowSpacing={2}>
            <Grid item xs={12}>
              <CustomDatePicker
                name="toDate"
                label="To Date"
                value={values.toDate}
                handleChangeAdvance={handleChangeAdvance}
                disablePast
                required
              />
            </Grid>

            <Grid item xs={12}>
              <CustomRadioButtons
                name="probation"
                label="Probation"
                value={values.probation}
                handleChange={handleChange}
                items={[
                  {
                    value: true,
                    label: "Yes",
                  },
                  {
                    value: false,
                    label: "No",
                  },
                ]}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <CustomRadioButtons
                name="timing"
                label="Part/Full Time"
                value={values.timing}
                handleChange={handleChange}
                items={[
                  {
                    value: "PARTTIME",
                    label: "Part Time",
                  },
                  {
                    value: "FULLTIME",
                    label: "Full Time",
                  },
                ]}
                required
              />
            </Grid>

            <Grid item xs={12} align="right">
              <Stack direction="row" justifyContent="flex-end" spacing={2}>
                <Button
                  variant="contained"
                  color="info"
                  onClick={() =>
                    navigate(
                      `/SalaryBreakupForm/New/${offerData?.job_id}/${offerData?.offer_id}/change`
                    )
                  }
                >
                  Change Offer
                </Button>

                <Button
                  variant="contained"
                  color="success"
                  onClick={() => setConfirmRejoin(true)}
                  disabled={loading || !requiredFieldsValid()}
                >
                  Rejoin
                </Button>
              </Stack>
            </Grid>

            {confirmRejoin ? (
              <Grid item xs={12} mt={2}>
                <Grid
                  container
                  component={Paper}
                  elevation={2}
                  sx={{
                    backgroundColor: "rgba(74, 87, 169, 0.1)",
                    color: "#46464E",
                    padding: 2,
                  }}
                >
                  <Grid item xs={12}>
                    <Typography
                      variant="subtitle2"
                      color="textSecondary"
                      sx={{ fontSize: 15 }}
                    >
                      Do you want rejoin the staff?
                    </Typography>
                  </Grid>

                  <Grid item xs={12} align="right" mt={4}>
                    <Stack
                      direction="row"
                      justifyContent="flex-end"
                      spacing={2}
                    >
                      <Button
                        variant="contained"
                        size="small"
                        onClick={handleRejoinStaff}
                      >
                        Yes
                      </Button>
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => setConfirmRejoin(false)}
                      >
                        No
                      </Button>
                    </Stack>
                  </Grid>
                </Grid>
              </Grid>
            ) : (
              <></>
            )}
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}

export default EmpRejoinForm;
