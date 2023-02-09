import {
  Box,
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";

const useStyles = makeStyles((theme) => ({
  stepperContainer: {
    padding: "10px 30px",
  },
  nextButton: {
    backgroundColor: `${theme.palette.secondary.main} !important`,
  },
}));

function DesktopStepper({
  steps,
  activeStep,
  handleNext,
  handleBack,
  message,
}) {
  const classes = useStyles();

  return (
    <Box sx={{ width: "100%" }}>
      <Stepper activeStep={activeStep} className={classes.stepperContainer}>
        {steps.map((obj, index) => {
          return (
            <Step key={index}>
              <StepLabel>{obj.label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>

      {activeStep === steps.length ? (
        <>
          <Box textAlign="center">
            <CheckCircleOutlineRoundedIcon
              color="success"
              sx={{ fontSize: "10rem" }}
            />
            <Typography variant="h6" sx={{ mt: 2, mb: 1 }} color="success">
              {/* All steps completed - you&apos;re finished */}
              {message}
            </Typography>
          </Box>
        </>
      ) : (
        <>
          <Box sx={{ width: "100%", p: 2 }}>{steps[activeStep].form}</Box>
          <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
            <Button
              color="inherit"
              variant="outlined"
              disabled={activeStep === 0}
              onClick={handleBack}
              sx={{ mr: 1 }}
            >
              Back
            </Button>
            <Box sx={{ flex: "1 1 auto" }} />
            <Button
              className={classes.nextButton}
              variant="contained"
              onClick={handleNext}
            >
              {activeStep === steps.length - 1 ? "Finish" : "Next"}
            </Button>
          </Box>
        </>
      )}
    </Box>
  );
}

export default DesktopStepper;
