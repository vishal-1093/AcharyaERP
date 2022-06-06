import {
  Theme,
  Box,
  MobileStepper,
  Paper,
  Typography,
  Button,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme: Theme) => ({
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

function MobileFormStepper({
  steps,
  activeStep,
  handleNext,
  handleBack,
}: Props) {
  const theme = useTheme();

  const classes = useStyles();

  return (
    <Box sx={{ width: "100%", flexGrow: 1 }}>
      {activeStep === steps.length ? (
        <>
          <Paper
            square
            elevation={0}
            sx={{
              display: "flex",
              alignItems: "center",
              pl: 2,
              bgcolor: "background.default",
            }}
          >
            <Typography sx={{ mt: 2, mb: 1 }}>
              All steps completed - you&apos;re finished
            </Typography>
          </Paper>
        </>
      ) : (
        <>
          <Paper
            square
            elevation={0}
            sx={{
              display: "flex",
              alignItems: "center",
              pl: 2,
              bgcolor: "background.default",
            }}
          >
            <Typography>{steps[activeStep].label}</Typography>
          </Paper>
          <Box sx={{ width: "100%", p: 2 }}>{steps[activeStep].form}</Box>
          <MobileStepper
            variant="text"
            steps={steps.length}
            position="static"
            activeStep={activeStep}
            nextButton={
              <Button
                variant="contained"
                className={classes.nextButton}
                size="small"
                onClick={handleNext}
                disabled={activeStep === steps.length}
              >
                {activeStep === steps.length - 1 ? "Finish" : "Next"}
                {theme.direction === "rtl" ? (
                  <KeyboardArrowLeft />
                ) : (
                  <KeyboardArrowRight />
                )}
              </Button>
            }
            backButton={
              <Button
                size="small"
                variant="outlined"
                onClick={handleBack}
                disabled={activeStep === 0}
              >
                {theme.direction === "rtl" ? (
                  <KeyboardArrowRight />
                ) : (
                  <KeyboardArrowLeft />
                )}
                Back
              </Button>
            }
          />
        </>
      )}
    </Box>
  );
}

export default MobileFormStepper;
