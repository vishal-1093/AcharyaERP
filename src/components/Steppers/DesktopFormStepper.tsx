import {
  Box,
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  Theme,
} from "@mui/material";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme: Theme) => ({
  stepperContainer: {
    padding: "10px 30px",
  },
  nextButton: {
    backgroundColor: `${theme.palette.secondary.main} !important`,
  },
}));

interface Props {
  steps: { label: string; form: JSX.Element }[];
  activeStep: number;
  handleNext: () => void;
  handleBack: () => void;
}

function DesktopStepper({ steps, activeStep, handleNext, handleBack }: Props) {
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
          <Typography sx={{ mt: 2, mb: 1 }}>
            All steps completed - you&apos;re finished
          </Typography>
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
